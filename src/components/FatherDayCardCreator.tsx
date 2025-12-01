import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type DragEndEvent } from "@dnd-kit/core";
import { Download, ArrowLeft, Printer, Loader2, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { ProgressSteps } from "./mothers-day-card/ProgressSteps";
import { CardTypeItem } from "./mothers-day-card/CardTypeItem";
import { CardPreview } from "./mothers-day-card/CardPreview";
import { useCardCanvas } from "./mothers-day-card/hooks/useCardCanvas";
import { FATHER_DAY_CARD_TYPES } from "./mothers-day-card/constants";
import type { CardData, ElementSize, StepType } from "./mothers-day-card/types";
import {
  MothersDayCardService,
  type MothersDayCardEntity,
  type MothersDayCard,
} from "@/lib/fatherdayService";
import {
  FacebookShareButton,
  LineShareButton,
  TwitterShareButton,
  FacebookIcon,
  LineIcon,
  XIcon,
} from "react-share";
import pkg from "file-saver";
import { useFollowGate, FollowGateModal } from "./FollowGate";
const { saveAs } = pkg;
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

//@ts-ignore
// import domtoimage from "dom-to-image-more";
import html2canvas from "html2canvas";
import * as culori from "culori";
import Swal from "sweetalert2";
import type { TextElement } from "./mothers-day-card/types";
import { type ImageElement } from "./mothers-day-card/types";

interface FatherDayCardCreatorProps {
  isPreview?: boolean;
  fetchCardData?: MothersDayCard | null;
}

const FatherDayCardCreator: React.FC<FatherDayCardCreatorProps> = ({
  isPreview,
  fetchCardData,
}) => {
  const [cardData, setCardData] = useState<CardData>({
    cardType: FATHER_DAY_CARD_TYPES[0],
    coverText: "Happy Father's Day",
    messageText: "",
    authorName: "",
    customImage: undefined,
    textElements: undefined,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textMessageAlign, setTextMessageAlign] = useState<
    "left" | "center" | "right"
  >(cardData.cardType.textPosition.textAlign as any);

  const imageUploadRef = useRef<HTMLInputElement>(null);

  const { canvasRef } = useCardCanvas({
    cardData,
    dragPositions,
    elementSizes,
  });

  function replaceOKLCHColors(root: HTMLElement) {
    const allElements = root.querySelectorAll<HTMLElement>("*");
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);

      // list property ที่ต้องเช็ค
      const props: (keyof CSSStyleDeclaration)[] = [
        "color",
        "backgroundColor",
        "borderColor",
      ];

      props.forEach((prop) => {
        const value = computedStyle[prop] as string;
        if (typeof value === "string" && value.includes("oklch")) {
          try {
            const rgb = culori.formatRgb(culori.oklch(value));
            if (rgb) {
              (el.style as any)[prop] = rgb;
            }
          } catch (err) {
            console.warn("สีแปลงไม่ได้:", value, err);
          }
        }
      });
    });
  }

  const generateCardImage = async () => {
    const exportWidth = 1024;
    const exportHeight = 768;

    // 1. สร้าง Container สำหรับ Export
    const exportContainer = document.createElement("div");
    exportContainer.style.width = `${exportWidth}px`;
    exportContainer.style.height = `${exportHeight}px`;
    exportContainer.style.position = "fixed";
    exportContainer.style.left = "-9999px"; // ซ่อน
    exportContainer.style.top = "-9999px";
    exportContainer.style.zIndex = "-9999";
    exportContainer.style.backgroundColor = "white";
    exportContainer.className = "card-export-container";
    document.body.appendChild(exportContainer);

    try {
      // 2. หา Export View Element ที่เราเตรียมไว้
      const exportViewElement = document.querySelector(
        "#desktop-export-view"
      ) as HTMLElement;
      const cardPreviewContainer = document.querySelector(
        ".card-preview-container"
      ) as HTMLElement;

      if (!exportViewElement) throw new Error("Export view not found");

      // 3. Clone Export View
      const clonedContent = exportViewElement.cloneNode(true) as HTMLElement;

      // 4. เตรียม Background (เนื่องจาก Background อยู่ที่ Container หลัก ไม่ได้อยู่ใน export view)
      // เราต้องดึง Background Image URL ออกมา
      const bgDiv = cardPreviewContainer.querySelector(
        '[style*="background-image"]'
      ) as HTMLElement;
      let bgImage = "";
      if (bgDiv && bgDiv.style.backgroundImage) {
        bgImage = bgDiv.style.backgroundImage;
      }

      // 5. Setup Cloned Content
      clonedContent.style.position = "relative"; // เปลี่ยนจาก absolute เป็น relative ใน container ใหม่
      clonedContent.style.width = "100%";
      clonedContent.style.height = "100%";
      clonedContent.style.opacity = "1"; // เปิดให้เห็น
      clonedContent.style.transform = "none"; // ลบ Scale ที่เราใส่ไว้ตอน render ในหน้าจอ
      clonedContent.style.left = "0";
      clonedContent.style.top = "0";

      // ใส่ Background ให้ Container
      exportContainer.style.backgroundImage = bgImage;
      exportContainer.style.backgroundSize = "cover";
      exportContainer.style.backgroundPosition = "center";
      exportContainer.style.backgroundRepeat = "no-repeat";

      exportContainer.appendChild(clonedContent);

      // 6. Inject Fonts
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: 'fonttintin';
          src: url('${window.location.origin}/fonts/fonttintin.ttf') format('truetype');
        }
        * {
           font-family: 'fonttintin', sans-serif !important;
        }
      `;
      exportContainer.appendChild(style);

      await document.fonts.ready;

      // รอรูปโหลด
      const images = Array.from(exportContainer.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      replaceOKLCHColors(exportContainer);

      // 7. Generate
      const canvas = await html2canvas(exportContainer, {
        width: exportWidth,
        height: exportHeight,
        scale: 1, // ขนาด 1:1 เพราะเราเตรียมไว้ 1024x768 แล้ว
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      return canvas.toDataURL("image/png", 1.0);
    } catch (error) {
      console.error("Generate Error:", error);
      throw error;
    } finally {
      if (exportContainer.parentNode)
        exportContainer.parentNode.removeChild(exportContainer);
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
        base64ToFile(dataUrl, `fathers-day-card-${Date.now()}.png`)
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

  const imageUrlToBase64 = async (url: string): Promise<string> => {
    if (url.startsWith("data:")) return url; // ถ้าเป็น base64 อยู่แล้ว ให้คืนค่าเลย

    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleCardTypeSelect = useCallback((cardType: any) => {
    setCardData((prev) => ({ ...prev, cardType }));
    setCurrentStep("customize");
  }, []);

  const handleAddImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const ImageToBase64 = useCallback((image: string) => {
    const img = new Image();
    img.src = image;
    return img.src;
  }, []);

  const handleLoad = async (path: string, name: string) => {
    // await MothersDayCardService.downloadCard(path, name);
    const downloadId = path.split("/").pop();

    const response = await fetch(
      `/event/api/download?fileId=${downloadId}&filename=${name}`
    );

    const blob = await response.blob();
    saveAs(blob, name, { autoBom: true });
  };

  const printCard = async () => {
    const printJS = (await import("print-js")).default;
    const downloadIdCover = cardResponse?.coverImage.split("/").pop();
    const downloadIdCard = cardResponse?.cardImage.split("/").pop();
    const name = `fathers-day-card-${Date.now()}.png`;

    const [responseCover, responseCard] = await Promise.all([
      fetch(`/event/api/download?fileId=${downloadIdCover}&filename=${name}`),
      fetch(`/event/api/download?fileId=${downloadIdCard}&filename=${name}`),
    ]);
    const blobCover = await responseCover.blob();
    const blobCard = await responseCard.blob();
    const blobUrlCover = URL.createObjectURL(blobCover);
    const blobUrlCard = URL.createObjectURL(blobCard);

    printJS({
      printable: [blobUrlCover, blobUrlCard],
      type: "image",
      showModal: true,
      imageStyle: "width:100%;margin:0px;padding:0px;",
    });
  };

  const handleAddMessage = useCallback(() => {
    setCardData((prev) => ({
      ...prev,
      // ถ้ายังไม่มีข้อความ ให้ใส่ค่าเริ่มต้น
      messageText: prev.messageText || "สุขสันต์วันพ่อ",
    }));
    // อาจจะเพิ่ม logic ให้ scroll ไปหา หรือ focus ก็ได้
  }, []);

  const handleAddTextBox = useCallback(() => {
    const newId = `text-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      text: "ข้อความใหม่",
      x: 520, // Center (approx)
      y: 380, // Center (approx)
      width: 600,
      height: 200,
      color: "#000000",
      textAlign: "center",
      fontSize: 32,
    };

    setCardData((prev) => ({
      ...prev,
      textElements: [...(prev.textElements || []), newElement],
    }));
  }, []);

  const handleUpdateTextElement = useCallback(
    (id: string, updates: Partial<TextElement>) => {
      setCardData((prev) => ({
        ...prev,
        textElements: (prev.textElements || []).map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      }));
    },
    []
  );

  const handleDeleteTextElement = useCallback((id: string) => {
    setCardData((prev) => ({
      ...prev,
      textElements: (prev.textElements || []).filter((el) => el.id !== id),
    }));
  }, []);

  // Handlers สำหรับ Image Elements
  const handleAddImageElement = useCallback((imageUrl: string) => {
    const newId = `img-${Date.now()}`;
    const newElement: ImageElement = {
      id: newId,
      url: imageUrl,
      x: 512, // Center X (approx)
      y: 384, // Center Y (approx)
      width: 200,
      height: 200,
      shape: "rectangle",
      blur: 0,
      opacity: 1,
      rotation: 0,
    };

    setCardData((prev) => ({
      ...prev,
      imageElements: [...(prev.imageElements || []), newElement],
    }));
  }, []);

  const handleUpdateImageElement = useCallback(
    (id: string, updates: Partial<ImageElement>) => {
      setCardData((prev) => ({
        ...prev,
        imageElements: (prev.imageElements || []).map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      }));
    },
    []
  );

  const handleDeleteImageElement = useCallback((id: string) => {
    setCardData((prev) => ({
      ...prev,
      imageElements: (prev.imageElements || []).filter((el) => el.id !== id),
    }));
  }, []);

  // // Handler เมื่อเลือกไฟล์จาก CardPreview
  // const handleAddImageUpload = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         const base64 = event.target?.result as string;
  //         handleAddImageElement(base64);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //     e.target.value = ""; // Reset
  //   },
  //   [handleAddImageElement]
  // );

  useEffect(() => {
    if (fetchCardData && isPreview) {
      const previewCardData = {
        id: fetchCardData.id,
        cardType: fetchCardData.data.cardType,
        authorName: fetchCardData.data.authorName,
        messageText: fetchCardData.data.messageText,
        coverImage: fetchCardData.data.coverImage,
        cardImage: fetchCardData.data.cardImage,
        createdAt: fetchCardData.createdAt,
        updatedAt: fetchCardData.updatedAt,
      };
      setCardResponse(previewCardData as MothersDayCardEntity);
      setCurrentStep("preview");
    }
  }, [fetchCardData]);

  // ✅ แก้ไขตรงนี้: เรียกใช้ useFollowGate เพียงครั้งเดียว
  const { isOpen, setIsOpen, gateKeeper, handleOpenFacebook } = useFollowGate();

  // ❌ ลบบรรทัดนี้ทิ้ง
  // const { gateKeeper } = useFollowGate();

  // Wrapper Functions using gateKeeper
  // หมายเหตุ: ต้องเรียก hook ครั้งเดียวข้างบน
  // const { isOpen, setIsOpen, gateKeeper, handleOpenFacebook } = useFollowGate();

  // Function โหลด 2 รูป เป็นไฟล์ zip
  const handleDownloadAll = async () => {
    if (!cardResponse) return;

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const timestamp = Date.now();

    try {
      // Download both images
      const downloadIdCover = cardResponse.coverImage.split("/").pop();
      const downloadIdCard = cardResponse.cardImage.split("/").pop();
      const name = `fathers-day-card-${timestamp}`;

      const [responseCover, responseCard] = await Promise.all([
        fetch(`/event/api/download?fileId=${downloadIdCover}&filename=${name}`),
        fetch(`/event/api/download?fileId=${downloadIdCard}&filename=${name}`),
      ]);

      const blobCover = await responseCover.blob();
      const blobCard = await responseCard.blob();

      // Add files to zip
      zip.file(`fathers-day-cover-${timestamp}.png`, blobCover);
      zip.file(`fathers-day-card-${timestamp}.png`, blobCard);

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `fathers-day-cards-${timestamp}.zip`);
    } catch (e) {
      console.error("Download error", e);
    }
  };

  // Function Print
  // (ใช้ printCard เดิมที่มีอยู่แล้ว)

  // Wrapper Click Handlers
  const onDownloadClick = () => {
    console.log("Download Clicked"); // Debug
    gateKeeper(() => {
      console.log("Gate Passed: Downloading"); // Debug
      handleDownloadAll();
    });
  };

  const onPrintClick = () => {
    console.log("Print Clicked"); // Debug
    gateKeeper(() => {
      console.log("Gate Passed: Printing"); // Debug
      printCard();
    });
  };

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
          เลือกการ์ดที่คุณชอบเพื่อส่งความรักให้คุณพ่อ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {FATHER_DAY_CARD_TYPES.map((cardType) => (
          <div key={cardType.id} className="space-y-4">
            <CardTypeItem
              cardType={cardType}
              isSelected={cardData.cardType.id === cardType.id}
              onSelect={handleCardTypeSelect}
              color="#ffdb4d"
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
            variant="blackFatherDay"
            onClick={handleCreateCard}
            disabled={isSubmitting}
            className=" px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-gray-800">ตัวอย่างการ์ด</h3>
          <div style={{ transform: "translateZ(0)", willChange: "auto" }}>
            <CardPreview
              textMessageAlign={textMessageAlign}
              cardData={cardData}
              dragPositions={dragPositions}
              elementSizes={elementSizes}
              onDragEnd={(event: any) => handleDragEnd(event)} // แก้ type ให้ตรงกับที่รับ
              onSizeChange={(id: string, size: ElementSize) =>
                handleSizeChange(id, size)
              }
              onUpdateTextElement={handleUpdateTextElement}
              onDeleteTextElement={handleDeleteTextElement}
              // ✅ เพิ่ม Props ใหม่
              onUpdateImageElement={handleUpdateImageElement}
              onDeleteImageElement={handleDeleteImageElement}
              onAddImageUpload={handleAddImageUpload}
              onRemoveCustomImage={removeCustomImage} // ✅ ส่ง prop นี้เข้าไป
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <Button
            type="button"
            onClick={handleAddTextBox}
            variant="blackFatherDay"
            className=" text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            เพิ่มข้อความ
          </Button>

          <Button
            type="button"
            onClick={() => imageUploadRef.current?.click()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            เพิ่มรูปภาพ
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // ปรับ FullPreview UI
  const FullPreview = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {cardResponse != null && (
        <div className="w-full space-y-6">
          {/* Grid แสดงรูป */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <img
                src={cardResponse.coverImage}
                alt="Card Image"
                className="w-full h-auto rounded-lg shadow-md object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-2">
              <img
                src={cardResponse.cardImage}
                alt="Card Image 2"
                className="w-full h-auto rounded-lg shadow-md object-cover object-center"
              />
            </div>
          </div>

          {/* ปุ่ม Action รวม */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 ">
            <Button
              type="button"
              onClick={onPrintClick}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 min-w-[200px]"
            >
              <Printer size={18} />
              <span>พิมพ์การ์ด (2 ด้าน)</span>
            </Button>

            <Button
              type="button"
              onClick={onDownloadClick}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 min-w-[200px]"
            >
              <Download size={18} />
              <span>ดาวน์โหลดทั้งหมด</span>
            </Button>
          </div>
        </div>
      )}

      {/* ... Share Section ... */}

      <div className="bg-white/75 rounded-xl p-6 border ">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          แชร์การ์ดวันพ่อของคุณ
        </h3>
        <p className="text-gray-600 text-center mb-6">
          แบ่งปันความรักที่มีต่อคุณพ่อให้เพื่อนๆ ได้เห็น
        </p>

        <div className="flex justify-center gap-4">
          {/* Facebook Share */}
          <FacebookShareButton
            url={"https://theoldsiam.co.th/event/2025/fathers-day-activity"}
            hashtag="#วันพ่อ #TheOldSiamPlaza #การ์ดวันพ่อ"
            className="hover:scale-110 transition-transform duration-200"
          >
            <FacebookIcon size={48} round />
          </FacebookShareButton>

          {/* Line Share */}
          <LineShareButton
            url={"https://theoldsiam.co.th/event/2025/fathers-day-activity"}
            title={`ในโอกาสวันพ่อ 5 ธันวาคมปีนี้ ให้ ดิ โอลด์ สยาม พลาซ่า เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณพ่อ`}
            className="hover:scale-110 transition-transform duration-200"
          >
            <LineIcon size={48} round />
          </LineShareButton>

          {/* X (Twitter) Share */}
          <TwitterShareButton
            url={"https://theoldsiam.co.th/event/2025/fathers-day-activity"}
            title={`ในโอกาสวันพ่อ 5 ธันวาคมปีนี้ ให้ ดิ โอลด์ สยาม พลาซ่า เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณพ่อ`}
            hashtags={["วันพ่อ", "TheOldSiamPlaza", "การ์ดวันพ่อ"]}
            className="hover:scale-110 transition-transform duration-200"
          >
            <XIcon size={48} round />
          </TwitterShareButton>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            คลิกที่ไอคอนเพื่อแชร์การ์ดของคุณ
          </p>
        </div>
      </div>

      {/* Follow Gate Modal */}
      <FollowGateModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleOpenFacebook={handleOpenFacebook}
      />
    </motion.div>
  );

  return (
    <div className="w-full" style={{ overflow: "hidden" }}>
      <div className="mx-auto px-4 mb-10">
        {/* Header */}
        <div className="text-center mb-4 md:my-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#21252b] mb-2">
            สร้างการ์ดวันพ่อ
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            เชิญชวนทุกท่านสร้างการ์ดอวยพร ในโอกาสวันพ่อ 5 ธันวาคม ให้{" "}
            <span className="font-semibold whitespace-nowrap">
              ดิ โอลด์ สยาม พลาซ่า
            </span>{" "}
            เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณพ่อ
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

        {/* Hidden Input สำหรับปุ่มเพิ่มรูปภาพ */}
        <input
          type="file"
          ref={imageUploadRef}
          accept="image/*"
          className="hidden"
          onChange={handleAddImageUpload}
        />
      </div>
    </div>
  );
};

export default FatherDayCardCreator;
