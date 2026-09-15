import React, { useState, useEffect } from 'react';
import { panditApi } from '../../api/pandit.api';
import { Trash2, Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

export const AvailabilityManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New slots form
  const [slots, setSlots] = useState([{ startTime: '09:00', endTime: '11:00' }]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (selectedDate) fetchAvailability();
  }, [selectedDate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await panditApi.getMyAvailability({ from: selectedDate, to: selectedDate });
      
      if (res.data.availability && res.data.availability.length > 0) {
        setAvailability(res.data.availability[0]);
        // Prefill form with existing non-booked slots to make updating easier
        setSlots(res.data.availability[0].slots.map(s => ({ startTime: s.startTime, endTime: s.endTime, isBooked: s.isBooked })));
      } else {
        setAvailability(null);
        setSlots([{ startTime: '09:00', endTime: '11:00' }]);
      }
    } catch (err) {
      setError('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const addSlot = () => setSlots([...slots, { startTime: '', endTime: '' }]);
  
  const removeSlot = (index) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    setSlots(newSlots);
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Filter out empty slots
      const validSlots = slots.filter(s => s.startTime && s.endTime);
      await panditApi.setMyAvailability({ date: selectedDate, slots: validSlots });
      setSuccess('Availability updated successfully');
      fetchAvailability();
    } catch (err) {
      setError(err.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDay = async () => {
    if (!window.confirm('Are you sure you want to delete all availability for this date?')) return;
    try {
      await panditApi.deleteMyAvailability({ date: selectedDate });
      setSuccess('Availability cleared for the selected date');
      fetchAvailability();
    } catch (err) {
      setError(err.message || 'Failed to clear availability. Ensure there are no booked slots.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="mr-2" size={20} /> Select Date
        </h3>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:border-orange-500 mb-4"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          Select a date to view or manage your available time slots.
        </p>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-6 flex justify-between items-center">
          <span>Manage Slots for {new Date(selectedDate).toLocaleDateString()}</span>
          {availability && (
            <button onClick={handleDeleteDay} className="text-sm text-red-600 hover:text-red-800 flex items-center">
              <Trash2 size={16} className="mr-1" /> Clear Day
            </button>
          )}
        </h3>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
        
        {loading ? (
          <Loader message="Loading slots..." />
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {slots.map((slot, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded border ${slot.isBooked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    disabled={slot.isBooked}
                    className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm disabled:bg-gray-100"
                    value={slot.startTime}
                    onChange={(e) => handleSlotChange(idx, 'startTime', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    disabled={slot.isBooked}
                    className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm disabled:bg-gray-100"
                    value={slot.endTime}
                    onChange={(e) => handleSlotChange(idx, 'endTime', e.target.value)}
                  />
                </div>
                <div className="mt-5 w-24">
                  {slot.isBooked ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Booked</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeSlot(idx)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove slot"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSlot}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded flex items-center justify-center hover:border-orange-500 hover:text-orange-600 transition"
            >
              <Plus size={18} className="mr-2" /> Add Time Slot
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Availability'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Note: Updating availability preserves already-booked slots. New slots cannot overlap with existing ones.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
