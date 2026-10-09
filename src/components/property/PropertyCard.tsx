import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import type { Property } from '../../types/database';
import { formatPKR, formatArea, getWhatsAppUrl } from '../../utils/formatters';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // CRITICAL REQUIREMENT: Use exact Supabase UUID directly
  const propertyId = property.id;

  const defaultImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const whatsappMessage = `Salam! I am interested in property "${property.title}" (Ref: ${propertyId}) listed on Property Dost.`;
  const whatsappLink = getWhatsAppUrl(property.dealer_whatsapp || '+923005412890', whatsappMessage);

  const statusColors: Record<string, string> = {
    Available: 'bg-emerald-500 text-white',
    Sold: 'bg-rose-600 text-white',
    Rented: 'bg-slate-700 text-white',
  };

  return (
    <div 
      data-testid={`property-card-${propertyId}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Property Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.image_url || defaultImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-navy-900/90 text-gold-400 uppercase tracking-wider backdrop-blur-sm shadow-sm">
              {property.purpose}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm">
              {property.property_type}
            </span>
          </div>

          <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-sm ${statusColors[property.status] || 'bg-slate-800 text-white'}`}>
            {property.status}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
            {formatPKR(property.price)}
          </div>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/properties/${propertyId}`}
            className="block text-base sm:text-lg font-bold text-navy-950 hover:text-gold-600 transition-colors line-clamp-1"
            title={property.title}
          >
            {property.title}
          </Link>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>
        </div>

        {/* Key Features Pill Strip */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {formatArea(property.area, property.area_unit)}
            </span>
          </div>

          {property.bedrooms > 0 ? (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          ) : (
            <div className="text-slate-400 italic">Open Plot/Shop</div>
          )}

          {property.bathrooms > 0 ? (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
          ) : (
            <div className="text-slate-400">-</div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-1 flex items-center gap-2">
          {/* Details Link */}
          <Link
            to={`/properties/${propertyId}`}
            className="flex-1 py-2.5 px-3 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-950 transition flex items-center justify-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Book Visit Link (Preserves Exact UUID) */}
          <Link
            to={`/book-visit/${propertyId}`}
            className="py-2.5 px-3.5 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-800 text-gold-400 hover:text-gold-300 transition flex items-center gap-1.5 shadow-sm"
            title="Schedule an in-person physical property visit"
          >
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Book Visit</span>
          </Link>

          {/* WhatsApp Direct */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
            title="Instant WhatsApp consultation"
            aria-label="WhatsApp dealer"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
