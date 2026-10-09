import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Target, 
  CheckCircle2, 
  Award,
  Sparkles,
  MapPin
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      role: 'Member 1: UI/UX & Frontend',
      focus: 'Design Architecture & Public Portal',
      description: 'Crafted the Deep Navy and Warm Gold design system, responsive card components, and accessible interaction patterns.',
    },
    {
      role: 'Member 2: Property & Visit Management',
      focus: 'Booking Workflows & Visit Lifecycle',
      description: 'Engineered the visit scheduling pipeline, time-slot allocation, and duplicate booking conflict handling.',
    },
    {
      role: 'Member 3: Database & Backend',
      focus: 'Supabase PostgreSQL & Security Policies',
      description: 'Architected the relational schema, foreign key integrity, auto-generating UUIDs, and strict Row Level Security (RLS).',
    },
    {
      role: 'Member 4: AI Property Assistant',
      focus: 'Property Dost AI NLP Engine',
      description: 'Built the natural language parser supporting Urdu, Roman Urdu, and English grounded strictly in database listings.',
    },
    {
      role: 'Member 5: Admin Dashboard & QA',
      focus: 'Dealer Operations, Testing & Deployment',
      description: 'Developed administrative inventory management, automated Vitest suites, and production Vercel readiness.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-600 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Our Vision & Legacy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-950">
          Redefining Real Estate in Jhelum & Punjab
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          <strong>PROPERTY DOST</strong> is a specialized property dealership and visit scheduling management platform built to establish trust, eliminate deceptive listings, and empower buyers across Jhelum, Punjab, Pakistan.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 text-gold-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-navy-950">100% Verified Ownership</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every listing published on our platform undergoes strict document and Fard verification before being presented to genuine buyers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500 text-navy-950 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-navy-950">Database-Level Integrity</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We avoid visual prototypes and dummy placeholders. Real UUIDs, database-level slot locks, and Row Level Security power our architecture.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 text-gold-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-navy-950">Direct Dealer Accompaniment</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Scheduled visits connect you directly with respected, local property dealers who understand market rates and neighborhood legalities.
          </p>
        </div>
      </div>

      {/* 5-Member Team Responsibilities */}
      <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 space-y-8 border border-slate-200">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-gold-600">
            Engineered with Excellence
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
            5-Member Engineering Team Structure
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Specialized division of responsibilities ensuring enterprise-grade software delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-black uppercase text-gold-600 tracking-wider">
                {member.role}
              </div>
              <h3 className="text-base font-bold text-navy-950">
                {member.focus}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
