import { createContext } from "react";

// Define and export the type
export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context with an undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
