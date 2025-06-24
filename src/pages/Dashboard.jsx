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


const Dashboard = () => {

   useEffect( ()=> {
            document.title = "Dashboard - WhoGoHelp";
        }, []);




  const { dashboardData, refreshDashboardData, notifications, refreshNotifications, refreshWalletBalance , loading } = useDashboard();
  const [post, setPost] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


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
  
  return (
      <>
    {loading ? (
     
      <DasboardSkeleton/>

    ) : (
       
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-black via-gray-700 to-gray-600 text-white">        
          <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 pb-32 space-y-8">
            <WelcomeHeader username={dashboardData?.username} />
            <Wallet wallet={dashboardData?.walletBalance?.balance} />
            
            {successMessage && (
              <div className="text-green-300 font-semibold bg-green-900 p-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <span className="text-sm text-gray-300">Ready to run or get help with an errand?</span>
            <ActionCards post={post} setPost={setPost} />

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