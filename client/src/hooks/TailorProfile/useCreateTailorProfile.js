import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";

export const useCreateTailorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createTailorProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      // Replace "/api/tailor/profile" with the actual endpoint for creating a tailor profile
      const response = await axios.post(`${BASE_URL}/tailor/profile-creation`, profileData, {
        withCredentials: true
      });
      setData(response.data);
    } catch (err) {
      // Fallback to a default message if none is provided by the server
      setError(err.response?.data?.message || "Error creating tailor profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    createTailorProfile,
    loading,
    error,
    data,
  };
};
