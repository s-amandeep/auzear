function getTeachingPrompt(input, classLevel) {
  return `
A parent wants to teach a child (Class ${classLevel}).

Input: "${input}"

Tasks:
1. Extract topic (1–3 words)
2. Identify subject (Math, English, Science, EVS, General)
3. Create a simple teaching script including:
   - explanation
   - analogy
   - real-life example
   - what parent should say/do
4. Generate 3 practice questions

Return ONLY JSON:

{
  "topic": "...",
  "subject": "...",
  "teach": "...",
  "practice": ["...", "...", "..."]
}
`;
}

module.exports = { getTeachingPrompt };