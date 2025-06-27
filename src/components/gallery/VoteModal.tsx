import React, { useState } from "react";
import { X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useVoting } from "@/lib/useGalleryImages";
import Placeholder from "@/assets/placeholder_view_vector.webp";
import type { GalleryImage } from "./types";

interface VoteModalProps {
  image: GalleryImage;
  onClose: () => void;
  onVoteSuccess: () => void;
}

export function VoteModal({ image, onClose, onVoteSuccess }: VoteModalProps) {
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  //   const { submitVote, submitting, voteError } = useVoting();

  const handleVoteSubmit = async () => {
    // if (!voterName.trim() || !voterPhone.trim()) {
    //   alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    //   return;
    // }
    // try {
    //   await submitVote(image.id, voterName.trim(), voterPhone.trim());
    //   alert("ส่งการโหวตเรียบร้อยแล้ว ขอบคุณครับ!");
    //   onVoteSuccess();
    //   onClose();
    // } catch (error) {
    //   alert(
    //     error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งการโหวต"
    //   );
    // }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 p-0 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-lg"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative">
          <img
            src={image.src || Placeholder.src}
            alt={image.alt}
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {image.title}
          </h2>
          <p className="text-gray-600 mb-4">{image.category}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล *
              </label>
              <input
                type="text"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรุณากรอกชื่อ-นามสกุล"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ *
              </label>
              <input
                type="tel"
                value={voterPhone}
                onChange={(e) => setVoterPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรุณากรอกเบอร์โทรศัพท์"
              />
            </div>

            {/* {voteError && <p className="text-red-600 text-sm">{voteError}</p>} */}
          </div>
          {/* 
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleVoteSubmit}
              disabled={submitting || !voterName.trim() || !voterPhone.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  โหวต
                </>
              )}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
