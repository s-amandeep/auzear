const { generateFromPrompt } = require("../services/aiService");
const { getQuestionPrompt } = require("../prompts/questionPrompt");

async function generateQuestions(req, res) {
  const { topic, classLevel } = req.body;

  try {
    const prompt = getQuestionPrompt(topic, classLevel);

    const raw = await generateFromPrompt(prompt);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    res.json({ data: parsed });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateQuestions };