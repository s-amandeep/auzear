"use client";

import { useState } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput, QuestionResponse } from "../types";
import { useRouter } from "next/navigation";

export default function TeachPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState<
    "low" | "medium" | "high" | "very_high" | ""
  >("");

  const { loading, result, questions, startTeaching, submitFeedback } =
    useTeaching();

  const handleStart = async ({ topic, classLevel }: TeachingInput) => {
    startTeaching({ topic, classLevel });
  };

  const engagementOptions = [
    { label: "😕", value: "low" as const, text: "Didn't understand" },
    { label: "🤔", value: "medium" as const, text: "Partially understood" },
    { label: "😊", value: "high" as const, text: "Understood well" },
    { label: "😄", value: "very_high" as const, text: "Enjoyed it" },
  ];

  const handleFeedbackClick = async (score: number) => {
    try {
      if (!engagement) {
        alert("Please select how your child responded");
        return;
      }

      setSaving(true);

      await submitFeedback({ score, engagement });
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
      {/* <div className="bg-white p-5 rounded-xl shadow max-w-md">
        <h2 className="font-semibold mb-2">How to Teach</h2>       
        <p className="text-gray-700">{result}</p>
      </div> */}

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

          <div className="mt-4">
            <p className="text-sm text-gray-500">How did your child respond?</p>

            <div className="flex gap-3 mt-2">
              {engagementOptions.map((item) => (
                <button
                  key={item.value}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg border ${
                    engagement === item.value ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setEngagement(item.value)}
                >
                  <span className="text-xl">{item.label}</span>
                  <span className="text-xs mt-1">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
