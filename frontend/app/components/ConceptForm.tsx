"use client";

import { useState } from "react";
import { TeachingInput } from "../types";

export default function ConceptForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: TeachingInput) => void;
  loading?: boolean;
}) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("classLevel") || "3";
    }
    return "3";
  });
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setTouched(true);

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
      {/* Title */}
      <p className="text-lg font-medium text-center">
        What would you like to teach today?
      </p>

      {/* Input */}
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
        />

        {/* Hint */}
        {!topic && (
          <p className="text-xs text-gray-500">
            e.g., Fractions • Simple Interest
          </p>
        )}

        {/* Validation */}
        {touched && !topic.trim() && (
          <p className="text-xs text-red-500">Please enter a topic</p>
        )}
      </div>

      {/* Class Selector */}
      <select
        value={classLevel}
        onChange={(e) => {
          setClassLevel(e.target.value);
          localStorage.setItem("classLevel", e.target.value);
        }}
        className="p-3 border rounded-xl"
      >
        <option value="1">Class 1</option>
        <option value="2">Class 2</option>
        <option value="3">Class 3</option>
        <option value="4">Class 4</option>
        <option value="5">Class 5</option>
        <option value="6">Class 6</option>
        <option value="7">Class 7</option>
        <option value="8">Class 8</option>
        <option value="9">Class 9</option>
      </select>

      {/* CTA */}
      <button className="bg-black text-white py-3 rounded-xl" disabled={loading}>
        {loading ? "Starting..." : "Start Teaching"}
      </button>

      {/* Subtle reassurance */}
      <p className="text-xs text-gray-400 text-center">
        Just start — clarity builds as you go 💛
      </p>
    </form>
  );
}
