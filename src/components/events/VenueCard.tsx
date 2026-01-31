import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function VenueCard() {
  const venue = {
    name: 'Olympic Sports Center',
    address: '1234 Sports Avenue, Main Arena',
    city: 'Los Angeles, CA 90001',
    phone: '+1 (555) 123-4567',
    email: 'info@olympicsportscenter.com',
    hours: 'Open 6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Venue Image */}
      <div className="relative h-48">
        <img 
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            Venue
          </Badge>
          <h3 className="text-xl font-bold text-white">{venue.name}</h3>
        </div>
      </div>

      {/* Venue Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-slate-700">{venue.address}</p>
            <p className="text-slate-500">{venue.city}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-slate-600">{venue.hours}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <a href={`tel:${venue.phone}`} className="text-blue-600 hover:underline">{venue.phone}</a>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <a href={`mailto:${venue.email}`} className="text-blue-600 hover:underline">{venue.email}</a>
        </div>
      </div>
    </div>
  );
}