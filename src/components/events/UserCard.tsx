import { Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserCard({ user }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <img 
          src={user.image} 
          alt={user.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-white/80 text-sm">{user.role}</p>
          </div>
          {user.verified && (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < user.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-slate-500">({user.reviews} reviews)</span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{user.bio}</p>
        <div className="flex flex-wrap gap-2">
          {user.specialties.slice(0, 3).map((specialty, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}