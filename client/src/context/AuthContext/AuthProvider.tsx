import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation
import { AuthContext } from "./AuthContext";

interface User {
  id: string;
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

  const [logoutTimer, setLogoutTimer] = useState<number | null>(null);
  const navigate = useNavigate();

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(userData));

    // Set a timer for automatic logout (e.g., 1 hour)
    const timer = setTimeout(() => {
      logout();
      navigate("/login");
    }, 3600000); // 1 hour in milliseconds
    setLogoutTimer(timer);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    // Clear the logout timer if it exists
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
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
