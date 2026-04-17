const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateFromPrompt(prompt) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    // max_tokens: 300, // 🔥 ADD HERE    
  });

  return response.choices[0].message.content;
}

module.exports = { generateFromPrompt };