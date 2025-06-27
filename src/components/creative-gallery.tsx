"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useGalleryImages } from "@/lib/useGalleryImages";
import { GalleryHeader } from "./gallery/GalleryHeader";
import { VoteModal } from "./gallery/VoteModal";
import { usePositionGenerator } from "./gallery/usePositionGenerator";
import { getDeviceType, getViewportDimensions } from "./gallery/utils";
import { CAMPAIGN_ID } from "./gallery/constants";
import type {
  GalleryImage,
  Position,
  Dimensions,
  DeviceType,
  LayoutMode,
} from "./gallery/types";

import { ScatteredGallery } from "./gallery/ScatteredGallery";
import { GridGallery } from "./gallery/GridGallery";
import { MasonryGallery } from "./gallery/MasonryGallery";

export function CreativeGallery() {
  // Gallery data from API
  const { images, campaignData, loading, error, refetch } =
    useGalleryImages(CAMPAIGN_ID);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("scattered");

  // Layout State
  const [imagePositions, setImagePositions] = useState<Position[]>([]);
  const [imageZIndexes, setImageZIndexes] = useState<number[]>([]);
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>({
    width: 1200,
    height: 800,
  });

  const deviceType = getDeviceType(containerDimensions.width);

  const {
    generateRandomPositions,
    generateCenterPositions,
    generateRandomZIndexes,
  } = usePositionGenerator(containerDimensions, images);

  // Animation functions
  const animateToFinalPositions = useCallback(() => {
    if (deviceType === "desktop" && images.length > 0) {
      setIsAnimating(true);

      const centerPositions = generateCenterPositions();
      setImagePositions(centerPositions);

      const initialZIndexes = generateRandomZIndexes();
      setImageZIndexes(initialZIndexes);

      setTimeout(() => {
        const finalPositions = generateRandomPositions();
        setImagePositions(finalPositions);

        setTimeout(() => {
          setIsAnimating(false);
        }, 1200);
      }, 200);
    }
  }, [
    deviceType,
    images.length,
    generateCenterPositions,
    generateRandomPositions,
    generateRandomZIndexes,
  ]);

  // Event handlers
  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
  }, []);

  const handleVoteSuccess = useCallback(() => {
    refetch(); // รีเฟรชข้อมูลเพื่อดูผลโหวตล่าสุด
  }, [refetch]);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Effects
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = getViewportDimensions();
      setContainerDimensions(newDimensions);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      containerDimensions.width > 0 &&
      containerDimensions.height > 0 &&
      !loading
    ) {
      if (deviceType === "desktop") {
        const timeoutId = setTimeout(() => {
          animateToFinalPositions();
          setIsLoading(false);
        }, 100);
        return () => clearTimeout(timeoutId);
      } else {
        setIsLoading(false);
      }
    }
  }, [
    containerDimensions.width,
    containerDimensions.height,
    animateToFinalPositions,
    deviceType,
    layoutMode,
    loading,
  ]);

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="flex-1 h-full w-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="size-10 animate-spin opacity-50 mx-auto mb-4">
            <div className="h-full w-full rounded-full border-4 border-white border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div
      className={`${
        deviceType === "desktop" ? "lg:fixed lg:inset-0 lg:overflow-hidden" : ""
      } w-full min-h-full`}
    >
      {/* Header */}
      <GalleryHeader
        deviceType={deviceType}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        campaignData={campaignData}
      />

      {/* Gallery Content */}
      {deviceType === "desktop" ? (
        layoutMode === "scattered" ? (
          <ScatteredGallery
            images={images}
            positions={imagePositions}
            zIndexes={imageZIndexes}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            setSelectedImage={handleImageClick}
            containerDimensions={containerDimensions}
          />
        ) : (
          <div className="w-full relative h-full flex items-center justify-center">
            <GridGallery
              images={images}
              hoveredId={hoveredId}
              zIndexes={imageZIndexes}
              setHoveredId={setHoveredId}
              setSelectedImage={handleImageClick}
              containerDimensions={containerDimensions}
            />
          </div>
        )
      ) : (
        <div className="w-full relative">
          <MasonryGallery
            images={images}
            deviceType={deviceType}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            setSelectedImage={handleImageClick}
          />
        </div>
      )}

      {/* Vote Modal */}
      {selectedImage && (
        <VoteModal
          image={selectedImage}
          onClose={handleCloseModal}
          onVoteSuccess={handleVoteSuccess}
        />
      )}

      {/* Error refresh button */}
      {error && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-lg"
          >
            โหลดข้อมูลใหม่
          </button>
        </div>
      )}
    </div>
  );
}

export default CreativeGallery;
