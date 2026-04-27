// services/topicServiceV2.js
const supabase = require("../config/supabase");

async function fetchTopics(child_id) {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select(
      `
      *,
      concepts (name, subject)
    `,
    )
    .eq("child_id", child_id)
    .order("last_learned_at", { ascending: false });

  if (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }

  return data.map((item) => ({
    conceptName: item.concepts?.name || "Unknown",
    subject: item.concepts?.subject || "General",
    understanding_score: item.understanding_score,
    teaching_mode: item.teaching_mode,
    last_learned_at: item.last_learned_at,
    concept_id: item.concept_id,
  }));
}

async function fetchTopicDetail(child_id, concept_id) {
  // 🔥 1. Get latest session
  const { data, error } = await supabase
    .from("learning_sessions_v2")
    .select("*")
    .eq("child_id", child_id)
    .eq("concept_id", concept_id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching session:", error);
    throw error;
  }

  const lastSession = data?.[0];

  // 🔥 2. Get concept name (IMPORTANT)
  const { data: conceptData, error: conceptError } = await supabase
    .from("concepts")
    .select("name, subject")
    .eq("id", concept_id)
    .single();

  if (conceptError) {
    console.error("Error fetching concept:", conceptError);
  }

  return {
    conceptName: conceptData?.name || "Unknown",
    subject: conceptData?.subject || "General",

    teach: lastSession?.teach || "", // ✅ FIXED name
    practice: lastSession?.practice || [],
    parent_tip: lastSession?.parent_tip || "",
    prerequisite: lastSession?.prerequisite || null,
    class_level: lastSession?.class_level || 2,

    teaching_mode: lastSession?.teaching_mode || "foundational",
    understanding_score: lastSession?.understanding_score || 0,

    next_step: lastSession?.next_step || null, // 🔥 future-ready
  };
}

module.exports = { fetchTopics, fetchTopicDetail };
