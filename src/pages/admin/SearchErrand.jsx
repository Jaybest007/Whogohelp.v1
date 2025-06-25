import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { FaTimes } from "react-icons/fa";




const SearchErrand = () => {

    const {adminData} = useAdmin();
    const [searchErrand, setSearchErrand] = useState()


    return (
      <div>
         <input
        type="text"
        placeholder="Search Errand ID..."
        className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/3 text-base inline"
        value={searchErrand}
        onChange={(e) => setSearchErrand(e.target.value)}
        />
        
        <span onClick={()=> setSearchErrand("")} className="font-bold text-2xl bg-neutral-600 text-white px-5 py-3 ml-2 rounded-lg hover:bg-neutral-500 cursor-pointer ">x</span>
       

        {searchErrand && adminData?.AllErrands && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 overflow-x-auto">
          <h2 className="text-neutral-600 font-semibold mb-2">Errand Search Result:</h2>
          {adminData.AllErrands
          .filter((errand) =>
            (errand.errand_Id || "")
            .toLowerCase()
             === searchErrand.trim().toLowerCase()
          )
          .map((errand) => (
            <div
            key={errand.errand_Id}
            className={`border-l-4 rounded-lg mb-4 p-4 shadow flex flex-col gap-2 hover:shadow-lg transition-shadow
              ${
                errand.status === "completed"
                ? "bg-green-50 text-green-700"
                : errand.status === "pending"
                ? "bg-yellow-50 text-yellow-700"
                : errand.status === "rejected"
                ? "bg-red-50 text-red-700"
                : errand.status === "progress" 
                ? "bg-blue-50 text-blue-800"
                : "bg-orange-50 text-orange-700"
              }`}>
            <div className="flex flex-wrap gap-4 items-center mb-2">
              <span className="bg-neutral-700 text-neutral-100 px-3 py-1 rounded-full text-sm font-bold">
              ID: {(errand.errand_Id || "").toUpperCase()}
              </span>
              <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                errand.status === "completed"
                ? "bg-green-800 text-green-50"
                : errand.status === "pending"
                ? "bg-yellow-800 text-yellow-50"
                : errand.status === "rejected"
                ? "bg-red-800 text-red-500"
                : errand.status === "progress" 
                ? "bg-blue-800 text-blue-50"
                : "bg-orange-800 text-orange-50"
              }`}
              >
              {errand.status.toUpperCase()}
              </span>
              <span className="bg-blue-800 text-blue-50 font-bold px-3 py-1 rounded-full text-">
              Reward: {errand.reward}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p>
                <span className="font-semibold text-gray-700">Title:</span>{" "}
                {errand.title}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Posted by:</span>{" "}
                {errand.posted_by}
              </p>
                {errand.accepted_by && (
              <p>
                <span className="font-semibold text-gray-700">
                  Accepted by:
                </span>{" "}
                  {errand.accepted_by}
              </p>
              )}
              <p>
              <span className="font-semibold text-gray-700">Pick up:</span>{" "}
                {errand.pick_up_location}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Drop off:</span>{" "}
                {errand.drop_off_location}
              </p>
                {errand.pickup_code && (
              <p>
                <span className="font-semibold text-gray-700">
                Pickup code:
                </span>{" "}
                {errand.pickup_code}
              </p>
              )}
              {errand.rejection_reason && (
              <p>
                <span className="font-semibold text-gray-700">
                Rejection reason:
                </span>{" "}
                {errand.rejection_reason}
              </p>
              )}
            </div>
            </div>
          ))}
          {adminData.AllErrands.filter((errand) =>
          (errand.errand_Id || "")
            .toLowerCase()
            .includes(searchErrand.trim().toLowerCase())
          ).length === 0 && (
          <div className="text-gray-500 text-center py-4">No errands found.</div>
          )}
        </div>
        )}
      </div>
    )
}

export default SearchErrand;