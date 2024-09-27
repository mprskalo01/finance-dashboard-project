import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

// Assuming your User interface includes an isAdmin property
interface User {
  isAdmin: boolean;
  // Add other properties if needed
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData); // Set the user data (e.g., isAdmin)
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(userData)); // Store the user data in localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedAuth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(storedAuth ? JSON.parse(storedAuth) : false);

      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
