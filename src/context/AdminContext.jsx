import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useDashboard } from "./DashboardContext";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastFetched = useRef(0);
  const { clearDashboardData } = useDashboard();
  const navigate = useNavigate();
  const [messages, setMessages] = useState()
  const [adminSettings, setAdminSettings] = useState(null)


//fetch data
  const fetchAdminData = useCallback( async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost/api/admin.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setAdminData(res.data);
      setAdminSettings(res.data.Settings);
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
    if (!adminData ){
      fetchAdminData();
    }
  }, [adminData, fetchAdminData]);


  // =====to cancel and complete errand====
  const take_action = useCallback(async (username, type) => {
    try {
      const res = await axios.post(
        "http://localhost/api/admin_actions.php",
        { action: "take_action", username , type },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAdminData(); 
      } else {
        toast.error(res.data.message || "Failed to ban user.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred while banning user.");
    }
  }, [fetchAdminData]);


  // =====TO CANCEL ERRAND OR COMPLETE ERRAND====
const errand_action = useCallback(async (errand_id, action_type) => {
    try {
      const res = await axios.post(
        "http://localhost/api/admin_actions.php",
        { action: "errand_action", errand_id, action_type },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAdminData(); 
      } else {
        toast.error(res.data.message || "Action Failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred while performing action.");
    }
  }, [fetchAdminData]);



  // ==== TO MARK MESSAGE AS READ ====
  const markMessageAsRead = useCallback(async (id) => {
    try {
      const res = await axios.post(
        "http://localhost/api/admin_actions.php",
        { action: "mark_message_as_read", id },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAdminData(); 
      } else {
        toast.error(res.data.message || "Failed to mark message as read.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred while marking message as read.");
    }
  }, [fetchAdminData]);


  // ====Admin Settings =====
  const updateAdminsettings = useCallback(async (maintenance_mode, withdrawal_limit, announcement) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost/api/admin_actions.php",
        {action: "settings", maintenance_mode, withdrawal_limit, announcement },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAdminData(); 
      } else {
        toast.error(res.data.message || "Failed to update settings.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred while updating settings.");
    } finally {
      setLoading(false);
    }
  }, [fetchAdminData]);





  return (
    <AdminContext.Provider
      value={{
        adminData,
        setAdminData,
        fetchAdminData,
        loading,
        take_action,
        errand_action,
        markMessageAsRead,
        updateAdminsettings,
        adminSettings
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
