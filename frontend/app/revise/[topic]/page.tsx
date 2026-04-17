"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchQuestions } from "../../../lib/api";

export default function RevisePage() {
  const params = useParams();
  //   const concept = params?.topic as string;
  const concept = decodeURIComponent(params?.topic as string);

  const [questions, setQuestions] = useState<any>(null);

  useEffect(() => {
    if (!concept) return;
    loadQuestions();
  }, [concept]);

  const loadQuestions = async () => {
    try {
      const res = await fetchQuestions(concept, "3");
      setQuestions(res?.data || []);
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

      {questions?.questions?.map((q: string, i: number) => (
        <p key={i}>
          {i + 1}. {q}
        </p>
      ))}
    </main>
  );
}
