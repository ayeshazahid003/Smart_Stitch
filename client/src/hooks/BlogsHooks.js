import axios from "axios";

export const BASE_URL = "http://localhost:5000";

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Create a new blog (POST /blogs)
export async function createBlog(blogData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/blogs`,
      blogData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get all blogs (GET /blogs)
export async function getAllBlogs(params = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await axios.get(`${BASE_URL}/blogs${query}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get blog by slug (GET /blogs/:slug)
export async function getBlogBySlug(slug) {
  try {
    const response = await axios.get(`${BASE_URL}/blog/${slug}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get blog by ID (GET /blogs/:id)
export async function getBlogById(id) {
  try {
    const response = await axios.get(
      `${BASE_URL}/blogs/id/${id}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Update blog (PUT /blogs/:id)
export async function updateBlog(id, blogData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/blogs/${id}`,
      blogData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Delete blog (DELETE /blogs/:id)
export async function deleteBlog(id) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/blogs/${id}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
