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
  private static readonly CAMPAIGN_ID = "cmicvn21f000rnw08vxcad2o8";

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

  // Download Card Files
  static async downloadCard(pathFile: string, filename: string): Promise<void> {
    try {
      const downloadIdCard = pathFile.split("/").pop();

      const response = await fetch(
        `/event/api/download?fileId=${downloadIdCard}&filename=${filename}`,
        {
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_DOWNLOAD_TOKEN ||
              "bN8FEA1vBJSFoceM70hnt779K76BUvzX5HB9vyL6ys0="
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-card.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download card:", error);
      throw new Error("ไม่สามารถดาวน์โหลดการ์ดได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  // Print Card
  static async printCard(cardId: string): Promise<void> {
    try {
      // Get card data first
      const cardData = await this.getCardById(cardId);

      if (!cardData) {
        throw new Error("ไม่พบการ์ดที่ระบุ");
      }

      const printJS = (await import("print-js")).default;
      const images: string[] = [];

      // Prepare cover image for printing
      if (cardData.data.coverImage) {
        const downloadIdCover = cardData.data.coverImage.split("/").pop();
        const downloadPathCover = `https://assets-manager.ssdapp.net/api/download/${downloadIdCover}`;

        const responseCover = await fetch(
          `/api/download?url=${encodeURIComponent(
            downloadPathCover
          )}&filename=cover.png`
        );

        if (responseCover.ok) {
          const blobCover = await responseCover.blob();
          const blobUrlCover = URL.createObjectURL(blobCover);
          images.push(blobUrlCover);
        }
      }

      // Prepare card image for printing
      if (cardData.data.cardImage) {
        const downloadIdCard = cardData.data.cardImage.split("/").pop();
        const downloadPathCard = `https://assets-manager.ssdapp.net/api/download/${downloadIdCard}`;

        const responseCard = await fetch(
          `/api/download?url=${encodeURIComponent(
            downloadPathCard
          )}&filename=card.png`
        );

        if (responseCard.ok) {
          const blobCard = await responseCard.blob();
          const blobUrlCard = URL.createObjectURL(blobCard);
          images.push(blobUrlCard);
        }
      }

      if (images.length > 0) {
        printJS({
          printable: images,
          type: "image",
          showModal: true,
          imageStyle: "width:100%;margin:0px;padding:0px;",
        });
      } else {
        throw new Error("ไม่พบรูปภาพที่จะพิมพ์");
      }
    } catch (error) {
      console.error("Failed to print card:", error);
      throw new Error("ไม่สามารถพิมพ์การ์ดได้ กรุณาลองใหม่อีกครั้ง");
    }
  }
}
