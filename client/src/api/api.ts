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
    return await axios.post(`${baseURL}/user/register`, userData);
  },
  login: async (email: string, password: string) => {
    return await axios.post(`${baseURL}/user/login`, { email, password });
  },
  getUserProfile: async () => {
    return await axios.get(`${baseURL}/user/profile`, getAuthHeader());
  },
  updateUserProfile: async (profileData: {
    username?: string;
    email?: string;
  }) => {
    return await axios.put(
      `${baseURL}/user/profile`,
      profileData,
      getAuthHeader()
    );
  },
  getAllUsers: async () => {
    return await axios.get(`${baseURL}/user/admin/users`, getAuthHeader());
  },
  updateUser: async (
    userId: string,
    userData: { username?: string; email?: string; isAdmin?: boolean }
  ) => {
    return await axios.put(
      `${baseURL}/user/admin/users/${userId}`,
      userData,
      getAuthHeader()
    );
  },
  deleteUser: async (userId: string) => {
    return await axios.delete(
      `${baseURL}/user/admin/users/${userId}`,
      getAuthHeader()
    );
  },

  // Account API
  getUserAccount: async () => {
    return await axios.get(`${baseURL}/account/account`, getAuthHeader());
  },

  updateAccount: async (accountData: {
    currentBalance?: number;
    totalRevenue?: number;
    totalExpenses?: number;
  }) => {
    return await axios.put(`${baseURL}/account/`, accountData, getAuthHeader());
  },
  addTransaction: async (transactionData: {
    date: string;
    amount: number;
    type: "revenue" | "expense";
    description: string;
  }) => {
    return await axios.post(
      `${baseURL}/account/transaction`,
      transactionData,
      getAuthHeader()
    );
  },
  updateTransaction: async (transactionData: {
    transactionId: string;
    date: string;
    amount: number;
    type: "revenue" | "expense";
    description: string;
  }) => {
    return await axios.put(
      `${baseURL}/account/transaction`,
      transactionData,
      getAuthHeader()
    );
  },
  deleteTransaction: async (transactionId: string) => {
    return await axios.delete(
      `${baseURL}/account/transaction/${transactionId}`,
      getAuthHeader()
    );
  },
  getUserTransactions: async () => {
    return await axios.get(`${baseURL}/account/transactions`, getAuthHeader());
  },
  getAccountStats: async () => {
    return await axios.get(`${baseURL}/account/stats`, getAuthHeader());
  },
};

export default api;
