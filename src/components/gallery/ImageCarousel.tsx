import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Thumbs,
  FreeMode,
  Autoplay,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface ImageCarouselProps {
  images: string[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  mainImage?: string;
  title: string;
}

export function ImageCarousel({
  images,
  selectedIndex,
  onImageSelect,
  title,
}: ImageCarouselProps) {
  const [randomizedImages, setRandomizedImages] = useState<string[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Randomize images order เมื่อ component mount
  useEffect(() => {
    const allImages = [...images];
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setRandomizedImages(shuffled);

    // Set random starting index
    const randomStart = Math.floor(Math.random() * shuffled.length);
    setActiveIndex(randomStart);
    onImageSelect(randomStart);
  }, [images, onImageSelect]);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    onImageSelect(swiper.activeIndex);
  };

  if (randomizedImages.length === 0) return null;

  return (
    <div className="relative  rounded-lg overflow-hidden  ">
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Autoplay]}
        spaceBetween={10}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 1,
          },
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        initialSlide={activeIndex}
        onSlideChange={handleSlideChange}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        loop={randomizedImages.length > 1}
        className="w-full"
      >
        {randomizedImages.map((image, index) => (
          <SwiperSlide key={`main-${image}-${index}`}>
            <div className=" flex items-center justify-center relative aspect-[3/4]">
              <motion.img
                src={image}
                alt={`${title} - รูปที่ ${index + 1}`}
                className="object-contain object-top"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 hover:scale-110">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 hover:scale-110">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-10">
        {activeIndex + 1} / {randomizedImages.length}
      </div>
    </div>
  );
}
