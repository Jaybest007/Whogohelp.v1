import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import CountdownTimer from './CountdownTimer';
import { IoChatboxEllipses } from 'react-icons/io5';
import { TiWarning } from 'react-icons/ti';

const ErrandDetailModal = ({
  errand,
  onClose,
  onAccept,
  onCompleted,
  onConfirming,
  onReject,
  onCancel,
  loading,
  triggerRefresh,
  triggerNotificationRefresh,
  actionType,
}) => {
  const { dashboardData, fetchChat, chat } = useDashboard();
  const [rejection, setRejection] = useState(false);
  const [reason, setReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const LoggedInUser = dashboardData?.username;

  useEffect(() => {
    if (errand?.errand_Id) {
      fetchChat(errand.errand_Id);
    }
  }, [errand]);

  if (!errand) return null;

  const handleCancel = async () => {
    if (!loading) {
      await onCancel(errand.errand_Id);
      setShowCancelConfirm(false);
      await triggerRefresh?.();
      await triggerNotificationRefresh?.();
    }
  };

  const handleComplete = async () => {
    if (!loading) {
      await onConfirming(errand.errand_Id);
      setShowConfirm(false);
      await triggerRefresh?.();
      await triggerNotificationRefresh?.();
    }
  };

  const handleReject = async () => {
    if (!loading && reason.trim()) {
      await onReject(errand.errand_Id, reason.trim());
      await triggerRefresh?.();
      await triggerNotificationRefresh?.();
    }
  };

  const handleAccept = async () => {
    if (!loading) {
      await onAccept(errand.errand_Id);
      await triggerRefresh?.();
      await triggerNotificationRefresh?.();
    }
  };

  const handleMarkComplete = async () => {
    if (!loading) {
      await onCompleted(errand.errand_Id);
      await triggerRefresh?.();
      await triggerNotificationRefresh?.();
    }
  };
 


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
      {/* this a pop confirmation div */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-gray-800">
            <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-center text-orange-600 mb-4">
              <TiWarning size={27} className="text-red-500" />
              Confirm Cancellation
            </h2>
            <p className="mb-5">Are you sure you want to cancel this errand? This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                No, Go Back
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* a pop confirmation page */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-gray-800">
            <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-center text-green-600 mb-4">
              <TiWarning size={27} className="text-green-500" />
              Confirm Completion
            </h2>
            <p className="mb-5">Are you sure you want to complete this errand? This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                No, Go Back
              </button>
              <button
                onClick={handleComplete}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                Yes, Compelete
              </button>
            </div>
          </div>
        </div>
      )}

      {!showCancelConfirm && (
        
      <div className="bg-gray-900 border border-orange-500 rounded-lg shadow-lg w-full max-w-md px-6 py-5">
        <button
          onClick={onClose}
          className="text-red-600 text-3xl ml-8 font-bold float-right cursor-pointer rounded-4xl hover:text-red-400 transition"
        >
          <IoMdCloseCircle />
        </button>
        <h2 className="text-2xl font-bold text-orange-500 mb-4">{errand.title}</h2>

        <div className="space-y-2 text-sm text-gray-300">
          <p><span className="font-medium text-white">Description:</span> {errand.description}</p>
          {errand.notes && (<p><span className="font-medium text-white">notes:</span> {errand.notes}</p>)}
          <p><span className="font-medium text-white">Pick-up:</span> {errand.pick_up_location}</p>
          <p><span className="font-medium text-white">Drop-off:</span> {errand.drop_off_location}</p>
          <p><span className="font-medium text-white">Reward:</span> {errand.reward}</p>
          <p><span className="font-medium text-white">Posted by:</span> <Link to={`/profile/${errand.posted_by}`} className='underline' > {errand.posted_by} </Link>  </p> 
          {errand.accepted_by && (<p><span className="font-medium text-white">Accepted by:</span> <Link to={`/profile/${errand.accepted_by}`} className='underline' > {errand.accepted_by} </Link> </p>)}
          {errand.accepted_by && errand.pickup_code && (<p>Pickup Code: <span className='font-bold text-xl text-white'>{errand.pickup_code}</span></p>)}
          {/* this is the rendering of the reason why the errand completion was rejected by the poster */}
          {errand.accepted_by && errand.status === "rejected_by_poster" && (
            <p className='bg-red-500 p-2 rounded-lg text-white'><span className="font-medium text-white ">Rejection reason: </span>{errand.rejection_reason}</p>)}
        
          {!chat && (
              <p className="mt-2 text-gray-500 italic">Chat will appear once the errand is accepted.</p>
            )}

          {chat &&
            chat.errand_id === errand.errand_Id &&
            (chat.poster_username === LoggedInUser || chat.helper_username === LoggedInUser) && (
              <p className="mt-2 text-white ">
                Chat room:{" "}
                <Link to={`/chat/${chat?.chat_id}/${chat.poster_username === LoggedInUser 
                    ? chat.helper_username 
                    : chat.poster_username}`} className='underline'>
                  Click here to chat <IoChatboxEllipses className="inline ml-1 text-white" size={20} />
                </Link>
              </p>
          )}

        </div>
        
        {/* ===THIS IS TO CHANGE THE STATUS FROM PENDING TO PROGRESS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mx-auto">
          {errand.status === "pending" && (
            <button
              onClick={handleAccept}
              disabled={loading && actionType === 'accept'}
              className="w-full bg-orange-500 text-white font-medium px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              {loading && actionType === 'accept' ? "Accepting..." : "Accept"}
            </button>
          )}

          {/* ===THIS IS TO CHANGE THE STATUS FROM PROGRESS TO AWAITING CONFIRMATION */}
          {(errand.status === "progress" || errand.status === "rejected_by_poster" ) && errand.accepted_by === LoggedInUser && (
            <button
              onClick={handleMarkComplete}
              disabled={loading && actionType === 'completed_by_helper'}
              className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {loading && actionType === 'completed_by_helper' ? "Completing..." : "Complete errand"}
            </button>
          )}

          {/* ===THIS IS TO CHANGE THE STATUS FROM AWAITING CONFRIMATION TO COMPLETED */}
          {errand.status === "awaiting_confirmation" && errand.posted_by === LoggedInUser &&  (
            <button
              onClick={() => {
                if (!loading) {
                  setShowConfirm(true);
                }
              }}
              disabled={loading && actionType === 'confirming_errand'}
              className="w-full bg-lime-600 text-white font-medium px-4 py-2 rounded hover:bg-lime-700 transition"
            >
              {loading && actionType === 'confirming_errand' ? "Confirming..." : " Confirm Errand Completion"}
            </button>
          )}
          { errand.status === "awaiting_confirmation" && errand.posted_by !== LoggedInUser && (
             <div>
                
                <CountdownTimer
                  errandId={errand.errand_Id}
                  onComplete={() => {
                    // Trigger something after 3hrs
                    onConfirming(errand.errand_Id);
                    console.log("Time’s up for this errand!");
                  }}
                />
             </div>
              
          )}


          {/* ===THIS IS TO CHANGE THE STATUS FROM AWAITING CONFIRMATION BACK TO reject INCASE THE POSTER SAID THEY DIDNT CONFIRM THE ERRAND */}
          {errand.status === "awaiting_confirmation" && errand.posted_by == LoggedInUser && !rejection && (
            <button 
              className='text-gray-300 cursor-pointer hover:text-gray-50' 
              onClick={()=> setRejection(true)}>The errand is'nt yet done?
              </button>)}
          {errand.status === "awaiting_confirmation" && errand.posted_by === LoggedInUser && rejection && (
            <>
          <span >Reason for rejection:
          <input 
            type="text" 
            placeholder='Reason for rejection' 
            required
            className='p-2 mt-1 block w-full bg-gray-100 text-black rounded-lg outline focus:outline outline-red-200'
            onChange={(event)=> setReason(event.target.value)}
            value={reason}
          />
          </span>

            <button
              onClick={handleReject}
              disabled={loading && actionType === 'status_reject_by_poster'}
              className="w-full bg-red-500 text-white font-medium px-4 py-2 rounded hover:bg-red-600 transition"
            >
              {loading && actionType === 'status_reject_by_poster' ? "Rejecting..." : "Reject Confirmation"}
            </button>
            </>
          )}
          

          {/* ===THIS IS TO CHANGE THE STATUS  TO CANCEL */}
          {(errand.status === "pending" || errand.status === "progress" || errand.status === "rejected_by_poster") && (
            <button
              onClick={() => {
                if (!loading) {
                  setShowCancelConfirm(true);
                }
              }}
              disabled={loading && actionType === 'cancel'}
              className="w-full bg-red-600 text-white font-medium px-4 py-2 rounded hover:bg-red-700 transition"
            >
              {loading && actionType === 'cancel' ? "Canceling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default ErrandDetailModal;
