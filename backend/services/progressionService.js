    const generateFromPrompt = require("../utils/generateFromPrompt");

async function getNextStep({ topic, classLevel, understanding_score }) {
  const prompt = `
You are an expert curriculum planner.

Topic: ${topic}
Class: ${classLevel}
Understanding score: ${understanding_score}

Suggest the NEXT BEST topic to teach.

Rules:
- If score < 50 → suggest easier / prerequisite
- If 50–75 → suggest reinforcement
- If > 75 → suggest next level

Return ONLY JSON:

{
  "topic": "...",
  "reason": "..."
}
`;

  const raw = await generateFromPrompt(prompt);

  return JSON.parse(raw);
}

module.exports = { getNextStep };