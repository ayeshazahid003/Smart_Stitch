import axios from "axios";
import { BASE_URL } from "@/lib/constants";

axios.defaults.baseURL = "http://localhost:5000";

// Config for protected routes (includes credentials)
const protectedConfig = {
  withCredentials: true,
};

export async function updateUserProfile(user) {
  try {
    const response = await axios.put(
      "/users/update-profile",
      user,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export async function getUserProfile() {
  try {
    const response = await axios.get("/users/profile", protectedConfig);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
}

export const getUserAddresses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      withCredentials: true,
    });
    return {
      success: true,
      addresses: response.data.user.contactInfo?.addresses || [],
      defaultAddress: response.data.user.contactInfo?.address || null,
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw new Error("Failed to fetch addresses");
  }
};

export const addUserAddress = async (addressData) => {
  try {
    const response = await axios.post(
      "/users/address",
      addressData,
      protectedConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add address",
    };
  }
};

export const updateUserAddress = async (addressId, updatedAddress) => {
  try {
    const currentUser = await getUserProfile();
    if (!currentUser.success) {
      throw new Error("Failed to fetch user profile");
    }

    const addresses = currentUser.user.contactInfo?.addresses || [];
    const updatedAddresses = addresses.map((addr) =>
      addr._id === addressId ? { ...addr, ...updatedAddress } : addr
    );

    const response = await updateUserProfile({
      ...currentUser.user,
      contactInfo: {
        ...currentUser.user.contactInfo,
        addresses: updatedAddresses,
        // Update default address if it's being updated
        address:
          currentUser.user.contactInfo?.address?._id === addressId
            ? { ...currentUser.user.contactInfo.address, ...updatedAddress }
            : currentUser.user.contactInfo?.address,
      },
    });

    if (response.success) {
      return { success: true, address: updatedAddress };
    }
    return { success: false, message: "Failed to update address" };
  } catch (error) {
    console.error("Error updating address:", error);
    throw new Error("Failed to update address");
  }
};

export const setDefaultAddress = async (addressId) => {
  try {
    const currentUser = await getUserProfile();
    if (!currentUser.success) {
      throw new Error("Failed to fetch user profile");
    }

    const addresses = currentUser.user.contactInfo?.addresses || [];
    const defaultAddress = addresses.find((addr) => addr._id === addressId);

    if (!defaultAddress) {
      throw new Error("Address not found");
    }

    const response = await updateUserProfile({
      ...currentUser.user,
      contactInfo: {
        ...currentUser.user.contactInfo,
        address: defaultAddress,
      },
    });

    if (response.success) {
      return { success: true, address: defaultAddress };
    }
    return { success: false, message: "Failed to set default address" };
  } catch (error) {
    console.error("Error setting default address:", error);
    throw new Error("Failed to set default address");
  }
};

export const addMeasurement = async (measurementData) => {
  try {
    const response = await axios.post(
      "/users/measurements",
      { measurement: measurementData },
      protectedConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error adding measurement:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add measurement",
    };
  }
};
