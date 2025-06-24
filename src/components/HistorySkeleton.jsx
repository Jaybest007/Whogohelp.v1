import React from "react";

const HistorySkeleton = () => (
 <div className="max-w-md mx-auto bg-gray-200 rounded-2xl shadow p-6 space-y-4 animate-pulse">
    {[...Array(5)].map((_, idx) => (
      <li key={idx} className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-200 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </li>
    ))}
  </div>
);

export default HistorySkeleton