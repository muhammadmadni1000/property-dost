import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, MapPin, Mail, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl(
    '+923005412890',
    'Salam! I am inquiring about properties listed on Property Dost.'
  );

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 shadow-md">
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-white">PROPERTY</span>
                <span className="text-xl font-black text-gold-400">DOST</span>
              </div>
            </div>
            
            <p className="text-xs text-gold-400 font-semibold tracking-wide uppercase">
              Find the Right Property. Make the Right Move.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise Property Dealer Management & Property Visit Booking Platform tailored for Pakistani real-estate dealers and genuine buyers in Jhelum, Punjab, Pakistan.
            </p>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-400 pl-2">
              Explore Portal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties" className="text-slate-300 hover:text-gold-400 transition">
                  All Properties in Jhelum
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-slate-300 hover:text-gold-400 transition">
                  Property Dost AI (اردو / Roman Urdu)
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-gold-400 transition">
                  About Our Network
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-gold-400 transition">
                  Contact & Office Directions
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-gold-400 transition">
                  Dealer & Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Areas Covered */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-400 pl-2">
              Key Localities (Jhelum)
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                Citi Housing Scheme Jhelum
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                Jhelum Cantonment (Cantt)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                Civil Lines & DC Office Area
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                Main G.T. Road Commercial Belt
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                River View Officers Colony
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                Kala Gujran Agricultural Belt
              </li>
            </ul>
          </div>

          {/* Contact Details & Trust */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-400 pl-2">
              Contact & Assurance
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Opposite Kazam Plaza, Main G.T. Road, Jhelum, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+92 300 1234567 (Support Demo)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>info@propertydost.pk</span>
              </div>
              
              <div className="pt-2 flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict Database-Level Booking Verification</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-300">PROPERTY DOST</strong>. All Rights Reserved. Your Trusted Property Partner | Jhelum & Punjab.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Demonstration real-estate records powered by <span className="text-gold-400 font-semibold">PostgreSQL & Supabase</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};
