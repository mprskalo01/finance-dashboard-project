import { useState, useEffect, ReactNode } from "react";
import { AdminContext } from "./AdminContext";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    // Check if the user is admin from localStorage if it exists
    const storedAdmin = localStorage.getItem("isAdmin");
    return storedAdmin ? JSON.parse(storedAdmin) : false;
  });

  // Function to update the admin state
  const setAdmin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    localStorage.setItem("isAdmin", JSON.stringify(adminStatus));
  };

  useEffect(() => {
    // Optionally, fetch the admin status from backend to verify on app load
    const fetchAdminStatus = async () => {
      try {
        const response = await fetch("/api/check-admin", {
          method: "GET",
          credentials: "include", // Assuming auth token is handled via cookies
        });
        const data = await response.json();
        if (response.ok) {
          setAdmin(data.isAdmin); // Set the admin status based on the backend response
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.error("Failed to verify admin status", error);
        setAdmin(false);
      }
    };

    fetchAdminStatus();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
