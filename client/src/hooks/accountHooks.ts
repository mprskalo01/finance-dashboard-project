import { useAuth } from "@/context/AuthContext/useAuth";
import api from "@/api/api"; // Adjust the path if necessary
import axios from "axios";

export const useAccount = () => {
  const { isAuthenticated } = useAuth();

  // Get user's account
  const getUserAccount = async () => {
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }
    try {
      const data = await api.getUserAccount();
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  // Update user's account
  const updateAccount = async (accountData: {
    currentBalance?: number;
    totalRevenue?: number;
    totalExpenses?: number;
  }) => {
    try {
      const data = await api.updateAccount(accountData);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Add a new transaction
  const addTransaction = async (transactionData: {
    date: string;
    amount: number;
    type: "revenue" | "expense";
    description: string;
  }) => {
    try {
      const data = await api.addTransaction(transactionData);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Update an existing transaction
  const updateTransaction = async (transactionData: {
    transactionId: string;
    date: string;
    amount: number;
    type: "revenue" | "expense";
    description: string;
  }) => {
    try {
      const data = await api.updateTransaction(transactionData);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (transactionId: string) => {
    try {
      const data = await api.deleteTransaction(transactionId);
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Get user's transactions
  const getUserTransactions = async () => {
    try {
      const data = await api.getUserTransactions();
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  // Get account statistics
  const getAccountStats = async () => {
    try {
      const data = await api.getAccountStats();
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
          console.error("Unauthorized: Please log in again");
        } else if (error.response.status === 404) {
          console.error("Not Found: The requested resource could not be found");
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
    getUserAccount,
    updateAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getUserTransactions,
    getAccountStats,
  };
};
