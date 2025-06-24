import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessPreview() {

    const location = useLocation();
    const navigate = useNavigate();
    const transactionData = location.state?.transactionData;
    const withdrawal = location?.state?.withdrawal;

    if (!transactionData && !withdrawal) {
    return <p className="pt-20 text-center text-gray-600">Loading transaction details...</p>;
}
  return (
    <>
    
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-orange-100 flex items-center justify-center px-4">
    
    {transactionData && (
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-6 text-white space-y-6">

        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-400">
            Deposit Successful 🎉
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Your transaction has been processed successfully.
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="font-semibold text-orange-300">₦{Number(transactionData.amount).toLocaleString("en-NG", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Payment Method</span>
            <span className="text-orange-200 capitalize">{transactionData.method === "bank" ? "Bank transfer" : transactionData.method}</span>
          </div>
        </div>

        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
          onClick={()=> { navigate("/dashboard")} }
        >
          Close
        </button>
      </div>
       )}

       {/* Successful withdrawal */}
    
        {withdrawal && (
        <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-6 text-white space-y-6 mt-12">

        <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-400">
            Withdrawal Successful ✅
            </h2>
            <p className="text-sm text-gray-300 mt-1">
            Your funds have been sent to your bank account.
            </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow space-y-4">
            

            <div className="flex justify-between  border-gray-700 pt-2">
                <span className="text-gray-400 font-semibold">Bank Name:</span>
                <span className="font-semibold text-orange-300 text-lg">{withdrawal.bank}</span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-2">
                <span className="text-gray-400 font-semibold">Account Number:</span>
                <span className="font-semibold text-orange-300 text-lg">{withdrawal.accountNumber}</span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-2">
                <span className="text-gray-400 font-semibold">Account Name:</span>
                <span className="font-semibold text-orange-300 text-lg">{withdrawal.accountName}</span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-2">
                <span className="text-gray-400 font-semibold">Amount</span>
                <span className="font-semibold text-orange-300 text-lg">₦{Number(withdrawal.withdrawalAmount).toLocaleString("en-NG", {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
        </div>

        <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
            onClick={()=> { navigate("/dashboard")} }
        >
            Close
        </button>
        </div>
        )}
 

    </div>
   
    

    


    </>
  );
}

export default SuccessPreview;
