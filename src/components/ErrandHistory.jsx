import React, { useState } from 'react';

import ErrandDetailModal from './ErrandDetailModal';



const ErrandHistory = ({errands = []}) => {


  const [selectedErrand, setSelectedErrand] = useState(null);

  const sortedErrands = [...errands].sort((a, b) => {
  const dateA = new Date(`${a.date} ${a.time}`);
  const dateB = new Date(`${b.date} ${b.time}`);
  return dateB - dateA; // Most recent first
});

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold text-orange-400 mb-3">Completed Errands (recent 10)</h3>

      <div className="space-y-2">
        

        {errands.length === 0 && (
          <div className="text-gray-400 text-sm">No completed errands found.</div>
        )}

        {sortedErrands.slice(0, 10).map((errand, idx) => (
          <div
            key={errand.errand_Id || idx}
            onClick={() => setSelectedErrand(errand)}
            className="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer rounded-md p-3 text-sm shadow-sm border border-gray-800"
          >
            <p className="text-white font-medium">📦 {errand.title} - {errand.reward}</p>
            <p className="text-gray-400 text-xs mt-1 capitalize">{errand.status} • {errand.date} {errand.time}</p>
          </div>
        ))}
      </div>

      {selectedErrand && (
        <ErrandDetailModal
          errand={selectedErrand}
          onClose={() => setSelectedErrand(null)}
        />
      )}
    </div>
  );
};

export default ErrandHistory;
