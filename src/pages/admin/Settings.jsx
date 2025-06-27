import React, { useState, useEffect } from 'react';
import Navbar from '../../components/adminComponent/NavBar';
import RefreshBtn from '../../components/adminComponent/RefreshBtn';
import { useAdmin } from '../../context/AdminContext';

const Settings = () => {
    const { updateAdminsettings, adminSettings, loading, impersonateUser } = useAdmin();

    const [maintenance, setMaintenance] = useState(false);
    const [newLimit, setNewLimit] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        if (adminSettings) {
            setMaintenance(!!Number(adminSettings.maintenance_mode));
            setNewLimit(adminSettings.withdrawal_limit ?? "");
            setAnnouncement(adminSettings.announcement ?? "");
        }
    }, [adminSettings]);

    const handleMaintenanceToggle = (event) => {
        const isActive = event.target.checked;
        setMaintenance(isActive);
        updateAdminsettings(isActive ? 1 : 0, null, null);
    };

    const handleLimitSave = () => {
        updateAdminsettings(null, newLimit, null);
    };

    const handleAnnouncementPost = () => {
        updateAdminsettings(null, null, announcement);
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gray-100">
            <Navbar />
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 bg-gradient-to-tr from-white via-gray-100 to-white rounded-2xl shadow-xl mt-6 border border-gray-200 overflow-x-auto">
                <RefreshBtn styling={"bg-gray-500 float-right text-white "} />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 border-gray-300">
                    <button className='hover:animate-spin'>⚙️</button> Settings
                </h1>

                <div className="space-y-10 px-4 sm:px-8 md:px-12 max-w-4xl mx-auto">

                    {/* ⚙️ Maintenance Mode */}
                    <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">🛠 Maintenance Mode</h2>
                                <p className="text-sm text-gray-500">Temporarily disable access to the platform for end users.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={maintenance}
                                    onChange={handleMaintenanceToggle}
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-green-500 transition-all"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </section>

                    {/* 💸 Withdrawal Limit */}
                    <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">💳 Withdrawal Limit</h2>
                        <p className="text-sm text-gray-500 mb-4">Control how much a user can withdraw in a single day.</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <input
                                type="number"
                                min="0"
                                className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Amount"
                                onChange={(event) => setNewLimit(event.target.value)}
                                value={newLimit}
                            />
                            <span className="text-gray-600">NGN</span>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md"
                                onClick={handleLimitSave}
                                disabled={loading}
                            >
                                Save
                            </button>
                        </div>
                    </section>

                    {/* 📢 Announcement */}
                    <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">📢 Announcement</h2>
                        <p className="text-sm text-gray-500 mb-4">Send a broadcast message to all users.</p>
                        <textarea
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="4"
                            placeholder="Type announcement..."
                            onChange={(event) => setAnnouncement(event.target.value)}
                            value={announcement}
                        />
                        <button
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
                            onClick={handleAnnouncementPost}
                            disabled={loading}
                        >
                            Post
                        </button>
                    </section>

                    {/* 🧑‍💻 User Impersonation */}
                    <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">👤 User Impersonation</h2>
                        <p className="text-sm text-gray-500 mb-4">Log in as a user for debugging or support purposes.</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <input
                                type="text"
                                className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter User ID or Email"
                                onChange={(event)=> setUsername(event.target.value)}
                            />
                            <button 
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition" 
                                onClick={() => {impersonateUser(username)}}>
                                Impersonate
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;