
import React from "react";

const StatCard = ({ icon, title, value, bgFrom, bgTo, iconBg, textColor }) => (
  <div
    className={`bg-gradient-to-tr ${bgFrom} ${bgTo} rounded-lg shadow flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200 min-w-[100px] min-h-[100px]`}
  >
    <div className={`${iconBg} text-white rounded-full p-3 mb-2 shadow`}>
      {icon}
    </div>
    <h2 className="text-base font-semibold text-gray-700 mb-1">{title}</h2>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
  </div>
);

export default StatCard;
