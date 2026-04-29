import { Navigate } from "react-router-dom";

/**
 * Wraps any route that requires authentication.
 * If no token is found in localStorage, redirects to the login page.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
