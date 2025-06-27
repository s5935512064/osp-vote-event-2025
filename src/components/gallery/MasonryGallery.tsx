import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Heart, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Placeholder from "@/assets/placeholder_view_vector.webp";
import { getResponsiveImageSizes, getViewportDimensions } from "./utils";
import type { MasonryGalleryProps, GalleryImage, Dimensions } from "./types";

export function MasonryGallery({
  images,
  deviceType,
  hoveredId,
  setHoveredId,
  setSelectedImage,
}: MasonryGalleryProps) {
  const columns = deviceType === "mobile" ? 2 : 3;

  // Container dimensions
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>({
    width: 1200,
    height: 800,
  });

  // Refresh seed สำหรับสร้าง layout ใหม่
  const [refreshSeed] = useState(() => Math.random());

  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = getViewportDimensions();
      setContainerDimensions(newDimensions);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // สร้าง shuffled images พร้อม calculated heights
  const shuffledImages = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Shuffle images
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomValue = seededRandom(refreshSeed * 1000 + i);
      const j = Math.floor(randomValue * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // เพิ่ม calculated heights
    const responsiveSizes = getResponsiveImageSizes(
      containerDimensions.width,
      containerDimensions.height
    );

    const heightPatterns = [
      { base: 1.0, variation: 0.1 },
      { base: 1.3, variation: 0.2 },
      { base: 0.7, variation: 0.1 },
      { base: 1.1, variation: 0.15 },
      { base: 1.5, variation: 0.3 },
      { base: 0.8, variation: 0.2 },
    ];

    return shuffled.map((image, index) => {
      const responsiveConfig = responsiveSizes[image.size];
      const baseHeight = responsiveConfig.height;

      const patternIndex = Math.floor(
        seededRandom(refreshSeed * 3000 + index) * heightPatterns.length
      );
      const pattern = heightPatterns[patternIndex];

      const patternHeight = baseHeight * pattern.base;
      const heightVariation =
        (seededRandom(refreshSeed * 4000 + index * 2) - 0.5) *
        (patternHeight * pattern.variation);

      const positionVariation = Math.sin((refreshSeed + index) * 0.7) * 30;
      const finalHeight = Math.max(
        patternHeight + heightVariation + positionVariation,
        baseHeight * 0.5
      );

      const minHeight = deviceType === "mobile" ? 180 : 200;
      const maxHeight = deviceType === "mobile" ? 350 : 400;
      const clampedHeight = Math.max(
        minHeight,
        Math.min(Math.floor(finalHeight), maxHeight)
      );

      return {
        ...image,
        calculatedHeight: clampedHeight,
      };
    });
  }, [images, refreshSeed, containerDimensions, deviceType]);

  // กระจาย images ลง columns
  const distributeImages = useCallback((): (GalleryImage & {
    calculatedHeight: number;
  })[][] => {
    const columnArrays: (GalleryImage & { calculatedHeight: number })[][] =
      Array.from({ length: columns }, () => []);
    const columnHeights = Array.from({ length: columns }, () => 0);

    shuffledImages.forEach((image, index) => {
      let selectedColumn = 0;

      if (index < columns) {
        selectedColumn = index;
      } else {
        // เลือก column ที่เตี้ยที่สุด
        selectedColumn = columnHeights.indexOf(Math.min(...columnHeights));
      }

      columnArrays[selectedColumn].push(image);
      columnHeights[selectedColumn] += image.calculatedHeight + 16;
    });

    return columnArrays;
  }, [shuffledImages, columns]);

  const imageColumns = useMemo(() => {
    return distributeImages();
  }, [distributeImages]);

  return (
    <div className="w-full">
      {/* Spacer สำหรับ header */}
      <div style={{ height: deviceType === "mobile" ? "150px" : "150px" }} />

      {images.length === 0 ? (
        <div className="flex justify-center items-center p-8 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>กำลังโหลดรูปภาพ...</p>
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-4 px-2 h-full ${
            deviceType === "mobile" ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {imageColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.map((image, imageIndex) => (
                <div
                  key={image.id}
                  className="relative cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    height: `${image.calculatedHeight}px`,
                    animationDelay: `${
                      (columnIndex * column.length + imageIndex) * 100
                    }ms`,
                  }}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative group w-full h-full">
                    <div
                      className={`w-full h-full relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ${
                        hoveredId === image.id
                          ? "shadow-lg ring-1 ring-black/5"
                          : "hover:shadow-md"
                      }`}
                    >
                      {/* Image */}
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={image.src || Placeholder.src}
                          alt={image.alt}
                          className="w-full h-full object-top object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-8 h-8 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-0"
                          >
                            <Heart className="w-4 h-4 text-gray-700" />
                          </Button>
                        </div>

                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-8 h-8 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-0"
                          >
                            <ZoomIn className="w-4 h-4 text-gray-700" />
                          </Button>
                        </div>

                        {/* Vote count badge */}
                        {image.votes && image.votes.votes > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {image.votes.votes} โหวต
                          </div>
                        )}

                        {/* Image info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="font-semibold text-white text-sm truncate">
                            {image.title}
                          </h3>
                          <p className="text-xs text-white/80 truncate">
                            {image.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
