import { useState, useEffect, useCallback } from "react";
import { GalleryService } from "./galleryService";
import type { GalleryImage, CampaignDataResponse } from "./types";
import { LocalStorageManager } from "./localStorageManager";

interface UseGalleryImagesState {
  images: GalleryImage[];
  campaignData: CampaignDataResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshAllStats: () => Promise<void>;
}

export function useGalleryImages(campaignId?: string): UseGalleryImagesState {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [campaignData, setCampaignData] = useState<CampaignDataResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function สำหรับสุ่มค่า size และ rotation
  const getRandomImageProps = () => {
    const sizes: GalleryImage["size"][] = ["small", "medium", "large"];
    const rotations = [
      "rotate-1",
      "-rotate-1",
      "rotate-2",
      "-rotate-2",
      "rotate-3",
      "-rotate-3",
    ];

    return {
      size: sizes[Math.floor(Math.random() * sizes.length)],
      rotation: rotations[Math.floor(Math.random() * rotations.length)],
    };
  };

  const refreshAllStats = useCallback(async () => {
    if (!campaignId) return;

    try {
      // ดึง stats ทั้งหมดจาก API
      const allStats = await GalleryService.getCampaignData(campaignId);
      setCampaignData(allStats);

      setImages((prevImages) =>
        prevImages.map((image) => {
          const newStats = allStats.submissions.find(
            (submission) => submission.id === image.id
          );
          if (newStats) {
            return {
              ...image,
              votes: {
                votes: newStats.votes.votes,
                likes: newStats.votes.likes,
                shares: newStats.votes.shares,
                comments: image.votes.comments, // Keep existing comments count
              },
            };
          }
          return image;
        })
      );
    } catch (error) {
      console.error("Failed to refresh all stats:", error);
    }
  }, [campaignId]);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      // ดึงข้อมูลแคมเปญ
      const data = await GalleryService.getCampaignData(campaignId);
      setCampaignData(data);

      // ตรวจสอบว่ามี submissions หรือไม่
      if (!data.submissions || data.submissions.length === 0) {
        setImages([]);
        return;
      }

      // แปลงข้อมูล submissions เป็น GalleryImage
      const galleryImages: GalleryImage[] = data.submissions.map(
        (submission) => {
          const randomProps = getRandomImageProps();

          return {
            id: submission.id,
            src: submission.data.main_photo,
            alt: submission.data.title || "Gallery Image",
            title: submission.data.title,
            category: submission.data.shop_name,
            description: submission.data.description_photo,
            gallery: submission.data.gallery || [],
            votes: submission.votes,
            size: randomProps.size,
            rotation: randomProps.rotation,
            createdAt: submission.createdAt,
          };
        }
      );

      setImages(galleryImages);
    } catch (err) {
      console.error("Error fetching gallery images:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ";

      setError(errorMessage);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const refetch = useCallback(async () => {
    await fetchImages();
  }, [fetchImages]);

  // Auto-fetch เมื่อ component mount หรือ campaignId เปลี่ยน
  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    campaignData,
    loading,
    error,
    refetch,
    refreshAllStats,
  };
}

// Hook สำหรับการโหวต
export function useVoting(campaignId?: string) {
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const submitVote = useCallback(
    async (
      submissionId: string,
      voterName: string,
      voterPhone: string,
      address: string,
      reason: string,
      customReason: string
    ) => {
      try {
        if (!campaignId) {
          throw new Error("Campaign ID is required");
        }

        setSubmitting(true);
        setVoteError(null);

        // ส่งการโหวต
        const result = await GalleryService.submitVote(campaignId, {
          submissionId,
          voterName,
          voterPhone,
          address,
          reason,
          customReason,
        });

        return result;
      } catch (err) {
        console.error("Error submitting vote:", err);

        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งการโหวต";

        setVoteError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [campaignId]
  );

  // ส่งการโหวตพร้อมข้อมูลครบถ้วน
  const submitVoteWithFullInfo = useCallback(
    async (
      submissionId: string,
      participantInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        reason: string;
        customReason?: string;
      }
    ) => {
      try {
        if (!campaignId) {
          throw new Error("Campaign ID is required");
        }

        setSubmitting(true);
        setVoteError(null);

        const result = await GalleryService.submitVoteWithFullInfo(
          campaignId,
          submissionId,
          participantInfo
        );

        return result;
      } catch (err) {
        console.error("Error submitting vote:", err);

        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งการโหวต";

        setVoteError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [campaignId]
  );

  return {
    submitVote,
    submitVoteWithFullInfo,
    submitting,
    voteError,
  };
}

export function useVoteStatus(campaignId?: string) {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [voteStatusError, setVoteStatusError] = useState<string | null>(null);

  // เช็คสถานะการโหวตจาก API โดยใช้ IP address
  const checkVoteStatus = useCallback(
    async (
      phone?: string
    ): Promise<{ hasVoted: boolean; votedSubmissionId?: string }> => {
      try {
        if (!campaignId) {
          throw new Error("Campaign ID is required");
        }

        setCheckingStatus(true);
        setVoteStatusError(null);

        // เช็คจาก localStorage ก่อน (ถ้ามี phone)
        if (phone) {
          const hasVotedLocally = LocalStorageManager.hasVoted(phone);
          if (hasVotedLocally) {
            const userActions = LocalStorageManager.getUserActions(phone);
            return {
              hasVoted: true,
              votedSubmissionId: userActions?.votedSubmissionId,
            };
          }
        }

        // เช็คจาก API (ใช้ IP address)
        const voteStatus = await GalleryService.checkVoteStatus(campaignId);

        // ถ้าโหวตแล้วจาก API และมี phone ให้บันทึกลง localStorage ด้วย
        if (voteStatus.hasVoted && phone && voteStatus.votedSubmissionId) {
          LocalStorageManager.addVote(phone, voteStatus.votedSubmissionId);
        }

        return {
          hasVoted: voteStatus.hasVoted,
          votedSubmissionId: voteStatus.votedSubmissionId,
        };
      } catch (err) {
        console.error("Error checking vote status:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "ไม่สามารถตรวจสอบสถานะการโหวตได้";
        setVoteStatusError(errorMessage);

        // ถ้า error จาก API และมี phone ให้ fallback ไปใช้ localStorage
        if (phone) {
          const hasVotedLocally = LocalStorageManager.hasVoted(phone);
          const userActions = LocalStorageManager.getUserActions(phone);
          return {
            hasVoted: hasVotedLocally,
            votedSubmissionId: userActions?.votedSubmissionId,
          };
        }

        return { hasVoted: false };
      } finally {
        setCheckingStatus(false);
      }
    },
    [campaignId]
  );

  // เช็คสถานะการโหวตจาก localStorage อย่างเดียว
  const checkVoteStatusLocally = useCallback(
    (phone: string): { hasVoted: boolean; votedSubmissionId?: string } => {
      const hasVoted = LocalStorageManager.hasVoted(phone);
      const userActions = LocalStorageManager.getUserActions(phone);
      return {
        hasVoted,
        votedSubmissionId: userActions?.votedSubmissionId,
      };
    },
    []
  );

  // เช็คสถานะการโหวตจาก IP อย่างเดียว (ไม่ใช้ localStorage)
  const checkVoteStatusByIP = useCallback(async (): Promise<{
    hasVoted: boolean;
    votedSubmissionId?: string;
  }> => {
    try {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      setCheckingStatus(true);
      setVoteStatusError(null);

      const voteStatus = await GalleryService.checkVoteStatus(campaignId);

      return {
        hasVoted: voteStatus.hasVoted,
        votedSubmissionId: voteStatus.votedSubmissionId,
      };
    } catch (err) {
      console.error("Error checking vote status by IP:", err);
      const errorMessage =
        err instanceof Error ? err.message : "ไม่สามารถตรวจสอบสถานะการโหวตได้";
      setVoteStatusError(errorMessage);
      return { hasVoted: false };
    } finally {
      setCheckingStatus(false);
    }
  }, [campaignId]);

  return {
    checkVoteStatus,
    checkVoteStatusLocally,
    checkVoteStatusByIP,
    checkingStatus,
    voteStatusError,
  };
}

// Hook สำหรับจัดการสถานะการโหวตแบบครอบคลุม
export function useUserVoteManager(campaignId?: string) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedSubmissionId, setVotedSubmissionId] = useState<string | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    checkVoteStatus,
    checkVoteStatusLocally,
    checkVoteStatusByIP,
    checkingStatus,
  } = useVoteStatus(campaignId);
  const { submitVoteWithFullInfo, submitting, voteError } =
    useVoting(campaignId);

  // ตั้งค่าผู้ใช้ปัจจุบันและเช็คสถานะการโหวต
  const initializeUser = useCallback(
    async (phone?: string) => {
      try {
        setCurrentUser(phone || null);
        setIsInitialized(false);

        // เช็คสถานะการโหวต
        const voteStatus = await checkVoteStatus(phone);
        setHasVoted(voteStatus.hasVoted);
        setVotedSubmissionId(voteStatus.votedSubmissionId || null);
      } catch (error) {
        console.error("Error initializing user:", error);

        // ถ้า error และมี phone ให้ใช้ localStorage
        if (phone) {
          const localStatus = checkVoteStatusLocally(phone);
          setHasVoted(localStatus.hasVoted);
          setVotedSubmissionId(localStatus.votedSubmissionId || null);
        } else {
          // ถ้าไม่มี phone ให้ตั้งค่าเป็น false
          setHasVoted(false);
          setVotedSubmissionId(null);
        }
      } finally {
        setIsInitialized(true);
      }
    },
    [checkVoteStatus, checkVoteStatusLocally]
  );

  // เช็คสถานะการโหวตจาก IP อย่างเดียว (ไม่ต้องมี phone)
  const checkCurrentVoteStatus = useCallback(async () => {
    try {
      setIsInitialized(false);

      const voteStatus = await checkVoteStatusByIP();
      setHasVoted(voteStatus.hasVoted);
      setVotedSubmissionId(voteStatus.votedSubmissionId || null);

      return voteStatus;
    } catch (error) {
      console.error("Error checking current vote status:", error);
      return { hasVoted: false };
    } finally {
      setIsInitialized(true);
    }
  }, [checkVoteStatusByIP]);

  // ส่งการโหวตและอัพเดทสถานะ
  const submitVote = useCallback(
    async (
      submissionId: string,
      participantInfo: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        reason: string;
        customReason?: string;
      }
    ) => {
      try {
        // เช็คก่อนว่าโหวตแล้วหรือยัง
        if (hasVoted) {
          throw new Error("คุณได้ทำการโหวตไปแล้ว");
        }

        // ส่งการโหวต
        const result = await submitVoteWithFullInfo(
          submissionId,
          participantInfo
        );

        // อัพเดทสถานะในระบบ
        setHasVoted(true);
        setVotedSubmissionId(submissionId);
        setCurrentUser(participantInfo.phone);

        // บันทึกลง localStorage
        LocalStorageManager.addVote(participantInfo.phone, submissionId);

        return result;
      } catch (error) {
        console.error("Error submitting vote:", error);
        throw error;
      }
    },
    [hasVoted, submitVoteWithFullInfo]
  );

  // รีเซ็ตสถานะ (สำหรับการเปลี่ยนผู้ใช้หรือรีเฟรชหน้า)
  const resetUserState = useCallback(() => {
    setCurrentUser(null);
    setHasVoted(false);
    setVotedSubmissionId(null);
    setIsInitialized(false);
  }, []);

  return {
    currentUser,
    hasVoted,
    votedSubmissionId,
    isInitialized,
    checkingStatus,
    submitting,
    voteError,
    initializeUser,
    checkCurrentVoteStatus,
    submitVote,
    resetUserState,
  };
}
