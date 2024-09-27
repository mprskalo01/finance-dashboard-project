// useAccount.ts
import { useContext } from "react";
import { AccountContext } from "./AccountContext";

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
