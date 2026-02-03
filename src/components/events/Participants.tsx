import React from "react";

export default function Participants(count) {
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

  const participants = new Array(count)
    .fill(null)
    .map((_, index) => participantsPlaceholder[index]);

  return (
    <div className="flex -space-x-2">
      {participants.map((participant, index) => (
        <Avatar
          key={participant.id}
          className="w-8 h-8 border-2 border-white ring-0 hover:z-10 hover:scale-110 transition-transform duration-200 cursor-pointer"
          style={{ zIndex: participants.length - index }}
        >
          <AvatarImage src={participant.image} alt={participant.name} />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {participant.name[0]}
          </AvatarFallback>
        </Avatar>
      ))}
      {eventData.current_players && eventData.current_players > 4 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            +{eventData.current_players - 4}
          </span>
        </div>
      )}
    </div>
  );
}
