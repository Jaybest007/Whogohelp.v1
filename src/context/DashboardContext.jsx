import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from "react";
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

  const clearDashboardData = () => {
    setDashboardData(null);
    setNotifications([]);
    setChat(null);
    setLoading(false);
  };

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    axios
      .get("http://localhost/api//dashboard_data.php", {
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

  const fetchNotifications = useCallback(() => {
    if (!isAuthenticated) return;
    axios
      .post(
        "http://localhost/api//notifications.php",
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
        } else {
          console.error("Notifications fetch error:", err);
        }
      });
  }, [isAuthenticated]);

  const refreshWalletBalance = useCallback(() => {
    if (!isAuthenticated) return;
    axios
      .get("http://localhost/api//wallet.php", {
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
  }, [isAuthenticated]);

  const fetchChat = useCallback((errandId) => {
    axios
      .post(
        "http://localhost/api//messages.php",
        { action: "fetchChat", errand_id: errandId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      )
      .then((res) => setChat(res.data))
      .catch((err) => console.error("Chat fetch error:", err));
  }, []);

  const smartRefresh = useCallback(() => {
    if (!isAuthenticated || !dashboardData) return;
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
  }, [fetchDashboardData, fetchNotifications, isAuthenticated, dashboardData, location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || dashboardData) return;
    fetchDashboardData();
  }, [isAuthenticated, dashboardData, fetchDashboardData]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (
        isUserActive.current &&
        !location.pathname.includes("/notification")
      ) {
        fetchNotifications();
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname, fetchNotifications]);

  useEffect(() => {
    const status = dashboardData?.userStatus?.status;
    if (isAuthenticated && status === "banned") {
      clearDashboardData();
      setIsAuthenticated(false);
      window.location.href = "/logout";
    }
  }, [dashboardData?.userStatus?.status, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!location.pathname.includes("/transactions")) {
      setWalletActionMode(null);
    }
  }, [location, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!location.pathname.includes("/notification")) {
      isUserActive.current = true;
      fetchNotifications();
    } else {
      smartRefresh();
    }
  }, [location.pathname, isAuthenticated, smartRefresh, fetchNotifications]);


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
