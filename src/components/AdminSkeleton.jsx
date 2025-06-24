const AdminDashboardSkeleton = () => {
  const shimmer = "animate-pulse bg-gray-300";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Skeleton */}
      <aside className="w-64 bg-neutral-800 text-white p-6 space-y-6">
        <div className={`${shimmer} h-6 w-1/2 rounded`} />
        <nav className="space-y-4 mt-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${shimmer} h-4 w-3/4 rounded`} />
          ))}
        </nav>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 bg-neutral-100 p-6 space-y-8">
        {/* Header */}
        <div className={`${shimmer} h-8 w-1/3 rounded`} />

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md space-y-2">
              <div className={`${shimmer} h-4 w-1/2 rounded`} />
              <div className={`${shimmer} h-8 w-2/3 rounded`} />
            </div>
          ))}
        </div>

        {/* Search Fields */}
        <div className="flex gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className={`${shimmer} h-10 w-1/3 rounded-lg`} />
          ))}
        </div>

        {/* Cancelled Errands Table */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
          <div className={`${shimmer} h-6 w-1/3 rounded`} />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className={`${shimmer} h-4 w-1/4 rounded`} />
              ))}
            </div>
          ))}
        </div>

        {/* Top Earner */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className={`${shimmer} h-6 w-1/4 mb-4 rounded`} />
          <div className={`${shimmer} h-5 w-1/2 rounded`} />
        </div>

        {/* Recent Users Table */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
          <div className={`${shimmer} h-6 w-1/4 rounded`} />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className={`${shimmer} h-4 w-[15%] rounded`} />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardSkeleton;
