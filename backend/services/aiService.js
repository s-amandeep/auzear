const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateFromPrompt(prompt) {
  try {
    // ⏱️ Timeout wrapper (10 sec)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI request timeout")), 30000)
    );

    const aiPromise = client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400, // 🔥 slightly reduced to control cost
      temperature: 0.7, // balanced creativity + consistency
    });

    const response = await Promise.race([aiPromise, timeoutPromise]);

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    return content;

  } catch (err) {
    console.error("AI SERVICE ERROR:", err.message);

    // 🔥 Normalize error messages (important for frontend stability)
    if (err.message.includes("timeout")) {
      throw new Error("AI request timeout");
    }

    throw new Error("AI generation failed");
  }
}

module.exports = { generateFromPrompt };