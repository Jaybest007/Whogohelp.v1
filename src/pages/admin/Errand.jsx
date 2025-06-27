import React from "react";
import NavBar from "../../components/adminComponent/NavBar";
import SearchErrand from '../../components/adminComponent/SearchErrand'
import { useAdmin } from "../../context/AdminContext";
import { useEffect } from "react";
import CancelBtn from "../../components/adminComponent/CancelBtn";
import CompletedBtn from "../../components/adminComponent/CompletedBtn";
import {
  FaUsers,
  FaUserTie,
  FaWallet,
  FaTasks,
  FaBan
} from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import StatCard from "../../components/adminComponent/StatCard";
import PendingErrands from "../../components/adminComponent/PendingErrands";
import OngoingErrands from "../../components/adminComponent/OngoingErrands";
import CompletedErrands from "../../components/adminComponent/CompletedErrands";
import RejectedErrands from "../../components/adminComponent/RejectedErrands";
import AwaitingConfirmations from "../../components/adminComponent/AwaitingConfirmations";
import RefreshBtn from "../../components/adminComponent/RefreshBtn";

const Errand = () => {
    useEffect( ()=> {
            document.title = "Errand - WhoGoHelp";
        }, []);

    const {adminData} = useAdmin();



    return (
    <div className="min-h-screen bg-neutral-100">

            <NavBar/>

            <main className="p-4 sm:p-6 max-w-7xl mx-auto ">
                
                <div className="w-full mt-2 rounded-xl ml-auto bg-gradient-to-tr from-white via-gray-100 to-white shadow-xl p-6 border border-gray-200">
                    <RefreshBtn styling={"bg-gray-100 border border-gray-200 float-right text-gray-600 hover:bg-gray-300 "} />
                    <h2 className="font-bold text-3xl mb-5 border-b pb-2 border-gray-300">📦 Errand Page:</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        
                <StatCard
                title="Pending"
                icon={<FaTasks size={22} />}
                value={adminData?.pendingErrands?.length ?? 0}
                bgFrom="from-yellow-100"
                bgTo="to-yellow-200"
                iconBg="bg-yellow-500"
                textColor="text-yellow-600"
                />
                
                <StatCard
                title="Ongoing"
                icon={<FaTasks size={22} />}
                value={adminData?.ongoingErrands?.length ?? 0}
                bgFrom="from-blue-100"
                bgTo="to-blue-200"
                iconBg="bg-blue-500"
                textColor="text-blue-600"
                />

                <StatCard
                title="Awaiting Confirmation"
                icon={<FaTasks size={22} />}
                value={adminData?.ongoingErrands?.length ?? 0}
                bgFrom="from-purple-100"
                bgTo="to-purple-200"
                iconBg="bg-purple-500"
                textColor="text-purple-600"
                />

                <StatCard
                title="Completed"
                icon={<FaTasks size={22} />}
                value={adminData?.completedErrands?.length ?? 0}
                bgFrom="from-green-100"
                bgTo="to-green-200"
                iconBg="bg-green-600"
                textColor="text-green-700"
                />
                <StatCard
                title="Rejected"
                icon={<FaBan size={22} />}
                value={adminData?.rejectedByPoster?.length ?? 0}
                bgFrom="from-red-100"
                bgTo="to-red-200"
                iconBg="bg-red-500"
                textColor="text-red-600"
                />
            </div>
                {/* =========SEARCH ERRAND============= */}
                
                <div className="w-full sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
                <label htmlFor="search-errand" className="block text-sm font-semibold text-gray-600 mb-2">
                    Search Errand:
                </label>
                <SearchErrand
                    id="search-errand"
                    className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Search Errand ID..."
                />
                </div>



                {/* Pending Errands - Modern Styled Details */}
                <details className="group mt-5 mb-6 rounded-lg border border-yellow-300 bg-yellow-50 shadow transition-all">
                  <summary className="flex items-center gap-2 cursor-pointer px-4 py-3 text-yellow-800 font-semibold text-lg group-open:rounded-t-lg group-open:bg-yellow-100 transition-all">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    Pending Errands
                    <span className="ml-auto transition-transform group-open:rotate-90">&#9654;</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <PendingErrands errands={adminData?.pendingErrands} />
                  </div>
                </details>
        
                {/* Ongoing Errands */}
                <details className="group mb-6 rounded-lg border border-blue-300 bg-blue-50 shadow transition-all">
                  <summary className="flex items-center gap-2 cursor-pointer px-4 py-3 text-blue-800 font-semibold text-lg group-open:rounded-t-lg group-open:bg-blue-100 transition-all">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    Ongoing Errands
                    <span className="ml-auto transition-transform group-open:rotate-90">&#9654;</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <OngoingErrands errands={adminData?.ongoingErrands} />
                  </div>
                </details>
        
                {/* Awaiting Confirmations */}
                <details className="group mb-6 rounded-lg border border-purple-300 bg-purple-50 shadow transition-all">
                  <summary className="flex items-center gap-2 cursor-pointer px-4 py-3 text-purple-800 font-semibold text-lg group-open:rounded-t-lg group-open:bg-purple-100 transition-all">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                    Awaiting Confirmations
                    <span className="ml-auto transition-transform group-open:rotate-90">&#9654;</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <AwaitingConfirmations errands={adminData?.awaitingConfirmations} />
                  </div>
                </details>
        
                {/* Completed Errands */}
                <details className="group mb-6 rounded-lg border border-green-300 bg-green-50 shadow transition-all">
                  <summary className="flex items-center gap-2 cursor-pointer px-4 py-3 text-green-800 font-semibold text-lg group-open:rounded-t-lg group-open:bg-green-100 transition-all">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Completed Errands
                    <span className="ml-auto transition-transform group-open:rotate-90">&#9654;</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <CompletedErrands errands={adminData?.completedErrands} />
                  </div>
                </details>
        
                {/* Rejected Errands */}
                <details className="group mb-6 rounded-lg border border-red-300 bg-red-50 shadow transition-all">
                  <summary className="flex items-center gap-2 cursor-pointer px-4 py-3 text-red-800 font-semibold text-lg group-open:rounded-t-lg group-open:bg-red-100 transition-all">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Rejected Errands
                    <span className="ml-auto transition-transform group-open:rotate-90">&#9654;</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <RejectedErrands errands={adminData?.rejectedByPoster} />
                  </div>
                </details>
                
                </div>
                
            
  
        </main>
            
          
    </div>
    )

}
export default Errand