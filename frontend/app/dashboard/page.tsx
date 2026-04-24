"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTopics } from "../../hooks/useTopics";
import { trackEvent } from "@/lib/analytics";

const labelMap: Record<string, string> = {
  foundational: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function Dashboard() {
  const { topics, loading, loadTopics } = useTopics();
  const router = useRouter();

  useEffect(() => {
    trackEvent("dashboard_clicked", {});
    // const child_id = typeof window !== "undefined" ? localStorage.getItem("child_id") : null;
    const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context
    loadTopics(child_id);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6 gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Your Child’s Learning</h1>
        <p className="text-sm text-gray-500">Continue from where you left</p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-sm mt-6">Loading topics...</p>
      )}

      {/* Empty State */}
      {!loading && topics.length === 0 && (
        <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md text-center">
          <p className="text-gray-800 font-medium">No topics explored yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Start with one concept — it only takes a minute 🌱
          </p>

          <button
            className="mt-4 bg-black text-white px-4 py-2 rounded-xl"
            onClick={() => router.push("/teach")}
          >
            Start Teaching
          </button>
        </div>
      )}

      {/* Topics List */}
      {!loading && topics.length > 0 && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {topics.map((t) => (
            <div key={t.concept_id} className="bg-white p-4 rounded-2xl shadow">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{t.conceptName}</p>

                <span className="text-xs text-gray-500">
                  {labelMap[t.teaching_mode]}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Understanding: {t.understanding_score}%
              </p>

              <button
                className="mt-3 text-sm text-black underline"
                onClick={() =>
                  router.push(`/teach/${t.concept_id}`)
                }
              >
                Continue learning →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {topics.length > 0 && (
        <button
          className="mt-4 bg-black text-white px-5 py-2 rounded-xl"
          onClick={() => router.push("/teach")}
        >
          Teach Something New
        </button>
      )}
    </main>
  );
}
