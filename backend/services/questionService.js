const { generateFromPrompt } = require("./aiService");
const { getQuestionPrompt } = require("../prompts/questionPrompt");
const { getLearningContext } = require("./contextService");
const { parseAIResponse } = require("../utils/parseAIResponse");

async function generateQuestionsService({ topic, classLevel, child_id }) {
  // 1. Fetch context
  const context = await getLearningContext(child_id, topic);

  const revision_level = context?.state?.revision_level || 1;
  const trend = context?.state?.trend || "stable";

  if (trend === "declining") {
    revision_level = Math.max(1, revision_level - 1);
  }

  // 2. Create prompt
  const prompt = getQuestionPrompt(topic, classLevel, revision_level);

  // 3. Call AI
  const raw = await generateFromPrompt(prompt);

 // 4. Safe parse
  let parsed;
  parsed = parseAIResponse(raw);  

  // 5. Return structured result
  return {
    questions: parsed,
    revision_level,
    trend,
  };
}

module.exports = { generateQuestionsService };
