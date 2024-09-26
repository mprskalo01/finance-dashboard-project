import { createContext } from "react";

export interface AdminContextType {
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);
