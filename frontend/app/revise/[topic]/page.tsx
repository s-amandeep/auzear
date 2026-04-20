"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchQuestions } from "../../../lib/api";
import { trackEvent } from "@/lib/analytics";

export default function RevisePage() {
  const params = useParams();
  //   const concept = params?.topic as string;
  const concept = decodeURIComponent(params?.topic as string);

  const [questions, setQuestions] = useState<any>(null);
  const [revision_level, setRevisionLevel] = useState<number>(1);
  const [trend, setTrend] = useState("stable");

  useEffect(() => {
    if (!concept) return;
    loadQuestions();
  }, [concept]);

  const loadQuestions = async () => {
    trackEvent("revise_clicked", { topic: concept });
    try {
      const res = await fetchQuestions(
        concept,
        "3",
        "c3658790-741b-4823-be25-0822ba4e72df",
      );
      setQuestions(res?.data || []);
      setRevisionLevel(res?.revision_level || 1);
      setTrend(res?.trend || "stable");
    } catch (err) {
      console.error("Failed to load questions");
    }
  };

  if (!concept) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <main className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Revise: {concept}</h1>

      <p className="text-sm text-gray-500 mb-2">
        Level {revision_level} Practice
      </p>

      {questions?.questions?.map((q: string, i: number) => (
        <p key={i}>
          {i + 1}. {q}
        </p>
      ))}

      {trend && (
        <div className="mt-6 text-center">
          {trend === "improving" && (
            <p className="text-green-600">
              Great! Your child is progressing well 🚀
            </p>
          )}

          {trend === "stable" && (
            <p className="text-gray-600">
              Good progress! Let’s strengthen this further 💪
            </p>
          )}

          {trend === "declining" && (
            <p className="text-red-500">
              Let’s revisit basics to build confidence 🌱
            </p>
          )}
        </div>
      )}
    </main>
  );
}
