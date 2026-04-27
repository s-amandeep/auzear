"use client";

import { TeachingInput } from "../types";

export default function ConceptForm({
  topic,
  setTopic,
  classLevel,
  setClassLevel,
  onSubmit,
  loading,
}: {
  topic: string;
  setTopic: (value: string) => void;
  classLevel: string;
  setClassLevel: (value: string) => void;
  onSubmit: (data: TeachingInput) => void;
  loading?: boolean;
}) {
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!topic.trim()) return;

    onSubmit({
      topic: topic.trim(),
      classLevel,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-md"
    >
      <p className="text-lg font-medium text-center">
        What would you like to teach today?
      </p>

      {/* Input */} <div className="flex flex-col gap-1">
      <input
        type="text"
        placeholder="Enter a topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-4 rounded-xl"
      />
      {/* Hint */}{" "}
      {!topic && (
        <p className="text-xs text-gray-500">
          {" "}
          e.g., Fractions • Simple Interest{" "}
        </p>
      )}
      </div>

      {/* Class Selector */}
      <select
        value={classLevel}
        onChange={(e) => setClassLevel(e.target.value)}
        className="p-3 border rounded-xl"
      >
        <option value="">Select Class</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => (
          <option key={c} value={String(c)}>
            Class {c}
          </option>
        ))}
      </select>
      <button
        className="bg-black text-white py-3 rounded-xl"
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Teaching"}
      </button>
    </form>
  );
}
