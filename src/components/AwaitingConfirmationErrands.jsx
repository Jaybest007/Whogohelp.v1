import React, { useState } from 'react';
import ErrandDetailModal from './ErrandDetailModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const AwaitingConfirmationErrands = ({ errands, triggerRefresh, triggerNotificationRefresh }) => {
  const [selectedErrand, setSelectedErrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState('');

  const handleConfirming = async (errand_Id) => {
    setLoading(true);
    setActionType('completed_by_helper');
    try {
      const response = await axios.get('http://localhost/api/errand_history.php', {
        withCredentials: true,
        params: {
          action: 'status_confirmed_completion',
          errand_Id,
        },
      });

      if (response.data?.success) {
        toast.success(response.data.message);
        setSelectedErrand(null);
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
      } else {
        toast.error(response.data.message || 'Could not complete the errand.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  const handleReject = async (errand_Id, reason) => {
    setLoading(true);
    setActionType('reject_confirmation');
    try {
      const response = await axios.get('http://localhost/api/errand_history.php', {
        withCredentials: true,
        params: {
          action: 'status_reject_by_poster',
          errand_Id,
          reason
        }
      });

      if (response.data?.success) {
        toast.success(response.data.message);
        setSelectedErrand(null);
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
      } else {
        toast.error(response.data.message || 'Could not reject the errand.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while rejecting the errand.");
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  const handleCancel = async (errand_Id) => {
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

      if (response.data?.success) {
        toast.success(response.data.message);
        setSelectedErrand(null);
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
      } else {
        toast.error(response.data.message || 'Could not cancel the errand.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while canceling the errand.");
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg font-semibold text-green-600 mb-4">Awaiting Errand Confirmation</h3>

      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      {!errands || errands.length === 0 ? (
        <div className="text-gray-500 italic">You have no errands in progress.</div>
      ) : (
        <div className="space-y-3">
          {errands.map((errand) => (
            <div
              key={errand.errand_Id}
              className="bg-green-50 hover:bg-green-100 border border-green-200 p-4 rounded-lg transition-all cursor-pointer"
              onClick={() => setSelectedErrand(errand)}
            >
              <p className="text-sm font-semibold text-green-700">📦 {errand.title}</p>
              <p className="text-sm text-gray-600 mt-1">
                {errand.pick_up_location} → {errand.drop_off_location}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">Status: {errand.status}</p>
            </div>
          ))}
        </div>
      )}

      {selectedErrand && (
        <ErrandDetailModal
          errand={selectedErrand}
          onClose={() => setSelectedErrand(null)}
          onConfirming={handleConfirming}
          onReject={handleReject}
          onCancel={handleCancel}
          loading={loading}
          actionType={actionType}
          triggerRefresh={triggerRefresh}
          triggerNotificationRefresh={triggerNotificationRefresh}
        />
      )}
    </div>
  );
};

export default AwaitingConfirmationErrands;
