import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  Menu, 
  X, 
  UserCheck, 
  LogIn, 
  LogOut,
  CalendarCheck
} from 'lucide-react';
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge';
import { SetupNoticeModal } from '../common/SetupNoticeModal';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-gold-400 font-semibold'
        : 'text-slate-200 hover:text-gold-300'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-md">
        {/* Top Information Strip */}
        <div className="bg-navy-950 text-slate-300 text-xs border-b border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5 text-slate-300 hover:text-gold-400 transition">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-medium">+92 300 1234567</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">(Helpline)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 hidden md:flex">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>G.T. Road, Jhelum, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 hidden lg:flex">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <ConnectionStatusBadge onOpenSetup={() => setSetupModalOpen(true)} />
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav className="bg-navy-900 border-b border-navy-800 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              
              {/* Brand Logo & Tagline */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shadow-md group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
                      PROPERTY
                    </span>
                    <span className="text-xl sm:text-2xl font-black tracking-wider text-gold-400">
                      DOST
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-medium text-slate-300 tracking-tight">
                    Find the Right Property. Make the Right Move.
                  </p>
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <div className="hidden md:flex items-center space-x-7">
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/properties" className={navLinkClass}>
                  Properties
                </NavLink>
                <NavLink to="/ai-assistant" className={navLinkClass}>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    Property Dost AI
                  </span>
                </NavLink>
                <NavLink to="/about" className={navLinkClass}>
                  About
                </NavLink>
                <NavLink to="/contact" className={navLinkClass}>
                  Contact
                </NavLink>
              </div>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-navy-800 text-gold-400 border border-navy-700 hover:bg-navy-700 hover:text-gold-300 transition"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Book Visit
                </Link>

                {user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-sm transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-rose-400 transition"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Admin Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-navy-950 border-t border-navy-800 px-4 pt-3 pb-6 space-y-3">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-gold-400"
              >
                Home
              </NavLink>
              <NavLink
                to="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-gold-400"
              >
                Properties
              </NavLink>
              <NavLink
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-medium text-gold-400"
              >
                <Sparkles className="w-4 h-4" />
                Property Dost AI
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-gold-400"
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-gold-400"
              >
                Contact
              </NavLink>

              <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-lg bg-gold-500 text-navy-950 font-semibold text-sm"
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2 rounded-lg text-slate-300 hover:text-rose-400 text-sm"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-navy-800 text-slate-200 hover:bg-navy-700 font-medium text-sm"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Setup Guide Modal */}
      <SetupNoticeModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
      />
    </>
  );
};
