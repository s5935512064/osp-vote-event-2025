import React from "react";
import { Heart, Share2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Placeholder from "@/assets/placeholder_view_vector.webp";
import { getImageDimensions } from "./utils";
import type { ScatteredGalleryProps } from "./types";

export function ScatteredGallery({
  images,
  positions,
  zIndexes,
  hoveredId,
  setHoveredId,
  setSelectedImage,
  containerDimensions,
}: ScatteredGalleryProps) {
  return (
    <div
      className="relative"
      style={{
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`,
        margin: "20px",
      }}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute cursor-pointer transition-all duration-1200 ease-out transform hover:scale-110 ${
            image.rotation
          } ${
            hoveredId === image.id
              ? "shadow-xl md:shadow-2xl"
              : "shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl"
          }`}
          style={{
            left: `${positions[index]?.x || 0}px`,
            top: `${positions[index]?.y || 0}px`,
            transform: `scale(${positions[index]?.scale || 1}) ${
              image.rotation
            }`,
            transitionDelay: `${index * 80}ms`,
            zIndex:
              hoveredId === image.id ? 100 : zIndexes[index] || 10 + index,
            transition: "all 1200ms ease-out, z-index 300ms ease-in-out",
          }}
          onMouseEnter={() => setHoveredId(image.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => setSelectedImage(image)}
        >
          <div className="relative group">
            <div
              className={`relative overflow-hidden rounded-xl md:rounded-2xl bg-white p-1 md:p-2 transition-all duration-300 ${
                hoveredId === image.id ? "ring-4 ring-white/50" : ""
              }`}
              style={{
                width: `${
                  getImageDimensions(
                    image.size,
                    1,
                    containerDimensions.width,
                    containerDimensions.height
                  ).width
                }px`,
                height: `${
                  getImageDimensions(
                    image.size,
                    1,
                    containerDimensions.width,
                    containerDimensions.height
                  ).height
                }px`,
              }}
            >
              {/* Image container */}
              <div className="relative w-full h-5/6 rounded-lg md:rounded-xl overflow-hidden">
                <img
                  src={image.src || Placeholder.src}
                  alt={image.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Action buttons */}
                <div className="hidden md:flex absolute top-2 md:top-3 right-2 md:right-3 gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-6 h-6 md:w-8 md:h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <Heart className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-6 h-6 md:w-8 md:h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>

                <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-6 h-6 md:w-8 md:h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>

                {/* Vote count badge */}
                {image.votes && image.votes.votes > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {image.votes.votes} โหวต
                  </div>
                )}
              </div>

              {/* Image info */}
              <div className="p-1 md:p-3 h-1/6 flex flex-col justify-center">
                <h3 className="font-semibold text-gray-800 text-xs md:text-sm truncate">
                  {image.title}
                </h3>
                <p className="text-xs text-gray-500 hidden md:block truncate">
                  {image.category}
                </p>
              </div>
            </div>

            {/* Hover indicator */}
            {hoveredId === image.id && (
              <div className="absolute -top-2 md:-top-3 -left-2 md:-left-3 w-3 h-3 md:w-5 md:h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-lg" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
