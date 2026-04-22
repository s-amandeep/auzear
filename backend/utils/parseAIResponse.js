function parseAIResponse(raw) {
  try {
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("AI PARSE ERROR:", raw);
    // throw new Error("Invalid AI response");
    return res.status(200).json({
      fallback: true,
      message: "Service waking up, please try again",
    });
  }
}

module.exports = { parseAIResponse };