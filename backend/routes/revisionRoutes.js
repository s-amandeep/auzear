const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/:childId", async (req, res) => {
  try {
    const { childId } = req.params;
    console.log("Revision API hit");

    const today = new Date().toISOString();

    const subjectMap = {};

    const { data: states, error } = await supabase
      .from("learning_states")
      .select("*")
      .eq("child_id", childId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!states) {
      return res.json({ revision: [], retentionScore: 0 });
    }

    // 2. Fetch concept names separately (SAFE way)
    const conceptIds = states.map((s) => s.concept_id);

    const { data: concepts } = await supabase
      .from("concepts")
      .select("id, name")
      .in("id", conceptIds);

    // 3. Merge data
    const revision = states.map((s) => ({
      ...s,
      conceptName:
        concepts?.find((c) => c.id === s.concept_id)?.name || "Unknown",
      subject:
        concepts?.find((c) => c.id === s.concept_id)?.subject || "General",
    }));

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
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
