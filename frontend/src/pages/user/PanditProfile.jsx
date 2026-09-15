import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { panditApi } from '../../api/pandit.api';
import { bookingApi } from '../../api/booking.api';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';
import { MapPin, Clock, Calendar, Info } from 'lucide-react';

export const PanditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [pandit, setPandit] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [selectedPujaId, setSelectedPujaId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [locationType, setLocationType] = useState('home');
  const [address, setAddress] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchPanditDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    } else {
      setAvailability([]);
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  const fetchPanditDetails = async () => {
    try {
      setLoading(true);
      const res = await panditApi.getById(id);
      setPandit(res.data.pandit);
      if (res.data.pandit.supportedRituals?.length > 0) {
        setSelectedPujaId(res.data.pandit.supportedRituals[0]._id);
      }
    } catch (err) {
      setError('Failed to load pandit profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (date) => {
    try {
      const res = await panditApi.getAvailability(id, { from: date, to: date });
      setAvailability(res.data.availability[0]?.slots || []);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Failed to fetch availability', err);
      setAvailability([]);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSlot) {
      setBookingError('Please select a time slot');
      return;
    }

    setBookingError('');
    setBookingSuccess('');
    setIsBooking(true);

    try {
      await bookingApi.create({
        panditId: id,
        pujaId: selectedPujaId,
        date: selectedDate,
        timeSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
        locationType,
        address: locationType === 'home' ? address : undefined,
      });
      setBookingSuccess('Booking request sent successfully!');
      // Refresh availability to remove booked slot
      fetchAvailability(selectedDate);
      setSelectedSlot(null);
      setAddress('');
    } catch (err) {
      setBookingError(err.message || 'Failed to book slot');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Loader message="Loading profile details..." />;
  if (error || !pandit) return <div className="max-w-2xl mx-auto mt-10"><Alert type="error" message={error || 'Pandit not found'} /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Profile Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 flex items-start gap-6">
          {pandit.photoUrl ? (
            <img src={pandit.photoUrl} alt={pandit.userId?.name} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-3xl font-bold">
              {pandit.userId?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pandit.userId?.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin size={18} className="mr-1" /> {pandit.location?.city}, {pandit.location?.state}
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <Clock size={18} className="mr-1" /> {pandit.experienceYears} Years Experience
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{pandit.bio}</p>
          
          <h3 className="font-semibold mt-6 mb-2">Languages Spoken</h3>
          <div className="flex flex-wrap gap-2">
            {pandit.languagesSpoken?.map(lang => (
              <span key={lang} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">{lang}</span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
          <h2 className="text-xl font-bold mb-4">Pujas Offered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pandit.supportedRituals?.map(puja => (
              <div key={puja._id} className="border border-gray-200 p-4 rounded bg-gray-50">
                <h3 className="font-bold text-orange-700">{puja.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{puja.category}</p>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-500">{puja.durationMinutes} mins</span>
                  <span className="font-medium">₹{puja.priceRange?.min} - ₹{puja.priceRange?.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Booking Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 sticky top-4">
          <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Book this Pandit</h2>
          
          {bookingSuccess && <Alert type="success" message={bookingSuccess} />}
          {bookingError && <Alert type="error" message={bookingError} />}
          
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Puja</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white focus:border-orange-500"
                value={selectedPujaId}
                onChange={(e) => setSelectedPujaId(e.target.value)}
                required
              >
                {pandit.supportedRituals?.map(p => (
                  <option key={p._id} value={p._id}>{p.name} (₹{p.priceRange?.min})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white focus:border-orange-500"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
              >
                <option value="home">At Home</option>
                <option value="temple">At Temple</option>
              </select>
            </div>

            {locationType === 'home' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:border-orange-500"
                  rows="2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address for the puja"
                  required
                ></textarea>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:border-orange-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                {availability.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availability.map((slot, idx) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={slot.isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 text-sm rounded border text-center transition ${
                            slot.isBooked 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : isSelected 
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                          }`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded flex items-start">
                    <Info size={16} className="mr-2 mt-0.5 text-gray-400 shrink-0" />
                    No availability set for this date. Please select another date.
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isBooking || !selectedSlot}
              className={`w-full py-3 px-4 mt-6 rounded-md shadow-sm text-white font-bold transition ${
                isBooking || !selectedSlot ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isBooking ? 'Processing...' : 'Request Booking'}
            </button>
            {!isAuthenticated && (
              <p className="text-xs text-center text-gray-500 mt-2">You will be redirected to login.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
