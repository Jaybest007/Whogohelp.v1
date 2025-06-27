import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserTie,
  FaTasks,
  FaUsers,
  FaWallet,
  FaCog,
  FaPowerOff,
  FaBars,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";

const NavBar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/admin", icon: <FaUserTie />, label: "Dashboard" },
    { to: "/admin/errand", icon: <FaTasks />, label: "Errands" },
    { to: "/admin/user", icon: <FaUsers />, label: "Users" },
    { to: "/admin/wallet", icon: <FaWallet />, label: "Wallet" },
    { to: "/admin/messages", icon: <FaEnvelope />, label: "Messages" },
    { to: "#", icon: <FaCog />, label: "Settings" },
    { to: "/logout", icon: <FaPowerOff />, label: "Logout" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 text-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center h-auto md:h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg text-orange-400 py-4 md:py-0">
          <FaUserTie /> WhoGoHelp Admin
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                location.pathname === to
                  ? "bg-neutral-700 text-orange-400"
                  : "text-white/80 hover:text-orange-300"
              }`}
            >
              <span>{icon}</span> <span className="text-sm">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none absolute right-4 top-4"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-800 border-t border-neutral-700 w-full">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 flex items-center gap-3 transition-all ${
                location.pathname === to
                  ? "bg-neutral-700 text-orange-400"
                  : "text-white/80 hover:text-orange-300"
              }`}
            >
              <span>{icon}</span> <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default NavBar;
