"use client";

import { useState } from "react";
import { fetchInsights } from "../lib/api";
import { InsightResponse } from "@/app/types";

export const useInsights = () => {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      // const child_id = localStorage.getItem("child_id");
      const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context

      if (!child_id) {
        setError("Child not found");
        setLoading(false);
        return;
      }

      const res = await fetchInsights(child_id);

      if ("error" in res) {
        setError(res.message);
        setLoading(false);
        return;
      }

      setData(res);
      setLoading(false);
    } catch (err) {
      console.error("Insight error:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};
