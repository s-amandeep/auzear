const {
  getAllTopicsService,
  getTopicTeachingService,
} = require("../services/topicService");

async function getAllTopics(req, res) {
  try {
    const { child_id } = req.params;

    const topics = await getAllTopicsService(child_id);

    res.json({ topics });

  } catch (err) {
    console.error("Topics Error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getTopicTeaching(req, res) {
  try {
    const { child_id, topic } = req.params;

    const teaching = await getTopicTeachingService(child_id, topic);

    res.json({ teaching });

  } catch (err) {
    console.error("Topic Teaching Error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllTopics,
  getTopicTeaching,
};