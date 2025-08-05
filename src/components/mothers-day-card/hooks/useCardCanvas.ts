import { useRef, useCallback } from "react";
import { type CardData, type ElementSize } from "../types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DEFAULT_CARD_WIDTH,
  DEFAULT_CARD_HEIGHT,
} from "../constants";
import { createFileDownload, calculateFontSize } from "../utils";

interface UseCardCanvasProps {
  cardData: CardData;
  dragPositions: {
    message: { x: number; y: number };
    author: { x: number; y: number };
    image: { x: number; y: number };
  };
  elementSizes: {
    message: ElementSize;
    author: ElementSize;
    image: ElementSize;
  };
}

export const useCardCanvas = ({
  cardData,
  dragPositions,
  elementSizes,
}: UseCardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wrapTextForCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number
    ): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0] || "";

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = `${currentLine} ${word}`;
        const metrics = ctx.measureText(testLine);

        if (metrics.width < maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    },
    []
  );

  const drawCardToCanvas = useCallback(
    async (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      includeImage: boolean = true
    ) => {
      // Set canvas size for high quality
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // Draw card background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#fce7f3");
      gradient.addColorStop(1, "#fbcfe8");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cover text
      ctx.fillStyle = "#831843";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(cardData.coverText, canvas.width / 2, 200);

      // Calculate dynamic font sizes
      const messageFontSize = calculateFontSize(
        cardData.cardType.textPosition.fontSize,
        elementSizes.message,
        { width: 200, height: 100 }
      );

      // Draw message text with dynamic font size
      const { textPosition } = cardData.cardType;
      ctx.fillStyle = textPosition.color;
      ctx.font = `${messageFontSize * 2}px ${textPosition.fontFamily}`;
      ctx.textAlign = textPosition.textAlign as CanvasTextAlign;

      const messageX = (canvas.width * dragPositions.message.x) / 100;
      const messageY = (canvas.height * dragPositions.message.y) / 100;
      const messageWidth =
        elementSizes.message.width * (canvas.width / DEFAULT_CARD_WIDTH);

      const wrappedText = wrapTextForCanvas(
        ctx,
        cardData.messageText,
        messageWidth
      );
      wrappedText.forEach((line, index) => {
        ctx.fillText(line, messageX, messageY + index * messageFontSize * 2.5);
      });

      // Draw author name with dynamic font size
      if (cardData.authorName) {
        const authorFontSize = calculateFontSize(
          textPosition.fontSize * 0.75,
          elementSizes.author,
          { width: 150, height: 40 }
        );

        const authorX = (canvas.width * dragPositions.author.x) / 100;
        const authorY = (canvas.height * dragPositions.author.y) / 100;

        ctx.font = `bold ${authorFontSize * 1.5}px ${textPosition.fontFamily}`;
        ctx.fillText(`ด้วยรักจาก ${cardData.authorName}`, authorX, authorY);
      }

      // Draw custom image if includeImage is true
      if (includeImage && cardData.customImage) {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const imageX = (canvas.width * dragPositions.image.x) / 100;
            const imageY = (canvas.height * dragPositions.image.y) / 100;
            const imageSize =
              elementSizes.image.width * (canvas.width / DEFAULT_CARD_WIDTH);

            ctx.drawImage(
              img,
              imageX - imageSize / 2,
              imageY - imageSize / 2,
              imageSize,
              imageSize
            );
            resolve();
          };
          img.onerror = () => {
            console.error("Failed to load image");
            resolve();
          };
          img.src = cardData.customImage || "";
        });
      }
    },
    [cardData, dragPositions, elementSizes, wrapTextForCanvas]
  );

  const printCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await drawCardToCanvas(ctx, canvas, true);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const printWindow = window.open("", "_blank");

        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Mother's Day Card</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh;
                    background: white;
                  }
                  img { 
                    max-width: 100%; 
                    height: auto; 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                  }
                  @media print {
                    body { padding: 0; }
                    img { box-shadow: none; }
                  }
                </style>
              </head>
              <body>
                <img src="${url}" alt="Mother's Day Card" />
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                      setTimeout(function() {
                        window.close();
                      }, 1000);
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 5000);
        } else {
          createFileDownload(blob, "mothers-day-card.png");
        }
      }
    });
  }, [drawCardToCanvas]);

  const downloadCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await drawCardToCanvas(ctx, canvas, true);
  }, [drawCardToCanvas]);

  // เพิ่มฟังก์ชันสำหรับสร้างภาพการ์ด
  const generateCardImage = useCallback(async (): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not found");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not found");

    // ตั้งค่าขนาด canvas
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // วาดการ์ดโดยใช้ฟังก์ชัน drawCardToCanvas
    await drawCardToCanvas(ctx, canvas, true);

    // ส่งคืนเป็น data URL
    return canvas.toDataURL("image/png", 0.9);
  }, [cardData, dragPositions, elementSizes, drawCardToCanvas]);

  return {
    canvasRef,
    printCard,
    downloadCard,
    generateCardImage, // เพิ่มฟังก์ชันนี้
  };
};
