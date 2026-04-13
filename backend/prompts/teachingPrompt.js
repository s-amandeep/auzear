function getTeachingPrompt(input, classLevel, context, engagement) {
  // let contextBlock = "";
  let improvementBlock = "";

  // - what parent should say/do

  // if (context && context.state) {
  //   contextBlock = `

  if (engagement) {
    improvementBlock = `
The child previously responded as: ${engagement}

Adapt teaching accordingly:
- low → simplify a lot, use very basic analogy and make parent_tip in response more interactive
- medium → add more relatable examples
- high → slightly deepen understanding
- very_high → challenge with thinking questions and suggest challenge activity in parent_tip in response
`;
  }

  return `
A parent wants to teach a child (Class ${classLevel}).

Input: "${input}"

${improvementBlock}

Tasks:
1. Extract topic (1–3 words)
2. Identify subject (Math, English, Science, EVS, General)
3. Create a teaching script (teach field):
   - What the parent should SAY
   - Simple explanation in conversational tone
   - Include one analogy
   - Include one real-life example
   
4. Generate 3 practice questions
5. Create a parent tip (parent_tip field):
   - What the parent should DO (not say)
   - Use actions like objects, gestures, or activities
   - Keep it short (1–2 lines)
   - Do NOT repeat explanation
  
Return ONLY JSON:

{
  "topic": "...",
  "subject": "...",
  "teach": "...",
  "practice": ["...", "...", "..."],
  "parent_tip": "..."
}
`;
}

module.exports = { getTeachingPrompt };
