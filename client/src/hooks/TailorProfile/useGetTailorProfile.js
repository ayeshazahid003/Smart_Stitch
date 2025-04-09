import { useState, useEffect } from "react";
import axios from "axios";

export const useGetTailorProfile = (tailorId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTailorProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/tailor/profile/${tailorId}`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tailor profile");
      } finally {
        setLoading(false);
      }
    };

    if (tailorId) {
      fetchTailorProfile();
    }
  }, [tailorId]);

  return { data, loading, error };
};