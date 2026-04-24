"use client";

import { useState } from "react";
import { fetchTopicsV2 } from "../lib/api";

export function useTopics() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTopics = async (child_id: string) => {
    setLoading(true);

    const data = await fetchTopicsV2(child_id);

    if (!data?.error) {
      setTopics(data || []);
    }

    setLoading(false);
  };

  return {
    topics,
    loading,
    loadTopics,
  };
}