const { generateTeachingService, getLastTeachingService } = require("../services/teachingService");

async function generateTeaching(req, res) {
  const { topic, classLevel, child_id, engagement } = req.body;

  try {
    // 1. Validation
    if (!topic || topic.length > 100) {
      return res.status(400).json({ error: "Invalid topic input" });
    }

    console.log("AI CALL:", {
      endpoint: "teach",
      topic,
      time: new Date(),
    });

    // 2. Call service
    const result = await generateTeachingService({
      topic,
      classLevel,
      child_id,
      engagement,
    });

    // 3. Send response
    res.json(result);
  } catch (err) {
    console.error("Teaching Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getLastTeaching(req, res) {
  try {
    const { topic, child_id } = req.query;

    const teaching = await getLastTeachingService(topic, child_id);

    res.json({ teaching });

  } catch (err) {
    console.error("Fetch last teaching error:", err);
    res.status(500).json({ error: "Failed to fetch teaching" });
  }
}

module.exports = { generateTeaching, getLastTeaching };
