import { useState } from "react";
import axios from "axios";

export const useAddPortfolioEntry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addPortfolioEntry = async (portfolioData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/tailor/portfolio", portfolioData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding portfolio entry");
    } finally {
      setLoading(false);
    }
  };

  return { addPortfolioEntry, loading, error, data };
};