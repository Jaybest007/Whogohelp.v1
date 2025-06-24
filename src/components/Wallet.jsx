import React, { useEffect, useState, useRef } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsCashCoin } from "react-icons/bs";
import { FaEye, FaEyeSlash, FaReceipt } from 'react-icons/fa';
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Wallet({ wallet }) {
  const [hidden, setHidden] = useState(false);
  const {walletActionMode, setWalletActionMode} = useDashboard();
  const navigate = useNavigate();
  const userInteracted = useRef(false); //  Track user click

  useEffect(() => {
    if (!userInteracted.current) return; 
    if (walletActionMode) { 
    navigate("/transactions");
  }
  }, [walletActionMode, navigate]);

  const handleActionClick = (action) => {
    userInteracted.current = true;
    setWalletActionMode(action);
  };


  return (
    <div className='w-full p-2 mb-5 bg-gradient-to-r from-orange-400 to-orange-300 border border-orange-200 text-white rounded-lg'>
      <span className='text-md pl-2'>
        Reward balance:
        {!hidden ? (
          <FaEye aria-label='Show Balance' className='inline text-md ml-1 cursor-pointer' onClick={() => setHidden(true)} />
        ) : (
          <FaEyeSlash aria-label='Hide Balance' className='inline text-md ml-1 cursor-pointer' onClick={() => setHidden(false)} />
        )}
      </span>

      <input
        type={hidden ? 'password' : 'text'}
        className='font-bold text-4xl pl-2 pb-2 md:block bg-transparent text-white'
        disabled
        value={wallet != null
          ? "₦" + Number(wallet).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "Loading..."}
      />

    <div className="mt-2  mb-1 flex flex-wrap gap-3">
        <button 
          className="flex items-center justify-center gap-1 text-sm font-bold px-4 py-2 bg-orange-300 rounded-2xl hover:bg-orange-400 shadow-lg outline-1 flex-shrink-0"
          onClick={() => handleActionClick("topup")}
        >
          Add Funds 
          <BsCashCoin size={18}/> 
        </button>

        <button 
          className="flex items-center justify-center gap-1 text-sm font-bold px-4 py-2 bg-orange-300 rounded-2xl hover:bg-orange-400 shadow-lg outline-1 flex-shrink-0"
          onClick={() => handleActionClick("withdraw")}
        >
          Withdraw  
          <BiMoneyWithdraw size={18}/> 
        </button>

        <Link to={"/transactions"}>
        <button 
          className="flex items-center justify-center gap-1 text-sm font-bold px-4 py-2 bg-orange-300 rounded-2xl hover:bg-orange-400 shadow-lg outline-1 flex-shrink-0"
        >
          
          History  
          <FaReceipt size={18}/>
          
        </button>
        </Link> 
      </div>
    </div>
  );
}

export default Wallet;