import React from "react";

const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-lg shadow-md p-4 animate-pulse space-y-3">
    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
    <div className="h-3 bg-gray-700 rounded w-full"></div>
    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
    <div className="h-8 bg-gray-600 rounded w-1/2 mt-2"></div>
  </div>
);

export default SkeletonCard