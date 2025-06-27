import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaPowerOff,
  FaBell,
  FaTachometerAlt,
  FaTasks,
  FaEnvelope,
  FaMoneyCheckAlt,
  FaUser,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import { FiSettings } from "react-icons/fi";

export default function Navbar() {
  const { dashboardData, notifications, unreadCount } = useDashboard();
  const [menuOpen, setMenuOpen] = useState(false);

  // Consider user logged in if dashboardData contains a valid username
  const loggedIn = !!dashboardData?.username;


  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const desktopLinks = loggedIn
    ? [
        { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
        { to: "/errands", label: "Errands", icon: <FaTasks /> },
        { to: "/transactions", label: "Transactions", icon: <FaMoneyCheckAlt /> },
        { to: `/profile/${dashboardData?.username}`, label: "Profile", icon: <FaUser /> },
        { to: "/contact", label: "Contact Us", icon: <FaEnvelope /> },
        { to: "/settings", label: "Settings", icon: <FiSettings /> }
      ]
    : [
        { to: "/login", label: "Login", icon: <FaSignInAlt /> },
        { to: "/signup", label: "Sign Up", icon: <FaUserPlus /> },
        { to: "/about", label: "About Us", icon: <FaInfoCircle /> },
        { to: "/contact", label: "Contact Us", icon: <FaEnvelope /> }
      ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 bg-orange-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4">
        <Link to="/" className="text-2xl font-bold hover:bg-orange-600 px-2 py-1 rounded transition">
          WhoGoHelp
        </Link>

        <ul className="hidden md:flex justify-center space-x-6">
          {desktopLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded transition ${
                    isActive ? "bg-orange-700" : "hover:bg-orange-600"
                  }`
                }
              >
                {icon && <span>{icon}</span>}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-2">
          {loggedIn && (
            <>
              <Link to="/notification" className="relative p-2 hover:bg-orange-600 rounded transition">
                <FaBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/logout"
                className="hidden md:inline-block p-2 hover:bg-orange-600 rounded transition"
              >
                <FaPowerOff size={20} />
              </Link>
            </>
          )}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <ul className="md:hidden flex flex-col bg-orange-500 px-4 pb-4 space-y-2 shadow-lg">
          {desktopLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="block p-2 rounded hover:bg-orange-600 transition"
                onClick={toggleMenu}
              >
                {label}
              </Link>
            </li>
          ))}

          {loggedIn && (
            <>
              <li>
                <Link
                  to="/notification"
                  className="relative block p-2 hover:bg-orange-600 rounded transition"
                  onClick={toggleMenu}
                >
                  <FaBell size={20} className="inline mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-2 text-xs font-bold bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="block p-2 rounded hover:bg-orange-600 transition"
                  onClick={toggleMenu}
                >
                  <FaPowerOff size={20} className="inline mr-2" />
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
