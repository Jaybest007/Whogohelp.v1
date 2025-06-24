import React, { useState } from 'react';
import ErrandDetailModal from './ErrandDetailModal.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaInfo } from 'react-icons/fa';

const ErrandCard = ({
  errand_Id,
  title,
  pick_up_location,
  drop_off_location,
  description,
  reward,
  posted_by,
  status,
  notes,
  pickup_code,
  rejection_reason,
  triggerRefresh,
  triggerNotificationRefresh
}) => {
  const [selectedErrands, setSelectedErrands] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleAccept = async () => {
    setLoading(true);
    setActionType("accept");
    try {
      const response = await axios.get("http://localhost/api/errand_history.php", {
        withCredentials: true,
        params: {
          action: "status_progress",
          errand_Id,
        },
      });

      if (response.data?.success) {
        setCurrentStatus("progress");
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
        setSelectedErrands(null);
      }
    } catch (err) {
      console.error("Axios error:", err);
      toast.error(err.response?.data?.error || "An error occurred while accepting the errand.");
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setActionType('cancel');
    try {
      const response = await axios.get('http://localhost/api/errand_history.php', {
        withCredentials: true,
        params: {
          action: 'status_cancel',
          errand_Id
        }
      });
      if (response.data.success) {
        setSelectedErrands(null);
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
      } else {
        toast.error(response.data.message || "Failed to cancel errand.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while canceling.");
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setActionType('complete');
    try {
      const response = await axios.get('http://localhost/api/errand_history.php', {
        withCredentials: true,
        params: {
          action: 'status_completed',
          errand_Id
        }
      });
      if (response.data?.success) {
        setCurrentStatus('completed');
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
        setSelectedErrands(null);
      } else {
        toast.error(response.data?.error || "Failed to complete errand.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while completing the errand.");
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  return (
    <div className="bg-gray-900 border border-orange-500 rounded-lg shadow-md p-5 hover:scale-[1.02] transition-transform">
      <h3 className="text-xl font-bold text-orange-400">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">
        <span className="font-medium text-white">Location:</span> {pick_up_location} → {drop_off_location}
      </p>

      <div className="mt-3 flex justify-between items-center text-sm text-gray-400">
        <span className="font-semibold text-white">Reward: {reward}</span>
        <span className="italic">ID: #{errand_Id}</span>
      </div>

      <p className="mt-2 inline-block bg-amber-500 text-black font-medium text-xs px-3 py-1 rounded">
        Status: {currentStatus}
      </p>

      <button
        className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
        onClick={() =>
          setSelectedErrands({
            errand_Id,
            title,
            pick_up_location,
            drop_off_location,
            description,
            reward,
            posted_by,
            notes,
            rejection_reason,
            pickup_code,
            status: currentStatus
          })
        }
      >
        View Details
      </button>

    
      {selectedErrands && (
        <ErrandDetailModal
          errand={selectedErrands}
          onClose={() => setSelectedErrands(null)}
          onAccept={handleAccept}
          onCancel={handleCancel}
          onCompleted={handleComplete}
          loading={loading}
          actionType={actionType}
          triggerRefresh={triggerRefresh}
          triggerNotificationRefresh={triggerNotificationRefresh}
        />
      )}
    </div>
  );
};

export default ErrandCard;
