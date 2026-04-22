const supabase = require("../config/supabase");

async function getLearningContext(child_id, topic) {
  try {
    if (!child_id || !topic) return null;

    const normalizedTopic = topic.trim().toLowerCase();

    // 1. Get concept
    const { data: concept, error: conceptError } = await supabase
      .from("concepts")
      .select("id, name")
      .ilike("name", normalizedTopic)
      .maybeSingle();

    if (conceptError) {
      console.error("Concept fetch error:", conceptError);
      return null;
    }

    if (!concept) return null;

    // 2. Get learning state
    const { data: state, error: stateError } = await supabase
      .from("learning_states")
      .select(
        "understanding_score, memory_strength, revision_level, trend, last_teaching"
      )
      .eq("child_id", child_id)
      .eq("concept_id", concept.id)
      .maybeSingle();

    if (stateError) {
      console.error("State fetch error:", stateError);
    }

    // 3. Get last session
    const { data: sessions, error: sessionError } = await supabase
      .from("sessions")
      .select("score, created_at, engagement")
      .eq("child_id", child_id)
      .eq("concept_id", concept.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (sessionError) {
      console.error("Session fetch error:", sessionError);
    }

    const lastSession = sessions?.[0] || null;

    return {
      concept,
      state,
      lastSession,
    };

  } catch (error) {
    console.error("Error fetching learning context:", error);

    // 🔥 IMPORTANT: DO NOT THROW
    return null;
  }
}

module.exports = { getLearningContext };