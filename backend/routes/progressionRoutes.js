// routes/progressionRoutes.js
const router = require("express").Router();
const { handleNextStep } = require("../controllers/progressionController");

router.post("/", handleNextStep);

module.exports = router;