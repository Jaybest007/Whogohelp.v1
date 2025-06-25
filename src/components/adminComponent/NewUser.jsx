import React from "react";
import { useAdmin } from "../../context/AdminContext";

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
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 overflow-x-auto">
            <h2 className="text-orange-600 text-xl font-semibold mb-4">New users:</h2>
            <table className="w-full border-collapse text-sm sm:text-base ">
                <thead>
                    <tr className="bg-orange-200 text-neutral-800">
                        <th className="p-2 sm:p-3 text-left ">Username</th>
                        <th className="p-2 sm:p-3 text-left">Full name</th>
                        <th className="p-2 sm:p-3 text-left">Phone</th>
                        <th className="p-2 sm:p-3 text-left">Email</th>
                        <th className="p-2 sm:p-3 text-left">Location</th>
                        <th className="p-2 sm:p-3 text-left">Joined</th>
                        <th className="p-2 sm:p-3 text-left">Last seen</th>
                    </tr>
                </thead>
                <tbody>
                    {recentUsers.map((user, index) => (
                        <tr className="border-b " key={index}>
                            <td className="p-2 sm:p-3">{user.username}</td>
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
                        </tr>
                    ))}
                </tbody>
                {recentUsers.length === 0 && (
                    <tfoot>
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-gray-500">
                                No users joined in the last 24 hours.
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default NewUser;