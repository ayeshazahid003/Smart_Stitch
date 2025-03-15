import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Configuration for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Create a new voucher (POST /vouchers)
export async function createVoucher(voucherData) {
  try {
    const response = await axios.post('/vouchers', voucherData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Update an existing voucher (PUT /vouchers/:id)
export async function updateVoucher(voucherId, updateData) {
  try {
    const response = await axios.put(`/vouchers/${voucherId}`, updateData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Delete a voucher (DELETE /vouchers/:id)
export async function deleteVoucher(voucherId) {
  try {
    const response = await axios.delete(`/vouchers/${voucherId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Check if a voucher is applicable (GET /vouchers/:id/check)
export async function checkVoucherIsApplicable(voucherId) {
  try {
    const response = await axios.get(`/vouchers/${voucherId}/check`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get single voucher details (GET /vouchers/:id)
export async function getSingleVoucherDetails(voucherId) {
  try {
    const response = await axios.get(`/vouchers/${voucherId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
