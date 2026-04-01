const { generateFromPrompt } = require("../services/aiService");
const { getQuestionPrompt } = require("../prompts/questionPrompt");

async function generateQuestions(req, res) {
  const { topic, classLevel } = req.body;

  try {
    const prompt = getQuestionPrompt(topic, classLevel);
    const result = await generateFromPrompt(prompt);

    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateQuestions };