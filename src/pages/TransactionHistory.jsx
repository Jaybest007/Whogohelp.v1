// src/pages/TransactionHistory.jsx
import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import axios from "axios";
import { useDashboard } from "../context/DashboardContext";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import HistorySkeleton from "../components/HistorySkeleton";

function TransactionHistory() {
   useEffect( ()=> {
          document.title = "Transactions - WhoGoHelp";
      }, []);


  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const { walletActionMode, setWalletActionMode, refreshWalletBalance, refreshNotifications } = useDashboard();
  const navigate = useNavigate();


  const [topUpData, setTopUpData] = useState({
    amount: "",
    method: "",
  });

  const [withdrawalData, setWithdrawalData] = useState({
    withdrawalAmount: "",
    bank: "",
    accountNumber: "",
    accountName: "",
  })

  const [error, setError] = useState({
    amount: "",
    method: "",
    withdrawalAmount: "",
    bank: "",
    accountNumber: "",
    accountName: "",
  });

  // to format my inout field
  function formatNumberForDisplay(value) {
  if (!value) return ""; // Preserve empty input
  return Number(value.replace(/\D/g, "")).toLocaleString(); // Add commas only for display
}


// =====HANDLE TOP UP =====
  const handleTopUpSubmit = (event) => {
    event.preventDefault();


    const { amount, method } = topUpData;

    // Check if inputs are empty
    const newError = {
      amount: amount.trim()
        ? Number(amount) >= 500 && Number(amount) <= 50000
          ? "" 
          : "Amount must be between N500 and N50,000.00"
        : "Amount can't be empty",
      
      method: method.trim() ? "" : "Payment method is required",
    };

    setError(newError);

    const hasError = Object.values(newError).some((e) => e.length > 0); //  Fixed validation logic
    if (hasError) {
      return;
    }

        axios.post("http://localhost/api//transaction_history.php?action=topup", 
          {amount, method},
          { withCredentials: true,
            headers: {"Content-Type": "application/json" },
           }
        )
        .then((res) => {
          if(res.data.success){
            // alert("Wallet top-up successful!");
            // setWalletActionMode(null);
            navigate("/success-preview", {state: {transactionData: topUpData}})
            refreshWalletBalance();
            refreshNotifications();
          }else{
            alert(res.data.message || "Top-up failed.");
          }
        })
        .catch((err)=>{
          console.error("Top-up error:", err);
          alert("An error occurred while processing the top-up.");
        })
  };

  const handleWithdrawalSubmit = (event) => {
    event.preventDefault();

    const { withdrawalAmount, bank, accountNumber, accountName } = withdrawalData;

    // Validate Inputs
    const newError = {
      withdrawalAmount: withdrawalAmount.trim()
        ? Number(withdrawalAmount) >= 1000 && Number(withdrawalAmount) <= 50000
          ? "" 
          : "Amount must be between N100 and N50,000.00"
        : "Amount can't be empty",
      bank: bank.trim() ? "" : "Pls input your bank",
      accountNumber:
        accountNumber.trim().length !== 10
          ? "Account number must be 10 digits"
          : "",
      accountName: accountName.trim() ? "" : "Pls input your Account name",
    };

    setError(newError);

    const hasError = Object.values(newError).some((e) => e.length > 0);
    if (hasError) return;

    // Convert Amount to Number and check
    const formattedAmount = parseFloat(withdrawalAmount);
    if (isNaN(formattedAmount) || formattedAmount <= 0) {
      alert("Invalid withdrawal amount");
      return;
  }

  axios
    .post(
      "http://localhost/api//transaction_history.php?action=withdraw",
      { withdrawalAmount: formattedAmount, bank, accountNumber, accountName },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      if (res.data.success) {
        // alert(res.data.message);
        // setWalletActionMode(null);
        navigate("/success-preview", {state: {withdrawal: withdrawalData}})
        refreshWalletBalance();
        refreshNotifications();
      } else {
        alert(res.data.message + " Withdrawal failed.");
      }
    })
    .catch((err) => {
      console.error("Withdrawal error:", err);
      alert("An error occurred while processing the withdrawal.");
    });
};



  // Fetch transactions correctly on mount
  useEffect(() => {
    axios
      .post(
        "http://localhost/api//transaction_history.php?action=fetchAllTransactions",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        setTransactions(res.data.transactions || []);
        setError({});
      })
      .catch(() => setError({ general: "Could not load transactions." }))
      .finally(() => setLoading(false));
  }, []);

  //  Filter + search helper
  const displayed = transactions
    .filter((t) =>
      filterType === "all" ? true : t.type.toLowerCase() === filterType
    )
    .filter((t) =>
      search.trim()
        ? t.errand_Id?.toLowerCase().includes(search.trim().toLowerCase())
        : true
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-orange-100 text-gray-800 pb-24 px-4 pt-20">
      
      {/* ===TOP UP=== */}
      {walletActionMode === "topup" && (
        <div className="max-w-md mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-orange-400 text-center">Top Up Wallet</h2>
          <form onSubmit={handleTopUpSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-300" htmlFor="amount">Amount (₦) </label>
              <input
              id="amount"
              name="amount"
              type="text"
              maxLength={10}
              value={formatNumberForDisplay(topUpData.amount)}
              placeholder="e.g. 1,000"
              onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              if (rawValue.length <= 10) {
                setTopUpData({ ...topUpData, amount: rawValue }); // Store raw number (no commas)
              }

              // Ensure proper validation after input
              const amountNum = Number(rawValue);
              if (amountNum < 500) {
                setError({ ...error, amount: "Minimum deposit is N500.00" });
              } else if (amountNum > 50000) {
                setError({ ...error, amount: "Maximum deposit is N50,000.00" });
              } else {
                setError({ ...error, amount: "" });
              }
            }}

              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
              {error.amount && (<span className="text-red-300">{error.amount}</span>)}
            </div>

            <div className="space-y-2 mt-5">
              <label className="text-sm text-gray-300" htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="method"
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setTopUpData({ ...topUpData, method: e.target.value })}
              >
                <option value="">Select method</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Card Payment</option>
              </select>
              {error.method && (<span className="text-red-300">{error.method}</span>)}
            </div>

            <button className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">
              Proceed to Pay
            </button>
          </form>
    
        </div>
      )}
      

      {/* Withdraw Page */}
      {walletActionMode === "withdraw" && (
        <div className="max-w-md mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-orange-400 text-center">Withdraw Funds</h2>
          <form onSubmit={handleWithdrawalSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-gray-300" htmlFor="bankDetails">Bank Name</label>
            <input
              id="bank"
              name="bank"
              type="text"
              placeholder="e.g. GTBank, UnionBank, Opay "
              onChange={(e) => setWithdrawalData({ ...withdrawalData, bank: e.target.value })}
              className="w-full  p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error.bank && (<span className="text-red-300">{error.bank}</span>) }
          </div>

          <div className="space-y-2 mt-3">
            <label className="text-sm text-gray-300" htmlFor="bankDetails">Account Number </label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              maxLength={10}
              value={withdrawalData.accountNumber}
              placeholder="e.g. 1234567890"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric
                if (value.length <= 10) {
                  setWithdrawalData({ ...withdrawalData, accountNumber: value });
                }else{
                  setError({ ...withdrawalData, accountNumber: "" });
                }
                if (value.length < 10){
                  setError({...error, accountNumber: "Invalid account number"})
                }else{
                  setError({...error, accountNumber: ""})
                }
              }}
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error.accountNumber && (<span className="text-red-300">{error.accountNumber}</span>)}
          </div>

          <div className="space-y-2 mt-3">
            <label className="text-sm text-gray-300" htmlFor="bankDetails">Account Name</label>
            <input
              id="accountName"
              name="accountName"
              type="text"
              placeholder="John Doe "
              onChange={(e) => setWithdrawalData({ ...withdrawalData, accountName: e.target.value })}
              className="w-full p-3  rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error.accountName && (<span className="text-red-300">{error.accountName}</span>)}
          </div>

          <div className="space-y-2 mt-3">
            <label className="text-sm text-gray-300" htmlFor="withdrawAmount">Amount (₦)</label>
            <input
              id="withdrawAmount"
              type="text"
              name="withdrawalAmount"
              placeholder="Enter amount"
              maxLength={10}
              value={formatNumberForDisplay(withdrawalData.withdrawalAmount)}
              onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              if (rawValue.length <= 10) {
                setWithdrawalData({ ...withdrawalData, withdrawalAmount: rawValue }); // Store raw number (no commas)
              }

              // Ensure proper validation after input
              const amountNum = Number(rawValue);
              if (amountNum < 500) {
                setError({ ...error, withdrawalAmount: "Minimum Withdrawal is N1,000.00" });
              } else if (amountNum > 50000) {
                setError({ ...error, withdrawalAmount: "Maximum withdral is N50,000.00" });
              } else {
                setError({ ...error, withdrawalAmount: "" });
              }
            }}
              className="w-full p-3  rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error.withdrawalAmount && (<span className="text-red-300">{error.withdrawalAmount}</span>)}
          </div>

          <button className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">
            Withdraw
          </button>
          </form>
          
          
        </div>
      )}



      {/* Transaction History */}
      {!walletActionMode && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-orange-600">Transaction History</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-orange-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-orange-400"
              >
                <option value="all">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                <option value="reversal">Reversal</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium text-gray-700">Search by Errand ID</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g., ERD-123456"
                className="bg-white border border-orange-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <h2 className="text-lg font-semibold text-orange-500 mb-2">Transactions (Latest 10)</h2>

            {loading && (<HistorySkeleton/> )}
            {error.general && <p className="text-red-500">{error.general}</p>}
            {!loading && !error.general && displayed.length === 0 && (
              <p className="text-gray-500 italic">No transactions found.</p>
            )}

            <ul className="space-y-4">
              {displayed.slice(0, 10).map((t, idx) => (
                <li key={idx} className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-400">
                  <p className="text-sm font-medium text-gray-800">💬 {t.description}</p>
                  <p className="text-sm text-gray-600">💵 Amount: ₦{Number(t.amount).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 capitalize">🔁 Type: {t.type}</p>
                  <p className="text-sm text-gray-600">🕒 {t.created_at}</p>
                  <p className="text-sm text-gray-600">🆔 {t.transaction_id}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <BottomNav />
      
    </div>
  );
}

export default TransactionHistory;
