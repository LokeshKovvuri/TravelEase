import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import { getToken } from "../services/authService";

function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();
  const location = useLocation();
  const token = getToken();

  console.log("PROTECTED ROUTE CHECK:", {
    path: location.pathname,
    authenticated,
    hasToken: !!token,
  });

  if (!authenticated || !token) {
    console.log("REDIRECTING TO LOGIN:", location.pathname);

    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
