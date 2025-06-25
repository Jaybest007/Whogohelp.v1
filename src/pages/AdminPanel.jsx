import React, { useState, useEffect } from "react";
import { FaUserTie, FaWallet, FaTasks, FaCog, FaUsers, FaSearch, FaBan, FaPowerOff } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import AdminDashboardSkeleton from '../components/AdminSkeleton';
import { Link } from "react-router-dom";
import { IoChatboxEllipses } from "react-icons/io5";
import SideBar from "../components/adminComponent/SideBar";
import SearchByUser from '../components/adminComponent/SearchUser';
import SearchErrand from "../components/adminComponent/SearchErrand";

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
  
  const ActiveUsers = adminData && adminData.AllUsers
    ? adminData.AllUsers.filter((user) => {
        const lastSeenTime = new Date(user.last_seen).getTime(); 
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000; 
        return now - lastSeenTime < twentyFourHours;
      }).length
    : 0;
  const walletRevenue = (adminData?.wallet ?? []).reduce((sum, wallet) => sum + parseFloat(wallet.balance || 0), 0);
    


  if (loading && !adminData) return <AdminDashboardSkeleton />;
 
  return (
    <div className="min-h-screen flex ">
      {/* SideBar */}
        <SideBar/>

      {/* Main Content */ }
        <main className="flex-1 bg-neutral-100 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-6 sm:mb-8">Dashboard Overview</h1>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {/* Users */}
            <div className="bg-gradient-to-tr from-orange-100 to-orange-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-orange-500 text-white rounded-full p-3 mb-2 shadow">
            <FaUsers size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Users</h2>
          <p className="text-2xl font-bold text-orange-600">{adminData?.AllUsers?.length ?? 0}</p>
            </div>
            {/* Active Users */}
            <div className="bg-gradient-to-tr from-green-100 to-green-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-green-500 text-white rounded-full p-3 mb-2 shadow">
            <FaUserTie size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Active</h2>
          <p className="text-2xl font-bold text-green-600">{ActiveUsers}</p>
            </div>
            {/* Wallet Revenue */}
            <div className="bg-gradient-to-tr from-yellow-100 to-yellow-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-yellow-500 text-white rounded-full p-3 mb-2 shadow">
            <FaWallet size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Revenue</h2>
          <p className="text-lg font-bold text-yellow-600">{(walletRevenue || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })}</p>
            </div>
            {/* Pending Errands */}
            <div className="bg-gradient-to-tr from-blue-100 to-blue-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-blue-500 text-white rounded-full p-3 mb-2 shadow">
            <FaTasks size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Pending</h2>
          <p className="text-2xl font-bold text-blue-600">{adminData?.pendingErrands?.length ?? 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {/* Ongoing Errands */}
            <div className="bg-gradient-to-tr from-purple-100 to-purple-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-purple-500 text-white rounded-full p-3 mb-2 shadow">
            <FaTasks size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Ongoing</h2>
          <p className="text-2xl font-bold text-purple-600">{adminData?.ongoingErrands?.length ?? 0}</p>
            </div>
            {/* Completed Errands */}
            <div className="bg-gradient-to-tr from-green-100 to-green-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-green-600 text-white rounded-full p-3 mb-2 shadow">
            <FaTasks size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Completed</h2>
          <p className="text-2xl font-bold text-green-700">{adminData?.completedErrands?.length ?? 0}</p>
            </div>
            {/* Rejected Errands by Poster */}
            <div className="bg-gradient-to-tr from-red-100 to-red-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-red-500 text-white rounded-full p-3 mb-2 shadow">
            <FaBan size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Rejected</h2>
          <p className="text-2xl font-bold text-red-600">{adminData?.rejectedByPoster?.length ?? 0}</p>
            </div>
            {/* Active Chats */}
            <div className="bg-gradient-to-tr from-indigo-100 to-indigo-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
          <div className="bg-indigo-500 text-white rounded-full p-3 mb-2 shadow">
            <IoChatboxEllipses size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Chats</h2>
          <p className="text-2xl font-bold text-indigo-600">{adminData?.AllChat?.length ?? 0}</p>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4 mt-6 mb-4">
            {/* Search by User */}
            <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Search by User</h3>
              <SearchByUser />
            </div>
            {/* Search by Errand */}
            <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Search by Errand</h3>
              <SearchErrand />
            </div>
          </div>
        
          
         
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 overflow-x-auto">
          <h2 className="text-base sm:text-xl font-bold text-gray-700 mb-4">Pending Errands</h2>
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2 sm:p-3 text-left">Errand ID</th>
                <th className="p-2 sm:p-3 text-left">Posted by</th>
                <th className="p-2 sm:p-3 text-left">Reason</th>
                <th className="p-2 sm:p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminData?.pendingErrands?.map((errands, index) => (
                <tr className="border-b" key={index}>
                  <td className="p-2 sm:p-3">{errands.errand_Id}</td>
                  <td className="p-2 sm:p-3">{errands.posted_by}</td>
                  <td className="p-2 sm:p-3">{errands.title}</td>
                  <td className="p-2 sm:p-3 text-yellow-500 font-semibold">{errands.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
      </main>
    </div>
  );
};

export default AdminPanel;
