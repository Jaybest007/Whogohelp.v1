import React, { useState } from 'react';
import ErrandDetailModal from './ErrandDetailModal.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaInfo } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext.jsx';
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
  const { setRateUser } = useDashboard();


  const handleAccept = async () => {
    setLoading(true);
    setActionType("accept");
    try {
      const response = await axios.get("https://whogohelp.free.nf/api/errand_history.php", {
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
      const response = await axios.get('https://whogohelp.free.nf/api/errand_history.php', {
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
      const response = await axios.get('https://whogohelp.free.nf/api/errand_history.php', {
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
        setRateUser(true); // Trigger rating modal
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
    <div className="bg-[#111827] border border-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] duration-200 ease-in-out w-full max-w-md">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-700 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-orange-400 leading-snug">{title}</h3>
          <p className="text-xs text-gray-500 italic mt-1">#{errand_Id}</p>
        </div>
        <span className="bg-amber-400 text-black text-xs font-semibold px-3 py-1 rounded-full mt-1 shadow-sm">
          {(currentStatus).toUpperCase()}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3 text-sm text-gray-300">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">📍</span>
          <span><strong className="text-white">From:</strong> {pick_up_location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400">📦</span>
          <span><strong className="text-white">To:</strong> {drop_off_location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">💰</span>
          <span><strong className="text-lime-400">Reward:</strong> {"₦" + Number(reward).toLocaleString("en-NG", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
      </div>

  {/* Call to Action */}
  <div className="p-5 pt-0">
    <button
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition duration-150 text-sm"
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
          status: currentStatus,
        })
      }
    >
      View Details
    </button>
  </div>



    
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
