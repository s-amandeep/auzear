const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTeaching(topic, classLevel) {
  const prompt = `
  You are teaching a Class ${classLevel} student.

  Topic: ${topic}

  Use simple language and a real-life example.

  Output:
  1. Explanation
  2. Analogy
  3. Example
  4. Parent instruction
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

async function generateQuestions(topic, classLevel) {
  const prompt = `
  You are teaching a Class ${classLevel} student.

  Topic: ${topic}

  Create 3 simple conceptual questions:
  - Avoid MCQs
  - Use real-life examples
  - Keep language very simple

  Output as numbered list.
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = { generateTeaching, generateQuestions };