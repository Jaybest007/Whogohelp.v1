import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import WelcomeHeader from '../components/WelcomeHeader';
import ActionCards from '../components/ActionCards';
import OngoingErrands from '../components/OngoingErrands';
import AwaitingConfirmationErrands from '../components/AwaitingConfirmationErrands';
import ErrandHistory from '../components/ErrandHistory';
import PostErrand from '../components/PostErrand';
import BottomNav from '../components/BottomNav';
import Wallet from '../components/Wallet';
import DasboardSkeleton from '../components/DashboardSkeleton';
import MaintainanceMode from '../components/MaintainanceMode'; 
import StarRating from '../components/StarRating'; // Assuming you have a StarRating component
const Dashboard = () => {

   useEffect( ()=> {
            document.title = "Dashboard - WhoGoHelp";
        }, []);




  const { dashboardData, refreshDashboardData, notifications, refreshNotifications, refreshWalletBalance , loading, adminSettings, rateUser, setRateUser } = useDashboard();
  const [post, setPost] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
 const [rating, setRating] = useState(0);

  const handlePostSuccess = () => {
  setPost(false); // Hide post form
  setSuccessMessage('Errand posted successfully!');

  // Trigger only wallet refresh after 1 second
  setTimeout(() => {
    refreshWalletBalance();
  }, 1000);

  // Clear message after 4 seconds
  setTimeout(() => {
    setSuccessMessage('');
  }, 4000);
  };


  // Show maintenance mode if enabled
  if (adminSettings?.maintenance_mode && Number(adminSettings.maintenance_mode) !== 0) {
    return <MaintainanceMode />;
  }

  return (
      <>
    {loading ? (
     
      <DasboardSkeleton/>

    ) : (
       
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-black via-gray-700 to-gray-600 text-white">        
          <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 pb-32 space-y-8">
            <WelcomeHeader username={dashboardData?.username} />

            {/* Announcement banner */}
            {adminSettings?.announcement.trim() !== "" && (
              <div className="relative mb-6 px-6 py-4 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-800 rounded-xl shadow-lg overflow-hidden border border-blue-700">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-yellow-400 text-yellow-900 rounded-full shadow-md animate-bounce">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-white leading-snug tracking-wide">
                      {adminSettings.announcement}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-300 rounded-bl-full blur-xl opacity-20 pointer-events-none"></div>
              </div>
            )}

            {/* Wallet Balance */}
            <Wallet wallet={dashboardData?.walletBalance?.balance} triggerWalletRefresh={refreshWalletBalance} />
            
            {/* success message */}
            {successMessage && (
              <div className="text-green-300 font-semibold bg-green-900 p-3 rounded-lg">
                {successMessage}
              </div>
            )}
            {/* Action Cards */}
            <span className="text-sm text-gray-300">Ready to run or get help with an errand?</span>
            <ActionCards post={post} setPost={setPost} />
          
          {/* this to rate user */}
          {/* ==========start======= */}
          {rateUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-white">Rate User</h3>
                <StarRating
                  value={rating}
                  onChange={(star) => setRating(star)}
                />
                <button
                  className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  onClick={() => setRateUser(rating)}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          {/* ==========end======= */}


          {/* Errands Section */}
            {post ? (
              <PostErrand onSuccess={handlePostSuccess} />
            ) : (
              <>

                {dashboardData?.awaiting_confirmations?.length > 0 && (<AwaitingConfirmationErrands triggerRefresh={refreshDashboardData}  triggerNotificationRefresh={refreshNotifications} errands={dashboardData?.awaiting_confirmations} />)} 
                <OngoingErrands triggerWalletRefresh={refreshDashboardData} triggerNotificationRefresh={refreshNotifications} errands={dashboardData?.ongoingErrands} />
                <ErrandHistory errands={dashboardData?.completedErrands}  />
              </>
            )}
          </div>

          <div className="fixed bottom-0 left-0 w-full z-50 shadow-t-lg">
            <BottomNav/>
          </div>
        </div>
    
      )}
          </>
  );
};

export default Dashboard;