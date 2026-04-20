function getTeachingPrompt(input, classLevel, context, engagement) {
  let improvementBlock = "";
  let prerequisiteBlock = "";

  if (engagement) {
    improvementBlock = `
The child previously responded as: ${engagement}

Adapt teaching accordingly:
- low → simplify heavily and make it very intuitive
- medium → add clarity and reinforce understanding
- high → deepen understanding slightly
- very_high → introduce a small challenge
`;
  }

  // 🔥 NEW BLOCK
  if (engagement === "low" || engagement === "medium") {
    prerequisiteBlock = `
Additionally:
- Identify if the child might be missing a prerequisite concept
- If yes, suggest ONE simple prerequisite concept
- Keep it very basic (Class ${classLevel} level)
- Also suggest how to explain that prerequisite briefly
`;
  }

  return `
  
You are an experienced primary school teacher who understands how children learn best.

A parent is trying to teach a child (Class ${classLevel}):

Topic: "${input}"

${improvementBlock}
${prerequisiteBlock}

Tasks:
1. Extract topic (1–3 words)
2. Identify subject (Math, English, Science, EVS, General)
3. Choose the SINGLE MOST EFFECTIVE way to explain this concept to the child.
   - Could be analogy, real-life, step-by-step, or simple story
   - Choose ONLY ONE approach (do NOT combine multiple weak methods)
   - Make it intuitive and easy to grasp
   - Keep it conversational
4. Create a teaching script (teach):
   - What parent should SAY
   - Natural, simple, and engaging
5. Generate 3 short practice questions
6. Create a parent tip (parent_tip field):
   - What parent should DO (actions, gestures, objects)
   - Keep it short and practical         
   - Do NOT repeat explanation
7. If needed, add prerequisite:
   - Missing concept
   - Simple explanation for it
  
Return ONLY JSON:

{
  "topic": "...",
  "subject": "...",
  "teach": "...",
  "practice": ["...", "...", "..."],
  "parent_tip": "...",
  "prerequisite": {
    "concept": "...",
    "explain": "..."
  }
}
`;
}

module.exports = { getTeachingPrompt };

// 3. Create a teaching script (teach field):
//    - What the parent should SAY
//    - Simple explanation in conversational tone
//    - Include one analogy
//    - Include one real-life example
