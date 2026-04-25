const { generateFromPrompt } = require("./aiService");
const { getTeachingPrompt } = require("../prompts/teachingPrompt");
const { getLearningContext } = require("./contextService");
const supabase = require("../config/supabase");
const { parseAIResponse } = require("../utils/parseAIResponse");

async function generateTeachingService({
  topic,
  classLevel,
  child_id,
  engagement,
}) {
  if (!child_id || !topic) return null;

  const normalizedTopic = topic.trim().toLowerCase();

  // 1. Fetch context
  const context = await getLearningContext(child_id, topic);

  // 2. Create prompt
  const prompt = getTeachingPrompt(
    normalizedTopic,
    classLevel,
    context,
    engagement,
  );

  // 3. Call AI
  const raw = await generateFromPrompt(prompt);
  // console.log(raw);

  // 4. Safe parse
  let parsed;
  parsed = parseAIResponse(raw);  

  // 5. Shape response
  return {
    topic: parsed.topic,
    subject: parsed.subject,
    teach: parsed.teach,
    questions: parsed.practice,
    parentTip: parsed.parent_tip,
    prerequisite: parsed.prerequisite || null,
  };
}

async function getLastTeachingService(topic, child_id) {
  if (!child_id || !topic) return null;
  
  const normalizedTopic = topic.trim().toLowerCase();

  const { data: concept } = await supabase
    .from("concepts")
    .select("id")
    .ilike("name", normalizedTopic)
    .maybeSingle();

  if (!concept) return null;

  const { data } = await supabase
    .from("learning_states")
    .select("last_teaching")
    .eq("concept_id", concept.id)
    .eq("child_id", child_id)
    .maybeSingle();

  return data?.last_teaching || null;
}

module.exports = {
  generateTeachingService,
  getLastTeachingService, // 🔥 add this
};
