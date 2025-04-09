import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Config to use for protected routes
const protectedConfig = {
  withCredentials: true
};

// POST /tailor/profile-creation
export async function createTailorProfile(profileData) {
  try {
    const response = await axios.post('/tailor/profile-creation', profileData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}
export async function getTailorShop() {
  try {
    const response = await axios.get('/tailor/get-profile', protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}


export async function verifyTailor({ token, tailorId }) {
  try {
    const response = await axios.post(
      `/tailor/verify-profile?token=${encodeURIComponent(token)}&tailorId=${encodeURIComponent(tailorId)}`,
      {},
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function addServiceToTailor(serviceData) {
  try {
    const response = await axios.post('/tailor/add-service', serviceData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function addPortfolioEntry(portfolioData) {
  try {
    const response = await axios.post('/tailor/add-portfolio', portfolioData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function removeServiceFromTailor(serviceId) {
  try {
    const response = await axios.delete(`/tailor/service/${serviceId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function removePortfolioFromTailor(portfolioId) {
  try {
    const response = await axios.delete(`/tailor/portfolio/${portfolioId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function updateService(serviceId, serviceData) {
  try {
    const response = await axios.put(`/tailor/service/${serviceId}`, serviceData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function addExtraService(extraServiceData) {
  try {
    const response = await axios.post('/tailor/extra-service', extraServiceData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function updateExtraService(extraServiceId, extraServiceData) {
  try {
    const response = await axios.put(`/tailor/extra-service/${extraServiceId}`, extraServiceData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function deleteExtraService(extraServiceId) {
  try {
    const response = await axios.delete(`/tailor/extra-service/${extraServiceId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function updateTailorProfile(profileData) {
  try {
    const response = await axios.put('/tailors/profile', profileData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function deleteTailorProfile() {
  try {
    const response = await axios.delete('/tailors/profile', protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getListOfServices(tailorId) {
  try {
    const response = await axios.get(`/tailor/services/${tailorId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getListOfExtraServices(tailorId) {
  try {
    const response = await axios.get(`/tailor/extra-services/${tailorId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getListOfPortfolio(tailorId) {
  try {
    const response = await axios.get(`/tailor/portfolio/${tailorId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function searchTailorsByPartialService(serviceName) {
  try {
    const response = await axios.get(`/tailors/search/service?serviceName=${encodeURIComponent(serviceName)}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getAllServicesBySearch(search) {
  try {
    const response = await axios.get(`/services?search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getTailorProfile(tailorId) {
  try {
    const response = await axios.get(`/tailors/${tailorId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getAllTailors(page = 1, limit = 10) {
  try {
    const response = await axios.get('/tailors', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function searchTailors(query) {
  try {
    const response = await axios.get('/tailors/search', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getTailorById(tailorId) {
  try {
    const response = await axios.get(`/tailor/${tailorId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}