const ProfileSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-500 py-10 px-4 mt-15 mb-12 animate-pulse">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative">
      {/* Profile Header */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/5 bg-gray-200 rounded" />
        <div className="h-4 w-2/4 bg-gray-100 rounded" />
      </div>
    </div>

    {/* User Info Fields */}
    <ul className="space-y-4 mb-10">
      <li className="h-4 w-3/4 bg-gray-100 rounded" />
      <li className="h-4 w-2/3 bg-gray-100 rounded" />
      <li className="h-4 w-1/2 bg-gray-100 rounded" />
    </ul>

    {/* Button placeholders */}
    <div className="flex gap-3 mb-8">
      <div className="w-24 h-10 bg-gray-200 rounded-md" />
      <div className="w-24 h-10 bg-gray-200 rounded-md" />
    </div>

    {/* Stats */}
    <div className="space-y-3 mb-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-4 w-full bg-gray-100 rounded" />
      ))}
    </div>

    {/* History */}
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-orange-100 rounded-lg" />
      ))}
    </div>
    </div>
  </div>
);

export default ProfileSkeleton;