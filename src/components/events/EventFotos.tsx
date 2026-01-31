import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const eventPhotos = [
  {
    url: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
    alt: "Volleyball training session",
  },
  {
    url: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&h=400&fit=crop",
    alt: "Team practice",
  },
  {
    url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    alt: "Volleyball game",
  },
  {
    url: "https://images.unsplash.com/photo-1553005746-9245ba190489?w=600&h=400&fit=crop",
    alt: "Indoor volleyball court",
  },
  {
    url: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&h=400&fit=crop",
    alt: "Players celebrating",
  },
  {
    url: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600&h=400&fit=crop",
    alt: "Training drills",
  },
];

export default function EventFotos() {
  return (
    <div>
      {/* Photo Gallery */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Photos from Event
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            View All
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {eventPhotos.map((photo, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                index === 0
                  ? "col-span-2 row-span-2 aspect-[4/3]"
                  : "aspect-square"
              }`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <ExternalLink className="w-4 h-4 text-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
