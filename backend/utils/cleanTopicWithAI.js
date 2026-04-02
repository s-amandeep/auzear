const { generateFromPrompt } = require("../services/aiService");

async function cleanTopicWithAI(input) {
  const prompt = `
Extract the core learning topic from this input:

"${input}"

Return ONLY the topic (1–3 words).
No explanation.
`;

  const result = await generateFromPrompt(prompt);
  return result.trim().replace(/["']/g, "");
}

module.exports = { cleanTopicWithAI };