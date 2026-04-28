"use client";

import { useState } from "react";
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
  const [touched, setTouched] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();

    setTouched(true);

    // ❌ block invalid submit
    if (!topic.trim() || !classLevel) return;

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
      {/* Input */}{" "}
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`border p-4 rounded-xl outline-none ${
            touched && !topic.trim()
              ? "border-red-500"
              : "focus:ring-2 focus:ring-black"
          }`}
        />
        {/* Hint */}{" "}
        {!topic && (
          <p className="text-xs text-gray-500">
            {" "}
            e.g., Fractions • Simple Interest{" "}
          </p>
        )}
        {touched && !topic.trim() && (
          <p className="text-xs text-red-500 mt-1">Please enter a topic</p>
        )}
      </div>
      {/* Class Selector */}
      <select
        value={classLevel}
        onChange={(e) => setClassLevel(e.target.value)}
        className={`p-3 border rounded-xl ${
          touched && !classLevel ? "border-red-500" : ""
        }`}
      >
        <option value="">Select Class</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => (
          <option key={c} value={String(c)}>
            Class {c}
          </option>
        ))}
      </select>
      {touched && !classLevel && (
        <p className="text-xs text-red-500 mt-1">Please select a class</p>
      )}
      <button
        className="bg-black text-white py-3 rounded-xl disabled:opacity-50"
        // disabled={loading || !topic.trim() || !classLevel}
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Teaching"}
      </button>
    </form>
  );
}
