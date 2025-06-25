import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import { useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [chat, setChat] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const [walletActionMode, setWalletActionMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterBased, setFilterBased] = useState("global");

  const location = useLocation();
  const isUserActive = useRef(false);
  const lastFetched = useRef(0);

const unreadCount = useMemo(() => {
  return notifications?.filter((n) => n.is_read === "false").length || 0;
      }, [notifications]);


      
  useEffect(() => {
    if(!isAuthenticated) return;
    if (!dashboardData) {
      fetchDashboardData();
      fetchNotifications();
    }
    
  }, []);
 
//==this is to fetch dashboard data
  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    axios
      .get("http://localhost/api/dashboard_data.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then((res) => {
        if (res.data?.error === "unauthorized") {
          clearDashboardData();
        } else {
          setDashboardData((prev) => ({
            ...prev,
            ...res.data
          }));
          lastFetched.current = Date.now();
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          clearDashboardData();
          setIsAuthenticated(false);
        } else {
          console.error("Dashboard fetch error:", err);
        }
      })
      .finally(() => setLoading(false));
  }, []);


  //===wallet refresh
  const refreshWalletBalance = useCallback(() => {
    if(!isAuthenticated) return;
    axios
      .get("http://localhost/api/wallet.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then((res) => {
        setDashboardData((prev) => ({
          ...prev,
          walletBalance: res.data.walletBalance
        }));
      })
      .catch((err) => console.error("Wallet refresh error:", err));
  }, []);



//==fetch notification
  const fetchNotifications = useCallback(() => {
    if(!isAuthenticated) return;
    axios
      .post(
        "http://localhost/api/notifications.php",
        { action: "fetch_notifications" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      )
      .then((res) => setNotifications(res.data.notifications))
      .catch((err) => {
        if (err.response?.status === 401) {
          clearDashboardData();
          setIsAuthenticated(false);
          console.error("Notifications fetch error:", err)
        }
        
      });
      
  }, []);


  //fetch chat
  const fetchChat = useCallback((errandId) => {
    axios
      .post(
        "http://localhost/api/messages.php",
        { action: "fetchChat", errand_id: errandId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      )
      .then((res) => setChat(res.data))
      .catch((err) => console.error("Chat fetch error:", err));
  }, []);


  //smartly refresh data after 1minutes of inactivity
  const smartRefresh = useCallback(() => {
    if(!isAuthenticated) return;
    const now = Date.now();
    const recentlyFetched = now - lastFetched.current < 5000;

    if (
      !isUserActive.current &&
      !recentlyFetched &&
      !location.pathname.includes("/notification")
    ) {
      fetchDashboardData();
      fetchNotifications();
    }
  }, [fetchDashboardData, fetchNotifications, location.pathname]);


  // this to clear notification
  useEffect(() => {
  if (!isAuthenticated) return; 

  const refreshDashboard = () => {
    if (!isUserActive.current && !location.pathname.includes("/notification")) {
      smartRefresh();
    }
  };

  const refreshNotifs = () => {
    if (isUserActive.current && !location.pathname.includes("/notification")) {
      fetchNotifications();
    }
  };

  // Only fetch if not already present
  if (!dashboardData) {
    fetchDashboardData();
  }

  if (!Array.isArray(notifications) || notifications.length === 0) {
    fetchNotifications();
  }

  const dashboardInterval = setInterval(refreshDashboard, 60000);
  const notificationInterval = setInterval(refreshNotifs, 500);

  return () => {
    clearInterval(dashboardInterval);
    clearInterval(notificationInterval);
  };
}, [
  location.pathname,
  smartRefresh,
  fetchDashboardData,
  fetchNotifications,
  dashboardData,
  notifications,
  isAuthenticated 
]);





  //this detect inactivity
  useEffect(() => {
    if(!isAuthenticated) return;
    let activityTimeout;

    const setActive = () => {
      isUserActive.current = true;
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        isUserActive.current = false;
      }, 15000);
    };

    window.addEventListener("mousemove", setActive);
    window.addEventListener("keydown", setActive);
    window.addEventListener("scroll", setActive);

    return () => {
      clearTimeout(activityTimeout);
      window.removeEventListener("mousemove", setActive);
      window.removeEventListener("keydown", setActive);
      window.removeEventListener("scroll", setActive);
    };
  }, []);


  //this navigate users back to transaction page
  useEffect(() => {

    if(!isAuthenticated) return;
    if (!location.pathname.includes("/transactions")) {
      setWalletActionMode(null);
    }
  }, [location]);

  

  //log out function
   const clearDashboardData = () => {
    setDashboardData(null);
    setNotifications([]);
    setChat(null);
    setLoading(false);
  };


  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        setDashboardData,
        notifications,
        setNotifications,
        chat,
        setChat,
        chatActive,
        setChatActive,
        fetchChat,
        refreshDashboardData: fetchDashboardData,
        refreshWalletBalance,
        refreshNotifications: fetchNotifications,
        clearDashboardData,
        smartRefresh,
        loading,
        walletActionMode,
        setWalletActionMode,
        filterBased,
        setFilterBased,
        unreadCount
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
