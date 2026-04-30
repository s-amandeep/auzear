// controllers/progressionController.js
const { getNextStep } = require("../services/progressionService");

async function handleNextStep(req, res) {
  try {
    const result = await getNextStep(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true });
  }
}

module.exports = { handleNextStep };