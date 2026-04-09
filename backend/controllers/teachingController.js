const { generateFromPrompt } = require("../services/aiService");
const { getTeachingPrompt } = require("../prompts/teachingPrompt");

async function generateTeaching(req, res) {
  const { topic, classLevel } = req.body;

  try {
    const normalizedTopic = topic.trim().toLowerCase();   

    let parsed;

    try {
      const prompt = getTeachingPrompt(normalizedTopic, classLevel);
      const raw = await generateFromPrompt(prompt);
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    res.json({
    topic: parsed.topic,
    subject: parsed.subject,
    teach: parsed.teach,
    questions: parsed.practice,
  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateTeaching };
