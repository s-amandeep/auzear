const supabase = require("../config/supabase");

async function getAllTopicsService(child_id) {
  const { data, error } = await supabase
    .from("learning_states")
    .select(`
      concept_id,
      understanding_score,
      revision_level,
      last_learned_at,
      concepts (name, subject)
    `)
    .eq("child_id", child_id)
    .order("last_learned_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => ({
    topic: item.concepts?.name,
    subject: item.concepts?.subject,
    revision_level: item.revision_level,
    understanding_score: item.understanding_score,
    last_learned_at: item.last_learned_at,
  }));
}

async function getTopicTeachingService(child_id, topic) {
  const normalizedTopic = topic.trim().toLowerCase();

  // 1. Find concept
  const { data: concept } = await supabase
    .from("concepts")
    .select("id")
    .ilike("name", normalizedTopic)
    .maybeSingle();

  if (!concept) return null;

  // 2. Fetch teaching
  const { data } = await supabase
    .from("learning_states")
    .select("last_teaching")
    .eq("child_id", child_id)
    .eq("concept_id", concept.id)
    .maybeSingle();

  return data?.last_teaching || null;
}

module.exports = {
  getAllTopicsService,
  getTopicTeachingService,
};