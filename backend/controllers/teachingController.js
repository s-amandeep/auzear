const { generateFromPrompt } = require("../services/aiService");
const { getTeachingPrompt } = require("../prompts/teachingPrompt");
const { cleanTopicWithAI } = require("../utils/cleanTopicWithAI");

async function generateTeaching(req, res) {
  const { topic, classLevel } = req.body;

  try {
    const cleanTopic = cleanTopicWithAI(topic);
    const prompt = getTeachingPrompt(cleanTopic, classLevel);
    const result = await generateFromPrompt(prompt);

    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateTeaching };