import { apiClient } from "./api";
import type { ApiResponse } from "./types";

export interface CreateCardRequest {
  cardType: string;
  cardImage: File;
  coverImage: string;
  authorName: string;
  messageText: string;
}

export interface SubmitCardResponse {
  success: boolean;
  message: string;
  data: MothersDayCardEntity;
}

export interface MothersDayCard {
  id: string;
  campaignId: string;
  data: {
    cardType: string;
    cardImage: string;
    coverImage: string;
    authorName: string;
    messageText: string;
  };
  createdAt: string;
  updatedAt: string;
  websiteId: string | null;
}

export interface MothersDayCardEntity {
  id: string;
  cardType: string;
  cardImage: string;
  coverImage: string;
  authorName: string;
  messageText: string;
  createdAt: string;
  updatedAt: string;
}

export class MothersDayCardService {
  private static readonly WEBSITE_ID = "OSP";
  private static readonly CAMPAIGN_ID = "cmdwrhyyj00oopd08h1fqcsi1";

  // Submit Mother's Day Card
  static async submitCard(
    cardData: CreateCardRequest
  ): Promise<MothersDayCardEntity> {
    try {
      const endpoint = `/api/public/campaigns/${this.CAMPAIGN_ID}/submitCard`;
      const formData = new FormData();

      formData.append("websiteId", this.WEBSITE_ID);
      formData.append("cardType", cardData.cardType);
      formData.append("authorName", cardData.authorName);
      formData.append("messageText", cardData.messageText);
      formData.append("coverImage", cardData.coverImage);
      formData.append("cardImage", cardData.cardImage, cardData.cardImage.name);

      const response = await apiClient.postForm<
        ApiResponse<MothersDayCardEntity>
      >(endpoint, formData);

      if (!response.success) {
        throw new Error(response.message || "ไม่สามารถส่งการ์ดได้");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to submit card:", error);
      throw new Error("ไม่สามารถส่งการ์ดได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  // Get Card by ID
  static async getCardById(cardId: string): Promise<MothersDayCard> {
    try {
      const endpoint = `/api/public/campaigns/${this.CAMPAIGN_ID}/submitCard?id=${cardId}&websiteId=${this.WEBSITE_ID}`;

      const response = await apiClient.get<ApiResponse<MothersDayCard>>(
        endpoint
      );

      if (!response.success) {
        throw new Error(response.message || "ไม่พบการ์ดที่ระบุ");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch card:", error);

      if (error instanceof Error && error.message.includes("not found")) {
        throw new Error("ไม่พบการ์ดที่ระบุ");
      }

      throw new Error("ไม่สามารถดึงข้อมูลการ์ดได้");
    }
  }
}
