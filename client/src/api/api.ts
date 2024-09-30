/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000"; // Fallback URL

// Helper function to get the authentication token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return { headers: {} };
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// API Functions
export const api = {
  // User API
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<any> => {
    try {
      return await axios.post(`${baseURL}/register`, userData);
    } catch (error) {
      console.error("Failed to register user:", error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<any> => {
    try {
      return await axios.post(`${baseURL}/login`, { email, password });
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  },

  getUserProfile: async (): Promise<any> => {
    try {
      return await axios.get(`${baseURL}/profile`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  // Update the updateUserProfile function to accept currentPassword and newPassword
  updateUserProfile: async (profileData: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<any> => {
    try {
      return await axios.put(
        `${baseURL}/profile`,
        profileData,
        getAuthHeader()
      );
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },
  verifyCurrentPassword: async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(`${baseURL}/verify-password`, {
        email,
        password,
      });
      return response.data.success;
    } catch (error) {
      console.error("Failed to verify password:", error);
      return false;
    }
  },
  getAllUsers: async (): Promise<any> => {
    try {
      return await axios.get(`${baseURL}/users`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      throw error;
    }
  },

  updateUser: async (
    userId: string,
    userData: { name?: string; email?: string; isAdmin?: boolean }
  ): Promise<any> => {
    try {
      return await axios.put(
        `${baseURL}/admin/users/${userId}`,
        userData,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to update user with ID ${userId}:`, error);
      throw error;
    }
  },

  deleteUser: async (userId: string): Promise<any> => {
    try {
      return await axios.delete(
        `${baseURL}/admin/users/${userId}`,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to delete user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Account API
  getUserAccount: async (): Promise<any> => {
    try {
      return await axios.get(`${baseURL}/account`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch user account:", error);
      throw error;
    }
  },

  updateAccount: async (accountData: {
    currentBalance?: number;
    totalRevenue?: number;
    totalExpenses?: number;
  }): Promise<any> => {
    try {
      return await axios.put(
        `${baseURL}/account/`,
        accountData,
        getAuthHeader()
      );
    } catch (error) {
      console.error("Failed to update account:", error);
      throw error;
    }
  },

  deleteSelf: async (): Promise<any> => {
    try {
      return await axios.delete(`${baseURL}/profile`, getAuthHeader());
    } catch (error) {
      console.error("Failed to delete own account:", error);
      throw error;
    }
  },

  // Edit monthly data
  editMonthlyData: async (monthData: {
    month: string;
    revenue: number;
    expenses: number;
  }): Promise<any> => {
    try {
      return await axios.patch(`${baseURL}/edit`, monthData, getAuthHeader());
    } catch (error) {
      console.error("Failed to edit monthly data:", error);
      throw error;
    }
  },
  addTransaction: async (transactionData: {
    date: string;
    amount: number;
    type: "revenue" | "expense";
    description: string;
  }): Promise<any> => {
    try {
      return await axios.post(
        `${baseURL}/transaction`,
        transactionData,
        getAuthHeader()
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Failed to add transaction:", error.response.data);
      } else {
        if (error instanceof Error) {
          console.error("Failed to add transaction:", error.message);
        } else {
          console.error("Failed to add transaction:", error);
        }
      }
      throw error;
    }
  },

  updateTransaction: async (transactionData: {
    transactionId: string;
    amount: number;
    type: "revenue" | "expense";
    date: string;
    description: string;
  }): Promise<any> => {
    try {
      const { transactionId, ...data } = transactionData;
      return await axios.put(
        `${baseURL}/transaction/${transactionId}`,
        data,
        getAuthHeader()
      );
    } catch (error) {
      console.error(
        `Failed to update transaction with ID ${transactionData.transactionId}:`,
        error
      );
      throw error;
    }
  },

  deleteTransaction: async (transactionId: string): Promise<any> => {
    try {
      console.log(`Attempting to delete transaction with ID ${transactionId}`);
      const response = await axios.delete(
        `${baseURL}/transaction/${transactionId}`,
        getAuthHeader()
      );
      console.log(`Successfully deleted transaction with ID ${transactionId}`);
      return response;
    } catch (error) {
      console.error(
        `Failed to delete transaction with ID ${transactionId}:`,
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : (error as Error).message
      );
      throw error;
    }
  },

  getUserTransactions: async (): Promise<any> => {
    try {
      return await axios.get(`${baseURL}/transactions`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch user transactions:", error);
      throw error;
    }
  },

  getAccountStats: async (): Promise<any> => {
    try {
      return await axios.get(`${baseURL}/account/stats`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch account stats:", error);
      throw error;
    }
  },

  // Product API
  getProductsByUserId: async (userId: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/products?userId=${userId}`,
        getAuthHeader()
      );

      // Check if the response is JSON
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        return response.data;
      } else {
        console.error("Unexpected response format:", response);
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to fetch products by user ID:", error);
      throw error;
    }
  },

  createProduct: async (productData: {
    userId: string;
    name: string;
    price: number;
    expense: number;
    inStock: number;
  }): Promise<any> => {
    try {
      return await axios.post(
        `${baseURL}/products`,
        productData,
        getAuthHeader()
      );
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  },

  updateProduct: async (
    productId: string,
    productData: {
      userId?: string;
      name?: string;
      price?: number;
      expense?: number;
      inStock?: number;
    }
  ): Promise<any> => {
    try {
      return await axios.put(
        `${baseURL}/products/${productId}`,
        productData,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to update product with ID ${productId}:`, error);
      throw error;
    }
  },

  deleteProduct: async (productId: string): Promise<any> => {
    try {
      return await axios.delete(
        `${baseURL}/products/${productId}`,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to delete product with ID ${productId}:`, error);
      throw error;
    }
  },
  updateProductStock: async (
    productId: string,
    quantity: number,
    type: "purchase" | "sale"
  ): Promise<any> => {
    try {
      return await axios.patch(
        `${baseURL}/products/${productId}/stock`,
        { quantity, type },
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to update stock for product with ID ${productId}:`, error);
      throw error;
    }
  },
  // TensorFlow Prediction API
  getFinancialPredictions: async (monthlyData: MonthlyData[]): Promise<any> => {
    try {
      return await axios.post(
        `${baseURL}/predict`,
        { monthlyData },
        getAuthHeader()
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch financial predictions:",
          error.response?.data || error.message
        );
      } else {
        console.error("Failed to fetch financial predictions:", error);
      }
      throw error;
    }
  },
};

export default api;
