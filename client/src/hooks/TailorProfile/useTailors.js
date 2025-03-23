import { useState } from "react";
import axios from "axios";

export const useTailors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ tailors: [] });

  const fetchTailors = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Convert params object to URL search params
      let queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const { data: result } = await axios.get(
        `/tailors/search?${queryString}`
      );
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch tailors");
    } finally {
      setLoading(false);
    }
  };

  return { fetchTailors, loading, error, data };
};
