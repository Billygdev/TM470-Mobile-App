import { TravelEvent } from "@/models/firestoreEventModel";

export function travelEventsSearchFilter(
  events: TravelEvent[],
  searchQuery: string
): TravelEvent[] {
  const query = searchQuery.trim().toLowerCase();

  return events.filter((event) =>
    event.title.toLowerCase().includes(query) ||
    event.destination.toLowerCase().includes(query) ||
    event.pickupLocation.toLowerCase().includes(query)
  );
}