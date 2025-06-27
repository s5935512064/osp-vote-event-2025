import React, { useState, useEffect, useMemo } from "react";
import { Heart, Share2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Placeholder from "@/assets/placeholder_view_vector.webp";
import { getResponsiveImageSizes } from "./utils";
import type { GridGalleryProps } from "./types";

export function GridGallery({
  images,
  hoveredId,
  zIndexes,
  setHoveredId,
  setSelectedImage,
  containerDimensions,
}: GridGalleryProps) {
  const responsiveSizes = getResponsiveImageSizes(
    containerDimensions.width,
    containerDimensions.height
  );

  // คำนวณจำนวน columns ตามขนาดหน้าจอ
  const columns = useMemo(() => {
    if (containerDimensions.width <= 768) return 2;
    if (containerDimensions.width <= 1024) return 3;
    if (containerDimensions.width <= 1440) return 4;
    return 5;
  }, [containerDimensions.width]);

  // สร้าง random rotations สำหรับ grid items
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    const newRotations = images.map(() => {
      const rotationValues = [-3, -2, -1, 0, 1, 2, 3];
      return rotationValues[Math.floor(Math.random() * rotationValues.length)];
    });
    setRotations(newRotations);
  }, [images]);

  // สร้าง shuffled images สำหรับ variety
  const shuffledImages = useMemo(() => {
    return [...images].sort(() => Math.random() - 0.5);
  }, [images]);

  return (
    <div
      className="grid gap-6 p-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        maxWidth: `${containerDimensions.width}px`,
        maxHeight: `${containerDimensions.height}px`,
        overflowY: "auto",
      }}
    >
      {shuffledImages.map((image, index) => (
        <div
          key={image.id}
          className="relative cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.1] active:scale-[0.98]"
          style={{
            transform:
              hoveredId === image.id
                ? "rotate(0deg)"
                : `rotate(${rotations[index] || 0}deg)`,
            animationDelay: `${index * 100}ms`,
            zIndex:
              hoveredId === image.id ? 100 : zIndexes[index] || 10 + index,
          }}
          onMouseEnter={() => setHoveredId(image.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => setSelectedImage(image)}
        >
          <div className="relative group">
            <div
              className={`relative overflow-hidden rounded-xl opacity-75 bg-white p-2 transition-all duration-300 shadow-md hover:shadow-xl ${
                hoveredId === image.id
                  ? "ring-4 ring-white/50 shadow-2xl opacity-100"
                  : ""
              }`}
              style={{
                width: `${responsiveSizes.medium.width}px`,
                height: `${responsiveSizes.medium.height}px`,
              }}
            >
              {/* Image container */}
              <div className="relative w-full h-5/6 rounded-lg overflow-hidden">
                <img
                  src={image.src || Placeholder.src}
                  alt={image.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Action buttons */}
                <div className="absolute top-3 right-3 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                {/* Vote count badge */}
                {image.votes && image.votes.votes > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {image.votes.votes} โหวต
                  </div>
                )}
              </div>

              {/* Image info */}
              <div className="p-3 h-1/6 flex flex-col justify-center">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {image.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {image.category}
                </p>
              </div>
            </div>

            {/* Hover indicator */}
            {hoveredId === image.id && (
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-lg" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
