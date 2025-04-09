import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
const protectedConfig = { withCredentials: true };

export const useCampaigns = () => {
  // Create a new campaign
  const createCampaign = async (campaignData) => {
    try {
      const response = await axios.post(
        "/campaigns",
        campaignData,
        protectedConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  // Get all campaigns for a tailor
  const getTailorCampaigns = async () => {
    try {
      const response = await axios.get("/campaigns/tailor", protectedConfig);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  // Get active campaigns (for customers)
  const getActiveCampaigns = async () => {
    try {
      const response = await axios.get("/campaigns/active", protectedConfig);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  // Update a campaign
  const updateCampaign = async (campaignId, updateData) => {
    try {
      const response = await axios.put(
        `/campaigns/${campaignId}`,
        updateData,
        protectedConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  // Delete a campaign
  const deleteCampaign = async (campaignId) => {
    try {
      const response = await axios.delete(
        `/campaigns/${campaignId}`,
        protectedConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  return {
    createCampaign,
    getTailorCampaigns,
    getActiveCampaigns,
    updateCampaign,
    deleteCampaign,
  };
};
