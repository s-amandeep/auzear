const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// 🔥 Common API response shape
type ApiResponse<T = any> =
  | T
  | {
      error: true;
      message: string;
    };

// 🔥 Headers
const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  "x-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
});

// 🔥 Core fetch wrapper
async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: getHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error: any) {
    console.error("API Error:", error);

    if (error.name === "AbortError") {
      return {
        error: true,
        message: "Server is taking too long. Please try again.",
      };
    }

    return {
      error: true,
      message: "Server is waking up... please try again in a few seconds",
    };
  }
}

// Teaching
export async function fetchTeaching({
  topic,
  classLevel,
  child_id,
  engagement,
}: {
  topic: string;
  classLevel: string;
  child_id: string;
  engagement?: "low" | "medium" | "high" | "very_high";
}) {
  return apiFetch("/api/teaching", {
    method: "POST",
    body: JSON.stringify({
      topic,
      classLevel,
      child_id,
      ...(engagement && { engagement }),
    }),
  });
}

// Questions
export async function fetchQuestions({
  topic,
  classLevel,
  child_id,
}: {
  topic: string;
  classLevel: string;
  child_id: string;
}) {
  return apiFetch("/api/questions", {
    method: "POST",
    body: JSON.stringify({
      topic,
      classLevel,
      child_id,
    }),
  });
}

// Save Session
export async function saveSession({
  topic,
  subject,
  child_id,
  engagement,
  teachResult,
}: {
  topic: string;
  subject: string;
  child_id: string;
  engagement: string;
  teachResult: any;
}) {
  return apiFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      topic,
      subject,
      child_id,
      engagement,
      teachResult,
    }),
  });
}

// Revision Dashboard
export async function fetchRevision(child_id: string) {
  return apiFetch(`/api/revision/${child_id}`, {
    method: "GET",
  });
}

// Insights
export async function fetchInsights(child_id: string) {
  return apiFetch(`/api/insights/${child_id}`, {
    method: "GET",
  });
}

// Revision Feedback
export async function submitRevisionFeedback(data: any) {
  return apiFetch("/api/revision/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Last Teaching
export async function fetchLastTeaching(topic: string, child_id: string) {
  return apiFetch(
    `/api/teaching/last?topic=${encodeURIComponent(topic)}&child_id=${child_id}`,
    {
      method: "GET",
    },
  );
}

// Topics
export async function fetchAllTopics(child_id: string) {
  return apiFetch(`/api/topics/${child_id}`, {
    method: "GET",
  });
}

export async function fetchTopicTeaching(child_id: string, topic: string) {
  return apiFetch(`/api/topics/${child_id}/${encodeURIComponent(topic)}`, {
    method: "GET",
  });
}

// ==========================
// 🔥 V2: Teaching (Depth-based)
// ==========================
export async function fetchTeachingV2({
  topic,
  classLevel,
  child_id,
  teaching_mode = "foundational",
}: {
  topic: string;
  classLevel: number; // ✅ number now
  child_id: string;
  teaching_mode?: "foundational" | "intermediate" | "advanced";
}) {
  return apiFetch("/api/v2/teaching", {
    method: "POST",
    body: JSON.stringify({
      topic,
      classLevel,
      child_id,
      teaching_mode,
    }),
  });
}

// ==========================
// 🔥 V2: Save Session
// ==========================
export async function saveSessionV2({
  topic,
  subject,
  classLevel,
  child_id,
  teaching_mode,
  understanding_score,
  teach,
  practice,
  parent_tip,
  prerequisite,
}: {
  topic: string;
  subject: string;
  classLevel: number;
  child_id: string;
  teaching_mode: "foundational" | "intermediate" | "advanced";
  understanding_score: number;
  teach: any;
  practice: any;
  parent_tip: string;
  prerequisite: any;
}) {
  return apiFetch("/api/v2/session", {
    method: "POST",
    body: JSON.stringify({
      topic,
      subject,
      classLevel,
      child_id,
      teaching_mode,
      understanding_score,
      teach,
      practice,
      parent_tip,
      prerequisite,
    }),
  });
}

// ==========================
// 🔥 V2: Fetch Topics (New Dashboard)
// ==========================
export async function fetchTopicsV2(child_id: string) {
  return apiFetch(`/api/v2/topics/${child_id}`, {
    method: "GET",
  });
}

// ==========================
// 🔥 V2: Fetch Topic Detail (Last Session)
// ==========================
export async function fetchTopicDetailV2({
  child_id,
  concept_id,
}: {
  child_id: string;
  concept_id: string;
}) {
  return apiFetch(`/api/v2/topics/${child_id}/${concept_id}`, {
    method: "GET",
  });
}
