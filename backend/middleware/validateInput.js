function validateTopic(req, res, next) {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string" || topic.length > 100) {
    return res.status(400).json({ error: "Invalid topic" });
  }

  next();
}

module.exports = { validateTopic };