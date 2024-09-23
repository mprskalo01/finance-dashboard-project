import { useState, useEffect } from "react";
import { api } from "@/api/api"; // Adjust the import path for your api.ts file

interface User {
  username: string;
  // Add any other fields you want to display from the user profile
}

interface Account {
  currentBalance: number; // Adjust this based on your actual API response
}

const AccountInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data); // Assuming response contains the user object
      } catch (err) {
        handleError(err);
      }
    };

    const fetchUserAccount = async () => {
      try {
        const response = await api.getUserAccount();
        setAccount(response.data); // Assuming response contains the account object
      } catch (err) {
        handleError(err);
      }
    };

    fetchUserProfile();
    fetchUserAccount();
  }, []);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message || "An error occurred while fetching data");
    } else {
      setError("An unexpected error occurred");
    }
    console.error("Error fetching data:", err);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user || !account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-xl font-bold">
      Welcome, {user.username}! Your current account balance is $
      {account.currentBalance}.
    </div>
  );
};

export default AccountInfo;
