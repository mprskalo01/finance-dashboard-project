import Account from "../models/Account.js";

const accountController = {
  initializeAccountAndTransactions: async (userId) => {
    try {
      // Get the current month index (0 for January, 1 for February, ..., 8 for September)
      const currentMonthIndex = new Date().getMonth(); // September is month 8

      // List of months
      const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];

      // Initialize monthly data with zero values for revenue and expenses up to the current month
      const monthlyData = months
        .slice(0, currentMonthIndex + 1)
        .map((month) => ({
          month: month,
          revenue: 10,
          expenses: 10,
        }));

      // Create a new account with initialized values
      const newAccount = new Account({
        userId: userId,
        currentBalance: 10, // Initialize currentBalance to 0
        totalRevenue: 10,
        totalExpenses: 10,
        monthlyData: monthlyData,
      });

      await newAccount.save();
      console.log(`Account initialized for user ${userId}`);
      return newAccount;
    } catch (error) {
      console.error("Error initializing account:", error);
      throw error;
    }
  },

  getUserAccount: async (req, res) => {
    try {
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching account", error: error.message });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      console.log(`here ${account}`);
      if (req.body.currentBalance !== undefined)
        account.currentBalance = req.body.currentBalance;
      if (req.body.totalRevenue !== undefined)
        account.totalRevenue = req.body.totalRevenue;
      if (req.body.totalExpenses !== undefined)
        account.totalExpenses = req.body.totalExpenses;

      await account.save();
      res.json(account);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating account", error: error.message });
    }
  },

  editMonthlyData: async (req, res) => {
    try {
      console.log("Received request body:", req.body);
      const { month, revenue, expenses } = req.body;

      if (!month || revenue === undefined || expenses === undefined) {
        console.error("Invalid request body:", req.body);
        return res.status(400).json({
          message:
            "Invalid request. Month, revenue, and expenses are required.",
        });
      }

      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        console.error("Account not found for user:", req.user.id);
        return res.status(404).json({ message: "Account not found" });
      }

      const monthDataIndex = account.monthlyData.findIndex(
        (m) => m.month.toLowerCase() === month.toLowerCase()
      );
      if (monthDataIndex === -1) {
        console.error("Month data not found:", month);
        return res.status(404).json({ message: "Month data not found" });
      }

      // Update the monthly revenue and expenses with proper conversion
      account.monthlyData[monthDataIndex].revenue = revenue * 100; // Convert to cents
      account.monthlyData[monthDataIndex].expenses = expenses * 100; // Convert to cents

      // Recalculate total revenue and expenses
      account.totalRevenue = account.monthlyData.reduce(
        (sum, month) => sum + month.revenue,
        0
      );
      account.totalExpenses = account.monthlyData.reduce(
        (sum, month) => sum + month.expenses,
        0
      );

      console.log("Account state before saving:", account);
      await account.save();
      res.json({
        account,
        updatedMonthData: account.monthlyData[monthDataIndex],
      });
    } catch (error) {
      console.error("Error in editMonthlyData:", error);
      res.status(500).json({
        message: "Error editing monthly data",
        error: error.message,
        stack: error.stack,
      });
    }
  },

  addTransaction: async (req, res) => {
    try {
      const { date, amount, type, description } = req.body;
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const newTransaction = { date, amount, type, description };
      account.transactions.push(newTransaction);

      if (type === "revenue") {
        account.currentBalance += amount;
        account.totalRevenue += amount;
      } else if (type === "expense") {
        account.currentBalance -= amount;
        account.totalExpenses += amount;
      }

      await updateMonthlyData(account, date, amount, type);
      await account.save();
      res.json({ account, transaction: newTransaction });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding transaction", error: error.message });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { transactionId, date, amount, type, description } = req.body;
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const transaction = account.transactions.id(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Revert old transaction
      await updateMonthlyData(
        account,
        transaction.date,
        -transaction.amount,
        transaction.type
      );
      if (transaction.type === "revenue") {
        account.currentBalance -= transaction.amount;
        account.totalRevenue -= transaction.amount;
      } else {
        account.currentBalance += transaction.amount;
        account.totalExpenses -= transaction.amount;
      }

      // Apply new transaction
      transaction.date = date;
      transaction.amount = amount;
      transaction.type = type;
      transaction.description = description;

      await updateMonthlyData(account, date, amount, type);
      if (type === "revenue") {
        account.currentBalance += amount;
        account.totalRevenue += amount;
      } else {
        account.currentBalance -= amount;
        account.totalExpenses += amount;
      }

      await account.save();
      res.json({ account, transaction });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating transaction", error: error.message });
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { transactionId } = req.params;
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const transaction = account.transactions.id(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      await updateMonthlyData(
        account,
        transaction.date,
        -transaction.amount,
        transaction.type
      );
      if (transaction.type === "revenue") {
        account.currentBalance -= transaction.amount;
        account.totalRevenue -= transaction.amount;
      } else {
        account.currentBalance += transaction.amount;
        account.totalExpenses -= transaction.amount;
      }

      account.transactions.id(transactionId).remove();
      await account.save();
      res.json({ message: "Transaction deleted", account });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting transaction", error: error.message });
    }
  },

  getUserTransactions: async (req, res) => {
    try {
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account.transactions);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching transactions", error: error.message });
    }
  },

  getAccountStats: async (req, res) => {
    try {
      const account = await Account.findOne({ userId: req.user.id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const stats = {
        currentBalance: account.currentBalance,
        totalRevenue: account.totalRevenue,
        totalExpenses: account.totalExpenses,
        monthlyRevenue: account.monthlyData.reduce(
          (sum, month) => sum + month.revenue,
          0
        ),
        monthlyExpenses: account.monthlyData.reduce(
          (sum, month) => sum + month.expenses,
          0
        ),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching account statistics",
        error: error.message,
      });
    }
  },
};

async function updateMonthlyData(account, date, amount, type) {
  // Update monthly data
  const monthStr = new Date(date).toLocaleString("default", { month: "long" });
  let monthData = account.monthlyData.find((month) => month.month === monthStr);
  if (!monthData) {
    monthData = { month: monthStr, revenue: 0, expenses: 0 };
    account.monthlyData.push(monthData);
  }
  if (type === "revenue") monthData.revenue += amount;
  else monthData.expenses += amount;
}

export default accountController;
