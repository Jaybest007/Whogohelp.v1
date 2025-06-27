import React from "react";
import NavBar from "../../components/adminComponent/NavBar";
import { useAdmin } from "../../context/AdminContext";
import StatCard from "../../components/adminComponent/StatCard";
import { FaReceipt, FaWallet } from "react-icons/fa";
import RefreshBtn from "../../components/adminComponent/RefreshBtn";


const Wallet = () => { 
    const { adminData } = useAdmin();
    const walletRevenue = (adminData?.wallet ?? []).reduce(
    (sum, w) => sum + parseFloat(w.balance || 0),
    0
  );
    const todaysTransactions = (adminData?.transaction_history ?? []).reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount || 0),
        0
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 bg-gradient-to-tr from-white via-gray-100 to-white rounded-2xl shadow-xl mt-6 border border-gray-200 overflow-x-auto">
                    <RefreshBtn styling={"bg-gray-100 border border-gray-200 float-right text-gray-600 hover:bg-gray-300 "} />
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 border-gray-300">
                💰 Wallet
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
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
                    title="Transactions"
                    icon={<FaReceipt size={22} />}
                    value={todaysTransactions.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0
                    })}
                    bgFrom="from-green-100"
                    bgTo="to-green-200"
                    iconBg="bg-green-500"
                    textColor="text-green-600"
                />
                </div>
                <div className="mt-10 lg:text-2xl md:xl sm:text-lg font-bold mb-2 ">
                    <h2>Transaction History:</h2>
                </div>
                
        <table className="w-full text-sm  text-left text-gray-300 border border-gray-700 rounded-xl overflow-hidden shadow-md">
            <thead className="bg-[#111827] text-orange-400 uppercase text-xs ">
                <tr>
                <th className="px-4 py-3">Tx ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Errand</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
                </tr>
            </thead>
            <tbody className="bg-[#1f2937] divide-y divide-gray-700">
                {adminData?.transaction_history?.map((transaction, index) => (
                <tr key={index}>
                <td className="px-4 py-3 font-mono text-orange-300">{transaction.transaction_id}</td>
                <td className="px-4 py-3">{transaction.username}</td>
                <td className="px-4 py-3">{transaction.errand_Id}</td>
                <td className="px-4 py-3 capitalize">{transaction.type}</td>
                <td
                  className={`px-4 py-3 ${
                    transaction.type === "debit"
                      ? "text-red-400"
                      : transaction.type === "credit"
                      ? "text-lime-400"
                      : transaction.type === "reversal"
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  {Number(transaction.amount).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 text-gray-400">{transaction.description}</td>
                <td className="px-4 py-3 text-gray-500 text-sm">{transaction.created_at}</td>
                <td className="px-4 py-3">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded transition">
                    Reverse
                    </button>
                </td>
                </tr>
                ))}
            </tbody>
        </table>

            </div>
        </div>
    );
}

export default Wallet;