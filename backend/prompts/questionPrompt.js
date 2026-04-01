function getQuestionPrompt(topic, classLevel) {
  return `
You are teaching a Class ${classLevel} student.

Topic: ${topic}

Create 3 conceptual questions:
- No MCQs
- Use real-life examples
- Keep it very simple

 Output as numbered list.
`;
}

module.exports = { getQuestionPrompt };