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
      const child_id = localStorage.getItem("child_id");

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