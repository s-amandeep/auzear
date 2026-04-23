const supabase = require("../config/supabase");
const {
  getScoreFromEngagement,
  calculateProgress,
} = require("./progressService");

async function saveSessionService({
  topic,
  subject,
  engagement,
  child_id,
  teachResult,
}) {
  const normalizedTopic = topic.trim().toLowerCase();
  const currentScore = getScoreFromEngagement(engagement);

  // 1. Find or create concept
  let concept_id;

  const { data: existingConcept } = await supabase
    .from("concepts")
    .select("id")
    .eq("name", normalizedTopic)
    .maybeSingle();

  if (existingConcept) {
    concept_id = existingConcept.id;
  } else {
    const { data: newConcept, error } = await supabase
      .from("concepts")
      .insert([{ name: normalizedTopic, subject }])
      .select("id")
      .single();

    if (error) {
      return res.status(200).json({
        fallback: true,
        message: "Service waking up, please try again",
      });
    }

    concept_id = newConcept.id;
  }

  // 2. Fetch existing learning state
  const { data: existingState } = await supabase
    .from("learning_states")
    .select("understanding_score, revision_level, memory_strength")
    .eq("child_id", child_id)
    .eq("concept_id", concept_id)
    .maybeSingle();

  const prevScore = existingState?.understanding_score || 0;
  const prevLevel = existingState?.revision_level || 1;
  const prevMemory = existingState?.memory_strength || 0.3;

  const { trend, newMemory, newLevel, nextDate } = calculateProgress({
    currentScore,
    prevScore,
    prevMemory,
    prevLevel,
  });

  // 7. Upsert learning state
  const { error: stateError } = await supabase.from("learning_states").upsert(
    {
      child_id,
      concept_id,
      understanding_score: currentScore,
      last_learned_at: new Date(),
      next_revision_at: nextDate,
      memory_strength: newMemory,
      revision_level: newLevel,
      trend,
      last_teaching: teachResult,
    },
    {
      onConflict: "child_id,concept_id",
    },
  );

  if (stateError) throw stateError;

  // 8. Insert session
  const { error: sessionError } = await supabase.from("sessions").insert([
    {
      child_id,
      concept_id,
      duration: 0,
      accuracy: currentScore,
      engagement,
    },
  ]);

  if (sessionError) throw sessionError;

  return { success: true };
}

module.exports = { saveSessionService };
