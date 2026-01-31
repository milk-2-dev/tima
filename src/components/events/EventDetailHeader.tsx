import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Check,
} from "lucide-react";

import type { EventItem } from "@/types/app.types";
import { getEventTime, getFormatedDate } from "@/helpers";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvailableSpots } from "@/components/events/AvailableSpots";

type EventDetailHeaderProps = {
  event: EventItem;
};

export default function EventDetailHeader({
  event: eventData,
}: EventDetailHeaderProps) {
  const navigate = useNavigate();

  const [isJoined, setIsJoined] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const eventTime = getEventTime(eventData);

  const participantsPlaceholder = [
    {
      id: 1,
      name: "Alex",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Maria",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "James",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Sophie",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];

  const participants = new Array(eventData.current_players).fill(null).map((_, index) => participantsPlaceholder[index]);


  return (
    <div className="relative w-full min-h-[420px] md:min-h-[380px] overflow-hidden">
      {/* Sticky Top Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky 
            ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group"
            aria-label="Go back"
          >
            <div className={`rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-300 ${
              isSticky 
                ? 'w-9 h-9 bg-white/10 group-hover:bg-white/20' 
                : 'w-10 h-10 bg-white/10 backdrop-blur-md group-hover:bg-white/20'
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className={`hidden md:inline text-sm font-medium transition-opacity duration-300 ${
              isSticky ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {isSticky ? 'Back' : 'Back to Events'}
            </span>
          </button>

          {/* Event Title (visible when sticky) */}
          {isSticky && (
            <h2 className="hidden md:block text-white font-semibold text-sm truncate max-w-md mx-4">
              {eventData.name}
            </h2>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              size={isSticky ? "sm" : "default"}
              className={`rounded-xl font-medium border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-2 ${
                isSticky ? 'h-9 px-3 text-sm' : 'h-10 px-4'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            
            <Button
              onClick={() => setIsJoined(!isJoined)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              size={isSticky ? "sm" : "default"}
              className={`rounded-xl font-semibold transition-all duration-300 ${
                isSticky ? 'h-9 px-4 text-sm' : 'h-10 px-5'
              } ${isJoined 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
              }`}
            >
              {isJoined ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Joined</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Join Event</span>
                  <span className="sm:hidden">Join</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1600&h=900&fit=crop')`,
          transform: isHovering ? "scale(1.02)" : "scale(1)",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]" />

      {/* Back Button */}
      {/* <button
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group z-10"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="hidden md:inline text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Back to Events
        </span>
      </button> */}

      {/* Action Buttons */}
      {/* <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-row gap-3 w-full md:w-auto mt-2 md:mt-0 md:self-end">
      <Button
        variant="outline"
        className="
                  flex-1 md:flex-none md:w-36 h-11 rounded-xl font-semibold text-sm
                  border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm
                  hover:bg-white/20 hover:border-white/50
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
                  flex items-center justify-center gap-2
                  transform hover:scale-[1.02] active:scale-[0.98]
                "
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

        <Button
          onClick={() => setIsJoined(!isJoined)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`
                  flex-1 md:flex-none md:w-36 h-11 rounded-xl font-semibold text-sm
                  transition-all duration-300 ease-out
                  ${
                    isJoined
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
        >
          {isJoined ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Joined
            </>
          ) : (
            "Join Event"
          )}
        </Button>
      </div> */}

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 lg:gap-8">
            {/* Event Avatar */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=200&h=200&fit=crop"
                  alt="Volleyball Training Event"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Live Badge */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Open
              </div>
            </div>

            {/* Event Information */}
            <div className="flex-1 min-w-0">
              {/* Event Name */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
                {eventData.title}
              </h1>

              {/* Event Details */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm md:text-base font-medium">
                    {getFormatedDate(eventData.start_datetime)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm md:text-base font-medium">
                    {eventTime.getRange()}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm md:text-base font-medium">
                    {eventData.venue_name} <br />
                    {eventData.adress.full_address}
                  </span>
                </div>
              </div>

              {/* Participants Row */}
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="flex -space-x-2">
                  {participants.map((participant, index) => (
                    <Avatar
                      key={participant.id}
                      className="w-8 h-8 border-2 border-white ring-0 hover:z-10 hover:scale-110 transition-transform duration-200 cursor-pointer"
                      style={{ zIndex: participants.length - index }}
                    >
                      <AvatarImage
                        src={participant.image}
                        alt={participant.name}
                      />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {participant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {eventData.current_players &&
                    eventData.current_players > 4 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          +{eventData.current_players - 4}
                        </span>
                      </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <AvailableSpots event={eventData} variant="compact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for Capacity */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div
          className="h-full bg-emerald-400 transition-all duration-500"
          style={{
            width: `${
              (eventData.current_players / eventData.max_players) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
}
