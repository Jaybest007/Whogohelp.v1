import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { dashboardData, loading } = useDashboard();

  useEffect(() => {
    // If not loading and no user data, redirect
   if (!loading && !dashboardData) {
  navigate("/");
  }
  }, [dashboardData, loading, navigate]);

  // Optional: show a loader while verifying
  if (loading) return <p>Checking authentication...</p>;

  return children;
};

export default ProtectedRoute;