import React, { useState, useEffect } from "react";
import { FaUserTie, FaWallet, FaTasks, FaCog, FaUsers, FaSearch, FaBan, FaPowerOff } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import AdminDashboardSkeleton from '../components/AdminSkeleton';
import { Link } from "react-router-dom";
import { IoChatboxEllipses } from "react-icons/io5";
import NavBar from "../components/adminComponent/NavBar";
import SearchByUser from '../components/adminComponent/SearchUser';
import SearchErrand from "../components/adminComponent/SearchErrand";
import Overview from "../components/adminComponent/Overview";

const AdminPanel = () => {
  useEffect( ()=> {
        document.title = "Admin Panel - WhoGoHelp";
    }, []);


  const [searchUser, setSearchUser] = useState("");
  const [searchErrand, setSearchErrand] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const {adminData,
        setAdminData,
        fetchAdminData,
        loading,} = useAdmin();
  

  if (loading && !adminData) return <AdminDashboardSkeleton />;
 
  return (
    <div className="min-h-screen bg-neutral-100">

      {/* Nav bar */}
        <NavBar/>

      {/* Main Content */ }
        <main className="p-4 sm:p-6 max-w-7xl mx-auto ">
          <div className="bg-white drop-shadow-xl p-6 rounded-xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-6 sm:mb-8">Dashboard Overview</h1>

          {/* Dashboard Metrics */}
          <Overview/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Search by User */}
        <details className="group bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all">
          <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer bg-gray-100 text-gray-700 font-semibold text-base group-open:rounded-t-lg group-open:bg-orange-50 hover:bg-gray-200 transition-all">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
            Search by User
            <span className="ml-auto transition-transform group-open:rotate-90 text-gray-500">&#9654;</span>
          </summary>
          <div className="px-5 pb-5 pt-2">
            <label htmlFor="search-user" className="block text-sm font-medium text-gray-600 mb-2">
              Enter username:
            </label>
            <SearchByUser
              id="search-user"
              className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Enter username..."
            />
          </div>
        </details>

        {/* Search by Errand */}
        <details className="group bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all">
          <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer bg-gray-100 text-gray-700 font-semibold text-base group-open:rounded-t-lg group-open:bg-orange-50 hover:bg-gray-200 transition-all">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
            Search by Errand
            <span className="ml-auto transition-transform group-open:rotate-90 text-gray-500">&#9654;</span>
          </summary>
          <div className="px-5 pb-5 pt-2">
            <label htmlFor="search-errand" className="block text-sm font-medium text-gray-600 mb-2">
              Errand ID:
            </label>
            <SearchErrand
              id="search-errand"
              className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Search Errand ID..."
            />
          </div>
        </details>
      </div>

          
          {/* ================ */}
          </div>
         
      </main>
    </div>
  );
};

export default AdminPanel;
