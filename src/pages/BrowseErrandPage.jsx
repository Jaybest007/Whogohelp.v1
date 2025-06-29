import React, { useEffect, useState, useMemo } from "react";
import ErrandCard from "../components/ErrandCard";
import BottomNav from "../components/BottomNav";
import { useDashboard } from "../context/DashboardContext";
import axios from "axios";
import { toast } from "react-toastify";
import SkeletonCard from "../components/SkeletonCard";

const BrowseErrandsPage = () => {
  useEffect(() => {
    document.title = "Errands - WhoGoHelp";
  }, []);

  const {
    dashboardData,
    refreshDashboardData,
    refreshNotifications,
    filterBased,
    setFilterBased,
    loading: dashboardLoading,
  } = useDashboard();

  const [locationErrands, setLocationErrands] = useState([]);
  const [myErrandList, setMyErrandList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const filteredErrands = useMemo(() => {
    if (filterBased === "global") return dashboardData?.availableErrands || [];
    if (filterBased === "location") return locationErrands;
    if (filterBased === "myErrands") return myErrandList;
    return [];
  }, [filterBased, dashboardData, locationErrands, myErrandList]);

  const handleChange = (event) => {
    setFilterBased(event.target.value);
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (initialized || !dashboardData || dashboardLoading) return;

      setLoading(true);
      try {
        const [locationRes, myErrandsRes] = await Promise.all([
          axios.get("http://localhost/api/errand_history.php?action=byUsersLocation", {
            withCredentials: true,
          }),
          axios.get("http://localhost/api/errand_history.php?action=myErrands", {
            withCredentials: true,
          }),
        ]);

        setLocationErrands(locationRes.data?.errands || []);
        setMyErrandList(Array.isArray(myErrandsRes.data) ? myErrandsRes.data : []);
        setInitialized(true);
      } catch (error) {
        console.error("Errand fetch error:", error);
        toast.error("Failed to load errands.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [dashboardData, dashboardLoading, initialized]);

  useEffect(() => {
    if (!dashboardData && !dashboardLoading) {
      refreshDashboardData();
    }
  }, [dashboardData, dashboardLoading, refreshDashboardData]);

  return (
    <div className="browse-page min-h-screen mt-16 bg-gradient-to-br from-[#0f0f0f] via-[#1f2937] to-[#111827] text-white p-4 sm:p-6 md:p-8 lg:p-10 pb-20">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <h2 className="text-3xl font-extrabold text-orange-400 tracking-tight drop-shadow-sm">
      🧭 Available Errands
    </h2>

    {/* Filter */}
    <div className="flex items-center gap-3 bg-[#1f2937] border border-orange-500 rounded-xl px-4 py-2 shadow-md">
      <label htmlFor="filter" className="text-sm text-orange-300 font-medium whitespace-nowrap">
        Filter by:
      </label>
      <select
        id="filter"
        value={filterBased}
        onChange={handleChange}
        className="bg-transparent text-gray-400 text-sm font-medium px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 border border-gray-600 hover:border-orange-400"
      >
        <option value="global">🌍 Global Errands</option>
        <option value="location">📍 Near My Location</option>
        <option value="myErrands">🧾 My Errands</option>
      </select>
    </div>
  </div>

      {loading || !initialized ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredErrands.length === 0 ? (
        <div className="text-gray-400">No errands found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredErrands.map((errand, idx) => (
          <ErrandCard
            key={errand.errand_Id || `errand-${idx}`}
            {...errand}
            triggerRefresh={refreshDashboardData}
            triggerNotificationRefresh={refreshNotifications}
          />
        ))}
      </div>


      )}

      <BottomNav />
    </div>
  );
};

export default BrowseErrandsPage;
