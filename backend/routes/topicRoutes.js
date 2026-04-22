const express = require("express");
const router = express.Router();

const {
  getAllTopics,
  getTopicTeaching,
} = require("../controllers/topicController");

const checkApiKey = require("../middleware/authMiddleware");

// All topics
router.get("/:child_id", checkApiKey, getAllTopics);

// Last teaching for topic
router.get("/:child_id/:topic", checkApiKey, getTopicTeaching);

module.exports = router;