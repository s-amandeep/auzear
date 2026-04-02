const { generateFromPrompt } = require("../services/aiService");
const { getTeachingPrompt } = require("../prompts/teachingPrompt");
const { cleanTopicWithAI } = require("../utils/cleanTopicWithAI");

async function generateTeaching(req, res) {
  const { topic, classLevel } = req.body;

  try {
    const cleanTopic = await cleanTopicWithAI(topic);
    console.log("here", topic, "---",cleanTopic);
    const prompt = getTeachingPrompt(cleanTopic, classLevel);
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

module.exports = { generateTeaching };
