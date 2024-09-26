import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

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
    username: string;
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      return await axios.post(`${baseURL}/user/register`, userData);
    } catch (error) {
      console.error("Failed to register user:", error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      return await axios.post(`${baseURL}/user/login`, { email, password });
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      return await axios.get(`${baseURL}/user/profile`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  updateUserProfile: async (profileData: {
    username?: string;
    email?: string;
  }) => {
    try {
      return await axios.put(
        `${baseURL}/user/profile`,
        profileData,
        getAuthHeader()
      );
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      return await axios.get(`${baseURL}/user/users`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      throw error;
    }
  },

  updateUser: async (
    userId: string,
    userData: { username?: string; email?: string; isAdmin?: boolean }
  ) => {
    try {
      return await axios.put(
        `${baseURL}/user/admin/users/${userId}`,
        userData,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to update user with ID ${userId}:`, error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      return await axios.delete(
        `${baseURL}/user/admin/users/${userId}`,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to delete user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Account API
  getUserAccount: async () => {
    try {
      return await axios.get(`${baseURL}/account/account`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch user account:", error);
      throw error;
    }
  },

  updateAccount: async (accountData: {
    currentBalance?: number;
    totalRevenue?: number;
    totalExpenses?: number;
  }) => {
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

  addTransaction: async (transactionData: {
    date: string;
    amount: number;
    type: "revenue" | "expense";
    description: string;
  }) => {
    try {
      return await axios.post(
        `${baseURL}/account/transaction`,
        transactionData,
        getAuthHeader()
      );
    } catch (error) {
      console.error("Failed to add transaction:", error);
      throw error;
    }
  },

  updateTransaction: async (transactionData: {
    transactionId: string;
    amount: number;
    type: "revenue" | "expense";
    date: string;
    description: string;
  }) => {
    try {
      const { transactionId, ...data } = transactionData;
      return await axios.put(
        `${baseURL}/account/transaction/${transactionId}`,
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

  deleteTransaction: async (transactionId: string) => {
    try {
      return await axios.delete(
        `${baseURL}/account/transaction/${transactionId}`,
        getAuthHeader()
      );
    } catch (error) {
      console.error(
        `Failed to delete transaction with ID ${transactionId}:`,
        error
      );
      throw error;
    }
  },

  getUserTransactions: async () => {
    try {
      return await axios.get(
        `${baseURL}/account/transactions`,
        getAuthHeader()
      );
    } catch (error) {
      console.error("Failed to fetch user transactions:", error);
      throw error;
    }
  },

  getAccountStats: async () => {
    try {
      return await axios.get(`${baseURL}/account/stats`, getAuthHeader());
    } catch (error) {
      console.error("Failed to fetch account stats:", error);
      throw error;
    }
  },

  // Product API
  getAllProducts: async () => {
    try {
      return await axios.get(`${baseURL}/products`, getAuthHeader());
    } catch (error) {
      console.log(error);
      console.error("Failed to fetch all products:", error);
      throw error;
    }
  },

  getProductById: async (productId: string) => {
    try {
      return await axios.get(
        `${baseURL}/products/${productId}`,
        getAuthHeader()
      );
    } catch (error) {
      console.error(`Failed to fetch product with ID ${productId}:`, error);
      throw error;
    }
  },

  createProduct: async (productData: {
    userId: string;
    name: string;
    price: number;
    expense: number;
  }) => {
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
    }
  ) => {
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

  deleteProduct: async (productId: string) => {
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
};

export default api;
