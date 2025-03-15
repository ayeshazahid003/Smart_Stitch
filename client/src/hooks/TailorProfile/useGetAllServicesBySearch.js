import { useState } from "react";
import axios from "axios";

export const useGetAllServicesBySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getAllServicesBySearch = async (search) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tailor/services", {
        params: { search },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching services");
    } finally {
      setLoading(false);
    }
  };

  return { getAllServicesBySearch, loading, error, data };
};