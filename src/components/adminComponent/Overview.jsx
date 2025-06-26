import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaWallet,
  FaTasks,
  FaBan
} from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { useAdmin } from "../../context/AdminContext";
import StatCard from "./StatCard";

const Overview = () => {
  const { adminData } = useAdmin();

  const allUsers = adminData?.AllUsers ?? [];
  const activeUsers = allUsers.filter((user) => {
    const lastSeen = new Date(user.last_seen).getTime();
    return Date.now() - lastSeen < 24 * 60 * 60 * 1000;
  }).length;

  const walletRevenue = (adminData?.wallet ?? []).reduce(
    (sum, w) => sum + parseFloat(w.balance || 0),
    0
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Users"
          icon={<FaUsers size={22} />}
          value={allUsers.length}
          bgFrom="from-orange-100"
          bgTo="to-orange-200"
          iconBg="bg-orange-500"
          textColor="text-orange-600"
        />
        <StatCard
          title="Active"
          icon={<FaUserTie size={22} />}
          value={activeUsers}
          bgFrom="from-green-100"
          bgTo="to-green-200"
          iconBg="bg-green-500"
          textColor="text-green-600"
        />
        <StatCard
          title="Revenue"
          icon={<FaWallet size={22} />}
          value={walletRevenue.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
          })}
          bgFrom="from-yellow-100"
          bgTo="to-yellow-200"
          iconBg="bg-yellow-500"
          textColor="text-yellow-600"
        />
        <StatCard
          title="Pending"
          icon={<FaTasks size={22} />}
          value={adminData?.pendingErrands?.length ?? 0}
          bgFrom="from-blue-100"
          bgTo="to-blue-200"
          iconBg="bg-blue-500"
          textColor="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Ongoing"
          icon={<FaTasks size={22} />}
          value={adminData?.ongoingErrands?.length ?? 0}
          bgFrom="from-purple-100"
          bgTo="to-purple-200"
          iconBg="bg-purple-500"
          textColor="text-purple-600"
        />
        <StatCard
          title="Completed"
          icon={<FaTasks size={22} />}
          value={adminData?.completedErrands?.length ?? 0}
          bgFrom="from-green-100"
          bgTo="to-green-200"
          iconBg="bg-green-600"
          textColor="text-green-700"
        />
        <StatCard
          title="Rejected"
          icon={<FaBan size={22} />}
          value={adminData?.rejectedByPoster?.length ?? 0}
          bgFrom="from-red-100"
          bgTo="to-red-200"
          iconBg="bg-red-500"
          textColor="text-red-600"
        />
        <StatCard
          title="Chats"
          icon={<IoChatboxEllipses size={22} />}
          value={adminData?.AllChat?.length ?? 0}
          bgFrom="from-indigo-100"
          bgTo="to-indigo-200"
          iconBg="bg-indigo-500"
          textColor="text-indigo-600"
        />
      </div>
    </div>
  );
};

export default Overview;
