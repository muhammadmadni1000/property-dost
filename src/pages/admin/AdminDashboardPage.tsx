import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  CheckCircle2, 
  Clock, 
  CalendarCheck, 
  MessageSquare, 
  Plus, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { DashboardStats, Visit, Inquiry } from '../../types/database';
import { formatPKR } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    todayVisits: 0,
    pendingVisits: 0,
    confirmedVisits: 0,
    totalVisits: 0,
    newInquiries: 0,
  });

  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch properties statistics
        const { data: properties, error: propError } = await supabase
          .from('properties')
          .select('id, status');

        if (propError) throw propError;

        const totalProps = properties?.length || 0;
        const availProps = properties?.filter((p) => p.status === 'Available').length || 0;
        const soldProps = properties?.filter((p) => p.status === 'Sold').length || 0;
        const rentedProps = properties?.filter((p) => p.status === 'Rented').length || 0;

        // 2. Fetch visits statistics
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: visits, error: visitError } = await supabase
          .from('visits')
          .select(`
            *,
            property:properties(title, location),
            customer:customers(name, phone)
          `)
          .order('created_at', { ascending: false });

        if (visitError) throw visitError;

        const totalV = visits?.length || 0;
        const pendingV = visits?.filter((v) => v.status === 'Requested').length || 0;
        const confirmedV = visits?.filter((v) => v.status === 'Confirmed').length || 0;
        const todayV = visits?.filter((v) => v.visit_date === todayStr).length || 0;

        // 3. Fetch inquiries statistics
        const { data: inquiries, error: inqError } = await supabase
          .from('inquiries')
          .select(`
            *,
            customer:customers(name, phone)
          `)
          .order('created_at', { ascending: false });

        if (inqError) throw inqError;

        const newInq = inquiries?.filter((i) => i.status === 'New').length || 0;

        setStats({
          totalProperties: totalProps,
          availableProperties: availProps,
          soldProperties: soldProps,
          rentedProperties: rentedProps,
          todayVisits: todayV,
          pendingVisits: pendingV,
          confirmedVisits: confirmedV,
          totalVisits: totalV,
          newInquiries: newInq,
        });

        setRecentVisits((visits as Visit[]).slice(0, 5));
        setRecentInquiries((inquiries as Inquiry[]).slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Unable to load dashboard data from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
        <p className="text-xs font-semibold text-slate-600">Loading live database metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>Database Query Error</span>
        </div>
        <p className="text-xs text-rose-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
            Overview & Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time dealership performance from Supabase PostgreSQL.
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Properties</span>
            <Building className="w-4 h-4 text-navy-900" />
          </div>
          <div className="text-2xl font-black text-navy-950">{stats.totalProperties}</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {stats.availableProperties} currently available
          </div>
        </div>

        {/* Pending Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Visits</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.pendingVisits}</div>
          <div className="text-[11px] text-slate-500">
            Awaiting dealer confirmation
          </div>
        </div>

        {/* Confirmed Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Visits</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.confirmedVisits}</div>
          <div className="text-[11px] text-slate-500">
            {stats.todayVisits} scheduled for today
          </div>
        </div>

        {/* New Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Inquiries</span>
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{stats.newInquiries}</div>
          <div className="text-[11px] text-slate-500">
            Uncontacted buyer requests
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Visits & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Visits Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold-600" />
              <h2 className="text-base font-bold text-navy-950">Recent Visit Requests</h2>
            </div>
            <Link to="/admin/visits" className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentVisits.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No visit requests yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentVisits.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-navy-950">
                      {v.customer?.name || 'Customer'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {v.property?.title || 'Property'} • {v.visit_date} at {v.visit_time}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.status === 'Requested' ? 'bg-amber-100 text-amber-800' :
                    v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    v.status === 'Visited' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold-600" />
              <h2 className="text-base font-bold text-navy-950">Recent Inquiries</h2>
            </div>
            <Link to="/admin/inquiries" className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No inquiries yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-navy-950">
                      {inq.customer?.name || 'Inquirer'} ({inq.customer?.phone})
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-1 mt-0.5">
                      "{inq.message}"
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    inq.status === 'New' ? 'bg-indigo-100 text-indigo-800' :
                    inq.status === 'Contacted' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
