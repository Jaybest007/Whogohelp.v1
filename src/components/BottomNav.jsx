// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";
import { FaHome, FaGlobe, FaHistory, FaUser } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";

export default function BottomNav() {
const {dashboardData,fetchDashboardData} = useDashboard();

  const links = [
    { to: "/dashboard", label: "Home", icon: FaHome },
    { to: "/errands",   label: "Errands", icon: FaGlobe },
    { to: "/transactions",   label: "Transactions", icon: FaHistory },
    { to: `/profile/${dashboardData?.username}`,   label: "Profile", icon: FaUser }
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-16 bg-gray-900 text-white border-t border-gray-800 shadow-inner">
      <nav className="h-full flex justify-around items-center px-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={label === "Errands" ? fetchDashboardData : undefined}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition ${
                isActive ? "text-orange-300" : "hover:text-orange-300"
              }`
            }
          >
            <Icon className="text-2xl text-orange-400" />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}

      </nav>
    </footer>
  );
}
