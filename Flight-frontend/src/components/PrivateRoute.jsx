import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role"); // "admin" or "user"

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Restrict admin-only routes
  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
