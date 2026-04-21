"use client";

import { useState } from "react";
import { TeachingInput } from "../types";

export default function ConceptForm({
  onSubmit,
}: {
  onSubmit: (data: TeachingInput) => void;
}) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ topic, classLevel });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      {/* <input
        type="text"
        placeholder="What would you like to teach today? (e.g., Fractions)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-3 rounded-lg"
        required
      /> */}
      <p className="text-lg font-medium text-center mb-2">
        What would you like to teach today?
      </p>

      <input
        type="text"
        placeholder="Enter a topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />

      {!topic && (
        <p className="text-xs text-gray-500 text-left">
          e.g., Fractions • Simple Interest
        </p>
      )}

      <input
        type="text"
        placeholder="Class (e.g., 3)"
        value={classLevel}
        onChange={(e) => setClassLevel(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />

      <button className="bg-blue-600 text-white py-3 rounded-lg">
        Start Teaching
      </button>
    </form>
  );
}
