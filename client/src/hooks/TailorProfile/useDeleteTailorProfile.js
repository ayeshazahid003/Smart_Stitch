import { useState } from "react";
import axios from "axios";

export const useDeleteTailorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteTailorProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.delete("/api/tailor/profile");
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting tailor profile");
    } finally {
      setLoading(false);
    }
  };

  return { deleteTailorProfile, loading, error, data };
};