 import React from "react";
import NavBar from "../../components/adminComponent/NavBar";
 import SearchUser from "../../components/adminComponent/SearchUser";
 import { useAdmin } from "../../context/AdminContext";
import StatCard from "../../components/adminComponent/StatCard";
import { FaUsers, FaUserTie } from "react-icons/fa";
import NewUser from "../../components/adminComponent/NewUser";


 const User = () => {

    const {adminData} = useAdmin();
    
    const ActiveUsers = adminData && adminData.AllUsers
    ? adminData.AllUsers.filter((user) => {
        const lastSeenTime = new Date(user.last_seen).getTime(); 
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000; 
        return now - lastSeenTime < twentyFourHours;
      }).length
    : 0;


        return (
            <div className="min-h-screen bg-neutral-100">
                <NavBar/>
            <main className="p-3 sm:p-6 max-w-7xl mx-auto">
                
                    <div className="w-full p-5 ml-auto bg-gradient-to-tr from-white via-gray-100 to-white rounded-2xl shadow-xl border border-gray-200">
                        <h2 className="text-3xl font-bold text-neutral-800 mb-6 border-b pb-2 border-gray-300">👥 User Page</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                        {/* user */}
                        <StatCard
                            title="Total Users"
                            icon={<FaUsers size={22} />}
                            value={adminData?.AllUsers?.length ?? 0}
                            bgFrom="from-green-100"
                            bgTo="to-green-200"
                            iconBg="bg-green-500"
                            textColor="text-green-600"
                        />
                        {/* Active Users */}
                        <StatCard
                            title="Active Users"
                            icon={<FaUserTie size={22} />}
                            value={ActiveUsers}
                            bgFrom="from-blue-100"
                            bgTo="to-blue-200"
                            iconBg="bg-blue-500"
                            textColor="text-blue-600"
                        />


                        </div>

                        <div className="justify-end">
                            <h2 className="mb-1">Search user:</h2>
                            <SearchUser className="w-full " />
                        </div>

                        {/* RECENTLY JOINED USERS */}
                        <NewUser/>
                        
                    </div>
                
            </main>
                
            </div>
        
        )
 }

 export default User