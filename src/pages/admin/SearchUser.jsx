import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";




const SearchUser = () => {

    const {adminData} = useAdmin();
    const [searchUser, setSearchUser] = useState("")


    return (
        <div>
            <input
            type="text"
            placeholder="Search User..."
            className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/3 text-base"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            />
        <span onClick={()=> setSearchUser("")} className="font-bold text-2xl bg-neutral-600 text-white px-5 py-3 ml-2 rounded-lg hover:bg-neutral-500 cursor-pointer ">x</span>

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
                    className="border-l-4 border-blue-400 bg-blue-50 rounded-lg mb-4 p-4 shadow flex flex-col gap-2 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-wrap gap-4 items-center mb-2">
                      <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        Username: {user.username}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {user.full_name}
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