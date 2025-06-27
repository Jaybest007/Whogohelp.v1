import React from "react";
import Navbar from "../../components/Navbar";
import NavBar from "../../components/adminComponent/NavBar";
import { useAdmin } from "../../context/AdminContext";
import { Routes, Route } from "react-router-dom";

import RefreshBtn from "../../components/adminComponent/RefreshBtn";

const Messages = () => {
  const { adminData, fetchAdminData, markMessageAsRead  } = useAdmin();

  return (
    <div className=" items-center justify-center min-h-screen bg-gray-100">
      <NavBar />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 bg-gradient-to-tr from-white via-gray-100 to-white rounded-2xl shadow-xl mt-6 border border-gray-200 overflow-x-auto">
       <RefreshBtn styling={"bg-gray-500 float-right text-white "} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 border-gray-300">
          📨 Messages
        </h1>
        
        {/* Message list */}
        <div className="space-y-4">
          {adminData?.AllMessages?.filter(message => message.marked_as_read ===  0).map((message, index) => (
            <details
              key={index}
              className="bg-white rounded-xl border border-gray-300 shadow-sm p-4"
            >
              <summary className="cursor-pointer text-sm sm:text-base font-medium text-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="truncate w-full sm:w-auto">
                  <span className="font-semibold">From:</span> {message.name}
                </span>
                <span className="mt-2 sm:mt-0 sm:ml-4 text-gray-500 text-xs sm:text-sm">
                  {message.received_on}
                </span>
              </summary>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Email:</span> {message.email}
                </p>
                <p className="whitespace-pre-wrap break-words">
                  <span className="font-semibold">Message:</span> {message.message}
                </p>

                {/* Action buttons */}
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs sm:text-sm transition"
                    onClick={() => markMessageAsRead(message.id)}
                  >
                    ✅ Mark as Read
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs sm:text-sm transition"
                    onClick={() => handleReply(message.email)}
                  >
                    ✉️ Reply
                  </button>
                </div>
              </div>
            </details>
          ))}
          {adminData?.AllMessages?.filter(message => message.marked_as_read ===  0).length === 0 && (
            <p className="text-gray-500 text-sm">No unread messages.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
