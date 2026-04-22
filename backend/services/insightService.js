const supabase = require("../config/supabase");
const { getInsightPrompt } = require("../prompts/insightPrompt");
const { generateFromPrompt } = require("./aiService");
const { parseAIResponse } = require("../utils/parseAIResponse");

async function generateInsightsService(child_id) {
  // 1. Fetch learning states
  const { data: states, error: statesError } = await supabase
    .from("learning_states")
    .select(
      `
      understanding_score,
      memory_strength,
      revision_level,
      trend,
      concepts (name, subject)
    `,
    )
    .eq("child_id", child_id);

  if (statesError) throw statesError;

  // 2. Fetch sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("accuracy, engagement, created_at")
    .eq("child_id", child_id);

  if (sessionsError) throw sessionsError;

  // 3. Build prompt
  const prompt = getInsightPrompt(states || [], sessions || []);

  // 4. Call AI
  const raw = await generateFromPrompt(prompt);

  // 5. Safe parse
  let parsed;
  parsed = parseAIResponse(raw);

  return parsed;
}

module.exports = { generateInsightsService };
