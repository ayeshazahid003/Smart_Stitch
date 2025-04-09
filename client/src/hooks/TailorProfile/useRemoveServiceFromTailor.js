import { useState } from "react";
import axios from "axios";

export const useRemoveServiceFromTailor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const removeServiceFromTailor = async (serviceId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/tailor/service/${serviceId}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error removing service");
    } finally {
      setLoading(false);
    }
  };

  return { removeServiceFromTailor, loading, error, data };
};