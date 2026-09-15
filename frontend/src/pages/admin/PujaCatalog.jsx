import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  durationMinutes: 60,
  priceRange: { min: 1000, max: 5000 },
  locationType: 'home',
  category: 'General',
};

export const PujaCatalog = () => {
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPujas();
  }, []);

  const fetchPujas = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllPujas();
      setPujas(res.data.pujas || []);
    } catch (err) {
      setAlertInfo({ type: 'error', message: err.message || 'Failed to load pujas' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
    setShowForm(true);
    setAlertInfo({ type: '', message: '' });
  };

  const handleOpenEdit = (puja) => {
    setEditingId(puja._id);
    setFormData({
      name: puja.name,
      description: puja.description,
      durationMinutes: puja.durationMinutes,
      priceRange: {
        min: puja.priceRange?.min ?? 1000,
        max: puja.priceRange?.max ?? 5000,
      },
      locationType: puja.locationType,
      category: puja.category,
    });
    setShowForm(true);
    setAlertInfo({ type: '', message: '' });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertInfo({ type: '', message: '' });

    try {
      if (editingId) {
        await adminApi.updatePuja(editingId, formData);
        setAlertInfo({ type: 'success', message: `Puja "${formData.name}" updated successfully!` });
      } else {
        await adminApi.createPuja(formData);
        setAlertInfo({ type: 'success', message: `Puja "${formData.name}" created successfully!` });
      }
      handleCancelForm();
      fetchPujas();
    } catch (err) {
      setAlertInfo({ type: 'error', message: err.message || 'Failed to save puja' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the Puja Catalog?`)) return;
    try {
      await adminApi.deletePuja(id);
      setAlertInfo({ type: 'success', message: `Puja "${name}" deleted successfully!` });
      fetchPujas();
    } catch (err) {
      setAlertInfo({ type: 'error', message: err.message || 'Failed to delete puja' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Puja Catalog Management</h2>
          <p className="text-sm text-gray-500">Add, edit, or remove master rituals available across the platform.</p>
        </div>
        <button
          onClick={showForm ? handleCancelForm : handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center shadow-sm transition"
        >
          {showForm ? (
            <><X size={16} className="mr-1" /> Cancel</>
          ) : (
            <><Plus size={16} className="mr-1" /> Add New Puja</>
          )}
        </button>
      </div>

      {alertInfo.message && (
        <div className="mb-4">
          <Alert type={alertInfo.type} message={alertInfo.message} onClose={() => setAlertInfo({ type: '', message: '' })} />
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 mb-8 transition">
          <h3 className="font-bold text-lg mb-4 text-gray-900">
            {editingId ? 'Edit Puja' : 'Create New Puja'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puja Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Navagraha Shanti"
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sanskar, Graha Shanti"
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Describe the significance and process of this ceremony..."
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                <input
                  required
                  type="number"
                  min="15"
                  max="480"
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                <select
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.locationType}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                >
                  <option value="home">Home</option>
                  <option value="temple">Temple</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.priceRange.min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceRange: { ...formData.priceRange, min: Number(e.target.value) },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full border-gray-300 rounded border p-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  value={formData.priceRange.max}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceRange: { ...formData.priceRange, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : editingId ? 'Update Puja' : 'Save New Puja'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Loader message="Loading catalog..." />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-bold text-gray-700">Name</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-700">Category</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-700">Duration</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-700">Price Range</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-700">Location</th>
                <th className="py-3 px-4 text-sm font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pujas.map((puja) => (
                <tr key={puja._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-900">{puja.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{puja.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{puja.durationMinutes}m</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    ₹{puja.priceRange?.min} - {puja.priceRange?.max}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">{puja.locationType}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(puja)}
                        title="Edit Puja"
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(puja._id, puja.name)}
                        title="Delete Puja"
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
