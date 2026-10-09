import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { getProperties, updateProperty, deleteProperty } from '../../services/propertyService';
import type { Property, PropertyStatus } from '../../types/database';
import { formatPKR, formatArea } from '../../utils/formatters';

export const AdminPropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PropertyStatus>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperties({
        searchTerm: searchTerm.trim() || undefined,
        status: statusFilter,
      });
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      await updateProperty(propertyId, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm('Are you sure you want to delete this property from Supabase? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(propertyId);
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err: any) {
      alert(`Error deleting property: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950">
            Property Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage real estate listings stored in the Supabase PostgreSQL database.
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading properties from Supabase...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Building className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">No properties found.</h2>
          <p className="text-xs text-slate-500">No properties match your filter criteria.</p>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Type / Purpose</th>
                  <th className="py-3.5 px-4">Price (PKR)</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/properties/${p.id}`}
                            target="_blank"
                            className="font-bold text-navy-950 hover:text-gold-600 transition flex items-center gap-1 line-clamp-1"
                          >
                            <span>{p.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </Link>
                          <div className="text-[11px] text-slate-500 truncate">
                            {p.location}, {p.city}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{p.property_type}</span>
                      <div className="text-[11px] text-slate-500">{p.purpose}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-navy-950">
                      {formatPKR(p.price)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {formatArea(p.area, p.area_unit)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as PropertyStatus)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border-none shadow-sm cursor-pointer ${
                          p.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'Sold' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Rented">Rented</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/properties/${p.id}/edit`}
                          className="p-2 rounded-lg text-slate-600 hover:text-gold-600 hover:bg-slate-100 transition"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
