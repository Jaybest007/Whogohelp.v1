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
    if (initialized) return; 
    setLoading(true);
    try {
      if (!dashboardData?.availableErrands?.length) {
        await refreshDashboardData();
      }

      const locationRes = await axios.get(
        "https://api-hvzs.onrender.com/api/errand_history.php?action=byUsersLocation",
        { withCredentials: true }
      );
      setLocationErrands(locationRes.data?.errands || []);

      const myErrandsRes = await axios.get(
        "https://api-hvzs.onrender.com/api/errand_history.php?action=myErrands",
        { withCredentials: true }
      );
      setMyErrandList(Array.isArray(myErrandsRes.data) ? myErrandsRes.data : []);

      setInitialized(true); // 
    } catch (error) {
      console.error(error);
      toast.error("Failed to load errands.");
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, [dashboardData, initialized]);

  return (
    <div className="browse-page bg-gradient-to-br from-black via-gray-700 to-gray-600 text-white min-h-screen p-4 pb-14">
      <h2 className="text-2xl font-bold text-orange-500 mt-18 mb-2">Available Errands:</h2>

      <div className="filter mb-7">
        <label className="mr-2">Filter Errand by:</label>
        <select
          value={filterBased}
          className="bg-black text-white rounded px-2 py-1 border border-orange-400 focus:bg-orange-500"
          onChange={handleChange}
        >
          <option value="global">Global</option>
          <option value="location">Location</option>
          <option value="myErrands">My errands</option>
        </select>
      </div>

      {!initialized || loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredErrands.length === 0 ? (
        <div className="text-gray-400">No errands found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredErrands.map((errand) => (
            <ErrandCard
              key={errand.errand_Id}
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
