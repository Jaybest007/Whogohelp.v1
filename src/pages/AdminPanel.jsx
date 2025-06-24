import React, { useState } from "react";
import { FaUserTie, FaWallet, FaTasks, FaCog, FaUsers, FaSearch, FaBan } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import AdminDashboardSkeleton from '../components/AdminSkeleton'

const AdminPanel = () => {
  const [searchUser, setSearchUser] = useState("");
  const [searchErrand, setSearchErrand] = useState("");
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
    

  
 console.log(adminData);



  if (loading && !adminData) return <AdminDashboardSkeleton />;
 
  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
            <FaUserTie size={20} /> <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
            <FaTasks size={20} /> <span>Errands</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
            <FaUsers size={20} /> <span>Users</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
            <FaWallet size={20} /> <span>Wallet</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
            <FaCog size={20} /> <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-100 p-6">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Dashboard Overview</h1>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-700">Users</h2>
            <p className="text-3xl font-semibold text-orange-500">{adminData && adminData.AllUsers ? adminData.AllUsers.length : 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-700">Active Errands</h2>
            <p className="text-3xl font-semibold text-orange-500">{ActiveUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-700">Wallet Revenue</h2>
            <p className="text-3xl font-semibold text-orange-500">{(walletRevenue || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mt-6">
          <input
            type="text"
            placeholder="Search User..."
            className="border border-gray-300 p-2 rounded-lg w-1/3"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search Errand ID..."
            className="border border-gray-300 p-2 rounded-lg w-1/3"
            value={searchErrand}
            onChange={(e) => setSearchErrand(e.target.value)}
          />
        </div>

        {searchErrand && adminData?.AllErrands ? (
          <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <h2 className="text-red-600">Search result:</h2>
            {adminData.AllErrands
              .filter((errand) => (errand.errand_Id || "").toLowerCase() === searchErrand.toLowerCase())
              .map((errand) => (
                <div key={errand.errand_Id} className="p-2 ">
                  <p><strong>ID:</strong> {errand.errand_Id}</p>
                  <p><strong>Title:</strong> {errand.title}</p>
                  <p><strong>Status:</strong> {errand.status}</p>
                  <p><strong>Reward:</strong> {errand.reward}</p>
                  <p><strong>Posted by:</strong> {errand.posted_by}</p>
                  {errand.accepted_by && (<p><strong>Accepted by:</strong> {errand.accepted_by}</p>)}
                  <p><strong>Pick up location:</strong> {errand.pick_up_location}</p>
                  <p><strong>Drop off Location:</strong> {errand.drop_off_location}</p>
                  {errand.pickup_code && (<p><strong>Pickup code:</strong> {errand.pickup_code}</p>)}
                  {errand.rejection_reason && (<p><strong>Accepted by:</strong> {errand.rejection_reason}</p>)}                
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <p>No search result</p>
          </div>
        )}

        {/* Filters for Cancelled & Unsuccessful Errands */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Cancelled & Unsuccessful Errands</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Errand ID</th>
                <th className="p-3 text-left">Posted by</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminData?.pendingErrands?.map((errands, index) => (
                <tr className="border-b" key={index}>
                  <td className="p-3">{errands.errand_Id}</td>
                  <td className="p-3">{errands.posted_by}</td>
                  <td className="p-3">{errands.title}</td>
                  <td className="p-3 text-yellow-500 font-semibold">{errands.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Earner */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          
        </div>

        {/* Users Table with Ban/Hold Button */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Users</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">jaybest</td>
                <td className="p-3">jaybest@runz.ng</td>
                <td className="p-3">Admin</td>
                <td className="p-3 text-green-500 font-semibold">Active</td>
                <td className="p-3">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                    <FaBan /> Ban/Hold
                  </button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">tosin</td>
                <td className="p-3">tosin@mail.com</td>
                <td className="p-3">User</td>
                <td className="p-3 text-yellow-500 font-semibold">Pending</td>
                <td className="p-3">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                    <FaBan /> Ban/Hold
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
