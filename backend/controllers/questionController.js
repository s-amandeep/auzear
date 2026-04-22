const { generateQuestionsService } = require("../services/questionService");

async function generateQuestions(req, res) {
  const { topic, classLevel, child_id } = req.body;

  try {
    if (!topic || topic.length > 100) {
      return res.status(400).json({ error: "Invalid topic input" });
    }

    console.log("AI CALL:", {
      endpoint: "revision-questions",
      topic,
      time: new Date(),
      child_id,
    });

    const result = await generateQuestionsService({
      topic,
      classLevel,
      child_id,
    });

    res.json({
      data: result.questions,
      revision_level: result.revision_level,
      trend: result.trend,
    });

  } catch (err) {
    console.error("Question Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateQuestions };