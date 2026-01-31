import React from 'react';
import VolleyballEventHeader from '@/components/VolleyballEventHeader';
import EventStats from '@/components/event/EventStats';
import CoachCard from '@/components/event/CoachCard';
import ScheduleTimeline from '@/components/event/ScheduleTimeline';
import TestimonialCard from '@/components/event/TestimonialCard';
import WhatYouLearn from '@/components/event/WhatYouLearn';
import RegistrationCTA from '@/components/event/RegistrationCTA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Users, Clock, Info } from 'lucide-react';

const coaches = [
  {
    id: 1,
    name: 'Michael Santos',
    role: 'Head Coach',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    reviews: 128,
    bio: 'Former national team player with 15+ years of coaching experience at collegiate and professional levels.',
    specialties: ['Offense', 'Serving', 'Team Strategy'],
    verified: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Defense Specialist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    reviews: 94,
    bio: 'Olympic bronze medalist and defensive specialist. Expert in libero training and passing techniques.',
    specialties: ['Defense', 'Passing', 'Libero Training'],
    verified: true,
  },
  {
    id: 3,
    name: 'David Park',
    role: 'Setter Coach',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 4,
    reviews: 76,
    bio: 'Professional setter with experience in multiple European leagues. Specializes in setting mechanics and game reading.',
    specialties: ['Setting', 'Quick Attacks', 'Game Reading'],
    verified: true,
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Emily Rodriguez',
    role: 'Club Player, 2024 Attendee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'This camp completely transformed my game. The coaches are world-class and the personalized feedback was incredible. Went from a bench player to starting varsity!',
  },
  {
    id: 2,
    name: 'Jason Lee',
    role: 'High School Varsity, 2024 Attendee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Best investment I made in my volleyball career. The serving clinic alone was worth the price. Coach Santos breaks down techniques in a way that just clicks.',
  },
  {
    id: 3,
    name: 'Amanda Foster',
    role: 'College Recruit, 2024 Attendee',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The small group sizes meant I got so much individual attention. Sarah helped me fix my passing platform in just one session. Highly recommend for any serious player!',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Event Header */}
      <VolleyballEventHeader />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
        
        {/* Stats Section */}
        <EventStats />
        
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
              value="schedule" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="coaches" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Coaches
            </TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about" className="mt-6 space-y-8">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Description */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">About This Event</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Join us for an intensive, full-day volleyball training camp designed for players of all skill levels. 
                      Whether you're just starting out or preparing for competitive play, our professional coaches will 
                      help you take your game to the next level.
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      This camp features small group instruction, ensuring personalized attention and feedback for every 
                      participant. You'll work on fundamental skills, learn advanced techniques, and put everything 
                      together in competitive match play.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      All equipment is provided, and lunch is included. Just bring your athletic wear, water bottle, 
                      and a passion for the game!
                    </p>
                  </div>
                </div>
                
                {/* What You'll Learn */}
                <WhatYouLearn />
              </div>
              
              {/* Testimonials */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">What Past Attendees Say</h3>
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Event Schedule</h2>
              <ScheduleTimeline />
            </div>
          </TabsContent>
          
          {/* Coaches Tab */}
          <TabsContent value="coaches" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Meet Your Coaches</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Registration CTA */}
        <RegistrationCTA />
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">Pro Volleyball Training</h4>
              <p className="text-slate-400 text-sm">
                Elevating players through professional coaching and world-class training programs.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white cursor-pointer transition-colors">All Events</li>
                <li className="hover:text-white cursor-pointer transition-colors">Our Coaches</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>info@provolleyballtraining.com</li>
                <li>(555) 123-4567</li>
                <li>Olympic Sports Center</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2025 Pro Volleyball Training. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}