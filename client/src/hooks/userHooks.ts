import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import api from "@/api/api"; // Adjust the path if necessary
import axios from "axios";
import { useCallback } from "react";

export const useUser = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  // Function to handle registration
  const handleRegister = async (
    username: string,
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await api.register({ username, name, email, password });
      console.log("Registration successful", response.data);
      navigate("/login");
    } catch (error) {
      handleError(error);
    }
  };

  // Function to handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const token = response.data.token; // Assuming token is sent in response

      if (token) {
        localStorage.setItem("token", token); // Store the token in localStorage
        login(); // Set authentication state to true
        navigate("/dashboard"); // Redirect to dashboard

        // Return success result
        return { success: true };
      } else {
        // If no token is received, return a failure result
        return { success: false, message: "No token received" };
      }
    } catch (error) {
      // If an error occurs, handle it and return a failure result with a message
      const errorMessage = handleError(error); // Assume this returns a readable error message
      return { success: false, message: errorMessage };
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    try {
      logout(); // Call logout to remove token and update auth state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      handleError(error); // Handle any error that occurs
    }
  };

  // Function to get current user profile
  const getUserProfile = async () => {
    try {
      const data = await api.getUserProfile();
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Function to update user profile
  const updateUserProfile = async (username?: string, email?: string) => {
    try {
      const data = await api.updateUserProfile({ username, email });
      console.log("Profile updated successfully", data);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Admin function to get all users
  const getAllUsers = useCallback(async () => {
    try {
      const data = await api.getAllUsers();
      return data;
    } catch (error) {
      handleError(error);
    }
  }, []); // Empty dependency array ensures this function is stable

  // Admin function to update a user
  const updateUser = async (
    userId: string,
    userData: { username?: string; email?: string; isAdmin?: boolean }
  ) => {
    try {
      const data = await api.updateUser(userId, userData);
      console.log("User updated successfully", data);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Admin function to delete a user
  const deleteUser = async (userId: string) => {
    try {
      const data = await api.deleteUser(userId);
      console.log("User deleted successfully", data);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Error handling utility function
  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          console.error("Unauthorized: Invalid credentials or session expired");
        } else if (error.response.status === 404) {
          console.error("Not Found: User not found");
        } else {
          console.error(
            "Server responded with error:",
            error.response.status,
            error.response.data
          );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
  };
};
