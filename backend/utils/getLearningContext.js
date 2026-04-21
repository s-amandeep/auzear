const supabase = require("../config/supabase");

async function getLearningContext(child_id, topic) {
  // normalize topic same as before
  try{
  if (!child_id || !topic) {
    con
  }
  const normalizedTopic = topic.trim().toLowerCase();

  // console.log("Fetching learning context for:", {topic, child_id});
  // get concept

  const { data: concept } = await supabase
    .from("concepts")
    .select("*")
    .eq("name", normalizedTopic)
    .maybeSingle();

  if (!concept) {
      return null;
    }

  // get learning state
  const { data: state } = await supabase
    .from("learning_states")
    .select("*")
    .eq("child_id", child_id)
    .eq("concept_id", concept.id)
    .maybeSingle();

  // get last session
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("child_id", child_id)
    .eq("concept_id", concept.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const lastSession = sessions?.[0];

  // console.log("Learning context fetched:", {concept, state, lastSession});
  return {
    concept,
    state,
    lastSession,
  };
}catch (error) {  console.error("Error fetching learning context:", error);
  throw new Error("Failed to fetch learning context");
}
}

module.exports = { getLearningContext };
