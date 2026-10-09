import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building, AlertCircle, RefreshCw } from 'lucide-react';
import { getProperties } from '../services/propertyService';
import type { Property, PropertyFilters } from '../types/database';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyFilterBar } from '../components/property/PropertyFilterBar';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: searchParams.get('q') || '',
    purpose: searchParams.get('purpose') || 'All',
    propertyType: searchParams.get('type') || 'All',
    bedrooms: searchParams.get('beds') ? Number(searchParams.get('beds')) : 'any',
    status: 'Available',
    sortBy: 'newest',
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (currentFilters: PropertyFilters) => {
    try {
      setLoading(true);
      setError(null);
      // Supabase is the sole source of truth
      const data = await getProperties(currentFilters);
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load properties from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Sync with URL params
    const nextParams = new URLSearchParams();
    if (newFilters.searchTerm) nextParams.set('q', newFilters.searchTerm);
    if (newFilters.purpose && newFilters.purpose !== 'All') nextParams.set('purpose', newFilters.purpose);
    if (newFilters.propertyType && newFilters.propertyType !== 'All') nextParams.set('type', newFilters.propertyType);
    if (newFilters.bedrooms && newFilters.bedrooms !== 'any') nextParams.set('beds', String(newFilters.bedrooms));
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    const resetState: PropertyFilters = {
      searchTerm: '',
      purpose: 'All',
      propertyType: 'All',
      bedrooms: 'any',
      status: 'Available',
      sortBy: 'newest',
    };
    setFilters(resetState);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">
          <Building className="w-4 h-4" />
          <span>Real-Estate Inventory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
          Available Properties in Jhelum & Punjab
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verified listings retrieved directly from Supabase PostgreSQL.
        </p>
      </div>

      {/* Filter Bar */}
      <PropertyFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-500" />
            <span>Loading properties...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Unable to load properties</span>
          </div>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={() => fetchProperties(filters)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Building className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">No properties found.</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No properties match your current search filters. Try adjusting your filter parameters or resetting them.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold hover:bg-navy-800 transition"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && properties.length > 0 && (
        <div>
          <div className="mb-4 text-xs font-semibold text-slate-500">
            Showing <span className="text-navy-950 font-bold">{properties.length}</span> verified {properties.length === 1 ? 'property' : 'properties'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
