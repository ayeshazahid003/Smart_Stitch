import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
const protectedConfig = { withCredentials: true };

// Get all offers for the current user
export const useOffers = () => {
  const getOffers = async () => {
    try {
      const response = await axios.get("/offers", protectedConfig);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  return { getOffers };
};

// Handle negotiations and offer status updates
export const useNegotiateOffer = () => {
  const negotiateOffer = async (offerId, amount, message, accept = false) => {
    try {
      const response = await axios.post(
        `/offers/${offerId}/negotiate`,
        { amount, message, accept },
        protectedConfig
      );
      return response.data;
    } catch (error) {
      console.error("Negotiation error:", error);
      throw error.response?.data || { message: error.message };
    }
  };

  const updateOfferStatus = async (offerId, status) => {
    try {
      const response = await axios.patch(
        `/offers/${offerId}/status`,
        { status },
        protectedConfig
      );
      return response.data;
    } catch (error) {
      console.error("Status update error:", error);
      throw error.response?.data || { message: error.message };
    }
  };

  return { negotiateOffer, updateOfferStatus };
};
