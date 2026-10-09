import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { PropertyFilters } from '../../types/database';

interface PropertyFilterBarProps {
  filters: PropertyFilters;
  onChange: (newFilters: PropertyFilters) => void;
  onReset: () => void;
}

export const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const propertyTypes = [
    'All',
    'House',
    'Plot',
    'Flat',
    'Shop',
    'Office',
    'Agricultural Land',
    'Commercial Property',
  ];

  const purposes = ['All', 'For Sale', 'For Rent'];
  const bedroomOptions = ['any', '1', '2', '3', '4', '5'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Top search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by area name, scheme (e.g. Citi Housing, Cantt, Civil Lines)..."
          value={filters.searchTerm || ''}
          onChange={(e) => onChange({ ...filters, searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition"
        />
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        {/* Purpose */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
          <select
            value={filters.purpose || 'All'}
            onChange={(e) => onChange({ ...filters, purpose: e.target.value })}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          >
            {purposes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType || 'All'}
            onChange={(e) => onChange({ ...filters, propertyType: e.target.value })}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          >
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
          <select
            value={filters.bedrooms || 'any'}
            onChange={(e) =>
              onChange({
                ...filters,
                bedrooms: e.target.value === 'any' ? 'any' : Number(e.target.value),
              })
            }
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          >
            <option value="any">Any Bedrooms</option>
            {bedroomOptions.filter((b) => b !== 'any').map((b) => (
              <option key={b} value={b}>
                {b}+ Bedrooms
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Sort By</label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-asc">Area: Small to Large</option>
            <option value="area-desc">Area: Large to Small</option>
          </select>
        </div>

        {/* Reset Actions */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
