"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchQuestions } from "../../lib/api";

export default function RevisePage() {
  const params = useSearchParams();
  const concept = params.get("concept");

  const [questions, setQuestions] = useState<any>(null);

  useEffect(() => {
    if (concept) loadQuestions();
  }, [concept]);

  const loadQuestions = async () => {
    const res = await fetchQuestions(concept, "3");
    setQuestions(res.data);
  };

  return (
    <main className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Revise: {concept}</h1>

      {questions?.questions?.map((q: string, i: number) => (
        <p key={i}>{i + 1}. {q}</p>
      ))}
    </main>
  );
}