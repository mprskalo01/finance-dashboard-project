import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/useAuth";
import api from "@/api/api"; // Adjust the path if necessary
import axios from "axios";
import { useCallback } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  user: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
}

export const useUser = () => {
  const navigate = useNavigate();
  const { login, logout, getLoggedInUserId } = useAuth(); // Include getLoggedInUserId

  // Function to handle registration
  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await api.register({ name, email, password });
      console.log("Registration successful", response.data);

      // Automatically log in the user after successful registration
      await handleLogin(email, password);
    } catch (error) {
      handleError(error);
    }
  };

  // Function to handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const token = response.data.token; // Get token from response

      // Decode the token with the new type
      const decodedToken = jwtDecode<DecodedToken>(token); // Specify the type here

      // Extract userData from the decoded token
      const userData = {
        id: decodedToken.user.id, // Access id from decoded token
        email: decodedToken.user.email, // Access email from decoded token
        isAdmin: decodedToken.user.isAdmin, // Access isAdmin from decoded token
      };

      // Log the userData object to the console
      console.log("User Data:", userData);

      // Check if token exists
      if (token) {
        localStorage.setItem("token", token); // Store token
        login(userData); // Pass userData (now includes id, email, and isAdmin)

        // Admin check logic
        if (userData.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

        return { success: true }; // Return success result
      } else {
        return { success: false, message: "No token received" }; // Token is missing
      }
    } catch (error) {
      const errorMessage = handleError(error); // Handle error and get readable message
      return { success: false, message: errorMessage }; // Return failure result
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
  const updateUserProfile = async (name: string, email: string) => {
    try {
      const data = await api.updateUserProfile({ name, email });
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
    userData: { name?: string; email?: string; isAdmin?: boolean }
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
    getLoggedInUserId, // Return getLoggedInUserId
  };
};
