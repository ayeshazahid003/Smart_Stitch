import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};



export async function updateUserProfile(user) {
  try {
    const response = await axios.put('/users/update-profile', user, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getUserProfile() {
  try {
    const response = await axios.get('/users/profile', protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}