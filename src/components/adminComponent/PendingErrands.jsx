import React from "react";
import CancelBtn from "./CancelBtn";


const PendingErrands = ({ errands }) => {
return (
    <div className="mt-2">
        <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
            <table className="w-full border-collapse text-sm sm:text-base">
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
                    {errands && errands.length > 0 ? (
                        errands.map((errand, index) => (
                            <tr className="border-b" key={errand.errand_Id || index}>
                                <td className="p-2 sm:p-3">{errand.errand_Id}</td>
                                <td className="p-2 sm:p-3">{errand.title}</td>
                                <td className="p-2 sm:p-3">{errand.date}</td>
                                <td className="p-2 sm:p-3">{errand.time}</td>
                                <td className="p-2 sm:p-3">{errand.posted_by}</td>
                                <td className="p-2 sm:p-3 text-yellow-500 font-semibold">{errand.status}</td>
                                <td className="p-2 sm:p-3">
                                
                                <CancelBtn errand_id={errand.errand_Id} />
                                    
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">
                                No pending errands found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
}

export default PendingErrands;