import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Building2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { getPropertyById } from '../services/propertyService';
import { createVisitBooking } from '../services/visitService';
import type { Property, Visit } from '../types/database';
import { formatPKR, formatArea } from '../utils/formatters';

export const BookVisitPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  // Form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const timeSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:30 PM',
    '03:30 PM',
    '04:30 PM',
    '05:30 PM',
    '06:30 PM',
  ];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [visitDate, setVisitDate] = useState(defaultDateStr);
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [confirmedVisit, setConfirmedVisit] = useState<Visit | null>(null);

  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) {
        setPropertyError('No property ID specified in URL.');
        setLoadingProperty(false);
        return;
      }

      try {
        setLoadingProperty(true);
        setPropertyError(null);
        // Supabase is queried using the exact propertyId from the URL
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err: any) {
        setPropertyError(err.message || 'Property Not Found');
      } finally {
        setLoadingProperty(false);
      }
    }

    loadProperty();
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSubmissionError(null);
    setSubmitting(true);

    try {
      // Direct call to visit service which verifies Supabase and inserts visit
      const result = await createVisitBooking({
        propertyId: property.id,
        name,
        phone,
        email: email || undefined,
        visitDate,
        visitTime,
        message: message || undefined,
      });

      // ONLY after Supabase confirms the INSERT succeeded:
      setConfirmedVisit(result);
    } catch (err: any) {
      setSubmissionError(err.message || 'Unable to submit visit request.');
    } finally {
      setSubmitting(false);
    }
  };

  // State: Loading Property
  if (loadingProperty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Verifying property in Supabase...</p>
      </div>
    );
  }

  // State: Property Not Found (DO NOT show booking form)
  if (propertyError || !property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-navy-950">Property Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          The requested property ID <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-700">{propertyId}</code> could not be found in our database. Visits can only be booked for valid, registered properties.
        </p>
        <div className="pt-2">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-gold-400 font-bold text-xs uppercase tracking-wider hover:bg-navy-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Available Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  // State: Booking Success (Rendered ONLY after Supabase confirms visit INSERT)
  if (confirmedVisit) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              Booking Reserved
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              Visit Request Submitted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your property visit has been registered in the database. Our authorized dealer will meet you on site.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                {confirmedVisit.status}
              </span>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Booking Reference</span>
              <span className="font-mono text-xs font-bold text-navy-950 text-right break-all">
                {confirmedVisit.id}
              </span>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Property</span>
              <span className="font-bold text-navy-950 text-right max-w-xs">
                {property.title}
              </span>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Location</span>
              <span className="text-slate-800 text-right">
                {property.location}, {property.city}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-500 font-medium block">Appointment Date</span>
                <span className="font-bold text-navy-950">{confirmedVisit.visit_date}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Time Slot</span>
                <span className="font-bold text-navy-950">{confirmedVisit.visit_time}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-medium block">Customer</span>
                <span className="font-semibold text-slate-800">
                  {confirmedVisit.customer?.name || name}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Contact Mobile</span>
                <span className="font-semibold text-slate-800">
                  {confirmedVisit.customer?.phone || phone}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/properties/${property.id}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold transition"
            >
              View Property Details
            </Link>
            <Link
              to="/properties"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-bold transition"
            >
              Browse Other Properties
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // State: Booking Form
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation */}
      <div>
        <Link
          to={`/properties/${property.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Property Details</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Physical Visit Scheduling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              Schedule Your Property Tour
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Reserve an exclusive on-site visit with our certified property representative.
            </p>
          </div>

          {/* Error Message */}
          {submissionError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Booking Request Failed</p>
                <p className="mt-0.5">{submissionError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Pakistani Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0300-1234567 or +92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. tariq@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Visit Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Available Time Slots <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setVisitTime(slot)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition ${
                      visitTime === slot
                        ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Special Requests or Questions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mention any specific timing preference, family members attending, or questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                    <span>Submitting visit request...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Visit Reservation</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict duplicate booking protection applied at database level</span>
            </div>

          </form>
        </div>

        {/* Right Column: Selected Property Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Selected Property
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-[16/10] bg-slate-100 relative">
              <img
                src={property.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-navy-950 text-gold-400 text-[10px] font-bold uppercase">
                {property.purpose}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-navy-950 line-clamp-2">
                  {property.title}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 text-gold-600 shrink-0" />
                  <span>{property.location}, {property.city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  {formatArea(property.area, property.area_unit)}
                </span>
                <span className="text-sm font-black text-navy-950">
                  {formatPKR(property.price)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600 break-all">
                UUID: {property.id}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-xs space-y-2">
            <div className="font-bold text-navy-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Physical Visit Policy</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              - Visits are accompanied by our certified real estate dealer.<br />
              - No advance visiting fees or booking charges.<br />
              - Arrive 10 minutes prior to your reserved slot.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
