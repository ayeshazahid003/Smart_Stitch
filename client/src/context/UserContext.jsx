import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { BASE_URL } from "@/lib/constants";
import { connectSocket, disconnectSocket } from "@/lib/socketUtils";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Connect socket for existing user session
        const socket = connectSocket(userData._id);
        if (socket) {
          console.log("[UserContext] Socket connected for stored user");
        }
      }
    };

    initializeUser();

    // Cleanup function
    return () => {
      disconnectSocket();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.status !== 200) {
        throw new Error("Login failed");
      }
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Initialize socket connection after successful login
      const socket = connectSocket(userData._id);
      if (socket) {
        console.log("[UserContext] Socket connected after login");
      }
    } catch (err) {
      console.error("[UserContext] Login error:", err);
      throw new Error("Login failed");
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup`,
        {
          username,
          email,
          password,
          role,
        },
        { withCredentials: true }
      );
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // Initialize socket connection after successful registration
      connectSocket(userData._id);
    } catch (err) {
      console.log(err);
      throw new Error("Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      // Disconnect socket before clearing user data
      disconnectSocket();
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("[UserContext] Logout error:", err);
      throw new Error("Logout failed");
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        withCredentials: true,
      });
      const userData = response.data.user;
      console.log("userData", userData);
      setUser(userData);
    } catch (err) {
      console.log(err);
      throw new Error("Fetching user profile failed");
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/profile`,
        updatedData,
        { withCredentials: true }
      );
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.log(err);
      throw new Error("Updating user profile failed");
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error(
        err.response?.data?.message || "Failed to send reset email"
      );
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, {
        resetToken,
        newPassword,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/resend-otp`, { email });
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  const getUserAddresses = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        return {
          success: true,
          addresses: response.user.contactInfo?.addresses || [],
          defaultAddress: response.user.contactInfo?.address || null,
        };
      }
      return { success: false, message: "Failed to fetch addresses" };
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw new Error("Failed to fetch addresses");
    }
  };

  const addUserAddress = async (addressData) => {
    try {
      const currentUser = await getUserProfile();
      if (!currentUser.success) {
        throw new Error("Failed to fetch user profile");
      }

      const updatedAddresses = [
        ...(currentUser.user.contactInfo?.addresses || []),
        addressData,
      ];

      const response = await updateUserProfile({
        ...currentUser.user,
        contactInfo: {
          ...currentUser.user.contactInfo,
          addresses: updatedAddresses,
          // If this is the first address, set it as default
          address: currentUser.user.contactInfo?.address || addressData,
        },
      });

      if (response.success) {
        return { success: true, address: addressData };
      }
      return { success: false, message: "Failed to add address" };
    } catch (error) {
      console.error("Error adding address:", error);
      throw new Error("Failed to add address");
    }
  };

  const updateUserAddress = async (addressId, updatedAddress) => {
    try {
      const currentUser = await getUserProfile();
      if (!currentUser.success) {
        throw new Error("Failed to fetch user profile");
      }

      const addresses = currentUser.user.contactInfo?.addresses || [];
      const updatedAddresses = addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updatedAddress } : addr
      );

      const response = await updateUserProfile({
        ...currentUser.user,
        contactInfo: {
          ...currentUser.user.contactInfo,
          addresses: updatedAddresses,
          // Update default address if it's being updated
          address:
            currentUser.user.contactInfo?.address?.id === addressId
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

  const setDefaultAddress = async (addressId) => {
    try {
      const currentUser = await getUserProfile();
      if (!currentUser.success) {
        throw new Error("Failed to fetch user profile");
      }

      const addresses = currentUser.user.contactInfo?.addresses || [];
      const defaultAddress = addresses.find((addr) => addr.id === addressId);

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

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getUserProfile,
        updateUserProfile,
        forgotPassword,
        verifyOtp,
        resetPassword,
        resendOtp,
        getUserAddresses,
        addUserAddress,
        updateUserAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
