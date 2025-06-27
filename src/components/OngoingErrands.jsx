import React, { useState, useEffect } from 'react';
import ErrandDetailModal from './ErrandDetailModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const OngoingErrands = ({ errands, triggerRefresh, triggerNotificationRefresh }) => {
  const [selectedErrand, setSelectedErrand] = useState(null);
  const [tempErrands, setTempErrands] = useState(errands || []);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setTempErrands(errands || []);
  }, [errands]);

  const removeErrandLocally = (errand_Id) => {
    setTempErrands((prev) => prev.filter((e) => e.errand_Id !== errand_Id));
  };

  const handleCompleted = async (errand_Id) => {
    setLoading(true);
    setActionType('completed_by_helper');
    try {
      const response = await axios.get('http://localhost/api/errand_history.php', {
        withCredentials: true,
        params: {
          action: 'status_completed_by_helper',
          errand_Id,
        },
      });

      if (response.data?.success) {
        toast.success(response.data.message);
        setSelectedErrand(null);
        removeErrandLocally(errand_Id);
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
      } else {
        toast.error(response.data.message || 'Could not complete the errand.');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Something went wrong.');
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
          errand_Id,
        },
      });

      if (response.data?.success) {
        toast.success(response.data.message);
        setSelectedErrand(null);
        removeErrandLocally(errand_Id);
        await triggerRefresh?.();
        await triggerNotificationRefresh?.();
      } else {
        toast.error(response.data.message || 'Could not cancel the errand.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'An error occurred while canceling the errand.');
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Ongoing Errands</h3>

      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      {!tempErrands || tempErrands.length === 0 ? (
        <div className="text-gray-500 italic">You have no errands in progress.</div>
      ) : (
        <div className="space-y-3">
          {tempErrands.map((errand) => (
            <div
              key={errand.errand_Id}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-lg transition-all cursor-pointer"
              onClick={() => setSelectedErrand(errand)}
            >
              <p className="text-sm font-semibold text-blue-700">📦 {errand.title}</p>
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
          onCompleted={handleCompleted}
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

export default OngoingErrands;
