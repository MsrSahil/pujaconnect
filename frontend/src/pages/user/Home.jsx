import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { panditApi } from '../../api/pandit.api';
import { pujaApi } from '../../api/puja.api';
import { MapPin, Clock, Search, Filter, RotateCcw } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

export const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    pujaType: '',
    experience: '',
    language: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [panditsRes, pujasRes] = await Promise.all([
        panditApi.getAll(),
        pujaApi.getAll(),
      ]);
      setPandits(panditsRes.data.pandits || []);
      setPujas(pujasRes.data.pujas || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPandits = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (appliedFilters.location) params.location = appliedFilters.location;
      if (appliedFilters.pujaType) params.pujaType = appliedFilters.pujaType;
      if (appliedFilters.experience) params.experience = appliedFilters.experience;
      if (appliedFilters.language) params.language = appliedFilters.language;

      const res = await panditApi.getAll(params);
      setPandits(res.data.pandits || []);
    } catch (err) {
      setError('Failed to load pandits matching your criteria');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchPandits(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      pujaType: '',
      experience: '',
      language: '',
    };
    setFilters(resetFilters);
    fetchPandits(resetFilters);
  };

  return (
    <div>
      {/* Hero Search Section */}
      <div className="bg-orange-600 text-white rounded-xl p-6 sm:p-8 mb-8 shadow-md">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find & Book Verified Pandits</h1>
          <p className="text-orange-100 text-sm sm:text-base">
            For authentic Vedic ceremonies at your home or temple. Filter by ritual, city, experience, and language.
          </p>
        </div>

        <form onSubmit={handleFilterSubmit} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Location / City */}
            <div>
              <label className="block text-xs font-semibold text-orange-100 mb-1">City / Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 rounded-md text-gray-900 bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            {/* Puja Type */}
            <div>
              <label className="block text-xs font-semibold text-orange-100 mb-1">Puja / Ritual Type</label>
              <select
                className="w-full px-3 py-2 rounded-md text-gray-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={filters.pujaType}
                onChange={(e) => setFilters({ ...filters, pujaType: e.target.value })}
              >
                <option value="">All Pujas</option>
                {pujas.map((puja) => (
                  <option key={puja._id} value={puja._id}>
                    {puja.name} ({puja.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Experience */}
            <div>
              <label className="block text-xs font-semibold text-orange-100 mb-1">Experience</label>
              <select
                className="w-full px-3 py-2 rounded-md text-gray-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
              >
                <option value="">Any Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
                <option value="20">20+ Years</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-orange-100 mb-1">Language</label>
              <input
                type="text"
                placeholder="e.g. Sanskrit, Hindi"
                className="w-full px-3 py-2 rounded-md text-gray-900 bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center"
            >
              <RotateCcw size={15} className="mr-1.5" /> Reset
            </button>
            <button
              type="submit"
              className="bg-orange-950 hover:bg-orange-900 text-white px-6 py-2 rounded-md text-sm font-medium transition flex items-center shadow-sm"
            >
              <Search size={15} className="mr-1.5" /> Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Verified Pandits</h2>
          <p className="text-sm text-gray-500 mt-0.5">Showing {pandits.length} available pandit{pandits.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {loading ? (
        <Loader message="Finding pandits near you..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : pandits.length === 0 ? (
        <div className="text-gray-500 text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-base font-medium text-gray-700 mb-1">No pandits found matching your criteria.</p>
          <p className="text-sm text-gray-500 mb-4">Try clearing one or more filters to broaden your search.</p>
          <button
            onClick={handleReset}
            className="text-orange-600 hover:text-orange-700 font-semibold text-sm underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pandits.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden flex flex-col hover:shadow-md transition">
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{p.userId?.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin size={16} className="mr-1 text-orange-500" /> {p.location?.city || 'Location not set'}{p.location?.state ? `, ${p.location.state}` : ''}
                    </div>
                  </div>
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.userId?.name} className="w-16 h-16 rounded-full object-cover border border-orange-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-bold">
                      {p.userId?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{p.bio || 'Experienced Vedic Pandit available for religious ceremonies.'}</p>

                {p.languagesSpoken?.length > 0 && (
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">Languages:</span> {p.languagesSpoken.join(', ')}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.supportedRituals?.slice(0, 3).map((puja) => (
                    <span key={puja._id} className="inline-block bg-orange-50 text-orange-700 text-xs px-2.5 py-0.5 rounded-full border border-orange-200">
                      {puja.name}
                    </span>
                  ))}
                  {p.supportedRituals?.length > 3 && (
                    <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2.5 py-0.5 rounded-full border border-gray-200">
                      +{p.supportedRituals.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-700 mt-auto pt-2 border-t border-gray-100">
                  <Clock size={16} className="mr-1.5 text-orange-500" />
                  <span>{p.experienceYears} Years Experience</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <Link
                  to={`/pandits/${p._id}`}
                  className="block w-full text-center bg-white text-orange-600 font-medium border border-orange-600 py-2 rounded hover:bg-orange-50 transition"
                >
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
