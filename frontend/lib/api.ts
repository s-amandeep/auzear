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

// Insights
export async function fetchInsights(child_id: string) {
  return apiFetch(`/api/insights/${child_id}`, {
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

type SaveSessionV2Input =
  | {
      topic: string;
      subject: string;
      classLevel: number;
      child_id: string;
      teaching_mode: "foundational" | "intermediate" | "advanced";
      understanding_score: number;
      teach: string;
      practice: string[];
      parent_tip: string;
      prerequisite: any;
      deep_dive?: string | null; // 🔥 ADD
      next_step?: any; // 🔥 ADD
      concept_id?: never;
    }
  | {
      concept_id: string;
      child_id: string;
      teaching_mode: "foundational" | "intermediate" | "advanced";
      understanding_score: number;
      teach: string;
      practice: string[];
      parent_tip: string;
      prerequisite: any;
      deep_dive?: string | null; // 🔥 ADD
      next_step?: any; // 🔥 ADD
      topic?: never;
      subject?: never;
      classLevel?: never;
    };

// ==========================
// 🔥 V2: Fetch Topics (New Dashboard)
// ==========================

export async function saveSessionV2(data: SaveSessionV2Input) {
  return apiFetch("/api/v2/session", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

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

// ==========================
// Generate Worksheet
// ==========================
export async function generateWorksheet(data: {
  topic: string;
  classLevel: string;
  teaching_mode: "foundational" | "intermediate" | "advanced";
  understanding_score: number;
  count: number;
  style: "basic" | "mixed" | "thinking" | "creative";
}) {
  return apiFetch("/api/worksheet", {
    method: "POST",
    body: JSON.stringify(data),
  });
}