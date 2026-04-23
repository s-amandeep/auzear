"use client";

import { useEffect, useState } from "react";
import { fetchAllTopics } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Topics() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    // const child_id = typeof window !== "undefined" ? localStorage.getItem("child_id") : null;
    const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context
    
    if (!child_id) return;

    setLoading(true);

    const res = await fetchAllTopics(child_id);

    if (!("error" in res)) {
      setTopics(res.topics || []);
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center px-4 py-6 gap-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Topics Covered</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && topics.length === 0 && (
        <p className="text-gray-500 text-sm">
          Start teaching to build your learning journey 🌱
        </p>
      )}

      <div className="w-full flex flex-col gap-3">
        {topics.map((t, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-xl shadow cursor-pointer"
            onClick={() => router.push(`/teach?topic=${t.topic}&mode=revisit`)}
          >
            <p className="font-semibold">{t.topic}</p>
            <p className="text-xs text-gray-500">
              {t.subject} • Level {t.revision_level}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
