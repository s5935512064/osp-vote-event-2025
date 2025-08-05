import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isClickable = event.status === "active";

  const CardContent = () => (
    <div
      className={`
      relative overflow-hidden rounded-xl h-full bg-white shadow-lg 
      transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
      ${isClickable ? "cursor-pointer" : "cursor-default opacity-75"}
    `}
    >
      <div className="relative">
        {event.image ? (
          <div
            className={`relative h-60`}
            style={{
              backgroundImage: `url(${event.image})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-white/90 text-sm">{event.subtitle}</p>
            </div>
          </div>
        ) : (
          <div className="relative h-56 p-6 text-white bg-[#0a3254] bg-gradient-to-br from-[#0a3254] to-[#164e73]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-white/90 text-sm">{event.subtitle}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 ">
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
          {event.description}
        </p>

        {/* Date Range */}
        {(event.startDate || event.endDate) && (
          <div className="mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>
                {event.startDate && formatDate(event.startDate)}
                {event.startDate && event.endDate && " - "}
                {event.endDate && formatDate(event.endDate)}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          {isClickable ? (
            <span
              className={`
              inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold
              bg-[#0a3254] text-white
              hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]
            `}
            >
              ร่วมกิจกรรม
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold bg-gray-100 text-gray-500 cursor-not-allowed">
              {event.status === "coming-soon" ? "เร็วๆ นี้..." : "สิ้นสุดแล้ว"}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <a href={event.href} className="block h-full">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}
