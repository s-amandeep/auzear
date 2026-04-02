function getTeachingPrompt(topic, classLevel) {
  return `
You are teaching a Class ${classLevel} student.

Topic: ${topic}

Note:
- If topic seems like a sentence, extract the main concept.

Instructions:
- Use simple language
- Keep sentences short
- Use real-life analogy
- Avoid technical terms

Return ONLY JSON in this format:

{
  "explanation": "...",
  "analogy": "...",
  "example": "...",
  "parent_instruction": "..."
}
`;
}

module.exports = { getTeachingPrompt };