export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  accounts: Account; // User can have multiple accounts if converted to an array
  transactions: Array<Transaction>; // User transactions
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// todo add choice of currency for user : currency: string; plus the model
export interface Day {
  id: string;
  date: string;
  revenue: number;
  expenses: number;
}
export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}
export interface Month {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
}

export interface Account {
  id: string;
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
  monthlyData: Array<Month>;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string; // e.g., "revenue", "expense"
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
