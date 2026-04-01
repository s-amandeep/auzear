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

Output format:
1. Explanation
2. Analogy
3. Example
4. Parent Instruction
`;
}

module.exports = { getTeachingPrompt };