const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
// const { extractTopicAndSubject } = require("../utils/extractTopicAndSubject");

router.post("/", async (req, res) => {
  const { topic, subject, classLevel, score } = req.body;

  console.log(topic);
  const normalizedTopic = topic.topic.trim().toLowerCase();
  console.log(normalizedTopic);

  const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp
  let concept_id;
  let newMemory = 0.3; // default for new concept
  let daysToAdd = 1;
  const next_revision = new Date();

  // 1. Check if concept exists
  const { data: existing } = await supabase
    .from("concepts")
    .select("*")
    .eq("name", normalizedTopic)
    .maybeSingle();

  if (existing && existing.id) {
    concept_id = existing.id;
  } else {
    const { data: newConcept, error } = await supabase
      .from("concepts")
      .insert([{ name: normalizedTopic, subject: subject }])
      .select()
      .single();

    if (error || !newConcept) {
      return res.status(500).json({ error: "Failed to create concept" });
    }

    concept_id = newConcept.id;
  }

  // Fetch existing state
  const { data: existingState } = await supabase
    .from("learning_states")
    .select("*")
    .eq("child_id", child_id)
    .eq("concept_id", concept_id)
    .maybeSingle();

  if (existingState) {
    const prev = existingState.memory_strength || 0;

    if (score >= 80) newMemory = Math.min(prev + 0.2, 1);
    else if (score >= 50) newMemory = prev + 0.05;
    else newMemory = Math.max(prev - 0.2, 0);
  }

  if (newMemory > 0.8) daysToAdd = 7;
  else if (newMemory > 0.6) daysToAdd = 4;
  else if (newMemory > 0.4) daysToAdd = 2;
  else daysToAdd = 1;

  next_revision.setDate(next_revision.getDate() + daysToAdd);

  // 3. Upsert learning state
  const { data, error } = await supabase.from("learning_states").upsert(
    [
      {
        child_id,
        concept_id,
        understanding_score: score,
        memory_strength: newMemory,
        last_learned_at: new Date(),
        next_revision_at: next_revision,
        status:
          newMemory > 0.7 ? "strong" : newMemory > 0.4 ? "medium" : "weak",
      },
    ],
    {
      onConflict: "child_id,concept_id", // 🔥 IMPORTANT
    },
  );

  if (error) {
    console.error("DB error:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("Saved successfully:", data);

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert([
      {
        child_id,
        concept_id,
        duration: 0,
        accuracy: score,
      },
    ])
    .select();

  if (sessionError) {
    console.error("❌ Session insert failed:", sessionError);
    return res.status(500).json({ error: sessionError.message });
  }

  console.log("✅ Session saved:", sessionData);

  res.json({ success: true });
});

module.exports = router;
