import { Coffee, Dumbbell, Users, Trophy, UtensilsCrossed } from 'lucide-react';

const schedule = [
  { time: '9:00 AM', title: 'Registration & Warm-up', description: 'Check-in, equipment setup, and dynamic stretching', icon: Coffee, color: 'bg-blue-500' },
  { time: '9:30 AM', title: 'Fundamentals Clinic', description: 'Passing, setting, and ball control drills', icon: Dumbbell, color: 'bg-purple-500' },
  { time: '11:00 AM', title: 'Position-Specific Training', description: 'Specialized training for setters, hitters, and liberos', icon: Users, color: 'bg-emerald-500' },
  { time: '12:30 PM', title: 'Lunch Break', description: 'Catered lunch and networking with coaches', icon: UtensilsCrossed, color: 'bg-amber-500' },
  { time: '1:30 PM', title: 'Advanced Techniques', description: 'Jump serving, quick attacks, and defensive strategies', icon: Dumbbell, color: 'bg-rose-500' },
  { time: '3:00 PM', title: 'Scrimmage & Tournament', description: 'Apply skills in competitive match play', icon: Trophy, color: 'bg-indigo-500' },
];

export default function ScheduleTimeline() {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 hidden md:block" />
      
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div 
            key={index}
            className="group relative flex gap-4 md:gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
          >
            {/* Timeline Dot */}
            <div className={`relative z-10 w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                  {item.time}
                </span>
                <h4 className="font-semibold text-slate-900">{item.title}</h4>
              </div>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}