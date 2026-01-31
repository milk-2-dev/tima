import React from 'react';
import { 
  Thermometer, 
  Users, 
  ShowerHead, 
  Car, 
  Wifi, 
  Coffee,
  Accessibility,
  Lock
} from 'lucide-react';

const amenities = [
  {
    icon: Thermometer,
    title: 'Heated Indoor Hall',
    description: 'Climate-controlled arena maintained at comfortable temperature year-round',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Users,
    title: "Changing Rooms",
    description: "Separate men's and women's facilities, each accommodating up to 20 people",
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: ShowerHead,
    title: 'Hot Showers',
    description: 'Modern shower facilities with hot water available in all changing rooms',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    icon: Car,
    title: 'Free Parking',
    description: 'Spacious parking lot with 200+ spots, including disabled access spaces',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Wifi,
    title: 'Free Wi-Fi',
    description: 'High-speed wireless internet throughout the facility',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Coffee,
    title: 'Refreshment Area',
    description: 'On-site café with healthy snacks, drinks, and sports nutrition',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Accessibility,
    title: 'Wheelchair Accessible',
    description: 'Full accessibility including ramps, elevators, and adapted facilities',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: Lock,
    title: 'Equipment Storage',
    description: 'Secure lockers available for personal belongings during training',
    color: 'bg-rose-100 text-rose-600',
  },
];

export default function FacilityAmenities() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Facility Amenities</h3>
      <div className="grid gap-3">
        {amenities.map((amenity, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
          >
            <div className={`w-10 h-10 rounded-lg ${amenity.color} flex items-center justify-center flex-shrink-0`}>
              <amenity.icon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-medium text-slate-900 text-sm">{amenity.title}</h5>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{amenity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}