import axios from "axios";

export const BASE_URL = "http://localhost:5000";

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Get all refund requests (admin only)
export async function getAllRefundRequests() {
  try {
    const response = await axios.get(
      `${BASE_URL}/refund-requests/admin`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get user's refund requests
export async function getUserRefundRequests() {
  try {
    const response = await axios.get(
      `${BASE_URL}/refund-requests/user`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get a specific refund request by ID
export async function getRefundRequestById(id) {
  try {
    const response = await axios.get(
      `${BASE_URL}/refund-requests/${id}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Update refund request (user can only update reason if status is pending)
export async function updateRefundRequest(id, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/refund-requests/${id}`,
      data,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Update refund request status (admin only)
export async function updateRefundStatus(id, statusData) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/refund-requests/${id}/status`,
      statusData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Process a refund (admin only)
export async function processRefund(id) {
  try {
    const response = await axios.post(
      `${BASE_URL}/refund-requests/${id}/process`,
      {},
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Create a new refund request (customer only)
export async function createRefundRequest(refundData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/refund-requests`,
      refundData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
