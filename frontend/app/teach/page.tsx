"use client";

import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput } from "../types";

export default function TeachPage() {
  const { loading, result, questions, startTeaching, submitFeedback } =
    useTeaching();

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm
        onSubmit={({ topic, classLevel }: TeachingInput) => startTeaching(topic, classLevel)}
      />

      {loading && <p>Generating...</p>}

      <TeachingCard data={result} />

      {questions && (
        <div className="mt-6 p-6 border rounded-xl w-full max-w-md">
          <h2 className="font-bold mb-2">Ask your child:</h2>
          <pre className="whitespace-pre-wrap">{questions}</pre>

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
