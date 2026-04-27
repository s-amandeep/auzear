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
    prerequisite,
    deep_dive,
    next_step,
  } = data;

  if (!child_id) return null;

  let concept_id = data.concept_id;

  // 1. Ensure concept exists
  if (!concept_id) {
    if (!topic) throw new Error("Missing topic");

    const normalizedTopic = topic.trim().toLowerCase();

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
  }

  let finalClassLevel = classLevel;

  if (!finalClassLevel) {
    // 🔥 Try from learning_tracks first
    const { data: track } = await supabase
      .from("learning_tracks")
      .select("class_level")
      .eq("child_id", child_id)
      .eq("concept_id", concept_id)
      .maybeSingle();

    if (track?.class_level) {
      finalClassLevel = track.class_level;
    } else {
      // 🔥 fallback: last session
      const { data: lastSession } = await supabase
        .from("learning_sessions_v2")
        .select("class_level")
        .eq("child_id", child_id)
        .eq("concept_id", concept_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      finalClassLevel = lastSession?.class_level || 5; // last fallback
    }
  }

  // 2. Insert session
  const { data: sessionData, error: sessionError } = await supabase
    .from("learning_sessions_v2")
    .insert([
      {
        child_id,
        concept_id,
        class_level: finalClassLevel,
        teaching_mode,
        teach,
        practice,
        parent_tip,
        prerequisite: prerequisite || null,
        deep_dive: deep_dive || null,
        next_step: next_step || null,
        understanding_score,
      },
    ])
    .select();

  if (sessionError) {
    console.error("❌ Session Insert Error:", sessionError);
    throw sessionError;
  }

  // console.log("SESSION INSERT RESULT:", sessionData);
  // console.log("SESSION INSERT ERROR:", sessionError);

  // 3. Upsert learning_tracks (current state)
  const { data: trackData, error: trackError } = await supabase
    .from("learning_tracks")
    .upsert(
      [
        {
          child_id,
          concept_id,
          class_level: finalClassLevel,
          understanding_score,
          teaching_mode,
          last_learned_at: new Date(),
        },
      ],
      {
        onConflict: "child_id,concept_id",
      },
    )
    .select();

  if (trackError) {
    console.error("❌ Track Upsert Error:", trackError);
    throw trackError;
  }
  // console.log("SESSION TRACK RESULT:", trackData);
  // console.log("SESSION TRACK ERROR:", trackError);
}

module.exports = { saveSession };
