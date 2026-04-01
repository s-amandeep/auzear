"use client";

import { useState } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";

export default function TeachPage() {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");

  const [result, setResult] = useState("");
  const [questions, setQuestions] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ topic, classLevel }: any) => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teaching`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic, classLevel }),
        },
      );

      const data = await res.json();
      setResult(data.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);

    try {
      const qRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic, classLevel }),
        },
      );

      const qData = await qRes.json();
      setQuestions(qData.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleFeedback = async (score: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          classLevel,
          score,
        }),
      });

      alert("Session saved & revision scheduled!");
    } catch (error) {
      console.error(error);
      alert("Error saving session");
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm onSubmit={handleSubmit} />

      {loading && <p>Generating...</p>}

      <TeachingCard data={result} />

      {questions && (
        <div className="mt-6 p-6 border rounded-xl w-full max-w-md">
          <h2 className="font-bold mb-2">Ask your child:</h2>
          <pre className="whitespace-pre-wrap">{questions}</pre>

          <div className="flex gap-4 mt-4">
            <button onClick={() => handleFeedback(100)}>✅ Correct</button>
            <button onClick={() => handleFeedback(60)}>⚠️ Partial</button>
            <button onClick={() => handleFeedback(30)}>❌ Wrong</button>
          </div>
        </div>
      )}
    </main>
  );
}
