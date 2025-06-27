import React from "react";
import { X, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Placeholder from "@/assets/placeholder_view_vector.webp";
import type { GalleryImage } from "./types";

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 p-0 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative">
          <img
            src={image.src || Placeholder.src}
            alt={image.alt}
            className="object-contain max-h-[60vh] w-full"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {image.title}
              </h2>
              <p className="text-gray-600 mb-2">{image.category}</p>
              {image.votes && (
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>โหวต: {image.votes.votes}</span>
                  <span>ไลค์: {image.votes.likes}</span>
                  <span>แชร์: {image.votes.shares}</span>
                </div>
              )}
            </div>
          </div>

          {image.description && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {image.description}
              </p>
            </div>
          )}

          {/* Gallery thumbnails */}
          {image.gallery && image.gallery.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                รูปภาพเพิ่มเติม
              </h4>
              <div className="flex gap-2 overflow-x-auto">
                {image.gallery.map((galleryImage, index) => (
                  <img
                    key={index}
                    src={galleryImage}
                    alt={`${image.title} - รูปที่ ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              โหวต
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              แชร์
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
