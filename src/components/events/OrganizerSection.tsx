import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  Calendar,
  MessageCircle,
} from "lucide-react";
import ScheduleTimeline from "@/components/events/ScheduleTimeline";

export default function OrganizerSection() {
  const organizer = {
    name: "Pro Volleyball Academy",
    logo: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=200&h=200&fit=crop",
    description:
      "Pro Volleyball Academy is the leading volleyball training organization in the region, dedicated to developing players of all ages and skill levels since 2015.",
    verified: true,
    followers: "12.5K",
    eventsHosted: 156,
    rating: 4.9,
    socialLinks: {
      website: "https://provolleyball.com",
      instagram: "@provolleyball",
    },
  };

  return (
    <div className="space-y-6">
      {/* Organizer Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Event Organizer
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Organizer Info */}
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-16 h-16 rounded-xl border-2 border-slate-100">
              <AvatarImage src={organizer.logo} alt={organizer.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl rounded-xl">
                PV
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900">
                  {organizer.name}
                </h4>
                {organizer.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                )}
              </div>

              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                {organizer.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{organizer.followers}</span>
                  <span className="text-slate-400">followers</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{organizer.eventsHosted}</span>
                  <span className="text-slate-400">events</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col gap-2 sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              Follow
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Event Schedule</h3>
        </div>

        <ScheduleTimeline />
      </div>
    </div>
  );
}
