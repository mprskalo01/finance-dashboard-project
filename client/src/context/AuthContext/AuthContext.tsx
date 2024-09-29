import { createContext } from "react";

// Define user type
interface User {
  id: string; // Add the id property
  isAdmin: boolean;
  // Add other user properties if needed
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
