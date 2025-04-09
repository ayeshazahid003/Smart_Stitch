import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Get all chats for the authenticated user (GET /chats)
export async function getUserChats() {
  try {
    const response = await axios.get('/chats', protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get unique chat participants for the authenticated user (GET /chat-participants)
export async function getChatParticipants() {
  try {
    const response = await axios.get('/chat-participants', protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
