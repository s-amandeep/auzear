const supabase = require("../config/supabase");
const {
  getScoreFromEngagement,
  calculateProgress,
} = require("./progressService");

async function getRevisionDashboard(child_id) {
  const today = new Date().toISOString();

  const { data: states, error } = await supabase
    .from("learning_states")
    .select(`
      *,
      concepts (name, subject),
      children (streak_count)
    `)
    .eq("child_id", child_id);

  if (error) throw error;

  if (!states || states.length === 0) {
    return {
      dueToday: [],
      upcoming: [],
      retentionScore: 0,
      streak: 0,
    };
  }

  const enriched = states.map((s) => ({
    ...s,
    conceptName: s.concepts?.name || "Unknown",
    subject: s.concepts?.subject || "General",
  }));

  // Due today
  const dueToday = enriched
    .filter((item) => item.next_revision_at <= today)
    .sort((a, b) => (a.memory_strength || 0) - (b.memory_strength || 0));

  // Upcoming
  const upcoming = enriched
    .filter((item) => item.next_revision_at > today)
    .sort((a, b) => (a.memory_strength || 0) - (b.memory_strength || 0));

  // Retention score
  const retentionScore = Math.round(
    (enriched.reduce(
      (acc, item) => acc + (item.memory_strength || 0),
      0
    ) /
      enriched.length) *
      100
  );

  const streak = enriched[0]?.children?.streak_count || 0;

  return {
    dueToday,
    upcoming,
    retentionScore,
    streak,
  };
}

async function saveRevisionFeedback({ topic, engagement, child_id }) {
  const score = getScoreFromEngagement(engagement);

  const { data: concept } = await supabase
    .from("concepts")
    .select("id")
    .ilike("name", topic)
    .maybeSingle();

  if (!concept) {
    return res.status(200).json({
      fallback: true,
      message: "Service waking up, please try again",
    });
  }

  const { data: existing } = await supabase
    .from("learning_states")
    .select("*")
    .eq("concept_id", concept.id)
    .eq("child_id", child_id)
    .maybeSingle();

  if (!existing) {
    return res.status(200).json({
      fallback: true,
      message: "Service waking up, please try again",
    });
  }

  const { trend, newMemory, newLevel, nextDate } = calculateProgress({
    currentScore: score,
    prevScore: existing.understanding_score || 0,
    prevMemory: existing.memory_strength || 0.3,
    prevLevel: existing.revision_level || 1,
  });

  const { error } = await supabase
    .from("learning_states")
    .update({
      understanding_score: score,
      memory_strength: newMemory,
      revision_level: newLevel,
      trend,
      next_revision_at: nextDate,
      last_learned_at: new Date(),
    })
    .eq("id", existing.id);

  if (error) throw error;

  return { success: true };
}

module.exports = {
  getRevisionDashboard,
  saveRevisionFeedback,
};