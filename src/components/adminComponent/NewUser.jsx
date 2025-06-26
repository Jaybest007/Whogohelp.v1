import React from "react";
import { useAdmin } from "../../context/AdminContext";
import BanBtn from "./BanBtn";
import UnBanBtn from "./UnBanBtn";

const NewUser = () => {
    const { adminData } = useAdmin();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUsers = adminData?.AllUsers?.filter(user => {
        let joinedAt;

        if (user.created_at.includes("T")) {
            // ISO format – parse normally
            joinedAt = new Date(user.created_at);
        } else {
            // Legacy format – convert "dd-MM-yy hh:mm:ss" to "yyyy-MM-ddTHH:mm:ss"
            const match = user.created_at.match(/^(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (match) {
                const [_, dd, MM, yy, hh, mm, ss] = match;
                const isoString = `20${yy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
                joinedAt = new Date(isoString);
            }
        }
        return joinedAt && joinedAt >= twentyFourHoursAgo;
    }) || [];

    return (
        <div className="bg-white rounded-lg border border-orange-300 shadow group overflow-hidden mt-6">
            <div className="flex items-center gap-2 px-5 py-4 bg-orange-50 text-orange-700 font-semibold text-lg group-open:rounded-t-lg">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2" />
                New Users
            </div>
            <div className="overflow-x-auto px-5 pb-5 pt-2">
                <table className="w-full border-collapse text-sm sm:text-base">
                <thead>
                    <tr className="bg-orange-200 text-orange-900 font-semibold">
                    <th className="p-2 sm:p-3 text-left">Username</th>
                    <th className="p-2 sm:p-3 text-left">Full name</th>
                    <th className="p-2 sm:p-3 text-left">Phone</th>
                    <th className="p-2 sm:p-3 text-left">Email</th>
                    <th className="p-2 sm:p-3 text-left">Location</th>
                    <th className="p-2 sm:p-3 text-left">Joined</th>
                    <th className="p-2 sm:p-3 text-left">Last seen</th>
                    <th className="p-2 sm:p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {recentUsers.map((user, index) => (
                    <tr
                        key={index}
                        className="border-b last:border-none hover:bg-orange-50 transition"
                    >
                        <td className="p-2 sm:p-3 font-medium text-gray-800">
                        {user.username}
                        </td>
                        <td className="p-2 sm:p-3">{user.full_name}</td>
                        <td className="p-2 sm:p-3">{user.phone}</td>
                        <td className="p-2 sm:p-3">{user.email}</td>
                        <td className="p-2 sm:p-3">{user.location}</td>
                        <td className="p-2 sm:p-3">
                        {(() => {
                            const d = new Date(user.created_at.replace(" ", "T"));
                            const day = d.getDate();
                            const month = d.getMonth() + 1;
                            const year = d.getFullYear();
                            const time = d.toTimeString().split(" ")[0];
                            return `${day}-${month}-${year} ${time}`;
                        })()}
                        </td>
                        <td className="p-2 sm:p-3">{user.last_seen}</td>
                        <td className="p-2 sm:p-3">
                        <div className="flex flex-wrap gap-3">
                            <BanBtn username={user.username} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow transition" />
                            <UnBanBtn username={user.username} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition" />
                        </div>
                        </td>

                    </tr>
                    ))}
                </tbody>
                {recentUsers.length === 0 && (
                    <tfoot>
                    <tr>
                        <td
                        colSpan={7}
                        className="text-center py-6 text-sm text-gray-500 font-medium"
                        >
                        No users joined in the last 24 hours.
                        </td>
                    </tr>
                    </tfoot>
                )}
                </table>
            </div>
        </div>

    );
};

export default NewUser;