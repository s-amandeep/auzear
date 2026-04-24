// controllers/teachingControllerV2.js
const { generateTeaching } = require("../services/teachingServiceV2");

async function generateTeachingV2(req, res) {
  const {
    topic,
    classLevel,
    teaching_mode = "foundational",
    child_id,
  } = req.body;

  try {
    if (!topic || topic.length > 100) {
      return res.status(400).json({ error: "Invalid topic input" });
    }

    if (classLevel < 1 || classLevel > 9) {
      return res.status(400).json({ error: "Invalid class level" });
    }

    console.log("Teaching AI CALL:", {
      endpoint: "teach",
      topic,
      classLevel,
      teaching_mode,
      time: new Date(),
    });

    const result = await generateTeaching({
      topic,
      classLevel,
      teaching_mode,
      child_id,
    });

    res.json(result);
  } catch (err) {
    console.error("Teaching V2 Error:", err);
    res.status(500).json({ error: "Failed to generate teaching" });
  }
}

module.exports = { generateTeachingV2 };
