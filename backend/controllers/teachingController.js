const { generateFromPrompt } = require("../services/aiService");
const { getTeachingPrompt } = require("../prompts/teachingPrompt");
const { getLearningContext } = require("../utils/getLearningContext");

async function generateTeaching(req, res) {
  const { topic, classLevel, child_id, engagement } = req.body;

  try {
    if (!topic || topic.length > 100) {
      return res.status(400).json({ error: "Invalid topic input" });
    }

    const normalizedTopic = topic.trim().toLowerCase();

    console.log("AI CALL:", {
      endpoint: "teach",
      topic,
      time: new Date(),
    });

    let parsed;

    try {
      // 🔥 fetch past context
      const context = await getLearningContext(child_id, topic);

      const prompt = getTeachingPrompt(
        normalizedTopic,
        classLevel,
        context,
        engagement,
      );
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
      parentTip: parsed.parent_tip,
      prerequisite: parsed.prerequisite || null,
    });
    // res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateTeaching };
