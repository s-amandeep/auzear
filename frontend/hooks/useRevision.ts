"use client";

import { useState } from "react";
import { fetchRevision } from "../lib/api";

export function useRevision() {
  const [loading, setLoading] = useState(false);
  const [revisionList, setRevisionList] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [retentionScore, setRetentionScore] = useState<number>(0);
  const [suggestion, setSuggestion] = useState<string>("");

  const startRevision = async () => {
  setLoading(true);

  try {
    const child_id = localStorage.getItem("child_id");

    if (!child_id) {
      setLoading(false);
      return;
    }

    const data = await fetchRevision(child_id);

    if (data?.error) {
      setLoading(false);
      return;
    }

    setRevisionList(data.dueToday || []);
    setUpcoming(data.upcoming || []);
    setRetentionScore(data.retentionScore || 0);

    // keep only what you actually use for now
    setSuggestion(data.suggestion || "");

    setLoading(false);

    return data;

  } catch (err) {
    console.error("Revision error:", err);
    setLoading(false);
  }
};

  return {
    loading,
    startRevision,
    revisionList,
    upcoming,
    retentionScore,
    suggestion,
  };
}
