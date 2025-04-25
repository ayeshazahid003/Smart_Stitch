import axios from "axios";

export const BASE_URL = "http://localhost:5000";

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Add a new trending design (POST /trending-designs)
export async function addTrendingDesign(designData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/trending-designs`,
      designData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get all trending designs (GET /trending-designs)
export async function getAllTrendingDesigns() {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending-designs`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get featured trending designs (GET /trending-designs/featured)
export async function getFeaturedTrendingDesigns() {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending-designs/featured`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get a single trending design by ID (GET /trending-designs/:id)
export async function getTrendingDesignById(id) {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending-designs/${id}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Update a trending design (PUT /trending-designs/:id)
export async function updateTrendingDesign(id, designData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/trending-designs/${id}`,
      designData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Delete a trending design (DELETE /trending-designs/:id)
export async function deleteTrendingDesign(id) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/trending-designs/${id}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
