const express = require("express");
const router = express.Router();
const { generateQuestions } = require("../controllers/questionController");

router.post("/", generateQuestions);

module.exports = router;