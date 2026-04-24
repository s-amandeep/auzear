// services/sessionServiceV2.js
const supabase = require("../config/supabase");

async function saveSession(data) {
  const {
    topic,
    subject,
    classLevel,
    child_id,
    teaching_mode,
    understanding_score,
    teach,
    practice,
    parent_tip,
    prerequisite
  } = data;

  const normalizedTopic = topic.trim().toLowerCase();

  // 1. Ensure concept exists
  let concept_id;

  const { data: existing } = await supabase
    .from("concepts")
    .select("id")
    .eq("name", normalizedTopic)
    .maybeSingle();

  if (existing) {
    concept_id = existing.id;
  } else {
    const { data: newConcept } = await supabase
      .from("concepts")
      .insert([{ name: normalizedTopic, subject }])
      .select("id") 
      .single();

    concept_id = newConcept.id;
  }

  // 2. Insert session
  await supabase.from("learning_sessions_v2").insert([
    {
      child_id,     
      concept_id,
      class_level: classLevel,
      teaching_mode,
      teach,
      practice,
      parent_tip,
      prerequisite,
      understanding_score
    }
  ]);

  // 3. Upsert learning_tracks (current state)
  await supabase.from("learning_tracks").upsert(
    [
      {
        child_id,
        concept_id,
        class_level: classLevel,
        understanding_score,
        teaching_mode,
        last_learned_at: new Date()
      }
    ],
    {
      onConflict: "child_id,concept_id"
    }
  );

  return { concept_id };
}

module.exports = { saveSession };