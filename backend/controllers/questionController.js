const { generateFromPrompt } = require("../services/aiService");
const { getQuestionPrompt } = require("../prompts/questionPrompt");
const { getLearningContext } = require("../utils/getLearningContext");

async function generateQuestions(req, res) {
  const { topic, classLevel, childId } = req.body;

  console.log("AI CALL:", {
    endpoint: "revision-questions",
    topic: topic,
    time: new Date(),
    childId: childId,
  });

  try {
    // 🔥 fetch past context
    const context = await getLearningContext(childId, topic);
    const revision_level = context?.state?.revision_level || 1;
    const prompt = getQuestionPrompt(topic, classLevel, revision_level);

    const raw = await generateFromPrompt(prompt);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: "Failed to generate questions" });
    }

    res.json({ data: parsed, revision_level: revision_level, trend: context?.state?.trend || "stable" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateQuestions };
