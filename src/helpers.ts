import { format } from "date-fns";

import type { EventItem } from "@/types/app.types";

export function getAvailableSpots(event: EventItem): number {
  const current = event.current_players || 0;
  return Math.max(0, event.max_players - current);
}

export function isFull(event: EventItem): boolean {
  return getAvailableSpots(event) === 0;
}

export function getOccupancyPercentage(event: EventItem): number {
  const current = event.current_players || 0;
  return Math.round((current / event.max_players) * 100);
}

export function getStatusBadge(event: EventItem): {
  text: string;
  color: string;
} {
  const available = getAvailableSpots(event);
  const percentage = getOccupancyPercentage(event);

  if (available === 0) {
    return { text: "Заповнено", color: "red" };
  } else if (percentage >= 80) {
    return { text: `Залишилось ${available}`, color: "orange" };
  } else if (percentage >= 50) {
    return { text: `${available} вільних`, color: "yellow" };
  } else {
    return { text: `${available} вільних`, color: "green" };
  }
}
export function getEventTime(event: EventItem) {
  const { start_datetime, end_datetime } = event;

  const start = start_datetime.split("T")[1].slice(0, 5);
  const end = end_datetime?.split("T")[1].slice(0, 5);

  return {
    start,
    end,
    getRange() {
      return `${this.start}${this.end ? ` - ${this.end}` : ""}`;
    },
  };
}

export function getFormatedDate(dateString: string) {
  return format(new Date(dateString), "E, dd MMM	yyyy");
}
