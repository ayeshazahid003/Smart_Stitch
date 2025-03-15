import { useState } from "react";
import axios from "axios";

export const useVerifyTailor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const verifyTailor = async (token, tailorId) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tailor/verify", {
        params: { token, tailorId },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying tailor");
    } finally {
      setLoading(false);
    }
  };

  return { verifyTailor, loading, error, data };
};