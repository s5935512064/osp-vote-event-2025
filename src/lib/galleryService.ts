import { apiClient } from "./api";
import type {
  ApiResponse,
  CampaignDataResponse,
  GalleryImage,
  Vote,
  VoteSubmission,
  VoteStatus,
  LikeAction,
  ShareAction,
  ActionResponse,
} from "./types";

// เพิ่ม interface สำหรับ action request
interface ActionRequest {
  submissionId: string;
  voteType: "vote" | "like" | "share";
  websiteId: string;
  participantInfo: {
    name?: string;
    phone?: string;
    email?: string;
    lineId?: string;
    contactMethod?: "phone" | "email" | "line";
    platform?: "facebook" | "line" | "twitter" | "copy"; // สำหรับ share
    userId?: string; // สำหรับ anonymous actions
    address?: string;
    reason?: string;
    customReason?: string;
  };
}

export class GalleryService {
  private static readonly WEBSITE_ID = "OSP";

  // ดึงข้อมูลแคมเปญและรูปภาพทั้งหมด
  static async getCampaignData(
    campaignId?: string
  ): Promise<CampaignDataResponse> {
    try {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      const endpoint = `/api/public/campaigns/${campaignId}?websiteId=${this.WEBSITE_ID}`;

      const response = await apiClient.get<ApiResponse<CampaignDataResponse>>(
        endpoint
      );

      if (!response.success) {
        throw new Error(response.message || "ไม่สามารถดึงข้อมูลได้");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign data:", error);
      throw new Error("ไม่สามารถดึงข้อมูลแคมเปญได้");
    }
  }

  // ส่งการโหวต
  static async submitVote(
    campaignId: string,
    voteData: VoteSubmission
  ): Promise<Vote> {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/vote`;

      const actionRequest: ActionRequest = {
        submissionId: voteData.submissionId,
        voteType: "vote",
        websiteId: this.WEBSITE_ID,
        participantInfo: {
          name: voteData.voterName,
          phone: voteData.voterPhone,
          address: voteData.address,
          reason: voteData.reason,
          customReason: voteData.customReason,
          // เพิ่มข้อมูลอื่นๆ ถ้ามี
        },
      };

      const response = await apiClient.post<ApiResponse<Vote>>(
        endpoint,
        actionRequest
      );

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

  // ส่งการไลค์
  static async submitLike(
    campaignId: string,
    action: LikeAction
  ): Promise<ActionResponse> {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/vote`;

      const actionRequest: ActionRequest = {
        submissionId: action.submissionId,
        voteType: "like",
        websiteId: this.WEBSITE_ID,
        participantInfo: {
          userId: action.voterPhone, // ใช้เป็น userId สำหรับ anonymous
          phone: action.voterPhone.startsWith("user_")
            ? undefined
            : action.voterPhone,
        },
      };

      const response = await apiClient.post<ApiResponse<ActionResponse>>(
        endpoint,
        actionRequest
      );

      if (!response.success) {
        throw new Error(response.message || "ไม่สามารถส่งการไลค์ได้");
      }

      return response.data;
    } catch (error) {
      console.error("Error submitting like:", error);
      throw error;
    }
  }

  // เช็คไลค์
  static async checkLikeStatus(
    campaignId: string,
    submissionId: string,
    userId?: string
  ): Promise<{
    hasVoted: boolean;
    hasLiked: boolean;
    votes: any[];
    summary: {
      like: number;
      share: number;
      vote: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        submissionId: submissionId,
        websiteId: this.WEBSITE_ID,
        voteType: "like",
        action: "check", // เพิ่ม parameter เพื่อระบุว่าเป็นการเช็คสถานะ
      });

      if (userId) {
        params.append("userId", userId);
      }

      const endpoint = `/api/public/campaigns/${campaignId}/vote?${params.toString()}`;
      const response = await apiClient.get<
        ApiResponse<{
          campaignId: string;
          submissionId: string;
          clientIP: string;
          message: string;
          voteStatus: {
            hasVoted: boolean;
            hasLiked: boolean;
            votes: any[];
            summary: {
              like: number;
              share: number;
              vote: number;
            };
          };
        }>
      >(endpoint);

      if (!response.success) {
        return {
          hasVoted: false,
          hasLiked: false,
          votes: [],
          summary: { like: 0, share: 0, vote: 0 },
        };
      }

      return response.data.voteStatus;
    } catch (error) {
      console.error("Error checking like status:", error);
      return {
        hasVoted: false,
        hasLiked: false,
        votes: [],
        summary: { like: 0, share: 0, vote: 0 },
      };
    }
  }

  // ส่งการแชร์
  static async submitShare(
    campaignId: string,
    action: ShareAction
  ): Promise<ActionResponse> {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/vote`;

      const actionRequest: ActionRequest = {
        submissionId: action.submissionId,
        voteType: "share",
        websiteId: this.WEBSITE_ID,
        participantInfo: {
          userId: action.voterPhone, // ใช้เป็น userId สำหรับ anonymous
          phone: action.voterPhone.startsWith("user_")
            ? undefined
            : action.voterPhone,
          platform: action.platform,
        },
      };

      const response = await apiClient.post<ApiResponse<ActionResponse>>(
        endpoint,
        actionRequest
      );

      if (!response.success) {
        throw new Error(response.message || "ไม่สามารถส่งการแชร์ได้");
      }

      return response.data;
    } catch (error) {
      console.error("Error submitting share:", error);
      throw error;
    }
  }

  // ตรวจสอบสถานะการโหวต
  static async checkVoteStatus(campaignId: string): Promise<VoteStatus> {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/vote?websiteId=${this.WEBSITE_ID}&checkVote=true`;
      const response = await apiClient.get<
        ApiResponse<{
          campaignId: string;
          clientIP: string;
          hasVoted: boolean;
          voteInfo?: {
            id: string;
            submissionId: string;
            timestamp: string;
          };
        }>
      >(endpoint);

      const data = response.data;
      return {
        hasVoted: data.hasVoted,
        votedSubmissionId: data.voteInfo?.submissionId,
      };
    } catch (error) {
      console.error("Error checking vote status:", error);
      return { hasVoted: false };
    }
  }

  // ตรวจสอบ actions ของผู้ใช้ (likes/shares)
  static async getUserActions(
    campaignId: string,
    userId: string
  ): Promise<{
    likedSubmissions: string[];
    sharedSubmissions: string[];
  }> {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/user/actions`;

      const response = await apiClient.post<
        ApiResponse<{
          likedSubmissions: string[];
          sharedSubmissions: string[];
        }>
      >(endpoint, {
        userId,
        websiteId: this.WEBSITE_ID,
      });

      return response.data || { likedSubmissions: [], sharedSubmissions: [] };
    } catch (error) {
      console.error("Error getting user actions:", error);
      return { likedSubmissions: [], sharedSubmissions: [] };
    }
  }

  // ดึงสถิติการโหวต
  static async getVoteStats(campaignId: string): Promise<
    {
      submissionId: string;
      votes: number;
      likes: number;
      shares: number;
    }[]
  > {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/stats?websiteId=${this.WEBSITE_ID}`;

      const response = await apiClient.get<
        ApiResponse<
          Array<{
            submissionId: string;
            votes: number;
            likes: number;
            shares: number;
          }>
        >
      >(endpoint);

      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch vote stats:", error);
      throw new Error("ไม่สามารถดึงสถิติการโหวตได้");
    }
  }

  // ส่งการโหวตพร้อมข้อมูลครบถ้วน (สำหรับ VoteForm)
  static async submitVoteWithFullInfo(
    campaignId: string,
    submissionId: string,
    participantInfo: {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      reason?: string;
      customReason?: string;
    }
  ): Promise<Vote> {
    try {
      const endpoint = `/api/public/campaigns/${campaignId}/vote`;

      const actionRequest: ActionRequest = {
        submissionId,
        voteType: "vote",
        websiteId: this.WEBSITE_ID,
        participantInfo: {
          name: `${participantInfo.firstName} ${participantInfo.lastName}`,
          phone: participantInfo.phone,
          address: participantInfo.address,
          reason: participantInfo.reason,
          ...(participantInfo.customReason && {
            customReason: participantInfo.customReason,
          }),
        },
      };

      const response = await apiClient.post<ApiResponse<Vote>>(
        endpoint,
        actionRequest
      );

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

  // ดึงเฉพาะรายการ submissions (deprecated - ใช้ getCampaignData แทน)
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
}
