import React from "react";

const CompletedErrands = ({ errands }) => {

  const today = new Date().toISOString().slice(0, 10);

  const todaysErrands = (errands || []).filter(
    (errand) => errand.date && errand.date.slice(0, 10) === today
  );

  return (
    <div className="mt-2">
      <div className="overflow-y-auto overflow-x-hidden max-h-[550px]">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-green-200 text-gray-700">
              <th className="p-2 sm:p-3 text-left">Errand ID</th>
              <th className="p-2 sm:p-3 text-left">Title</th>
              <th className="p-2 sm:p-3 text-left">Date</th>
              <th className="p-2 sm:p-3 text-left">Time</th>
              <th className="p-2 sm:p-3 text-left">Posted by</th>
              <th className="p-2 sm:p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {todaysErrands.length > 0 ? (
              todaysErrands.map((errand, index) => (
                <tr className="border-b" key={errand.errand_Id || index}>
                  <td className="p-2 sm:p-3">{errand.errand_Id}</td>
                  <td className="p-2 sm:p-3">{errand.title}</td>
                  <td className="p-2 sm:p-3">{errand.date}</td>
                  <td className="p-2 sm:p-3">{errand.time}</td>
                  <td className="p-2 sm:p-3">{errand.posted_by}</td>
                  <td className="p-2 sm:p-3 text-green-500 font-semibold">
                    {errand.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No completed errands found for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedErrands;