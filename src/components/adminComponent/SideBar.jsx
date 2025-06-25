import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserTie, FaTasks, FaUsers, FaWallet, FaCog, FaPowerOff, FaTimes } from "react-icons/fa";

const SideBar = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <div>
            <aside
                className={`
        fixed top-0 left-0 h-full w-64 bg-neutral-800 text-white p-6 space-y-6 z-30
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-200 ease-in-out
        md:static md:translate-x-0 md:block
      `}
            >
                {/* Close button for mobile */}
                <button
                    className="md:hidden absolute top-4 right-4 text-white"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <FaTimes size={22} />
                </button>
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                <nav className="space-y-4">
                    <Link
                        to="/admin"
                        className={`flex items-center space-x-2 hover:text-neutral-200 px-2 py-1 rounded ${location.pathname === "/admin" ? "bg-neutral-700 text-orange-400" : ""}`}
                    >
                        <FaUserTie size={20} /> <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/errand"
                        className={`flex items-center space-x-2 hover:text-neutral-200 px-2 py-1 rounded ${location.pathname === "/admin/errand" ? "bg-neutral-700 text-orange-400" : ""}`}
                    >
                        <FaTasks size={20} /> <span>Errands</span>
                    </Link>
                    <Link
                        to="/admin/user"
                        className={`flex items-center space-x-2 hover:text-neutral-200 px-2 py-1 rounded ${location.pathname === "/admin/user" ? "bg-neutral-700 text-orange-400" : ""}`}
                    >
                        <FaUsers size={20} /> <span>Users</span>
                    </Link>
                    <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
                        <FaWallet size={20} /> <span>Wallet</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 hover:text-neutral-200">
                        <FaCog size={20} /> <span>Settings</span>
                    </a>
                    <Link
                        to="/logout"
                        className={`flex items-center space-x-2 hover:text-neutral-200 px-2 py-1 rounded ${location.pathname === "/logout" ? "bg-neutral-700 text-orange-400" : ""}`}
                    >
                      <FaPowerOff size={20} /> <span>Logout</span>
                    </Link>
                </nav>
            </aside>
        </div>
    );
};

export default SideBar;