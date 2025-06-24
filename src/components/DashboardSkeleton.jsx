import React from 'react';

const DasboardSkeleton = () => (
  <div className="min-h-screen flex flex-col mt-14 overflow-x-hidden bg-gradient-to-br from-black via-gray-700 to-gray-600 animate-pulse">
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 pb-32 space-y-8">

      {/* Header placeholder */}
      <div className="w-1/3 h-8 bg-gray-500 rounded" />

      {/* Wallet balance bar */}
      <div className="w-full h-16 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-200 rounded-lg" />

      {/* Action Cards placeholder */}
      <div className="h-36 max-w-3xl mx-auto bg-orange-900 rounded-xl shadow-2xl" />

      {/* Awaiting Errands skeleton */}
      <div className="mt-3 bg-blue-50 rounded-xl p-5 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-10 w-full bg-blue-200 rounded" />
        ))}
      </div>

      {/* Ongoing or History skeleton */}
      <div className="mt-3 bg-gray-800 rounded-xl p-5 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-full bg-gray-900 rounded" />
        ))}
      </div>

    </div>
  </div>
);

export default DasboardSkeleton;
