const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const checkApiKey = require("../middleware/authMiddleware");

router.get("/:childId", checkApiKey, async (req, res) => {
  try {
    const { childId } = req.params;

    const today = new Date().toISOString();

    const subjectMap = {};

    const { data: states, error } = await supabase
      .from("learning_states")
      // .select("*")
      .select(
        `
          *,
          concepts (name, subject),
          children (
            streak_count
          )
        `,
      )
      .eq("child_id", childId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!states) {
      return res.json({ revision: [], retentionScore: 0 });
    }

    const revision = states.map((s) => ({
      ...s,
      conceptName: s.concepts.name || "Unknown",
      subject: s.concepts.subject || "General",
    }));

    // const streak = states?.[0]?.children?.streak_count || 0;
    // console.log("Streak count:", streak);

    const safeStates = revision || [];

    // Subject-wise logic

    safeStates.forEach((item) => {
      const subject = item.subject || "General";
      const memory = item.memory_strength || 0;

      if (!subjectMap[subject]) {
        subjectMap[subject] = [];
      }

      subjectMap[subject].push(memory);
    });

    const subjectStats = Object.keys(subjectMap).map((subject) => {
      const values = subjectMap[subject];

      const avg = values.reduce((a, b) => a + b, 0) / values.length;

      return {
        subject,
        avgMemory: avg,
        count: values.length,
      };
    });

    subjectStats.sort((a, b) => a.avgMemory - b.avgMemory);

    const weakestSubject = subjectStats[0] || null;

    // Subject-wise logic ends here

    let learningPattern = "";
    let guidance = "";

    if (weakestSubject) {
      learningPattern = `Child tends to struggle more with ${weakestSubject.subject} concepts.`;

      guidance = `Try using more real-life examples while teaching ${weakestSubject.subject}. Keep explanations simple and interactive.`;
    }

    // Weekly plan

    const weeklyPlan = safeStates
      .sort(
        (a, b) => new Date(a.next_revision_at) - new Date(b.next_revision_at),
      )
      .slice(0, 5)
      .map((item) => ({
        concept: item.conceptName,
        subject: item.subject, // 🔥 ADD THIS
        date: item.next_revision_at,
      }));

    // Weekly Plan ends here

    const resultsToday = safeStates.filter(
      (item) => item.next_revision_at <= today,
    );

    const dueToday = [...resultsToday].sort(
      (a, b) => (a.memory_strength || 0) - (b.memory_strength || 0),
    );

    const resultsUpcoming = safeStates.filter(
      (item) => item.next_revision_at > today,
    );

    const upcoming = [...resultsUpcoming].sort(
      (a, b) => (a.memory_strength || 0) - (b.memory_strength || 0),
    );

    let suggestion = "Introduce a new concept today";

    if (dueToday.length > 0) {
      suggestion = `Revise ${dueToday[0].conceptName} today`;
    } else if (weakestSubject) {
      suggestion = `Focus on ${weakestSubject.subject}`;
    }

    // 4. Retention score
    const retentionScore =
      states && states.length > 0
        ? Math.round(
            (states.reduce(
              (acc, item) => acc + (item.memory_strength || 0),
              0,
            ) /
              states.length) *
              100,
          )
        : 0;

    res.json({
      dueToday,
      upcoming,
      retentionScore,
      subjectStats, // 🔥 new
      weakestSubject, // 🔥 new
      suggestion,
      weeklyPlan,
      learningPattern,
      guidance,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const { topic, engagement, child_id } = req.body;

    // Convert engagement to score
    let currentScore;

    if (engagement === "low") currentScore = 30;
    else if (engagement === "medium") currentScore = 60;
    else if (engagement === "high") currentScore = 80;
    else currentScore = 95;

    // 1. Find concept
    const { data: concept } = await supabase
      .from("concepts")
      .select("id")
      .ilike("name", topic)
      .single();

    if (!concept) {
      return res.status(404).json({ error: "Concept not found" });
    }

    // 2. Get existing state
    const { data: existing } = await supabase
      .from("learning_states")
      .select("*")
      .eq("concept_id", concept.id)
      .eq("child_id", child_id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Learning state not found" });
    }

    // 3. Apply SAME logic as teaching
    const prevScore = existing?.understanding_score || 0;
    const prevMemory = existing?.memory_strength || 0.3;
    const prevLevel = existing?.revision_level || 1;

    // Trend
    let trend = "stable";
    if (currentScore > prevScore + 10) trend = "improving";
    else if (currentScore < prevScore - 10) trend = "declining";

    // Memory
    const newMemory = 0.7 * prevMemory + 0.3 * (currentScore / 100);

    // Level
    let newLevel = prevLevel;
    if (currentScore >= 80 && trend !== "declining") {
      newLevel = Math.min(prevLevel + 1, 5);
    } else if (currentScore < 40) {
      newLevel = Math.max(prevLevel - 1, 1);
    }

    // Next revision
    let days = 1;
    if (newMemory > 0.7) days = 3;
    if (newMemory > 0.85) days = 5;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);

    // 4. Update DB

    // const today = new Date().toDateString();
    // const { data: existingChild } = await supabase
    //   .from("children")
    //   .select("*")
    //   .eq("child_id", child_id)
    //   .single();

    // const lastActive = existingChild.last_active_date;

    // let newStreak = existingChild.streak_count || 0;

    // if (lastActive === yesterday) {
    //   newStreak += 1;
    // } else if (lastActive !== today) {
    //   newStreak = 1;
    // }

    // await supabase
    //   .from("children")
    //   .update({
    //     last_active_date: today,
    //     streak_count: newStreak,
    //   })
    //   .eq("id", child_id);

    await supabase
      .from("learning_states")
      .update({
        understanding_score: currentScore,
        memory_strength: newMemory,
        revision_level: newLevel,
        trend: trend,
        next_revision_at: nextDate,
        last_learned_at: new Date(),
      })
      .eq("id", existing.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save revision feedback" });
  }
});

module.exports = router;
