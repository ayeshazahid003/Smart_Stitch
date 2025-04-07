import axios from "axios";

export const BASE_URL = "http://localhost:5000";

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

// Create a new order (POST /orders)
export async function createNewOrder(orderData) {
  try {
    const response = await axios.post("/orders", orderData, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get order by ID (GET /orders/:id)
export async function getOrderById(orderId) {
  try {
    const response = await axios.get(`/orders/${orderId}`, protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get all orders (GET /orders)
export async function getAllOrders() {
  try {
    const response = await axios.get("/orders", protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getTailorOrders() {
  try {
    const response = await axios.get("/orders/tailor", protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get orders by customer (GET /orders/customer/:customerId)
export async function getOrdersByCustomer(customerId) {
  try {
    const response = await axios.get(
      `/orders/customer/${customerId}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get orders by tailor (GET /orders/tailor)
export async function getOrdersByTailor() {
  try {
    const response = await axios.get("/orders/tailor", protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export const updateOrderStatus = async (orderId, updateData) => {
  try {
    const { status, design, shippingAddress, measurement } = updateData;
    const response = await axios.put(
      `${BASE_URL}/orders/${orderId}/status`,
      {
        status,
        design,
        shippingAddress,
        measurement,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error(error.response?.data?.message || "Failed to update order");
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(`/orders/${orderId}`, orderData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update order",
    };
  }
};

// Generate an invoice for an order (POST /orders/:id/invoice)
export async function generateInvoiceForOrder(orderId) {
  try {
    const response = await axios.post(
      `/orders/${orderId}/invoice`,
      {},
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get order summary by customer (GET /orders/customer/:customerId/summary)
export async function getOrderSummaryByCustomer(customerId) {
  try {
    const response = await axios.get(
      `/orders/customer/${customerId}/summary`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get order summary by tailor (GET /orders/tailor/summary)
export async function getOrderSummaryByTailor() {
  try {
    const response = await axios.get("/orders/tailor/summary", protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get orders by status for customers (GET /orders/customer/status/:status)
// Expects customerId as a query parameter
export async function getOrdersByStatusOfCustomers(status, customerId) {
  try {
    const response = await axios.get(
      `/orders/customer/status/${status}?customerId=${encodeURIComponent(
        customerId
      )}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

// Get orders by status for tailor (GET /orders/tailor/status/:status)
export async function getOrdersByStatusOfTailor(status) {
  try {
    const response = await axios.get(
      `/orders/tailor/status/${status}`,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export const useCreateOffer = () => {
  const createOffer = async (offerData) => {
    try {
      const response = await axios.post("/offers", offerData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  return { createOffer };
};

export const createCheckoutSession = async (orderId, amount) => {
  try {
    const response = await axios.post(
      `/stripe/create-checkout-session`,
      {
        orderId,
        amount,
        currency: "usd",
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create checkout session"
    );
  }
};
