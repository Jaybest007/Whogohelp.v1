import React from "react";
import Navbar from "../../components/Navbar";
import NavBar from "../../components/adminComponent/NavBar";
import { useAdmin } from "../../context/AdminContext";
import { Routes, Route } from "react-router-dom";

import RefreshBtn from "../../components/adminComponent/RefreshBtn";

const Messages = () => {
  const { adminData, fetchAdminData } = useAdmin();

  return (
    <div className=" items-center justify-center min-h-screen bg-gray-100">
      <NavBar />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 bg-gradient-to-tr from-white via-gray-100 to-white rounded-2xl shadow-xl mt-6 border border-gray-200 overflow-x-auto">
       <RefreshBtn styling={"bg-gray-500 float-right text-white "} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 border-gray-300">
          📨 Messages
        </h1>
        

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 text-sm text-gray-700 font-semibold uppercase tracking-wide mb-4">
          <p className="col-span-2 bg-gray-100 px-3 py-2 rounded">Title</p>
          <p className="col-span-3 bg-gray-100 px-3 py-2 rounded">Email</p>
          <p className="col-span-5 bg-gray-100 px-3 py-2 rounded">Message</p>
          <p className="col-span-2 bg-gray-100 px-3 py-2 rounded">Date</p>
        </div>

        {/* Message list */}
        <div className="space-y-4">
          {adminData?.AllMessages?.map((message, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 text-sm text-gray-800"
            >
              {/* Mobile layout */}
              <div className="sm:hidden bg-white p-4 rounded border space-y-2">
                <div>
                  <span className="font-semibold">Title: </span>
                  <span className="block break-words">{message.name}</span>
                </div>
                <div>
                  <span className="font-semibold">Email: </span>
                  <span className="block break-words">{message.email}</span>
                </div>
                <div>
                  <span className="font-semibold">Message: </span>
                  <span className="block whitespace-pre-wrap break-words">{message.message}</span>
                </div>
                <div>
                  <span className="font-semibold">Date: </span>
                  <span>{message.received_on}</span>
                </div>
              </div>

              {/* Desktop layout */}
              <p className="hidden sm:block col-span-2 bg-white px-3 py-2 rounded border truncate">{message.name}</p>
              <p className="hidden sm:block col-span-3 bg-white px-3 py-2 rounded border truncate">{message.email}</p>
              <p className="hidden sm:block col-span-5 bg-white px-3 py-2 rounded border whitespace-pre-wrap break-words">{message.message}</p>
              <p className="hidden sm:block col-span-2 bg-white px-3 py-2 rounded border">{message.received_on}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
