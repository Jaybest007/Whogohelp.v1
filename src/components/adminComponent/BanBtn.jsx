import React from "react";
import {useAdmin} from "../../context/AdminContext";
import { FaBan } from "react-icons/fa";

const BanBtn = ({ username, className = "" }) => {
  const { take_action } = useAdmin();

  const handleBan = () => take_action(username, "banned");

  return (
    <button
      onClick={handleBan}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition ${className}`}
    >
      <FaBan size={14} />
      Ban User
    </button>
  );
};

export default BanBtn;
