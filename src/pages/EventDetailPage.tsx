import { useParams, useNavigate } from "react-router";
import { Info, MapPin } from "lucide-react";

import { useEvent } from "@/hooks/useEvents";

import { useEventsStore } from "@/stores/eventsStore";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EventDetailSkeleton } from "@/components/events/EventDetailSkeleton";
import EventDetailHeader from "@/components/events/EventDetailHeader";
import UserCard from "@/components/events/UserCard";
import OrganizerSection from "@/components/events/OrganizerSection";
import EventFotos from "@/components/events/EventFotos";
import FacilityAmenities from "@/components/events/FacilityAmenities";
import VenueCard from "@/components/events/VenueCard";
import VenueMap from "@/components/events/VenueMap";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = useEvent(id!);
  const isLoading = useEventsStore((state) => state.isLoading);
  const error = useEventsStore((state) => state.error);

  const participants = [
    {
      id: 1,
      name: "Michael Santos",
      role: "Head Coach",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      rating: 5,
      reviews: 128,
      bio: "Former national team player with 15+ years of coaching experience at collegiate and professional levels.",
      specialties: ["Offense", "Serving", "Team Strategy"],
      verified: true,
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Defense Specialist",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      rating: 5,
      reviews: 94,
      bio: "Olympic bronze medalist and defensive specialist. Expert in libero training and passing techniques.",
      specialties: ["Defense", "Passing", "Libero Training"],
      verified: true,
    },
    {
      id: 3,
      name: "David Park",
      role: "Setter Coach",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      rating: 4,
      reviews: 76,
      bio: "Professional setter with experience in multiple European leagues. Specializes in setting mechanics and game reading.",
      specialties: ["Setting", "Quick Attacks", "Game Reading"],
      verified: true,
    },
  ];

  // Loading state
  if (isLoading && !event) {
    return <EventDetailSkeleton />;
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Подію не знайдено"}
          </h1>
          <p className="text-gray-600 mb-6">
            Можливо подію було видалено або посилання невірне
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Повернутися до списку подій
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b  z-10">
        <EventDetailHeader event={event} />
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start bg-white border border-slate-200 rounded-xl p-1 h-auto flex-wrap">
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              About
            </TabsTrigger>

            <TabsTrigger
              value="venue"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Venue
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6 space-y-8">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Description */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    About This Event
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Join us for an intensive, full-day volleyball training
                      camp designed for players of all skill levels. Whether
                      you're just starting out or preparing for competitive
                      play, our professional coaches will help you take your
                      game to the next level.
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      This camp features small group instruction, ensuring
                      personalized attention and feedback for every participant.
                      You'll work on fundamental skills, learn advanced
                      techniques, and put everything together in competitive
                      match play.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      All equipment is provided, and lunch is included. Just
                      bring your athletic wear, water bottle, and a passion for
                      the game!
                    </p>
                  </div>
                </div>

                <EventFotos />
              </div>

              {/* Testimonials */}
              <div className="lg:col-span-2">
                <OrganizerSection />
              </div>
            </div>
          </TabsContent>

          {/* Venue Tab */}
          <TabsContent value="venue" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <FacilityAmenities />
              </div>
              <div className="space-y-6">
                <VenueCard />
                <VenueMap />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Participants */}
        <div className="w-full mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Participants
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participants.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Info */}
      </main>
    </div>
  );
}
