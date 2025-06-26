import React from "react";

const AwaitingConfirmations = ({ errands }) => {
  return (
    <div className="mt-2">
      <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-purple-200 text-gray-700">
              <th className="p-2 sm:p-3 text-left">Errand ID</th>
              <th className="p-2 sm:p-3 text-left">Title</th>
              <th className="p-2 sm:p-3 text-left">Date</th>
              <th className="p-2 sm:p-3 text-left">Time</th>
              <th className="p-2 sm:p-3 text-left">Posted by</th>
              <th className="p-2 sm:p-3 text-left">Status</th>
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
                  <td className="p-2 sm:p-3 text-purple-500 font-semibold">
                    {errand.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No errands awaiting confirmation found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AwaitingConfirmations;