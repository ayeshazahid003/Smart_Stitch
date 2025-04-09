import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Add a new review (POST /reviews)
export async function addReview(reviewData) {
  try {
    const response = await axios.post('/reviews', reviewData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Update an existing review (PUT /reviews/:id)
export async function updateReview(reviewId, reviewData) {
  try {
    const response = await axios.put(`/reviews/${reviewId}`, reviewData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get a single review by ID (GET /reviews/:id)
export async function getReview(reviewId) {
  try {
    const response = await axios.get(`/reviews/${reviewId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get all reviews (GET /reviews)
// Optionally, a tailorId can be passed as a query parameter to filter reviews for a specific tailor.
export async function getAllReviews(tailorId) {
  try {
    let url = '/reviews';
    if (tailorId) {
      url += `?tailorId=${encodeURIComponent(tailorId)}`;
    }
    const response = await axios.get(url, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Delete a review (DELETE /reviews/:id)
export async function deleteReview(reviewId) {
  try {
    const response = await axios.delete(`/reviews/${reviewId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
