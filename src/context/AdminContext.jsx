import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useDashboard } from "./DashboardContext";
import { useNavigate } from "react-router-dom";


export const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastFetched = useRef(0);
  const { clearDashboardData } = useDashboard();
  const navigate = useNavigate();
  



  const fetchAdminData = useCallback( async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost/api/admin.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setAdminData(res.data);
      lastFetched.current = Date.now();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");  
      }
      console.error("Admin Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [clearDashboardData]);

  useEffect(() => {
    if (!adminData){
      fetchAdminData();
    }
  }, [adminData, fetchAdminData]);

  return (
    <AdminContext.Provider
      value={{
        adminData,
        setAdminData,
        fetchAdminData,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
