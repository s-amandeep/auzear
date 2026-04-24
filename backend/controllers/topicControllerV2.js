// controllers/topicControllerV2.js
const { fetchTopics, fetchTopicDetail } = require("../services/topicServiceV2");

async function getTopics(req, res) {
  
  try {
    const { child_id } = req.params;
    
    const data = await fetchTopics(child_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
}

async function getTopicDetail(req, res) {
  try {
    const { child_id, concept_id } = req.params;

    const data = await fetchTopicDetail(child_id, concept_id);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch topic detail" });
  }
}

module.exports = { getTopics, getTopicDetail };
