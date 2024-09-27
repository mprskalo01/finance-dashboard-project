// AccountContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/api/api";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface Transaction {
  amount: number;
  type: string;
  date: string;
  description: string;
}

interface Account {
  monthlyData: MonthlyData[];
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
  transactions: Transaction[];
}

interface AccountContextType {
  account: Account | null;
  fetchUserAccount: () => void;
}

interface AccountProviderProps {
  children: ReactNode;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const [account, setAccount] = useState<Account | null>(null);

  const fetchUserAccount = async () => {
    try {
      const response = await api.getUserAccount();
      setAccount(response.data);
    } catch (err) {
      console.error("Failed to fetch user account:", err);
    }
  };

  useEffect(() => {
    fetchUserAccount();
  }, []);

  return (
    <AccountContext.Provider value={{ account, fetchUserAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext };
