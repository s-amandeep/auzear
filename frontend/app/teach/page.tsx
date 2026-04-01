"use client";

import { useState } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";

export default function TeachPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

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
        }
      );

      const data = await res.json();
      setResult(data.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm onSubmit={handleSubmit} />

      {loading && <p>Generating...</p>}

      <TeachingCard data={result} />
    </main>
  );
}