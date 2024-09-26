import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  element,
  adminOnly,
}: {
  element: JSX.Element;
  adminOnly?: boolean;
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/dashboard" />; // Redirect non-admin users to the dashboard
  }

  return element;
};

export default ProtectedRoute;
