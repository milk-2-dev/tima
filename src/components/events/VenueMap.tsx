import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

export default function VenueMap() {
  const mapUrl = 'https://maps.google.com';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Location & Directions</h3>
      </div>
      
      {/* Map */}
      <div className="relative h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.2436849!3d34.0522342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>

      {/* Directions Button */}
      <div className="p-4">
        <Button 
          className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl h-11"
          onClick={() => window.open(mapUrl, '_blank')}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </div>
    </div>
  );
}