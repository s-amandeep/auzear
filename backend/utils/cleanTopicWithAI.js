async function cleanTopicWithAI(input) {
  const prompt = `
Extract the core learning topic from this input:

"${input}"

Return ONLY the topic (1–3 words).
`;

  const result = await generateFromPrompt(prompt);
  return result.trim();
}

module.exports = { cleanTopicWithAI };