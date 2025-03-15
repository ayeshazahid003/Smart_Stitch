import { useState } from "react";
import axios from "axios";

export const useSearchTailors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const searchTailors = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tailor/search", {
        params: { query },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error searching tailors");
    } finally {
      setLoading(false);
    }
  };

  return { searchTailors, loading, error, data };
};