import React, { useEffect, useState } from 'react';
import { panditApi } from '../../api/pandit.api';
import { pujaApi } from '../../api/puja.api';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';
import { Save, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export const ProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allPujas, setAllPujas] = useState([]);

  const [formData, setFormData] = useState({
    bio: '',
    experienceYears: 0,
    location: { city: '', state: '' },
    languagesSpoken: '',
    photoUrl: '',
    supportedRituals: [],
  });

  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    fetchProfileAndPujas();
  }, []);

  const fetchProfileAndPujas = async () => {
    try {
      setLoading(true);
      const [profileRes, pujasRes] = await Promise.all([
        panditApi.getMyProfile(),
        pujaApi.getAll(),
      ]);

      const pandit = profileRes.data.pandit;
      setVerificationStatus(pandit.verificationStatus);
      setAllPujas(pujasRes.data.pujas || []);

      setFormData({
        bio: pandit.bio || '',
        experienceYears: pandit.experienceYears || 0,
        location: {
          city: pandit.location?.city || '',
          state: pandit.location?.state || '',
        },
        languagesSpoken: (pandit.languagesSpoken || []).join(', '),
        photoUrl: pandit.photoUrl || '',
        supportedRituals: (pandit.supportedRituals || []).map((r) => r._id || r),
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRitualToggle = (pujaId) => {
    setFormData((prev) => {
      const exists = prev.supportedRituals.includes(pujaId);
      return {
        ...prev,
        supportedRituals: exists
          ? prev.supportedRituals.filter((id) => id !== pujaId)
          : [...prev.supportedRituals, pujaId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const languages = formData.languagesSpoken
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      await panditApi.updateMyProfile({
        bio: formData.bio,
        experienceYears: Number(formData.experienceYears),
        location: formData.location,
        languagesSpoken: languages,
        photoUrl: formData.photoUrl,
        supportedRituals: formData.supportedRituals,
      });

      setSuccess('Profile updated successfully!');
      fetchProfileAndPujas();
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading your profile..." />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pandit Profile & Services</h2>
          <p className="text-sm text-gray-500">Configure your credentials, bio, and supported religious ceremonies.</p>
        </div>
        <div>
          {verificationStatus === 'verified' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              <CheckCircle size={14} className="mr-1" /> Verified Account
            </span>
          )}
          {verificationStatus === 'pending' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              <AlertCircle size={14} className="mr-1" /> Pending Admin Approval
            </span>
          )}
          {verificationStatus === 'rejected' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              <XCircle size={14} className="mr-1" /> Verification Rejected
            </span>
          )}
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              required
              placeholder="e.g. Mumbai, Varanasi"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={formData.location.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              placeholder="e.g. Maharashtra, Uttar Pradesh"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={formData.location.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, state: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="70"
              required
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData({ ...formData, experienceYears: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages Spoken (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Hindi, Sanskrit, English"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={formData.languagesSpoken}
              onChange={(e) =>
                setFormData({ ...formData, languagesSpoken: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Vedic Background</label>
            <textarea
              rows="3"
              placeholder="Describe your lineage, Vedic education, experience, and expertise..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </div>

        {/* Supported Rituals Selection */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-2">Supported Rituals & Ceremonies</h3>
          <p className="text-xs text-gray-500 mb-3">Select the pujas you are qualified and available to perform for devotees:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
            {allPujas.map((puja) => {
              const isChecked = formData.supportedRituals.includes(puja._id);
              return (
                <label
                  key={puja._id}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition ${
                    isChecked
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                    checked={isChecked}
                    onChange={() => handleRitualToggle(puja._id)}
                  />
                  <div className="ml-3">
                    <span className="text-sm font-semibold text-gray-900">{puja.name}</span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {puja.category} • ₹{puja.priceRange?.min} - ₹{puja.priceRange?.max}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md font-medium text-sm flex items-center transition disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
