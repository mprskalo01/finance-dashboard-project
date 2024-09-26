import { useContext } from "react";
import { AdminContext } from "./AdminContext"; // Import the context

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
