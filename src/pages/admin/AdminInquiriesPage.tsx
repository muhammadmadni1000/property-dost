import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Phone
} from 'lucide-react';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '../../services/inquiryService';
import type { Inquiry, InquiryStatus } from '../../types/database';
import { getWhatsAppUrl } from '../../utils/formatters';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInquiries();
      setInquiries(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load inquiries from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: InquiryStatus) => {
    try {
      setUpdatingId(id);
      await updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    } catch (err: any) {
      alert(`Error updating inquiry: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) {
      return;
    }

    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(`Error deleting inquiry: ${err.message}`);
    }
  };

  const filteredInquiries = statusFilter === 'all'
    ? inquiries
    : inquiries.filter((i) => i.status === statusFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950">
            Customer Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions and requirement briefs received via the public portal.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="all">All ({inquiries.length})</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading inquiries from Supabase...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredInquiries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">No inquiries yet.</h2>
          <p className="text-xs text-slate-500">
            Public inquiries will appear here as visitors submit contact requests.
          </p>
        </div>
      )}

      {!loading && !error && filteredInquiries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Message / Requirement</th>
                  <th className="py-3.5 px-4">Property Context</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInquiries.map((inq) => {
                  const customerPhone = inq.customer?.phone || '';
                  const whatsappMsg = `Salam ${inq.customer?.name || ''}! Regarding your Property Dost inquiry.`;
                  const whatsappUrl = getWhatsAppUrl(customerPhone, whatsappMsg);

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-navy-950">
                          {inq.customer?.name || 'Anonymous Inquirer'}
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
                        {inq.customer?.email && (
                          <div className="text-[10px] text-slate-400">{inq.customer.email}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="text-slate-800 text-xs leading-relaxed">
                          {inq.message}
                        </p>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          ID: {inq.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {inq.property ? (
                          <Link
                            to={`/properties/${inq.property.id}`}
                            target="_blank"
                            className="font-bold text-navy-950 hover:text-gold-600 transition flex items-center gap-1 line-clamp-1"
                          >
                            <span>{inq.property.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-[11px]">General Inquiry</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          inq.status === 'New' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                          inq.status === 'Contacted' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {inq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inq.status === 'New' && (
                            <button
                              onClick={() => handleStatusUpdate(inq.id, 'Contacted')}
                              disabled={updatingId === inq.id}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] transition"
                            >
                              Mark Contacted
                            </button>
                          )}

                          {inq.status !== 'Resolved' && (
                            <button
                              onClick={() => handleStatusUpdate(inq.id, 'Resolved')}
                              disabled={updatingId === inq.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition"
                            >
                              Mark Resolved
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Inquiry"
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
