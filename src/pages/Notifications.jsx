import React, { useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import axios from "axios";


const Notifications = () => {
  const { notifications, refreshNotifications } = useDashboard();

  //  Correctly filter unread notifications
  const unreadNotifications = notifications?.filter(notification => notification.is_read === "false") || [];

useEffect(() => {
  if (unreadNotifications.length > 0) {
    const timeoutId = setTimeout(() => {
      axios.post(
        "http://localhost/api//notifications.php",
        { action: "markasread" },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch(err => console.log("Failed to mark notifications as read:", err));
    }, 500); 

   
    return () => clearTimeout(timeoutId);
  }
}, [unreadNotifications]);


  return (
    <div className="mt-20 px-4 sm:px-6 lg:px-8">
      
    <ul className="grid gap-3 max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4">Notifications</h1>

        {unreadNotifications.length === 0 ? (
          <p className="text-gray-300 text-sm">No unread notifications found.</p>
        ) : (
          unreadNotifications.map((notification) => (
            <li
              key={notification.id}
              className="bg-gray-900 border border-orange-500 rounded-lg p-3 sm:p-4 text-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <span className="text-sm text-gray-400">
                  📅 Date: <span className="text-white">{notification.created_at}</span>
                </span>
                <span className="text-sm text-gray-400">
                  🔔 Type: <span className="text-orange-400">{notification.type}</span>
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-300">{notification.message}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notifications;