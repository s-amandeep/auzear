"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchQuestions } from "../../lib/api";

export default function RevisePage() {
  const params = useSearchParams();
  const concept = params.get("concept");

  const [questions, setQuestions] = useState<any>(null);  

  useEffect(() => {
    if (!concept) return;
    loadQuestions();
  }, [concept]);

  if (!concept) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const loadQuestions = async () => {
    if (!concept) return; // 🔥 VERY IMPORTANT

    try {
      const res = await fetchQuestions(concept, "3");
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Failed to load questions");
    }
  };  

  return (
    <main className="p-6 flex flex-col items-center gap-6">
      
      <h1 className="text-2xl font-bold">Revise: {concept}</h1>

      {questions?.questions?.map((q: string, i: number) => (
        <p key={i}>
          {i + 1}. {q}
        </p>
      ))}
    </main>
  );
}
