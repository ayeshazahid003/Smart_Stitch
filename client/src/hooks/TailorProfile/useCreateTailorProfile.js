import { useState } from "react";
import axios from "axios";

export const useCreateTailorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createTailorProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await axios.post("/tailor/profile-creation", profileData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating tailor profile");
    } finally {
      setLoading(false);
    }
  };

  return { createTailorProfile, loading, error, data };
};