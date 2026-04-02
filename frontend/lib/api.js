const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTeaching(topic, classLevel) {
  const res = await fetch(`${API_URL}/api/teaching`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, classLevel }),
  });

  return res.json();
}

export async function fetchQuestions(topic, classLevel) {
  const res = await fetch(`${API_URL}/api/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, classLevel }),
  });

  return res.json();
}

export async function saveSession(topic, classLevel, score) {
  const res = await fetch(`${API_URL}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, classLevel, score }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to save session");
  }

  alert("Session saved & revision scheduled!");
  return data;
}