import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type DragEndEvent } from "@dnd-kit/core";
import {
  Upload,
  Download,
  ArrowLeft,
  Printer,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { ProgressSteps } from "./mothers-day-card/ProgressSteps";
import { CardTypeItem } from "./mothers-day-card/CardTypeItem";
import { CardPreview } from "./mothers-day-card/CardPreview";
import { useCardCanvas } from "./mothers-day-card/hooks/useCardCanvas";
import { CARD_TYPES } from "./mothers-day-card/constants";
import type { CardData, ElementSize, StepType } from "./mothers-day-card/types";
import {
  MothersDayCardService,
  type MothersDayCardEntity,
} from "@/lib/motherdaysService";
import { downloadFile } from "../lib/download";

//@ts-ignore
import domtoimage from "dom-to-image-more";

// เพิ่ม import สำหรับ Sweet Alert
import Swal from "sweetalert2";

const MothersDayCardCreator: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    cardType: CARD_TYPES[0],
    coverText: "Happy Mother's Day",
    messageText: "",
    authorName: "",
    customImage: undefined,
  });

  const [cardResponse, setCardResponse] = useState<MothersDayCardEntity | null>(
    null
  );

  const [currentStep, setCurrentStep] = useState<StepType>("select");

  // ปรับ initial positions และ sizes ให้สอดคล้องกับ base dimensions
  const [dragPositions, setDragPositions] = useState(() => {
    return {
      message: { x: 520, y: 380 }, // ตำแหน่งกลางแนวนอน, บนกว่าเดิม
      author: { x: 650, y: 500 }, // ตำแหน่งกลางแนวนอน, กลางแนวตั้ง
      image: { x: 230, y: 550 }, // ซ้ายกว่าเดิม
    };
  });

  const [elementSizes, setElementSizes] = useState(() => {
    return {
      message: { width: 600, height: 200 }, // ลดขนาดลง
      author: { width: 200, height: 60 }, // ลดขนาดลง
      image: { width: 150, height: 150 }, // ลดขนาดลง
    };
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่ม state สำหรับการ submit

  const { canvasRef, printCard, downloadCard } = useCardCanvas({
    cardData,
    dragPositions,
    elementSizes,
  });

  const generateCardImage = async () => {
    // สร้าง hidden container สำหรับ export ที่มี aspect ratio เดียวกับ preview
    const exportContainer = document.createElement("div");
    exportContainer.style.position = "absolute";
    exportContainer.style.left = "-9999px";
    exportContainer.style.top = "-9999px";

    // ใช้ aspect ratio 4:3 เหมือน preview แต่ขนาดใหญ่ขึ้น
    const exportWidth = 1024;
    const exportHeight = 768; // 4:3 ratio

    exportContainer.style.width = `${exportWidth}px`;
    exportContainer.style.height = `${exportHeight}px`;
    exportContainer.style.background = "white";
    exportContainer.className = "card-export-container";
    document.body.appendChild(exportContainer);

    try {
      // Clone CardPreview content
      const cardPreviewElement = document.querySelector(
        ".card-preview-container"
      );

      if (cardPreviewElement) {
        exportContainer.innerHTML = cardPreviewElement.innerHTML;
        const clonedContainer = exportContainer.querySelector(
          ".card-preview-container"
        );
        if (clonedContainer) {
          (clonedContainer as HTMLElement).style.width = `${exportWidth}px`;
          (clonedContainer as HTMLElement).style.height = `${exportHeight}px`;
          (clonedContainer as HTMLElement).style.maxWidth = `${exportWidth}px`;
          (
            clonedContainer as HTMLElement
          ).style.maxHeight = `${exportHeight}px`;

          // แสดงเฉพาะ desktop version และซ่อน mobile version
          const desktopElements = clonedContainer.querySelectorAll(".hidden");
          desktopElements.forEach((element) => {
            (element as HTMLElement).classList.remove("hidden");
            (element as HTMLElement).classList.add("block");
          });

          const mobileElements = clonedContainer.querySelectorAll(".block");
          mobileElements.forEach((element) => {
            if (
              element.classList.contains("md:hidden") ||
              element.previousElementSibling?.classList.contains("hidden")
            ) {
              (element as HTMLElement).classList.remove("block");
              (element as HTMLElement).classList.add("hidden");
            }
          });
        }

        const previewElement = document.querySelector(
          ".card-preview-container"
        ) as HTMLElement;

        const previewWidth = previewElement?.offsetWidth || 400;
        const previewHeight = previewElement?.offsetHeight || 300;

        const scaleX = exportWidth / previewWidth;
        const scaleY = exportHeight / previewHeight;
        const scale = Math.min(scaleX, scaleY);
        // แสดงเฉพาะ desktop version ใน export
        const desktopElements = exportContainer.querySelectorAll(".hidden");
        desktopElements.forEach((element) => {
          (element as HTMLElement).style.display = "block";
        });

        const mobileElements = exportContainer.querySelector("#mobile");
        if (mobileElements) {
          (mobileElements as HTMLElement).style.display = "none";
        }

        const dataUrl = await domtoimage.toPng(exportContainer, {
          bgcolor: "#ffffff",
          height: exportHeight,
          width: exportWidth,
          quality: 1.0,
          cacheBust: true,
          imagePlaceholder: undefined,
          copyDefaultStyles: true,
          scale: 1,
          useCORS: true, // เพิ่ม option นี้
          allowTaint: true, // เพิ่ม option นี้
          filter: (node: any) => {
            return !node.classList?.contains("export-ignore");
          },
          onclone: (clonedNode: any) => {
            const container = clonedNode as HTMLElement;
            container.style.width = `${exportWidth}px`;
            container.style.height = `${exportHeight}px`;
            container.style.position = "relative";
            container.style.background = "white";

            // ลบ resize handles
            const resizeHandles = container.querySelectorAll(
              '.absolute[style*="bg-blue-400"], .absolute[style*="bg-blue-500"], .fixed'
            );
            resizeHandles.forEach((handle) => handle.remove());

            // ปรับขนาด font
            const textElements = container.querySelectorAll(
              '[style*="font-size"]'
            );

            textElements.forEach((element) => {
              const htmlElement = element as HTMLElement;
              const currentStyle = htmlElement.style.fontSize;

              if (currentStyle) {
                const fontSize = parseFloat(currentStyle);
                htmlElement.style.fontSize = `${fontSize}px`;
              }
            });

            const style = document.createElement("style");
            style.textContent = `
              @font-face {
                font-family: 'fonttintin';
                src: url('${window.location.origin}/fonts/fonttintin.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
              }
              * {
                font-family: 'fonttintin', sans-serif !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
              }
              .card-preview-container {
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
              }
              .card-preview-container * {
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
              }
              .draggable-element {
                border: none !important;
                outline: none !important;
              }
              .resize-handle, .absolute[style*="bg-blue-400"], .fixed {
                display: none !important;
              }
              *:focus {
                outline: none !important;
                border: none !important;
              }
              *:hover {
                border: none !important;
                outline: none !important;
              }
            `;
            container.appendChild(style);
          },
        });

        return dataUrl;
      }
    } finally {
      // ลบ container
      document.body.removeChild(exportContainer);
    }
  };

  // ฟังก์ชันสำหรับแสดง Sweet Alert และส่ง API
  const handleCreateCard = async () => {
    try {
      setIsSubmitting(true);

      Swal.fire({
        title: "กำลังสร้างการ์ด...",
        text: "กรุณารอสักครู่ กำลังบันทึกการ์ดของคุณ",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // สร้างภาพการ์ด
      const cardImageDataUrl: File = await generateCardImage().then((dataUrl) =>
        base64ToFile(dataUrl, `mothers-day-card-${Date.now()}.png`)
      );

      const response = await MothersDayCardService.submitCard({
        cardType: cardData.cardType.id,
        cardImage: cardImageDataUrl,
        coverImage: cardData.cardType.coverImage,
        authorName: cardData.authorName,
        messageText: cardData.messageText,
      });

      if (response) {
        setCardResponse(response);
      }

      Swal.fire({
        icon: "success",
        title: "สร้างการ์ดสำเร็จ!",
        text: "ขอบคุณที่ให้เราเป็นส่วนหนึ่งในการตอบแทนความรักของคุณ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0a3254",
        timer: 3000,
      }).then(() => {
        setCurrentStep("preview");
      });
    } catch (error) {
      console.error("Error creating card:", error);

      // แสดง error message
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสร้างการ์ดได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ลองใหม่",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag end for DnD
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    if (active) {
      const elementId = active.id as string;

      setDragPositions((prevPositions) => {
        const currentPosition =
          prevPositions[elementId as keyof typeof prevPositions];

        const newX = currentPosition.x + delta.x;
        const newY = currentPosition.y + delta.y;

        return {
          ...prevPositions,
          [elementId]: { x: newX, y: newY },
        };
      });
    }
  }, []);

  // Handlers
  const handleInputChange = useCallback(
    (field: keyof CardData, value: string) => {
      setCardData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCardTypeSelect = useCallback((cardType: any) => {
    setCardData((prev) => ({ ...prev, cardType }));
    setCurrentStep("customize");
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardData((prev) => ({
          ...prev,
          customImage: e.target?.result as string,
        }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const removeCustomImage = useCallback(() => {
    setIsUploading(false);
    setCardData((prev) => ({
      ...prev,
      customImage: undefined,
    }));
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);

  const handleSizeChange = useCallback(
    (elementId: string, newSize: ElementSize) => {
      console.log(elementId, newSize, "newSize");
      setElementSizes((prev) => ({
        ...prev,
        [elementId]: newSize,
      }));
    },
    []
  );

  const base64ToFile = useCallback(
    (base64String: string, fileName: string): File => {
      // Extract the data part from data URL
      const arr = base64String.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], fileName, { type: mime });
    },
    []
  );

  // Components
  const CardTypeSelector = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <p className="text-gray-600">
          เลือกการ์ดที่คุณชอบเพื่อส่งความรักให้คุณแม่
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {CARD_TYPES.map((cardType) => (
          <div key={cardType.id} className="space-y-4">
            <CardTypeItem
              cardType={cardType}
              isSelected={cardData.cardType.id === cardType.id}
              onSelect={handleCardTypeSelect}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );

  const CardCustomizer = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-screen-lg mx-auto"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => setCurrentStep("select")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            กลับไปเลือกแบบ
          </Button>
          <Button
            type="button"
            onClick={handleCreateCard} // เปลี่ยนเป็น handleCreateCard
            disabled={isSubmitting} // ปิดปุ่มเมื่อกำลัง submit
            className="bg-[#0a3254] text-white px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              "สร้างการ์ด"
            )}
          </Button>
        </div>

        {/* Form Section */}
        <div className="gap-2 grid grid-cols-1 md:grid-cols-2 relative h-full">
          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-700">
              ข้อความอวยพร
            </label>
            <textarea
              value={cardData.messageText}
              onChange={(e) => handleInputChange("messageText", e.target.value)}
              onKeyDown={handleKeyDown}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-transparent resize-none"
              placeholder="เขียนข้อความถึงคุณแม่..."
              style={{
                transform: "translateZ(0)",
                willChange: "auto",
              }}
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ส่ง
              </label>
              <input
                type="text"
                value={cardData.authorName}
                onChange={(e) =>
                  handleInputChange("authorName", e.target.value)
                }
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-transparent"
                placeholder="ชื่อของคุณ"
                style={{
                  transform: "translateZ(0)",
                  willChange: "auto",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพ (ไม่บังคับ)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                {cardData.customImage ? (
                  <div className="mt-2 relative aspect-square max-h-40">
                    <img
                      src={cardData.customImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeCustomImage}
                      disabled={isUploading}
                      className="absolute shrink-0 top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors aspect-square disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className={`w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer duration-200 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-200 transition-all ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 size={24} className="text-gray-400" />
                    ) : (
                      <Upload size={24} className="text-gray-400" />
                    )}

                    <span className="text-sm text-gray-600">
                      คลิกเพื่ออัปโหลดรูปภาพ
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-gray-800">ตัวอย่างการ์ด</h3>
          <div style={{ transform: "translateZ(0)", willChange: "auto" }}>
            <CardPreview
              cardData={cardData}
              dragPositions={dragPositions}
              elementSizes={elementSizes}
              onDragEnd={handleDragEnd}
              onSizeChange={handleSizeChange}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const FullPreview = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {cardResponse != null && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-4">
            <img
              src={cardResponse.coverImage}
              alt="Card Image"
              className="w-full h-full object-cover"
            />
            <div className="flex justify-center gap-4">
              {/* <Button
                type="button"
                onClick={() => printCardFromUrl(cardResponse.coverImage)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg flex items-center gap-2"
              >
                <Printer size={16} />
                พิมพ์การ์ด
              </Button> */}
              <Button
                type="button"
                onClick={() =>
                  downloadFile(
                    cardResponse.coverImage,
                    `mothers-day-card-${Date.now()}.png`
                  )
                }
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg flex items-center gap-2"
              >
                <Download size={16} />
                โหลดเก็บ
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <img
              src={cardResponse.cardImage}
              alt="Card Image"
              className="w-full h-full object-cover"
            />

            <div className="flex justify-center gap-4">
              {/* <Button
                type="button"
                onClick={() => printCardFromUrl(cardResponse.cardImage)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg flex items-center gap-2"
              >
                <Printer size={16} />
                พิมพ์การ์ด
              </Button> */}
              <Button
                type="button"
                onClick={() =>
                  downloadFile(
                    cardResponse.cardImage,
                    `mothers-day-card-${Date.now()}.png`
                  )
                }
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg flex items-center gap-2"
              >
                <Download size={16} />
                โหลดเก็บ
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="w-full" style={{ overflow: "hidden" }}>
      <div className="mx-auto px-4 mb-10">
        {/* Header */}
        <div className="text-center md:my-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a3254] mb-2">
            สร้างการ์ดวันแม่
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            เชิญชวนทุกท่านสร้างการ์ดอวยพร ในโอกาสวันแม่ 12 สิงหาคม ให้{" "}
            <span className="font-semibold whitespace-nowrap">
              ดิ โอลด์ สยาม พลาซ่า
            </span>{" "}
            เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณแม่
          </p>
        </div>

        <ProgressSteps currentStep={currentStep} />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === "select" && CardTypeSelector}
          {currentStep === "customize" && CardCustomizer}
          {currentStep === "preview" && FullPreview}
        </AnimatePresence>

        {/* Hidden canvas for download */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default MothersDayCardCreator;
