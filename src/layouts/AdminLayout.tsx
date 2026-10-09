import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Building, 
  CalendarCheck, 
  MessageSquare, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ConnectionStatusBadge } from '../components/common/ConnectionStatusBadge';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
      isActive
        ? 'bg-gold-500 text-navy-950 shadow-sm'
        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy-950 border-r border-navy-800 flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-black text-sm tracking-wider text-white">
                <span>PROPERTY</span>
                <span className="text-gold-400">DOST</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-500">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 space-y-1.5">
          <NavLink to="/admin" end className={navItemClass}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </NavLink>

          <NavLink to="/admin/properties" className={navItemClass}>
            <Building className="w-4 h-4" />
            <span>Manage Properties</span>
          </NavLink>

          <NavLink to="/admin/visits" className={navItemClass}>
            <CalendarCheck className="w-4 h-4" />
            <span>Visit Requests</span>
          </NavLink>

          <NavLink to="/admin/inquiries" className={navItemClass}>
            <MessageSquare className="w-4 h-4" />
            <span>Customer Inquiries</span>
          </NavLink>
        </nav>

        {/* User & Session Footer */}
        <div className="p-4 border-t border-navy-800 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-navy-900 border border-navy-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Logged in as</div>
            <div className="text-xs font-semibold text-white truncate" title={user?.email || 'Admin'}>
              {user?.email || 'admin@propertydost.pk'}
            </div>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-navy-900/60 hover:bg-navy-900 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline">
              Property Dost Management Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionStatusBadge />
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-navy-950 p-4 space-y-2 border-b border-navy-800 text-slate-200">
            <NavLink
              to="/admin"
              end
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg hover:bg-navy-900"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </NavLink>
            <NavLink
              to="/admin/properties"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg hover:bg-navy-900"
            >
              <Building className="w-4 h-4" />
              <span>Manage Properties</span>
            </NavLink>
            <NavLink
              to="/admin/visits"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg hover:bg-navy-900"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Visit Requests</span>
            </NavLink>
            <NavLink
              to="/admin/inquiries"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg hover:bg-navy-900"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Inquiries</span>
            </NavLink>
            <div className="pt-2 border-t border-navy-800 flex items-center justify-between">
              <Link to="/" className="text-xs text-gold-400">View Public Site</Link>
              <button onClick={handleSignOut} className="text-xs text-rose-400">Sign Out</button>
            </div>
          </div>
        )}

        {/* Routed Sub-pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
