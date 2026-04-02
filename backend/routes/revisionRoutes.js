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
      // .select("*, concepts(name)")
      .select("*")
      .eq("child_id", childId)
      .lte("next_revision_at", today);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!states) {
      return res.json({ revision: [], retentionScore: 0 });
    }

    // const score = !data.length
    //   ? Math.round(
    //       data.reduce((acc, item) => acc + item.understanding_score, 0) /
    //         data.length,
    //     )
    //   : 0;

    // res.json({
    //   revision: data || [],
    //   retentionScore: score,
    // });
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
    }));

    // 4. Retention score
    const retentionScore =
      revision.length > 0
        ? Math.round(
            revision.reduce(
              (acc, item) => acc + (item.understanding_score || 0),
              0,
            ) / revision.length,
          )
        : 0;

    res.json({
      revision,
      retentionScore,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
