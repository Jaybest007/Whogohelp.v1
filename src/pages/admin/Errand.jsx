import React from "react";
import SideBar from "./SideBar";
import SearchErrand from './SearchErrand'
import { useAdmin } from "../../context/AdminContext";

const Errand = () => {

    const {adminData} = useAdmin();



    return (
        <div className="min-h-screen flex">
            <SideBar/>
            <div className="flex-1 bg-neutral-100 p-4 sm:p-6">
                <h2 className="font-bold text-4xl mb-6">Errand Page</h2>
                <div className="w-full mt-2 p-5 bg-white rounded-xl ml-auto">
                    <div className="justify-end">
                        <h2 className="mb-1">Search Errand:</h2>
                        <SearchErrand className="w-full " />
                    </div>

                {/* pending errands */}
                    <div className="mt-8">
                    <h2 className="text-lg font-bold mb-2 text-yellow-800">Pending Errands:</h2>
                    <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
                    <table className="w-full border-collapse text-sm sm:text-base ">
                        <thead>
                        <tr className="bg-yellow-200 text-gray-700">
                            <th className="p-2 sm:p-3 text-left">Errand ID</th>
                            <th className="p-2 sm:p-3 text-left">Title</th>
                            <th className="p-2 sm:p-3 text-left">Date</th>
                            <th className="p-2 sm:p-3 text-left">Time</th>
                            <th className="p-2 sm:p-3 text-left">Posted by</th>
                            <th className="p-2 sm:p-3 text-left">Status</th>
                            <th className="p-2 sm:p-3 text-left">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adminData?.pendingErrands?.map((errands, index) => (
                            <tr className="border-b" key={index}>
                            <td className="p-2 sm:p-3">{errands.errand_Id}</td>
                            <td className="p-2 sm:p-3">{errands.title}</td>
                            <td className="p-2 sm:p-3">{errands.date}</td>
                            <td className="p-2 sm:p-3">{errands.time}</td>
                            <td className="p-2 sm:p-3">{errands.posted_by}</td>
                            <td className="p-2 sm:p-3 text-yellow-500 font-semibold">{errands.status}</td>
                            <td className="p-2 sm:p-3"><button className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 cursor-pointer">Cancel</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="mt-10">
                    {/* ongoing errands */}
                    <h2 className="text-lg font-bold mb-2 text-blue-700  ">Ongoing Errands:</h2>
                    <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
                    <table className="w-full border-collapse text-sm sm:text-base ">
                        <thead>
                        <tr className="bg-blue-200 text-gray-700">
                            <th className="p-2 sm:p-3 text-left">Errand ID</th>
                            <th className="p-2 sm:p-3 text-left">Title</th>
                            <th className="p-2 sm:p-3 text-left">Date</th>
                            <th className="p-2 sm:p-3 text-left">Time</th>
                            <th className="p-2 sm:p-3 text-left">Posted by</th>
                            <th className="p-2 sm:p-3 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adminData?.ongoingErrands?.map((errands, index) => (
                            <tr className="border-b" key={index}>
                            <td className="p-2 sm:p-3">{errands.errand_Id}</td>
                            <td className="p-2 sm:p-3">{errands.title}</td>
                            <td className="p-2 sm:p-3">{errands.date}</td>
                            <td className="p-2 sm:p-3">{errands.time}</td>
                            <td className="p-2 sm:p-3">{errands.posted_by}</td>
                            
                            <td className="p-2 sm:p-3 text-blue-500 font-semibold">{errands.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="mt-10">
                    {/* completed errands */}
                    <h2 className="text-lg font-bold mb-2 text-gray-700 ">Completed Errands:</h2>
                    <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
                        <table className="w-full border-collapse text-sm sm:text-base">
                            <thead>
                            <tr className="bg-lime-200 text-gray-700">
                                <th className="p-2 sm:p-3 text-left">Errand ID</th>
                                <th className="p-2 sm:p-3 text-left">Title</th>
                                <th className="p-2 sm:p-3 text-left">Date</th>
                                <th className="p-2 sm:p-3 text-left">Time</th>
                                <th className="p-2 sm:p-3 text-left">Posted by</th>
                                <th className="p-2 sm:p-3 text-left">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {adminData?.completedErrands?.slice(0,40)
                            .map((errands, index) => (
                                <tr className="border-b" key={index}>
                                <td className="p-2 sm:p-3">{errands.errand_Id}</td>
                                <td className="p-2 sm:p-3">{errands.title}</td>
                                <td className="p-2 sm:p-3">{errands.date}</td>
                                <td className="p-2 sm:p-3">{errands.time}</td>
                                <td className="p-2 sm:p-3">{errands.posted_by}</td>
                                
                                <td className="p-2 sm:p-3 text-lime-500 font-semibold">{errands.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-10">
                    {/* rejected by Poster errands */}
                    <h2 className="text-lg font-bold mb-2 text-gray-700 ">Completed Errands:</h2>
                    <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
                    <table className="w-full border-collapse text-sm sm:text-base ">
                        <thead>
                        <tr className="bg-red-200 text-gray-700">
                            <th className="p-2 sm:p-3 text-left">Errand ID</th>
                            <th className="p-2 sm:p-3 text-left">Title</th>
                            <th className="p-2 sm:p-3 text-left">Date</th>
                            <th className="p-2 sm:p-3 text-left">Time</th>
                            <th className="p-2 sm:p-3 text-left">Posted by</th>
                            <th className="p-2 sm:p-3 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adminData?.rejectedByPoster?.map((errands, index) => (
                            <tr className="border-b" key={index}>
                            <td className="p-2 sm:p-3">{errands.errand_Id}</td>
                            <td className="p-2 sm:p-3">{errands.title}</td>
                            <td className="p-2 sm:p-3">{errands.date}</td>
                            <td className="p-2 sm:p-3">{errands.time}</td>
                            <td className="p-2 sm:p-3">{errands.posted_by}</td>
                            
                            <td className="p-2 sm:p-3 text-red-500 font-semibold">{errands.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                </div>
            </div>
            
        </div>
    )

}
export default Errand