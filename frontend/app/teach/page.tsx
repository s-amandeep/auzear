"use client";

import { useState } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput, QuestionResponse } from "../types";
import { useRouter } from "next/navigation";

export default function TeachPage() {
  const router = useRouter();
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [saving, setSaving] = useState(false);

  const { loading, result, questions, startTeaching, submitFeedback } =
    useTeaching();

  const handleStart = ({ topic, classLevel }: TeachingInput) => {
    setCurrentTopic(topic);
    setCurrentClass(classLevel);
    startTeaching({topic, classLevel});
  };

  const handleFeedbackClick = async (score: number) => {
    try {
      let topic = currentTopic;
      let classLevel = currentClass;
      setSaving(true);
      await submitFeedback({topic, classLevel, score});
      setSaving(false);

      // ✅ Only after successful save
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to save session");
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm onSubmit={handleStart} />

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
            <button onClick={() => handleFeedbackClick(90)}>✅ Got it</button>

            <button onClick={() => handleFeedbackClick(60)}>
              ⚠️ Needs practice
            </button>

            <button onClick={() => handleFeedbackClick(30)}>
              ❌ Didn’t understand
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
