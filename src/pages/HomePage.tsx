import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  CalendarCheck, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Building,
  KeyRound,
  FileCheck2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getProperties } from '../services/propertyService';
import type { Property } from '../types/database';
import { PropertyCard } from '../components/property/PropertyCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick search bar state
  const [searchPurpose, setSearchPurpose] = useState('All');
  const [searchType, setSearchType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        setError(null);
        // Supabase is the sole source of truth
        const properties = await getProperties({ status: 'Available' });
        setFeaturedProperties(properties.slice(0, 6));
      } catch (err: any) {
        setError(err.message || 'Unable to load properties from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchPurpose !== 'All') params.set('purpose', searchPurpose);
    if (searchType !== 'All') params.set('type', searchType);
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-navy-950 text-white overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Architectural backdrop layer */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        
        {/* Radial ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-gold-400/30 text-gold-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Your Trusted Property Partner | Jhelum & Punjab</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Find the Right Property. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
                Make the Right Move.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
              Connecting genuine buyers with verified property listings in Jhelum Cantt, Citi Housing, Civil Lines, and prime Punjab real estate with transparent physical visit scheduling.
            </p>

            {/* Hero Search Box */}
            <form 
              onSubmit={handleHeroSearch}
              className="mt-8 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/20 text-slate-800 text-left grid grid-cols-1 sm:grid-cols-4 gap-3"
            >
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Purpose
                </label>
                <select
                  value={searchPurpose}
                  onChange={(e) => setSearchPurpose(e.target.value)}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="All">Buy or Rent</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="All">All Types</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Flat">Flat</option>
                  <option value="Shop">Shop</option>
                  <option value="Office">Office</option>
                  <option value="Agricultural Land">Agricultural Land</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Location / Society
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Citi Housing, Cantt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs font-semibold py-2 pl-3 pr-2 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>

            {/* Quick Filter Tags */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Popular Searches:</span>
              <button 
                type="button" 
                onClick={() => navigate('/properties?type=House')} 
                className="hover:text-gold-400 underline decoration-slate-600 underline-offset-4"
              >
                5 Marla Houses
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => navigate('/properties?type=Plot')} 
                className="hover:text-gold-400 underline decoration-slate-600 underline-offset-4"
              >
                10 Marla Plots
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => navigate('/properties?q=Citi+Housing')} 
                className="hover:text-gold-400 underline decoration-slate-600 underline-offset-4"
              >
                Citi Housing Jhelum
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => navigate('/properties?q=Cantt')} 
                className="hover:text-gold-400 underline decoration-slate-600 underline-offset-4"
              >
                Jhelum Cantt
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES (From Supabase Only) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>Handpicked Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
              Featured Properties in Jhelum
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time available properties retrieved directly from our verified database.
            </p>
          </div>

          <Link
            to="/properties"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600 transition"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic state rendering */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Unable to load properties from Supabase</p>
              <p className="text-xs text-rose-700 mt-1">{error}</p>
              <p className="text-xs text-slate-600 mt-2">
                Make sure your Supabase URL and key are configured and the seed data migration has been executed.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && featuredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Building className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No properties found.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The Supabase database currently has no available properties or seed data has not yet been applied.
            </p>
          </div>
        )}

        {!loading && !error && featuredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 3. HOW PROPERTY VISIT BOOKING WORKS */}
      <section className="bg-slate-100 py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-600 mb-2">
              <CalendarCheck className="w-4 h-4" />
              <span>Transparent Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
              How Property Visit Booking Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Zero fake listings, zero guesswork. Direct physical inspection appointments managed with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 font-black text-lg flex items-center justify-center mx-auto">
                01
              </div>
              <h3 className="text-base font-bold text-navy-950">Explore Verified Listings</h3>
              <p className="text-xs text-slate-600">
                Browse authentic houses, plots, and commercial units in Jhelum with real pricing in PKR.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-gold-500 text-navy-950 font-black text-lg flex items-center justify-center mx-auto">
                02
              </div>
              <h3 className="text-base font-bold text-navy-950">Select Date & Time Slot</h3>
              <p className="text-xs text-slate-600">
                Pick a convenient visit slot. Our system enforces database-level slot reservation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 font-black text-lg flex items-center justify-center mx-auto">
                03
              </div>
              <h3 className="text-base font-bold text-navy-950">Receive Real Visit ID</h3>
              <p className="text-xs text-slate-600">
                Instant confirmation directly from Supabase with your unique booking reference number.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto">
                04
              </div>
              <h3 className="text-base font-bold text-navy-950">Dealer Guided Tour</h3>
              <p className="text-xs text-slate-600">
                Meet our certified property dealer on-site, inspect documentation, and discuss pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI PROPERTY ASSISTANT SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white border border-gold-500/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Multilingual Natural Language Assistant</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Meet Property Dost AI
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Describe your dream property in everyday <strong>Roman Urdu</strong>, <strong>Urdu</strong>, or <strong>English</strong>. Our assistant matches your budget, size (Marla/Kanal), and preferred locality with genuine Supabase database listings.
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-gold-300">
                "Mujhe Jhelum Citi Housing mein 5 marla ka ghar chahiye, budget 1.35 crore ke around."
              </div>

              <div className="pt-2">
                <Link
                  to="/ai-assistant"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-lg transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try Property Dost AI</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Hallucination Guarantee</span>
              </div>
              <p className="text-slate-300">
                Unlike generic chatbots, Property Dost AI only recommends properties that physically exist in our PostgreSQL database. If no matching property is available, it transparently tells you.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Supports Urdu & Roman Urdu</span>
                <span className="text-emerald-400">Database Grounded</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY PROPERTY DOST / TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
            Why Jhelum Property Buyers Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Professional property dealership built on transparency, legal safety, and verified ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Registry & Fard Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every listing is cross-checked with relevant land revenue departments and municipal housing authorities.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Guaranteed Time Slots</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict duplicate protection ensures you never arrive at a property to find conflicting buyer appointments.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Certified Local Dealers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Work with respected dealers based in Jhelum Cantt, Civil Lines, and Citi Housing with decades of community trust.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
