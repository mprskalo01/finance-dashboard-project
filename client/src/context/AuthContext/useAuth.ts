import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const getLoggedInUserId = () => {
    return context.user?.id; // Return the logged-in user's ID
  };

  return {
    ...context,
    getLoggedInUserId,
  };
};
