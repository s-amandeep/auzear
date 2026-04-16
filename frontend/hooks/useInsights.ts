import { useState } from "react";
import { fetchInsights } from "../lib/api";
import { InsightResponse } from "@/app/types";


export const useInsights = () => {
  
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    const res = await fetchInsights();

    setData(res);
    setLoading(false);
  };

  return { data, loading, fetchData };
};