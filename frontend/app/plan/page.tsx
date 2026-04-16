"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRevision } from "../../hooks/useRevision";
import UpcomingRevision from "./components/UpcomingRevision";
import FocusCard from "./components/FocusCard";
import WeeklyPlan from "./components/WeeklyPlan";

export default function Plan() {
  const { startRevision, upcoming, suggestion, weeklyPlan } = useRevision();

  useEffect(() => {
    startRevision();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 gap-6">
      {/* Header */}
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Learning Plan</h1>

        <p className="text-sm text-gray-500">
          A simple guide for upcoming days
        </p>
      </div>

      <h2 className="text-xl font-semibold">Coming up</h2>

      <UpcomingRevision items={upcoming} />

      <p className="text-sm text-gray-500">Suggested Focus</p>

      <FocusCard text={suggestion} />

      <h2 className="text-xl font-semibold">Weekly Plan</h2>
      
      <WeeklyPlan items={weeklyPlan} />
    </div>
  );
}
