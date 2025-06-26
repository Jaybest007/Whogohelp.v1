import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { FaCheckCircle } from "react-icons/fa";

const UnBanBtn = ({ username, className = "" }) => {
  const { take_action } = useAdmin();
  const handleUnban = () => take_action(username, "active");

  return (
    <button
      onClick={handleUnban}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 shadow transition ${className}`}
    >
      <FaCheckCircle size={14} />
      Unban User
    </button>
  );
};

export default UnBanBtn;
