const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const checkApiKey = require("../middleware/authMiddleware");

router.post("/", checkApiKey, async (req, res) => {
  const { topic } = req.body;

  const normalizedTopic = topic.topic.trim().toLowerCase();
  const currentSubject = topic.subject;
  const engagement = topic.engagement;

  const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp
  let concept_id;
  const next_revision = new Date();

  // Convert engagement to score
  let currentScore;

  if (engagement === "low") currentScore = 30;
  else if (engagement === "medium") currentScore = 60;
  else if (engagement === "high") currentScore = 80;
  else currentScore = 95;

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
      .insert([{ name: normalizedTopic, subject: currentSubject }])
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

  // if (existingState) {
  // const prev = existingState.memory_strength || 0;
  const prevScore = existingState?.understanding_score || 0;
  const prevLevel = existingState?.revision_level || 1;
  const prevMemory = existingState?.memory_strength || 0.3;

  let trend = "stable";

  if (currentScore > prevScore + 10) trend = "improving";
  else if (currentScore < prevScore - 10) trend = "declining";

  let newMemory = prevMemory;

  // Smooth update instead of reset
  newMemory = 0.7 * prevMemory + 0.3 * (currentScore / 100);
  
  let newLevel = prevLevel;

  if (currentScore >= 80 && trend !== "declining") {
    newLevel = Math.min(prevLevel + 1, 5);
  } else if (currentScore < 40) {
    newLevel = Math.max(prevLevel - 1, 1);
  }

  let nextRevisionDays = 1;

  if (newMemory > 0.7) nextRevisionDays = 3;
  if (newMemory > 0.85) nextRevisionDays = 5;

  next_revision.setDate(next_revision.getDate() + nextRevisionDays);

  // 3. Upsert learning state
  const { data, error } = await supabase.from("learning_states").upsert(
    [
      {
        child_id,
        concept_id,
        understanding_score: currentScore,
        memory_strength: newMemory,
        last_learned_at: new Date(),
        next_revision_at: next_revision,
        memory_strength: newMemory,
        revision_level: newLevel,
        trend: trend,
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

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert([
      {
        child_id,
        concept_id,
        duration: 0,
        accuracy: currentScore,
        engagement,
      },
    ])
    .select();

  if (sessionError) {
    console.error("❌ Session insert failed:", sessionError);
    return res.status(500).json({ error: sessionError.message });
  }

  res.json({ success: true });
});

module.exports = router;
