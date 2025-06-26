import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { Link } from "react-router-dom";
import BanBtn from "./BanBtn";
import UnBanBtn from "./UnBanBtn";

const SearchUser = () => {
  const { adminData, take_action } = useAdmin();
  const [searchUser, setSearchUser] = useState("");

  const BanUser = (username) => take_action(username, "banned");
  const Unban = (username) => take_action(username, "active");

  const filteredUsers = (adminData?.AllUsers || []).filter((user) =>
    (user.username || "").toLowerCase().includes(searchUser.trim().toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search by username"
          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        {searchUser && (
          <span
            onClick={() => setSearchUser("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 font-bold text-lg px-2 py-1 rounded cursor-pointer"
          >
            ×
          </span>
        )}
      </div>

      {searchUser && (
        <details open className="group mt-6 rounded-lg border border-orange-300 bg-white shadow">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-orange-700 font-semibold text-lg group-open:rounded-t-lg group-open:bg-orange-50 transition">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2" />
            Search Results
            <span className="ml-auto text-gray-500 group-open:rotate-90 transition-transform">&#9654;</span>
          </summary>

          <div className="px-4 pb-4 pt-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id || user.username}
                  className={`border-l-4 ${
                    user.status === "active"
                      ? "bg-blue-50 border-blue-400"
                      : "bg-red-50 border-red-400"
                  } rounded-lg mb-4 p-4 shadow hover:shadow-md transition-shadow`}
                >
                  <Link to={`/profile/${user.username}`} className="block mb-3">
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        @{user.username}
                      </span>
                      <span
                        className={`text-white px-3 py-1 rounded-full text-sm ${
                          user.status === "active" ? "bg-neutral-700" : "bg-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-800">
                      <p><strong>Full Name:</strong> {user.full_name}</p>
                      <p><strong>Phone:</strong> {user.phone}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Location:</strong> {user.location}</p>
                      <p><strong>Last seen:</strong> {user.last_seen}</p>
                      <p><strong>Joined:</strong> {user.created_at}</p>
                    </div>
                  </Link>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <BanBtn username={user.username}/>
                    <UnBanBtn username={user.username}/>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No users found.</div>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default SearchUser;
