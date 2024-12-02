import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { BASE_URL } from "@/lib/constants";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
      const userData = response.data.user;
      console.log("userData", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.log(err);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      const userData = response.data;
      console.log("userData", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.log(err);
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
