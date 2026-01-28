import { Users, AlertCircle, CheckCircle } from "lucide-react";
import { getAvailableSpots, getOccupancyPercentage, isFull } from "@/helpers";
import type { EventItem } from "@/types/app.types";

interface AvailableSpotsProps {
  event: EventItem;
  variant?: "default" | "compact" | "badge";
  showProgress?: boolean;
}

export function AvailableSpots({
  event,
  variant = "default",
  showProgress = false,
}: AvailableSpotsProps) {
  const available = getAvailableSpots(event);
  const percentage = getOccupancyPercentage(event);
  const full = isFull(event);
  const current = event.current_players || 0;

  // Колір залежно від заповненості
  const getColor = () => {
    if (full) return "text-red-600 bg-red-50 border-red-200";
    if (percentage >= 80)
      return "text-orange-600 bg-orange-50 border-orange-200";
    if (percentage >= 50)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getIcon = () => {
    if (full) return <AlertCircle className="w-4 h-4" />;
    if (percentage >= 80) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getColor()}`}
      >
        {getIcon()}
        {full ? "Заповнено" : `${available} вільних`}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-1.5 text-sm ${
          getColor().split(" ")[0]
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="font-medium">
          {current}/{event.max_players}
        </span>
      </div>
    );
  }

  // Default variant
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            {current} / {event.max_players} учасників
          </span>
        </div>
        <span className={`font-medium ${getColor().split(" ")[0]}`}>
          {full ? "Заповнено" : `${available} вільних`}
        </span>
      </div>

      {showProgress && (
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ${
              full
                ? "bg-red-500"
                : percentage >= 80
                ? "bg-orange-500"
                : percentage >= 50
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {event.min_players && current < event.min_players && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Потрібно мінімум {event.min_players} учасників
        </p>
      )}
    </div>
  );
}
