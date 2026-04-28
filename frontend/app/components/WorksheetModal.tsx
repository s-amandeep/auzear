"use client";
import { useEffect } from "react";

import WorksheetGenerator from "./WorksheetGenerator";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  topic: string;
  classLevel: string;
  teachingMode: "foundational" | "intermediate" | "advanced";
  understandingScore: number;
};

export default function WorksheetModal({
  isOpen,
  onClose,
  topic,
  classLevel,
  teachingMode,
  understandingScore,
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative print:hidden">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-lg"
        >
          ✕
        </button>

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-4">Create Worksheet</h2>

        {/* CONTENT */}
        <WorksheetGenerator
          topic={topic}
          classLevel={classLevel}
          teachingMode={teachingMode}
          understandingScore={understandingScore}
        />
      </div>
    </div>
  );
}
