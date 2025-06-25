 import React from "react";
 import SideBar from "../../components/adminComponent/SideBar";
 import SearchUser from "../../components/adminComponent/SearchUser";
 import { useAdmin } from "../../context/AdminContext";

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
            <div className="min-h-screen flex">
                <SideBar/>

                <div className="flex-1 bg-neutral-100 p-4 sm:p-6">
                    <h2 className="text-4xl font-bold text-neutral-800 mb-6">User Page</h2>

                    <div className="w-full mt-2 p-5 bg-white rounded-xl ml-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                            {/* user */}
                            <div className="bg-gradient-to-tr from-orange-100 to-orange-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
                                <div className="bg-orange-500 text-white rounded-full p-3 mb-2 shadow">
                                    <FaUsers size={22} />
                                </div>
                                <h2 className="text-base font-semibold text-gray-700 mb-1">Users</h2>
                                <p className="text-2xl font-bold text-orange-600">{adminData?.AllUsers?.length ?? 0}</p>
                            </div>

                            {/* active */}
                            <div className="bg-gradient-to-tr from-green-100 to-green-200 rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]">
                            <div className="bg-green-500 text-white rounded-full p-3 mb-2 shadow">
                                <FaUserTie size={22} />
                            </div>
                            <h2 className="text-base font-semibold text-gray-700 mb-1">Active</h2>
                            <p className="text-2xl font-bold text-green-600">{ActiveUsers}</p>
                                </div>
                        </div>

                        <div className="justify-end">
                            <h2 className="mb-1">Search user:</h2>
                            <SearchUser className="w-full " />
                        </div>

                        {/* RECENTLY JOINED USERS */}
                        <NewUser/>
                        
                    </div>
                </div>
            </div>
        
        )
 }

 export default User