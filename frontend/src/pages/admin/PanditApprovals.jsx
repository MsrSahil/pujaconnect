import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { UserCheck, UserX, MapPin, Clock } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

export const PanditApprovals = () => {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingPandits();
  }, []);

  const fetchPendingPandits = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingPandits();
      setPandits(res.data.pandits);
    } catch (err) {
      setError('Failed to load pending pandits');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      setActionLoading(id);
      await adminApi.verifyPandit(id, status);
      fetchPendingPandits();
    } catch (err) {
      alert(err.message || 'Failed to verify pandit');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader message="Loading pending approvals..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Pandit Applications</h2>
      
      {pandits.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
          No pending pandit applications found.
        </div>
      ) : (
        pandits.map((pandit) => (
          <div key={pandit._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="w-full md:w-3/4">
              <div className="flex items-center gap-4 mb-3">
                {pandit.photoUrl ? (
                  <img src={pandit.photoUrl} alt={pandit.userId?.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                    {pandit.userId?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pandit.userId?.name}</h3>
                  <p className="text-sm text-gray-500">{pandit.userId?.email} • {pandit.userId?.phone}</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{pandit.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center"><MapPin size={16} className="mr-1 text-gray-400" /> {pandit.location?.city}, {pandit.location?.state}</span>
                <span className="flex items-center"><Clock size={16} className="mr-1 text-gray-400" /> {pandit.experienceYears} Years Exp.</span>
                <span className="flex items-center font-medium">Langs: {pandit.languagesSpoken?.join(', ')}</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/4 flex gap-2 justify-end">
              <button
                onClick={() => handleVerify(pandit._id, 'verified')}
                disabled={actionLoading === pandit._id}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50 flex items-center justify-center"
              >
                <UserCheck size={16} className="mr-1" /> Approve
              </button>
              <button
                onClick={() => handleVerify(pandit._id, 'rejected')}
                disabled={actionLoading === pandit._id}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50 flex items-center justify-center"
              >
                <UserX size={16} className="mr-1" /> Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
