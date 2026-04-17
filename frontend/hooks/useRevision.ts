"use client";

import { useState } from "react";
import { fetchRevision } from "../lib/api";
import {
  SubjectStat,
  WeakestSubject,
  WeeklyPlanItem,
  RevisionResponse,
} from "../app/types";

export function useRevision() {
  const [loading, setLoading] = useState(false);
  const [revisionList, setRevisionList] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [retentionScore, setRetentionScore] = useState<number>(0);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [weakestSubject, setWeakestSubject] = useState<WeakestSubject>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanItem[]>([]);
  const [learningPattern, setLearningPattern] = useState("");
  const [guidance, setGuidance] = useState("");

  const startRevision = async () => {
    setLoading(true);

    const data = await fetchRevision();

    setRevisionList(data.dueToday || []);
    setUpcoming(data.upcoming || []);
    setRetentionScore(data.retentionScore || 0);

    setSubjectStats(data.subjectStats || []);
    setWeakestSubject(data.weakestSubject || null);
    setSuggestion(data.suggestion || "");
    setWeeklyPlan(data.weeklyPlan || []);
    setLearningPattern(data.learningPattern || "");
    setGuidance(data.guidance || "");

    setLoading(false);

    return data;
  };

  return {
    loading,
    startRevision,
    revisionList,
    upcoming,
    retentionScore,
    subjectStats,
    weakestSubject,
    suggestion,
    weeklyPlan,
    learningPattern,
    guidance,
  };
}
