import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext/useAuth"; // Adjust the path as necessary

interface ProtectedAdminRouteProps {
  element: JSX.Element;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  element,
}) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedAdminRoute;
