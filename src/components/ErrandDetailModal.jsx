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
      {/* === CANCEL CONFIRMATION MODAL === */}
{showCancelConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-gray-800">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-orange-600 mb-4">
        <TiWarning size={28} className="text-red-500" />
        Confirm Cancellation
      </h2>
      <p className="mb-6 text-center text-gray-700">
        Are you sure you want to cancel this errand? <br /> This action cannot be undone.
      </p>

      {/* Buttons to confirm or go back */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowCancelConfirm(false)}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          No, Go Back
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* === COMPLETE CONFIRMATION MODAL === */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-gray-800">
            <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-green-600 mb-4">
              <TiWarning size={28} className="text-green-500" />
              Confirm Completion
            </h2>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to complete this errand? <br /> This action cannot be undone.
            </p>

            {/* Buttons to confirm or go back */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                No, Go Back
              </button>
              <button
                onClick={handleComplete}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {!showCancelConfirm && (
        
      <div className="bg-gray-900 border border-orange-500 rounded-lg shadow-lg w-full max-w-md px-6 py-5">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-orange-500 drop-shadow-md">
          {errand.title}
        </h2>
        <button
          onClick={onClose}
          className="text-red-600 text-3xl font-bold hover:text-red-400 transition"
        >
          <IoMdCloseCircle />
        </button>
      </div>


        {/* this is my errand detail page that shows */}
        <div className="space-y-6 text-sm text-gray-200 bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] p-6 rounded-2xl shadow-xl border border-gray-700">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Description</p>
            <p className="text-white font-medium">{errand.description}</p>
          </div>

          {errand.notes && (
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Notes</p>
              <p className="text-white">{errand.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Pick-up Location</p>
            <p className="text-white">{errand.pick_up_location}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Drop-off Location</p>
            <p className="text-white">{errand.drop_off_location}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Reward</p>
            <p className="text-lime-400 font-bold">{"₦" + Number(errand.reward).toLocaleString("en-NG", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
        </div>

        <hr className="border-gray-600 my-4" />

        <div className="space-y-2">
          <p>
            <span className="text-gray-400">Posted by:</span>{" "}
            <Link to={`/profile/${errand.posted_by}`} className="text-indigo-300 underline">
              {errand.posted_by}
            </Link>
          </p>

          {errand.accepted_by && (
            <p>
              <span className="text-gray-400">Accepted by:</span>{" "}
              <Link to={`/profile/${errand.accepted_by}`} className="text-indigo-300 underline">
                {errand.accepted_by}
              </Link>
            </p>
          )}

          {errand.accepted_by && errand.pickup_code && (
            <p>
              <span className="text-gray-400">Pickup Code:</span>{" "}
              <span className="text-white text-lg font-semibold tracking-wider">{errand.pickup_code}</span>
            </p>
          )}

          {errand.accepted_by && errand.status === "rejected_by_poster" && (
            <div className="bg-red-600 bg-opacity-80 p-3 rounded-lg shadow border border-red-800">
              <p className="text-white font-semibold">Rejection Reason:</p>
              <p className="text-red-100">{errand.rejection_reason}</p>
            </div>
          )}

          {!chat && (
            <p className="italic text-gray-500">Chat will appear once the errand is accepted.</p>
          )}

          {chat &&
            chat.errand_id === errand.errand_Id &&
            (chat.poster_username === LoggedInUser || chat.helper_username === LoggedInUser) && (
              <p>
                <span className="text-gray-400">Chat room:</span>{" "}
                <Link
                  to={`/chat/${chat?.chat_id}/${chat.poster_username === LoggedInUser 
                    ? chat.helper_username 
                    : chat.poster_username}`}
                  className="text-sky-400 underline inline-flex items-center gap-1"
                >
                  Click here to chat <IoChatboxEllipses className="text-sky-400" size={18} />
                </Link>
              </p>
            )}
        </div>
      </div>

        
        {/* === ACTION BUTTONS SECTION === */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
          
          {/* === From PENDING to PROGRESS === */}
          {errand.status === "pending" && (
            <button
              onClick={handleAccept}
              disabled={loading && actionType === 'accept'}
              className={`w-full px-5 py-3 rounded-lg font-semibold text-white shadow transition
                ${loading && actionType === 'accept' ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              {loading && actionType === 'accept' ? "Accepting..." : "Accept"}
            </button>
          )}

          {/* === From PROGRESS/REJECTED to AWAITING CONFIRMATION === */}
          {(errand.status === "progress" || errand.status === "rejected_by_poster") && errand.accepted_by === LoggedInUser && (
            <button
              onClick={handleMarkComplete}
              disabled={loading && actionType === 'completed_by_helper'}
              className={`w-full px-5 py-3 rounded-lg font-semibold text-white shadow transition
                ${loading && actionType === 'completed_by_helper' ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading && actionType === 'completed_by_helper' ? "Completing..." : "Complete errand"}
            </button>
          )}

          {/* === From AWAITING CONFIRMATION to COMPLETED (by poster) === */}
          {errand.status === "awaiting_confirmation" && errand.posted_by === LoggedInUser && (
            <button
              onClick={() => !loading && setShowConfirm(true)}
              disabled={loading && actionType === 'confirming_errand'}
              className={`w-full px-5 py-3 rounded-lg font-semibold text-white shadow transition
                ${loading && actionType === 'confirming_errand' ? 'bg-lime-400' : 'bg-lime-600 hover:bg-lime-700'}`}
            >
              {loading && actionType === 'confirming_errand' ? "Confirming..." : "Confirm Errand Completion"}
            </button>
          )}

          {/* === Countdown timer display for helper side === */}
          {errand.status === "awaiting_confirmation" && errand.posted_by !== LoggedInUser && (
            <div className="col-span-full">
              <CountdownTimer
                errandId={errand.errand_Id}
                onComplete={() => {
                  onConfirming(errand.errand_Id);
                  console.log("Time’s up for this errand!");
                }}
              />
            </div>
          )}

          {/* === Option to trigger Rejection Reason === */}
          {errand.status === "awaiting_confirmation" && errand.posted_by === LoggedInUser && !rejection && (
            <button
              onClick={() => setRejection(true)}
              className="text-gray-400 hover:text-gray-100 text-sm font-medium underline transition"
            >
              The errand isn't yet done?
            </button>
          )}

          {/* === From AWAITING CONFIRMATION back to REJECTED (by poster) === */}
          {errand.status === "awaiting_confirmation" && errand.posted_by === LoggedInUser && rejection && (
            <>
              <div className="col-span-full space-y-2">
                <label className="text-sm text-gray-300">Reason for rejection:</label>
                <input
                  type="text"
                  placeholder="Reason for rejection"
                  required
                  className="block w-full bg-gray-800 text-white border border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onChange={(event) => setReason(event.target.value)}
                  value={reason}
                />
              </div>

              <button
                onClick={handleReject}
                disabled={loading && actionType === 'status_reject_by_poster'}
                className={`w-full px-5 py-3 rounded-lg font-semibold text-white shadow transition
                  ${loading && actionType === 'status_reject_by_poster' ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {loading && actionType === 'status_reject_by_poster' ? "Rejecting..." : "Reject Confirmation"}
              </button>
            </>
          )}

          {/* === Cancel Option at Various States === */}
          {(errand.status === "pending" || errand.status === "progress" || errand.status === "rejected_by_poster") && (
            <button
              onClick={() => !loading && setShowCancelConfirm(true)}
              disabled={loading && actionType === 'cancel'}
              className={`w-full px-5 py-3 rounded-lg font-semibold text-white shadow transition
                ${loading && actionType === 'cancel' ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
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
