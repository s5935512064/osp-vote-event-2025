import { apiClient } from "./api";
import type {
  ApiResponse,
  CampaignDataResponse,
  GalleryImage,
  Vote,
  VoteSubmission,
} from "./types";

export class GalleryService {
  // ดึงข้อมูลแคมเปญและรูปภาพทั้งหมด
  static async getCampaignData(
    campaignId?: string
  ): Promise<CampaignDataResponse> {
    try {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      const endpoint = `/api/public/campaigns/${campaignId}?websiteId=OSP`;

      console.log("Fetching from endpoint:", endpoint);

      const response = await apiClient.get<ApiResponse<CampaignDataResponse>>(
        endpoint
      );

      console.log("API Response:", response);

      if (!response.success) {
        throw new Error(response.message || "ไม่สามารถดึงข้อมูลได้");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign data:", error);
      throw new Error("ไม่สามารถดึงข้อมูลแคมเปญได้");
    }
  }

  // ดึงเฉพาะรายการ submissions
  static async getSubmissions(): Promise<GalleryImage[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          submissions: Array<{
            id: string;
            data: {
              shop_name: string;
              title: string;
              description_photo: string;
              main_photo: string;
              gallery: string[];
            };
            votes: {
              likes: number;
              shares: number;
              comments: number;
              votes: number;
            };
            createdAt: string;
          }>;
        }>
      >("/api/submissions");

      return response.data.submissions.map((submission) => ({
        id: submission.id,
        src: submission.data.main_photo,
        alt: submission.data.title,
        title: submission.data.title,
        category: submission.data.shop_name,
        description: submission.data.description_photo,
        gallery: submission.data.gallery,
        votes: submission.votes,
        size: this.getRandomSize(),
        rotation: this.getRandomRotation(),
        createdAt: submission.createdAt,
      }));
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      throw new Error("ไม่สามารถดึงข้อมูลรูปภาพได้");
    }
  }

  // ส่งการโหวต
  static async submitVote(voteData: VoteSubmission): Promise<Vote> {
    try {
      const response = await apiClient.post<ApiResponse<Vote>>("/api/votes", {
        submissionId: voteData.submissionId,
        voterName: voteData.voterName,
        voterPhone: voteData.voterPhone,
      });

      if (!response.success) {
        throw new Error(response.message || "ไม่สามารถส่งการโหวตได้");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to submit vote:", error);
      if (error instanceof Error && error.message.includes("already voted")) {
        throw new Error("คุณได้ทำการโหวตไปแล้ว");
      }
      throw new Error("ไม่สามารถส่งการโหวตได้");
    }
  }

  // ตรวจสอบสถานะการโหวต
  static async checkVoteStatus(
    phone: string
  ): Promise<{ hasVoted: boolean; votedSubmissionId?: string }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{ hasVoted: boolean; votedSubmissionId?: string }>
      >(`/api/votes/check?phone=${encodeURIComponent(phone)}`);

      return response.data;
    } catch (error) {
      console.error("Failed to check vote status:", error);
      return { hasVoted: false };
    }
  }

  // ดึงสถิติการโหวต
  static async getVoteStats(): Promise<
    { submissionId: string; votes: number; likes: number }[]
  > {
    try {
      const response = await apiClient.get<
        ApiResponse<
          Array<{
            submissionId: string;
            votes: number;
            likes: number;
          }>
        >
      >("/api/votes/stats");

      return response.data;
    } catch (error) {
      console.error("Failed to fetch vote stats:", error);
      throw new Error("ไม่สามารถดึงสถิติการโหวตได้");
    }
  }

  // Helper functions
  private static getRandomSize(): GalleryImage["size"] {
    const sizes: GalleryImage["size"][] = ["small", "medium", "large"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  private static getRandomRotation(): string {
    const rotations = [
      "rotate-1",
      "-rotate-1",
      "rotate-2",
      "-rotate-2",
      "rotate-3",
      "-rotate-3",
    ];
    return rotations[Math.floor(Math.random() * rotations.length)];
  }
}
