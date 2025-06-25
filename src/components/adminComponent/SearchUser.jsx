import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { Link } from "react-router-dom";



const SearchUser = () => {

    const {adminData, take_action} = useAdmin();
    const [searchUser, setSearchUser] = useState("")

    function BanUser (username){
        const type = "banned";
        take_action(username, type);
    };

    function Unban(username){
      const type = "active";
      take_action(username, type);
    }

    return (
        <div>
           <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by username"
            className="border border-gray-300 p-3 pr-10 rounded-lg w-full text-base"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          {searchUser && (
            <span
              onClick={() => setSearchUser("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 font-bold text-sm sm:text-base md:text-lg px-2 py-1 rounded cursor-pointer"
            >
              x
            </span>
          )}
        </div>
            {searchUser && adminData?.AllUsers && (
            <div className="bg-white p-4 rounded-lg shadow-md mt-6 overflow-x-auto">
              <h2 className="text-orange-600 font-semibold mb-4">User Search Result</h2>
              {adminData.AllUsers
                .filter((user) =>
                  (user.username || "")
                    .toLowerCase()
                    .includes(searchUser.trim().toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id || user.username}
                    className={`border-l-4 ${user?.status === 'active' ? 'bg-blue-50 border-blue-400' : 'bg-red-50 border-red-400'} rounded-lg mb-4 p-4 shadow flex flex-col gap-2 hover:shadow-lg transition-shadow`}
                  >
                    <Link to={`/profile/${user.username}`}>
                      <div className="flex flex-wrap gap-4 items-center mb-2">
                        <span className="bg-blue-700 text-blue-100 px-3 py-1 rounded-full text-sm font-bold">
                          Username: {user.username}
                        </span>
                        <span className={`${user.status === "active" ? 'bg-neutral-700' : 'bg-red-700' } text-white px-3 py-1 rounded-full text-sm`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p>
                          <span className="font-semibold text-gray-700">Full name:</span>{" "}
                          {user.full_name}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Phone:</span>{" "}
                          {user.phone}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Email:</span>{" "}
                          {user.email}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Location:</span>{" "}
                          {user.location}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Last seen:</span>{" "}
                          {user.last_seen}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Joined on:</span>{" "}
                          {user.created_at}
                        </p>
                      </div>
                    </Link>
                    <div>
                      <p className="mb-2">Actions:</p>
                      <button onClick={() => BanUser(user.username)} className="bg-red-500 text-white px-4 py-2 mr-3 rounded hover:bg-red-600 cursor-pointer shadow">Ban account</button>
                      <button onClick={() => Unban(user.username)} className="bg-lime-500 text-white px-4 py-2 mr-3 rounded hover:bg-lime-600 cursor-pointer shadow">Lift Limitation</button>
                      {/* <button onClick={() => banUser(user.username)} className="bg-red-800 text-white px-3 py-2 mr-3 rounded hover:bg-red-600 cursor-pointer shadow">Disable account</button> */}
                    </div>
                  </div>
                ))}
              {adminData.AllUsers.filter((user) =>
                (user.username || "")
                  .toLowerCase()
                  .includes(searchUser.trim().toLowerCase())
              ).length === 0 && (
                <div className="text-gray-500 text-center py-4">No users found.</div>
              )}
            </div>
          )}
        </div>
    )
}

export default SearchUser;