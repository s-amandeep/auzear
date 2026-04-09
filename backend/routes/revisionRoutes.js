const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/:childId", async (req, res) => {
  try {
    const { childId } = req.params;
    console.log("Revision API hit");

    const today = new Date().toISOString();

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
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
