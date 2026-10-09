import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Phone,
  UserCheck
} from 'lucide-react';
import { getVisits, updateVisitStatus, deleteVisit } from '../../services/visitService';
import type { Visit, VisitStatus } from '../../types/database';
import { getWhatsAppUrl } from '../../utils/formatters';

export const AdminVisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | VisitStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVisits();
      setVisits(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load visits from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: VisitStatus) => {
    try {
      setUpdatingId(id);
      await updateVisitStatus(id, newStatus);
      setVisits((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
    } catch (err: any) {
      alert(`Error updating visit: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this visit booking from Supabase?')) {
      return;
    }

    try {
      await deleteVisit(id);
      setVisits((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(`Error deleting visit: ${err.message}`);
    }
  };

  const filteredVisits = filterStatus === 'all'
    ? visits
    : visits.filter((v) => v.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950">
            Property Visit Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and coordinate physical buyer visits registered in Supabase.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="all">All ({visits.length})</option>
            <option value="Requested">Requested</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Visited">Visited</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading visit requests from Supabase...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredVisits.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">No visit requests yet.</h2>
          <p className="text-xs text-slate-500">
            When visitors book visits through the public portal, they will appear here.
          </p>
        </div>
      )}

      {!loading && !error && filteredVisits.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Appointment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVisits.map((v) => {
                  const customerPhone = v.customer?.phone || '';
                  const whatsappMsg = `Salam ${v.customer?.name || ''}! Regarding your visit booking for "${v.property?.title || 'property'}" on ${v.visit_date} at ${v.visit_time}.`;
                  const whatsappUrl = getWhatsAppUrl(customerPhone, whatsappMsg);

                  return (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-navy-950">
                          {v.customer?.name || 'Customer'}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${customerPhone}`}
                            className="text-slate-600 hover:text-navy-950 text-[11px]"
                          >
                            {customerPhone}
                          </a>
                          {customerPhone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-semibold text-[10px]"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                        {v.customer?.email && (
                          <div className="text-[10px] text-slate-400">{v.customer.email}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {v.property ? (
                          <>
                            <Link
                              to={`/properties/${v.property.id}`}
                              target="_blank"
                              className="font-bold text-navy-950 hover:text-gold-600 transition flex items-center gap-1 line-clamp-1"
                            >
                              <span>{v.property.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                            </Link>
                            <div className="text-[11px] text-slate-500">
                              {v.property.location}, {v.property.city}
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Unlinked Property</span>
                        )}
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                          Ref: {v.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{v.visit_date}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gold-600" />
                          <span>{v.visit_time}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          v.status === 'Requested' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          v.status === 'Visited' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {v.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-500 italic">
                        {v.message ? `"${v.message}"` : '-'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {v.status === 'Requested' && (
                            <button
                              onClick={() => handleStatusUpdate(v.id, 'Confirmed')}
                              disabled={updatingId === v.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition"
                            >
                              Confirm
                            </button>
                          )}

                          {v.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(v.id, 'Visited')}
                              disabled={updatingId === v.id}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition"
                            >
                              Mark Visited
                            </button>
                          )}

                          {v.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(v.id, 'Cancelled')}
                              disabled={updatingId === v.id}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-semibold text-[11px] transition"
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(v.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Visit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
