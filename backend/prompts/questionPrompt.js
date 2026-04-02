function getQuestionPrompt(topic, classLevel) {
  return `
You are teaching a Class ${classLevel} student.

Topic: ${topic}

Create 3 conceptual questions:
- No MCQs
- Use real-life examples
- Keep it very simple

 Return ONLY JSON in this format:

 {
  "questions": [
    "...",
    "...",
    "..."
  ]
}
`;
}

module.exports = { getQuestionPrompt };