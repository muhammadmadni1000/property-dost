import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Check, 
  Share2, 
  AlertCircle, 
  Building2, 
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';
import { getPropertyById } from '../services/propertyService';
import type { Property } from '../types/database';
import { formatPKR, formatExactPKR, formatArea, getWhatsAppUrl } from '../utils/formatters';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      if (!id) {
        setError('No property ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Supabase is queried by exact UUID
        const data = await getPropertyById(id);
        setProperty(data);
        setActiveImage(data.image_url || (data.images && data.images[0]) || '');
      } catch (err: any) {
        setError(err.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gold-500 border-t-transparent" />
        <p className="text-sm font-semibold text-slate-600">Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-navy-950">Property Not Found</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {error || "The property you are looking for does not exist in our Supabase database or may have been removed."}
        </p>
        <div className="pt-2">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-gold-400 font-bold text-xs uppercase tracking-wider hover:bg-navy-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  // Gallery array
  const allImages = property.images && property.images.length > 0
    ? property.images
    : property.image_url ? [property.image_url] : [];

  const whatsappMessage = `Salam! I am interested in property "${property.title}" (Ref: ${property.id}) listed on Property Dost.`;
  const whatsappUrl = getWhatsAppUrl(property.dealer_whatsapp || '+923005412890', whatsappMessage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Breadcrumb & Share Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Property</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Details (Left 8 Cols) and Booking/Dealer Card (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-md bg-navy-950 text-gold-400 uppercase tracking-wider">
                {property.purpose}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-200 text-slate-800">
                {property.property_type}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
                {property.status}
              </span>
              <span className="text-[11px] font-mono text-slate-600 ml-auto">
                Ref: {property.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
              <span>{property.location}, {property.city}, Punjab</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
              <img
                src={activeImage || property.image_url}
                alt={property.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      activeImage === img
                        ? 'border-gold-500 scale-95 shadow-md'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Property Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-gold-600" />
                  Area Size
                </div>
                <div className="mt-1 text-base font-black text-navy-950">
                  {formatArea(property.area, property.area_unit)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-gold-600" />
                  Bedrooms
                </div>
                <div className="mt-1 text-base font-black text-navy-950">
                  {property.bedrooms > 0 ? property.bedrooms : 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-gold-600" />
                  Bathrooms
                </div>
                <div className="mt-1 text-base font-black text-navy-950">
                  {property.bathrooms > 0 ? property.bathrooms : 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gold-600" />
                  City
                </div>
                <div className="mt-1 text-base font-black text-navy-950">
                  {property.city}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-navy-950">Description & Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features & Amenities */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-navy-950">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-medium"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Pricing & Booking Action */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Price & Book Card */}
          <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Listing Price
              </div>
              <div className="text-2xl sm:text-3xl font-black text-navy-950 mt-1">
                {formatPKR(property.price)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {formatExactPKR(property.price)}
              </div>
            </div>

            {/* CRITICAL: "Book Visit" button directs to exact property UUID */}
            <div className="space-y-3">
              <Link
                to={`/book-visit/${property.id}`}
                className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Book In-Person Visit</span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>

            {/* Verified Dealer Info Card */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500">
                Authorized Dealer
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-950">
                    {property.dealer_name || 'Property Dost Associate'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {property.dealer_phone || '+92 300 1234567'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Realtor | Jhelum Real Estate Board</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
