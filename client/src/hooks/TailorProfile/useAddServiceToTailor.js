import { useState } from "react";
import axios from "axios";

export const useAddServiceToTailor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addServiceToTailor = async (serviceData) => {
    setLoading(true);
    try {
      const response = await axios.post("/tailor/add-service", serviceData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding service");
    } finally {
      setLoading(false);
    }
  };

  return { addServiceToTailor, loading, error, data };
};