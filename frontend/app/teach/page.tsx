"use client";

import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput, QuestionResponse } from "../types";

export default function TeachPage() {
  const { loading, result, questions, startTeaching, submitFeedback } =
    useTeaching();

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm
        onSubmit={({ topic, classLevel }: TeachingInput) =>
          startTeaching(topic, classLevel)
        }
      />

      {loading && <p>Generating...</p>}

      <TeachingCard data={result} />

      {questions && (
        <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold mb-3">Ask your child:</h2>
          {questions?.questions?.map((q: string, i: number) => (
            <p key={i} className="mb-2">
              {i + 1}. {q}
            </p>
          ))}

          <div className="flex gap-4 mt-4">
            <button onClick={() => submitFeedback("", "", 100)}>
              ✅ Correct
            </button>
            <button onClick={() => submitFeedback("", "", 60)}>
              ⚠️ Partial
            </button>
            <button onClick={() => submitFeedback("", "", 30)}>❌ Wrong</button>
          </div>
        </div>
      )}
    </main>
  );
}
