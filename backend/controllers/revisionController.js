const {
  getRevisionDashboard,
  saveRevisionFeedback,
} = require("../services/revisionService");

async function getDashboard(req, res) {
  try {
    const { child_id } = req.params;

    const result = await getRevisionDashboard(child_id);

    res.json(result);

  } catch (err) {
    console.error("Revision error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function saveFeedback(req, res) {
  try {
    const { topic, engagement, child_id } = req.body;

    const result = await saveRevisionFeedback({
      topic,
      engagement,
      child_id,
    });

    res.json(result);

  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getDashboard,
  saveFeedback,
};