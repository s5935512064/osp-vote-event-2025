import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Vote, Share2, Heart } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";
import { VoteForm, type VoteFormData } from "./VoteForm";
import {
  FacebookShareButton,
  LineShareButton,
  FacebookIcon,
  LineIcon,
} from "react-share";
import { GalleryService } from "@/lib/galleryService";
import { LocalStorageManager } from "@/lib/localStorageManager";
import type { GalleryImage } from "@/lib/types";
import { CAMPAIGN_ID } from "./constants";
import { useGalleryImages } from "@/lib/useGalleryImages";

interface PhotoModalProps {
  photo: GalleryImage;
  isOpen: boolean;
  onClose: () => void;
  onVote: (photoId: string, formData: VoteFormData) => Promise<void>;
  isVoted: boolean;
  isSubmitting: boolean;
  votedSubmissionId?: string | null;
}

interface UserActionState {
  isLiked: boolean;
  isShared: boolean;
  likesCount: number;
  sharesCount: number;
}

const INITIAL_VOTE_FORM_DATA: VoteFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  reason: "",
  customReason: "",
};

const SHARE_CONFIG = {
  url: "https://theoldsiam.co.th/event/2025/pride-month-vote",
  title:
    "ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน ดิ โอลด์ สยาม พลาซ่า เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย",
  hashtag: "#TheOldSiamPlaza #TheOldSiamProudOfYou #SilkMarketOfThailand",
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
};

export function PhotoModal({
  photo,
  isOpen,
  onClose,
  onVote,
  isVoted,
  isSubmitting,
  votedSubmissionId,
}: PhotoModalProps) {
  const [url, setUrl] = useState("");
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [voteFormData, setVoteFormData] = useState<VoteFormData>(
    INITIAL_VOTE_FORM_DATA
  );
  const [userActionState, setUserActionState] = useState<UserActionState>({
    isLiked: false,
    isShared: false,
    likesCount: photo.votes.likes,
    sharesCount: photo.votes.shares,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  // Utility functions
  const getUserId = (): string => {
    let userId = localStorage.getItem("osp_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("osp_user_id", userId);
    }
    return userId;
  };

  const resetModalState = () => {
    setShowVoteForm(false);
    setSelectedImageIndex(0);
    setShowShareMenu(false);
    setVoteFormData(INITIAL_VOTE_FORM_DATA);
  };

  const updateVoteCounts = () => {
    setUserActionState((prev) => ({
      ...prev,
      likesCount: photo.votes.likes,
      sharesCount: photo.votes.shares,
    }));
  };

  // User action status management
  const checkUserActionStatus = async () => {
    if (!isOpen) return;

    const userId = getUserId();

    try {
      const likeStatus = await GalleryService.checkLikeStatus(
        CAMPAIGN_ID,
        photo.id,
        userId
      );

      const isShared = likeStatus.votes.some((vote) => vote.type === "share");

      setUserActionState((prev) => ({
        ...prev,
        isLiked: likeStatus.hasLiked,
        likesCount: likeStatus.summary.like,
        isShared: isShared,
        sharesCount: likeStatus.summary.share,
      }));

      // Sync with localStorage
      const userActions = LocalStorageManager.getUserActions(userId) || {
        likedSubmissions: [] as string[],
        sharedSubmissions: [] as string[],
      };

      const photoIdString = photo.id.toString();

      if (
        likeStatus.hasLiked &&
        !userActions.likedSubmissions.includes(photoIdString)
      ) {
        LocalStorageManager.addLike(userId, photo.id);
      } else if (
        !likeStatus.hasLiked &&
        userActions.likedSubmissions.includes(photoIdString)
      ) {
        LocalStorageManager.removeLike(userId, photo.id);
      }
    } catch (error) {
      console.error("Failed to check user action status:", error);

      // Fallback to localStorage
      const userActions = LocalStorageManager.getUserActions(userId);
      if (userActions) {
        const photoIdString = photo.id.toString();
        setUserActionState((prev) => ({
          ...prev,
          isLiked: userActions.likedSubmissions.includes(photoIdString),
          isShared: userActions.sharedSubmissions.includes(photoIdString),
        }));
      }
    }
  };

  // Event handlers
  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const handleVoteClick = () => {
    if (!isVoted) {
      setShowVoteForm(true);
    }
  };

  const handleVoteSubmit = async () => {
    try {
      await onVote(photo.id, voteFormData);
      setShowVoteForm(false);
      setVoteFormData(INITIAL_VOTE_FORM_DATA);

      await checkUserActionStatus();
    } catch (error) {
      console.error("Vote submission failed:", error);
    }
  };

  const handleLikeClick = async () => {
    if (actionLoading) return;

    setActionLoading(true);
    const userId = getUserId();
    const { isLiked } = userActionState;

    // Optimistic update
    setUserActionState((prev) => ({
      ...prev,
      isLiked: !isLiked,
      likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
    }));

    // Update localStorage
    if (isLiked) {
      LocalStorageManager.removeLike(userId, photo.id);
    } else {
      LocalStorageManager.addLike(userId, photo.id);
    }

    try {
      if (isLiked) {
        // Unlike the photo
        await GalleryService.submitLike(CAMPAIGN_ID, {
          submissionId: photo.id,
          voterPhone: userId,
        });
      } else {
        // Like the photo
        await GalleryService.submitLike(CAMPAIGN_ID, {
          submissionId: photo.id,
          voterPhone: userId,
        });
      }
    } catch (error) {
      // Revert on error
      setUserActionState((prev) => ({
        ...prev,
        isLiked: isLiked,
        likesCount: isLiked ? prev.likesCount + 1 : prev.likesCount - 1,
      }));

      if (isLiked) {
        LocalStorageManager.addLike(userId, photo.id);
      } else {
        LocalStorageManager.removeLike(userId, photo.id);
      }
      alert("เกิดข้อผิดพลาดในการกดไลค์");
    } finally {
      setActionLoading(false);

      await checkUserActionStatus();
    }
  };

  const handleShareComplete = async (platform: string) => {
    if (actionLoading) return;

    setActionLoading(true);
    const userId = getUserId();

    try {
      // Optimistic update
      if (!userActionState.isShared) {
        setUserActionState((prev) => ({
          ...prev,
          isShared: true,
          sharesCount: prev.sharesCount + 1,
        }));
        LocalStorageManager.addShare(userId, photo.id);
      }

      await GalleryService.submitShare(CAMPAIGN_ID, {
        submissionId: photo.id,
        voterPhone: userId,
        platform: platform as "facebook" | "line" | "twitter" | "copy",
      });

      setShowShareMenu(false);
    } catch (error) {
      console.error("Share submission failed:", error);
    } finally {
      setActionLoading(false);

      await checkUserActionStatus();
    }
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      checkUserActionStatus();
    }
  }, [isOpen, photo.id]);

  useEffect(updateVoteCounts, [photo.votes.likes, photo.votes.shares]);

  // Component definitions
  const ActionButton = ({
    onClick,
    isActive,
    icon: Icon,
    label,
    activeLabel,
    disabled = false,
  }: {
    onClick: () => void;
    isActive: boolean;
    icon: React.ComponentType<{ className?: string; [key: string]: any }>;
    label: string;
    activeLabel: string;
    disabled?: boolean;
  }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-pink-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      disabled={disabled}
    >
      <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
      <span className="text-sm">
        {disabled ? "..." : isActive ? activeLabel : label}
      </span>
    </motion.button>
  );

  const ShareOption = ({
    ShareComponent,
    icon: Icon,
    label,
    platform,
    ...shareProps
  }: any) => (
    <ShareComponent
      url={url}
      title={SHARE_CONFIG.title}
      onShareWindowClose={() => handleShareComplete(platform)}
      className="w-full"
      {...shareProps}
    >
      <div className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded transition-colors">
        <Icon size={24} round />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </ShareComponent>
  );

  const ShareMenu = () => (
    <AnimatePresence>
      {showShareMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-10"
        >
          <div className="space-y-2">
            <ShareOption
              ShareComponent={FacebookShareButton}
              icon={FacebookIcon}
              label="Facebook"
              platform="facebook"
              hashtag={SHARE_CONFIG.hashtag}
            />
            <ShareOption
              ShareComponent={LineShareButton}
              icon={LineIcon}
              label="Line"
              platform="line"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ActionButtons = () => (
    <div className="flex items-center gap-3">
      <ActionButton
        onClick={handleLikeClick}
        isActive={userActionState.isLiked}
        icon={Heart}
        label="ถูกใจ"
        activeLabel={userActionState.likesCount.toString() || "0"}
        disabled={actionLoading}
      />

      <div className="relative">
        <motion.button
          onClick={() => setShowShareMenu(!showShareMenu)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            userActionState.isShared
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm">
            {userActionState.isShared
              ? userActionState.sharesCount.toString() || "0"
              : "แชร์"}
          </span>
        </motion.button>
        <ShareMenu />
      </div>
    </div>
  );

  const VoteButton = () => (
    <motion.button
      onClick={handleVoteClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg text-white font-medium transition-all ${
        isVoted
          ? "bg-green-500 cursor-not-allowed"
          : "bg-[#0a3254] hover:bg-[#0a3254]/90"
      }`}
      disabled={isVoted}
    >
      <Vote className="w-5 h-5" />
      <span className="text-sm sm:text-base">
        {isVoted ? `มีเพื่อนๆ โหวตแล้ว ${photo.votes.votes} คน` : "โหวต"}
      </span>
    </motion.button>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          variants={MODAL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-5xl max-h-[calc(100vh-50px)] bg-white rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-50px)] overflow-y-auto">
            {/* Image Section - ย้ายมาด้านบนในมือถือ */}
            <div className="lg:w-1/2 bg-gray-50 p-4 flex-shrink-0">
              <ImageCarousel
                images={photo.gallery || []}
                selectedIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                mainImage={photo.src}
                title={photo.title}
              />
            </div>

            {/* Details Section - เพิ่ม overflow-y-auto เฉพาะส่วนนี้ */}
            <div className="lg:w-1/2 p-4 sm:p-6 bg-white flex flex-col-reverse lg:flex-col  space-y-4 ">
              <div className="lg:mb-4 ">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 hidden lg:block">
                  {photo.title}
                </h3>
                <p className="text-gray-600 mb-3 hidden lg:block">
                  {photo.category}
                </p>
                {!showVoteForm && (
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                    {photo.description || "ไม่มีรายละเอียด"}
                  </p>
                )}
              </div>

              {!showVoteForm && <ActionButtons />}

              {/* Action Buttons */}
              {!showVoteForm ? (
                <div className="space-y-3 mb-4">
                  <VoteButton />
                  {isVoted && (
                    <div className="text-sm text-gray-500">
                      <span>
                        คุณไม่สามารถโหวตได้อีกเนื่องจากมีการโหวตภาพอื่นไปแล้ว
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <VoteForm
                  formData={voteFormData}
                  onFormDataChange={setVoteFormData}
                  onSubmit={handleVoteSubmit}
                  onCancel={() => setShowVoteForm(false)}
                  isSubmitting={isSubmitting}
                />
              )}

              <div className="lg:mb-4 lg:hidden">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {photo.title}
                </h3>
                <p className="text-gray-600 mb-3">{photo.category}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
