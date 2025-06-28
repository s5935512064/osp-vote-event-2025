import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote } from "lucide-react";
import { GalleryHeader } from "./gallery/GalleryHeader";
import { PhotoModal } from "./gallery/PhotoModal";
import { type VoteFormData } from "./gallery/VoteForm";
import { useGalleryImages, useUserVoteManager } from "@/lib/useGalleryImages";
import { CAMPAIGN_ID } from "./gallery/constants";
import type { GalleryImage } from "@/lib/types";

// Animation constants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  },
  cardFlip: {
    front: {
      rotateY: 0,
      transition: { duration: 0.3 },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.3 },
    },
  },
};

// Utility functions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const updatePhotoStats = (
  shuffledImages: GalleryImage[],
  images: GalleryImage[]
): GalleryImage[] => {
  return shuffledImages.map((shuffledPhoto) => {
    const updatedPhoto = images.find((img) => img.id === shuffledPhoto.id);
    return updatedPhoto || shuffledPhoto;
  });
};

const PhotoGallery = () => {
  const { images, campaignData, loading, error, refreshAllStats } =
    useGalleryImages(CAMPAIGN_ID);
  const {
    hasVoted,
    votedSubmissionId,
    isInitialized,
    checkingStatus,
    submitVote: submitVoteWithManager,
    checkCurrentVoteStatus,
    initializeUser,
  } = useUserVoteManager(CAMPAIGN_ID);

  // State management
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryImage | null>(null);
  const [layoutMode, setLayoutMode] = useState<"grid" | "masonry">("grid");
  const [filter, setFilter] = useState<string>("all");
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [shuffledImages, setShuffledImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    checkCurrentVoteStatus();
  }, [checkCurrentVoteStatus]);

  // Initialize shuffled images on first load
  useEffect(() => {
    if (images.length === 0) return;

    if (shuffledImages.length === 0) {
      const shuffled = shuffleArray(images);
      setShuffledImages(shuffled);
    } else {
      const updatedShuffled = updatePhotoStats(shuffledImages, images);
      setShuffledImages(updatedShuffled);
    }
  }, [images, shuffledImages.length]);

  // Update selected photo when images change
  useEffect(() => {
    if (!selectedPhoto) return;

    const updatedPhoto = images.find((img) => img.id === selectedPhoto.id);
    if (updatedPhoto) {
      setSelectedPhoto(updatedPhoto);
    }
  }, [images, selectedPhoto]);

  // Memoized filtered photos
  const filteredPhotos = useMemo(() => {
    const sourceImages = shuffledImages.length > 0 ? shuffledImages : images;
    return filter === "all"
      ? sourceImages
      : sourceImages.filter((photo) => photo.category === filter);
  }, [shuffledImages, images, filter]);

  // Event handlers
  const handleVote = useCallback(
    async (photoId: string, formData: VoteFormData) => {
      try {
        // ใช้ submitVoteWithManager ที่มีการเช็คสถานะ built-in
        await submitVoteWithManager(photoId, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          reason: formData.reason,
          customReason: formData.customReason,
        });

        // Refresh stats หลังจากโหวตสำเร็จ
        await refreshAllStats();
      } catch (error) {
        console.error("Error voting:", error);
        throw error;
      }
    },
    [submitVoteWithManager, refreshAllStats]
  );

  const handleCardClick = useCallback((photo: GalleryImage) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photo.id)) {
        newSet.delete(photo.id);
      } else {
        newSet.add(photo.id);
      }
      return newSet;
    });

    setTimeout(() => {
      setSelectedPhoto(photo);
    }, 300);
  }, []);

  const closeModal = useCallback(async () => {
    setSelectedPhoto(null);
    setFlippedCards(new Set());
    await refreshAllStats();
  }, [refreshAllStats]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full size-10 border-4 border-white/75 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  // Grid/Masonry layout classes
  const layoutClasses =
    layoutMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 px-4"
      : "columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 sm:gap-6 px-4";

  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center mb-4 -mt-2">
        <GalleryHeader deviceType="desktop" />
      </div>

      <motion.div
        layout
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
        className={layoutClasses}
      >
        <AnimatePresence>
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              layoutMode={layoutMode}
              isFlipped={flippedCards.has(photo.id)}
              isVoted={votedSubmissionId === photo.id}
              isSubmitting={false}
              onCardClick={handleCardClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col gap-4 items-center justify-center my-4 mt-8 ">
        <div className="text-white text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/10 px-3 py-1 rounded-full">
              <span className="opacity-75">Total Photos: </span>
              <span className="font-semibold">{filteredPhotos.length}</span>
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-full">
              <span className="opacity-75">Total Votes: </span>
              <span className="font-semibold">
                {campaignData?.stats.totalVotes}
              </span>
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-full">
              <span className="opacity-75">Total Likes: </span>
              <span className="font-semibold">
                {campaignData?.stats.totalLikes}
              </span>
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-full">
              <span className="opacity-75">Total Shares: </span>
              <span className="font-semibold">
                {campaignData?.stats.totalShares}
              </span>
            </div>
          </div>

          {!hasVoted && isInitialized && (
            <p className="text-yellow-400 mt-2 text-sm">
              Click on a photo to vote
            </p>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={closeModal}
          onVote={handleVote}
          isSubmitting={false}
          isVoted={hasVoted}
          votedSubmissionId={votedSubmissionId}
        />
      )}
    </>
  );
};

// Extracted PhotoCard component for better organization
interface PhotoCardProps {
  photo: GalleryImage;
  layoutMode: "grid" | "masonry";
  isFlipped: boolean;
  isVoted: boolean;
  isSubmitting: boolean;
  onCardClick: (photo: GalleryImage) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  layoutMode,
  isFlipped,
  isVoted,
  isSubmitting,
  onCardClick,
}) => {
  const handleClick = useCallback(() => {
    onCardClick(photo);
  }, [photo, onCardClick]);

  const handleVoteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onCardClick(photo);
    },
    [photo, onCardClick]
  );

  return (
    <motion.div
      layout
      variants={ANIMATION_VARIANTS.item}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 300 },
      }}
      className={`relative group ${
        layoutMode === "masonry" ? "mb-6 break-inside-avoid" : ""
      }`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gray-800 aspect-[3/4] cursor-pointer"
        variants={ANIMATION_VARIANTS.cardFlip}
        animate={isFlipped ? "back" : "front"}
        onClick={handleClick}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <motion.img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end"
          >
            <div className="p-4 text-white">
              <h3 className="font-semibold text-base sm:text-lg mb-1">
                {photo.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-3">
                {photo.category}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="bg-white/20 rounded-full px-2 sm:px-3 py-1">
                    <span className="text-xs">{photo.votes.votes} votes</span>
                  </div>
                  <div className="bg-white/20 rounded-full px-2 sm:px-3 py-1">
                    <span className="text-xs">{photo.votes.likes} likes</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleVoteClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    isVoted
                      ? "bg-green-500 text-white"
                      : "bg-[#0a3254] text-white"
                  }`}
                  disabled={isVoted || isSubmitting}
                  aria-label={`Vote for ${photo.title}`}
                >
                  <Vote className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{isVoted ? "Voted" : "Vote"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhotoGallery;
