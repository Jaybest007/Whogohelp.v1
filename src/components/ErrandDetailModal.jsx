import { useState, useEffect } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import CountdownTimer from './CountdownTimer';
import { IoChatboxEllipses } from 'react-icons/io5';
import { TiWarning } from 'react-icons/ti';
import StarRating from './StarRating';


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
  const [showConfirm, setShowConfirm] = useState(false);
  const LoggedInUser = dashboardData?.username;
  

  useEffect(() => {
    if (errand?.errand_Id) {
      fetchChat(errand.errand_Id);
    }
  }, [errand]);

  if (!errand) return null;

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

  // Modal state for cancel confirmation
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = async () => {
    if (!loading) {
      await onCancel(errand.errand_Id);
      setShowCancelConfirm(false);
      await triggerRefresh?.();
      await triggerNotificationRefresh?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-2">
      <div className="relative w-full max-w-md bg-gray-900 border border-orange-500 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-2xl font-bold hover:text-red-400 transition z-10"
          aria-label="Close"
        >
          <IoMdCloseCircle />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-orange-500 truncate">{errand.title}</h2>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="block text-xs text-gray-400 uppercase">Pick-up</span>
              <span className="text-white">{errand.pick_up_location}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 uppercase">Drop-off</span>
              <span className="text-white">{errand.drop_off_location}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 uppercase">Reward</span>
              <span className="text-lime-400 font-bold">
                ₦{Number(errand.reward).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 uppercase">Status</span>
              <span className="text-white">{errand.status.replace(/_/g, " ")}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="block text-xs text-gray-400 uppercase mb-1">Description</span>
            <span className="text-white">{errand.description}</span>
          </div>

          {/* Notes (collapsible if long) */}
          {errand.notes && (
            <details className="bg-gray-800 rounded p-2">
              <summary className="text-xs text-gray-400 uppercase cursor-pointer">Notes</summary>
              <div className="text-white mt-1">{errand.notes}</div>
            </details>
          )}

          {/* Poster/Helper Info */}
          <div className="flex flex-col gap-1 text-xs text-gray-300">
            <span>
              Posted by:{" "}
              <Link to={`/profile/${errand.posted_by}`} className="text-indigo-300 underline">
                {errand.posted_by}
              </Link>
            </span>
            {errand.accepted_by && (
              <span>
                Accepted by:{" "}
                <Link to={`/profile/${errand.accepted_by}`} className="text-indigo-300 underline">
                  {errand.accepted_by}
                </Link>
              </span>
            )}
            {errand.accepted_by && errand.pickup_code && (
              <span>
                Pickup Code:{" "}
                <span className="text-white font-semibold">{errand.pickup_code}</span>
              </span>
            )}
          </div>

          {/* Chat Link */}
          {chat &&
            chat.errand_id === errand.errand_Id &&
            (chat.poster_username === LoggedInUser || chat.helper_username === LoggedInUser) && (
              <div className="mt-2">
                <Link
                  to={`/chat/${chat?.chat_id}/${chat.poster_username === LoggedInUser
                    ? chat.helper_username
                    : chat.poster_username}`}
                  className="text-sky-400 underline inline-flex items-center gap-1"
                >
                  Chat <IoChatboxEllipses className="text-sky-400" size={18} />
                </Link>
              </div>
            )}

          {/* Rejection Reason */}
          {errand.accepted_by && errand.status === "rejected_by_poster" && (
            <div className="bg-red-600 bg-opacity-80 p-2 rounded-lg shadow border border-red-800 mt-2">
              <p className="text-white font-semibold">Rejection Reason:</p>
              <p className="text-red-100">{errand.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-5 py-3 flex flex-col gap-2">
          {/* Render your action buttons here, as in your original code */}
          {/* Example: */}
          {errand.status === "pending" && (
            <button
              onClick={handleAccept}
              disabled={loading && actionType === 'accept'}
              className={`w-full px-5 py-2 rounded-lg font-semibold text-white shadow transition
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
              className={`w-full px-5 py-2 rounded-lg font-semibold text-white shadow transition
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
              className={`w-full px-5 py-2 rounded-lg font-semibold text-white shadow transition
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
                className={`w-full px-5 py-2 rounded-lg font-semibold text-white shadow transition
                  ${loading && actionType === 'status_reject_by_poster' ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {loading && actionType === 'status_reject_by_poster' ? "Rejecting..." : "Reject Confirmation"}
              </button>
            </>
          )}

          {/* === Confirm Action Modal === */}
          {showConfirm && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
                <div className="flex flex-col items-center gap-2">
                  <TiWarning className="text-orange-500 text-4xl" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Completion</h3>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to confirm this errand as completed?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleComplete}
                      disabled={loading && actionType === 'confirming_errand'}
                      className={`px-4 py-2 rounded bg-lime-600 text-white font-semibold hover:bg-lime-700 transition ${
                        loading && actionType === 'confirming_errand' ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading && actionType === 'confirming_errand' ? "Confirming..." : "Yes, Confirm"}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === Cancel Option at Various States === */}
          {(errand.status === "pending" || errand.status === "progress" || errand.status === "rejected_by_poster") && (
            <>
              <button
                onClick={() => !loading && setShowCancelConfirm(true)}
                disabled={loading && actionType === 'cancel'}
                className={`w-full px-5 py-2 rounded-lg font-semibold text-white shadow transition
                  ${loading && actionType === 'cancel' ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {loading && actionType === 'cancel' ? "Canceling..." : "Cancel"}
              </button>
              {showCancelConfirm && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
                    <div className="flex flex-col items-center gap-2">
                      <TiWarning className="text-red-500 text-4xl" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Cancel</h3>
                      <p className="text-gray-700 mb-4">
                        Are you sure you want to cancel this errand?
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleCancel}
                          disabled={loading && actionType === 'cancel'}
                          className={`px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition ${
                            loading && actionType === 'cancel' ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          {loading && actionType === 'cancel' ? "Canceling..." : "Yes, Cancel"}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>


            
  );
};

export default ErrandDetailModal;
