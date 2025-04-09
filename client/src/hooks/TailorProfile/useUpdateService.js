import { useState } from "react";
import axios from "axios";

export const useUpdateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateService = async (serviceId, serviceData) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/tailor/service/${serviceId}`, serviceData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating service");
    } finally {
      setLoading(false);
    }
  };

  return { updateService, loading, error, data };
};