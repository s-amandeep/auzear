const { saveSessionService } = require("../services/sessionService");

async function saveSession(req, res) {
  try {
    const { topic, subject, engagement, child_id, teachResult } = req.body;

    if (!topic || !child_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await saveSessionService({
      topic,
      subject,
      engagement,
      child_id,
      // teachResult,
    });

    res.json(result);
  } catch (err) {
    console.error("Session Error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { saveSession };
