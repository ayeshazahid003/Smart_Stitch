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

  const fetchTailorServices = async (tailorId) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result } = await axios.get(
        `/tailor/${tailorId}/all-services`
      );

      return {
        services: result.services || [],
        extraServices: result.extraServices || [],
        success: result.success,
      };
    } catch (err) {
      console.error("Fetch services error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch tailor services"
      );
      return {
        services: [],
        extraServices: [],
        success: false,
      };
    } finally {
      setLoading(false);
    }
  };

  return { fetchTailors, fetchTailorServices, loading, error, data };
};
