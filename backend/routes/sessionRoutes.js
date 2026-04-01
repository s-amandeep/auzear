const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.post("/", async (req, res) => {
  const { topic, classLevel, score } = req.body;

  const child_id = "1111-2222"; // temp
  let concept_id;

  // 1. Check if concept exists
  const { data: existing } = await supabase
    .from("concepts")
    .select("*")
    .eq("name", topic)
    .maybeSingle();

  if (existing && existing.id) {
    concept_id = existing.id;
  } else {
    const { data: newConcept, error } = await supabase
      .from("concepts")
      .insert([{ name: topic, subject: "General" }])
      .select()
      .single();

    if (error || !newConcept) {
      return res.status(500).json({ error: "Failed to create concept" });
    }

    concept_id = newConcept.id;
  }

  // 2. Calculate next revision
  let next_revision = new Date();

  if (score >= 80) {
    next_revision.setDate(next_revision.getDate() + 3);
  } else {
    next_revision.setDate(next_revision.getDate() + 1);
  }

  // 3. Upsert learning state
  await supabase.from("learning_states").upsert([
    {
      child_id,
      concept_id,
      understanding_score: score,
      last_learned_at: new Date(),
      next_revision_at: next_revision,
      status: score >= 80 ? "strong" : "weak",
    },
  ]);

  res.json({ success: true });
});

module.exports = router;
