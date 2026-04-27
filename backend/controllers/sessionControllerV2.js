// controllers/sessionControllerV2.js
const { saveSession } = require("../services/sessionServiceV2");

async function saveSessionV2(req, res) {
  try {    
    const result = await saveSession(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Session V2 Error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { saveSessionV2 };