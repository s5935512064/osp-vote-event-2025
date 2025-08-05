import { useState, useMemo, useCallback } from "react";
import { EventCard } from "./EventCard";
import {
  getAllEvents,
  getActiveEvents,
  getUpcomingEvents,
} from "@/lib/eventsConfig";
import type { Event } from "@/lib/types";
import { Search } from "lucide-react";

interface EventsGridProps {
  showOnlyActive?: boolean;
  limit?: number;
}

export function EventsGrid({ showOnlyActive = false, limit }: EventsGridProps) {
  let events: Event[] = showOnlyActive ? getActiveEvents() : getAllEvents();

  if (limit) {
    events = events.slice(0, limit);
  }

  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    if (!search.trim()) {
      return events;
    }

    const filtered = events.filter(
      (e) =>
        e.tags?.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        ) ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase())
    );

    return filtered;
  }, [events, search]);

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* Page Header */}
      <div className="text-center flex flex-col items-center w-full ">
        <p className="text-lg text-white mb-2">
          ร่วมสนุกกับกิจกรรมและอีเวนต์สุดพิเศษจาก The Old Siam Plaza
        </p>

        <div className="relative w-full flex items-center justify-center max-w-md ">
          <input
            type="text"
            placeholder="ค้นหากิจกรรม..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Active Events */}
      {filteredEvents.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={`featured-${event.id}`} className="relative h-full">
                <div className="absolute -top-2 -left-2 z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    HOT
                  </span>
                </div>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            ไม่พบกิจกรรมที่ตรงกับ "{search}"
          </h3>
          <p className="text-white">
            โปรดติดตามกิจกรรมใหม่ๆ กำลังจะมาเร็วๆ นี้!
          </p>
        </div>
      )}
    </div>
  );
}
