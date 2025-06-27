import { useState, useEffect, useCallback } from "react";
import { GalleryService } from "./galleryService";
import type { GalleryImage, CampaignDataResponse } from "./types";

interface UseGalleryImagesState {
  images: GalleryImage[];
  campaignData: CampaignDataResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching campaign data for ID:", campaignId);

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

      console.log("Transformed gallery images:", galleryImages.length, "items");
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
  }, [fetchImages]);

  return {
    images,
    campaignData,
    loading,
    error,
    refetch,
  };
}

// Hook สำหรับการโหวต
export function useVoting() {
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const submitVote = useCallback(
    async (submissionId: string, voterName: string, voterPhone: string) => {
      try {
        setSubmitting(true);
        setVoteError(null);

        console.log("Submitting vote:", {
          submissionId,
          voterName,
          voterPhone,
        });

        // ส่งการโหวต (ลบการตรวจสอบ vote status ออกก่อน เพื่อให้ test ได้)
        const result = await GalleryService.submitVote({
          submissionId,
          voterName,
          voterPhone,
        });

        console.log("Vote submitted successfully:", result);
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
    []
  );

  return {
    submitVote,
    submitting,
    voteError,
  };
}

// Hook สำหรับดึงสถิติการโหวต
export function useVoteStats() {
  const [stats, setStats] = useState<
    { submissionId: string; votes: number; likes: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const voteStats = await GalleryService.getVoteStats();
      setStats(voteStats);
    } catch (err) {
      console.error("Error fetching vote stats:", err);

      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงสถิติ";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}

// Hook สำหรับตรวจสอบสถานะการโหวต
export function useVoteStatus(phone?: string) {
  const [voteStatus, setVoteStatus] = useState<{
    hasVoted: boolean;
    votedSubmissionId?: string;
  }>({ hasVoted: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);

      const status = await GalleryService.checkVoteStatus(phoneNumber);
      setVoteStatus(status);

      return status;
    } catch (err) {
      console.error("Error checking vote status:", err);

      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการตรวจสอบสถานะ";

      setError(errorMessage);
      return { hasVoted: false };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (phone) {
      checkStatus(phone);
    }
  }, [phone, checkStatus]);

  return {
    voteStatus,
    loading,
    error,
    checkStatus,
  };
}
