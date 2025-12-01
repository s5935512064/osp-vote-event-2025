import React, { useRef, useState, useEffect, useCallback } from "react";
import { DraggableElement } from "./DraggableElement";
import {
  type CardData,
  type ElementSize,
  type TextElement,
  type ImageElement,
  type ShapeType,
} from "./types";
import { calculateFontSize } from "./utils";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  Bold,
  Italic,
  Pencil, // เพิ่ม Icon ดินสอ
  Trash2, // เพิ่ม Icon ถังขยะ
  Image as ImageIcon,
  Square,
  Circle,
  Heart,
} from "lucide-react"; // Icons
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CardPreviewProps {
  cardData: CardData;
  isFullSize?: boolean;
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
  onDragEnd: (event: {
    active: { id: string };
    delta: { x: number; y: number };
  }) => void;
  onSizeChange: (id: string, size: ElementSize) => void;
  textMessageAlign: "left" | "center" | "right";
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onDeleteTextElement: (id: string) => void;
  // ✅ เพิ่ม Props ใหม่
  onUpdateImageElement: (id: string, updates: Partial<ImageElement>) => void;
  onDeleteImageElement: (id: string) => void;
  onAddImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCustomImage?: () => void; // ✅ เพิ่ม prop นี้
}

const EditModal = ({
  element,
  onSave,
  onCancel,
  onDelete,
}: {
  element: TextElement;
  onSave: (updates: Partial<TextElement>) => void;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const [text, setText] = useState(element.text);
  const [color, setColor] = useState(element.color || "#000000");
  const [align, setAlign] = useState(element.textAlign || "center");
  const [fontSize, setFontSize] = useState(element.fontSize || 24);
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">(
    element.fontWeight || "normal"
  );
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">(
    element.fontStyle || "normal"
  );

  const colors = [
    "#ffffff",
    "#000000",
    "#1f2937",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#78350f",
  ];

  const handleSave = () => {
    onSave({
      text,
      color,
      textAlign: align as any,
      fontSize,
      fontWeight,
      fontStyle,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="w-full max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อความ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ข้อความ
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              สีตัวอักษร
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c
                      ? "border-blue-500 scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Style & Alignment & Size */}
          <div className="space-y-3">
            {/* Row 1: Alignment & Style */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  จัดวาง
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setAlign("left")}
                    className={`flex-1 p-2 rounded ${
                      align === "left" ? "bg-white shadow" : ""
                    }`}
                  >
                    <AlignLeft className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setAlign("center")}
                    className={`flex-1 p-2 rounded ${
                      align === "center" ? "bg-white shadow" : ""
                    }`}
                  >
                    <AlignCenter className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setAlign("right")}
                    className={`flex-1 p-2 rounded ${
                      align === "right" ? "bg-white shadow" : ""
                    }`}
                  >
                    <AlignRight className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  รูปแบบ
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                  <button
                    onClick={() =>
                      setFontWeight(fontWeight === "bold" ? "normal" : "bold")
                    }
                    className={`flex-1 p-2 rounded ${
                      fontWeight === "bold" ? "bg-white shadow font-bold" : ""
                    }`}
                  >
                    <Bold className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() =>
                      setFontStyle(fontStyle === "italic" ? "normal" : "italic")
                    }
                    className={`flex-1 p-2 rounded ${
                      fontStyle === "italic" ? "bg-white shadow italic" : ""
                    }`}
                  >
                    <Italic className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Size */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                ขนาด ({fontSize}px)
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium"
          >
            ลบ
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> บันทึก
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ImageEditModal = ({
  element,
  onSave,
  onCancel,
  onDelete,
}: {
  element: ImageElement;
  onSave: (updates: Partial<ImageElement>) => void;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const [shape, setShape] = useState<ShapeType>(element.shape);
  const [blur, setBlur] = useState(element.blur);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="w-full max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>ปรับแต่งรูปภาพ</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Shape Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block text-gray-700">
              รูปทรง
            </label>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShape("rectangle")}
                className={`p-3 border-2 rounded-xl transition-all ${
                  shape === "rectangle"
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Square size={24} />
                <span className="text-xs mt-1 block">สี่เหลี่ยม</span>
              </button>
              <button
                onClick={() => setShape("circle")}
                className={`p-3 border-2 rounded-xl transition-all ${
                  shape === "circle"
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Circle size={24} />
                <span className="text-xs mt-1 block">วงกลม</span>
              </button>
              <button
                onClick={() => setShape("heart")}
                className={`p-3 border-2 rounded-xl transition-all ${
                  shape === "heart"
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Heart size={24} />
                <span className="text-xs mt-1 block">หัวใจ</span>
              </button>
            </div>
          </div>

          {/* Blur Slider */}
          {/* <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                ความฟุ้งของขอบ
              </label>
              <span className="text-xs text-gray-500">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div> */}
        </div>

        <DialogFooter className="flex flex-row justify-between gap-3 sm:justify-between">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
          >
            <Trash2 size={16} /> ลบรูปภาพ
          </button>
          <button
            onClick={() => onSave({ shape, blur })}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Check size={16} /> บันทึก
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper Function for Shape Style
const getShapeStyle = (shape: ShapeType, blur: number): React.CSSProperties => {
  let clipPath = "";
  if (shape === "circle") {
    clipPath = "circle(50% at 50% 50%)";
  } else if (shape === "heart") {
    // Heart SVG Path or Polygon approximation
    clipPath =
      "path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')";
    // Note: clip-path with path() uses 0-1 coordinates for clipPathUnits="objectBoundingBox" usually,
    // but standard path uses px. For responsive element, polygon or basic shapes are easier.
    // Let's use a simpler heart polygon or a mask-image if possible.
    // Using polygon for heart is tricky. Let's use a CSS shape or SVG mask.

    // Better approach for Heart: mask-image with radial-gradients for circle/blur, but heart needs an SVG.
  }

  // Filter Blur handling
  // `filter: blur(5px)` blurs everything content.
  // To blur just the *edge*, we need a mask with feathering.
  // `mask-image: radial-gradient(black 60%, transparent 100%)` creates blur edge for circle.

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  if (shape === "circle") {
    style.borderRadius = "50%";
  } else if (shape === "heart") {
    // Use CSS mask for heart shape
    style.maskImage =
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>\")";
    style.maskSize = "contain";
    style.maskRepeat = "no-repeat";
    style.maskPosition = "center";
    style.WebkitMaskImage = style.maskImage;
    style.WebkitMaskSize = style.maskSize;
    style.WebkitMaskRepeat = style.maskRepeat;
    style.WebkitMaskPosition = style.maskPosition;
    style.backgroundColor = "red"; // Fallback color?
  }

  // Handle Blur Edge (Feathering)
  // For Rectangle/Circle, we can use BoxShadow inset or Mask
  if (blur > 0) {
    // Simple approach: mask-image with gradient
    if (shape === "circle") {
      // Blur edge for circle
      style.maskImage = `radial-gradient(circle, black ${
        100 - blur * 2
      }%, transparent 100%)`;
      style.WebkitMaskImage = style.maskImage;
      style.borderRadius = "50%"; // Ensure click area matches
    } else if (shape === "rectangle") {
      // Blur edge for rectangle
      style.maskImage = `linear-gradient(to right, transparent 0%, black ${blur}%, black ${
        100 - blur
      }%, transparent 100%), linear-gradient(to bottom, transparent 0%, black ${blur}%, black ${
        100 - blur
      }%, transparent 100%)`;
      // This is complex to do perfect rect blur with single mask.
      // Easier: `box-shadow: inset 0 0 20px white;` (if background is white)
      // OR `mask-image: linear-gradient(black, transparent)`...

      // Let's try `mask-box-image` or just simple CSS filter if it's about content blur?
      // Requirement says "Blur Edge".
      // CSS `box-shadow: inset 0 0 ${blur}px rgba(255,255,255,1)` works if on white bg.
      // Or use SVG Filter.
    }
  }

  return style;
};

export const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  isFullSize = true,
  dragPositions,
  elementSizes,
  onDragEnd,
  onSizeChange,
  textMessageAlign,
  onUpdateTextElement,
  onDeleteTextElement,
  onUpdateImageElement, // รับ prop
  onDeleteImageElement, // รับ prop
  onAddImageUpload, // รับ prop
  onRemoveCustomImage, // ✅ รับ prop
}) => {
  const { textPosition } = cardData.cardType;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [backgroundImageBase64, setBackgroundImageBase64] =
    useState<string>("");
  const [customImageBase64, setCustomImageBase64] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  // ✅ เพิ่ม State นี้
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // ✅ เพิ่ม State สำหรับ Config ของรูปหลัก (Custom Image)
  const [mainImageConfig, setMainImageConfig] = useState<{
    shape: ShapeType;
    blur: number;
  }>({ shape: "circle", blur: 0 }); // Default เป็นวงกลม

  // Update scale based on container size
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { offsetWidth } = containerRef.current;
        const newScale = offsetWidth / 1024; // Base width: 1024px
        setScale(newScale);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // ✅ แก้ไข useEffect นี้
  useEffect(() => {
    const convertImages = async () => {
      try {
        // Background Image
        const backgroundBase64 = await imageUrlToBase64(
          cardData.cardType.messageImage
        );
        setBackgroundImageBase64(backgroundBase64);

        // Custom Image (รูปหลัก)
        if (cardData.customImage) {
          const customBase64 = await imageUrlToBase64(cardData.customImage);
          setCustomImageBase64(customBase64);
        } else {
          // ✅ เพิ่มบรรทัดนี้: ถ้าไม่มีรูป ต้องเคลียร์ Base64 ทิ้ง
          setCustomImageBase64("");
        }
      } catch (error) {
        console.error("Failed to convert images to base64:", error);
        setBackgroundImageBase64("");
        setCustomImageBase64(""); // Error ก็เคลียร์ด้วย
      }
    };

    convertImages();
  }, [cardData.cardType.messageImage, cardData.customImage]);

  async function imageUrlToBase64(url: string): Promise<string> {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to convert image to Base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Handler เมื่อคลิกพื้นหลัง (Deselect)
  const handleBackgroundClick = (e: React.MouseEvent | React.TouchEvent) => {
    // ตรวจสอบว่าไม่ได้คลิกที่ Draggable Element
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).classList.contains("interactive-layer")
    ) {
      setSelectedElementId(null);
    }
  };

  const handleElementClick = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation(); // ป้องกัน event ทะลุไป background

    // ถ้าเป็น message/author/image (Static Elements) อาจจะไม่ต้องทำอะไร หรือทำแบบเดียวกันก็ได้
    // แต่ใน requirement เน้น TextElement ที่แก้ไขได้

    if (["message", "author"].includes(id)) {
      // logic เดิม หรือจะให้ select ก็ได้ถ้าต้องการ resize
      return;
    }

    if (selectedElementId === id) {
      // ถ้าเลือกอยู่แล้ว ให้เปิด Edit Dialog เลย (Double Tap logic)
      setEditingElementId(id);
    } else {
      // ถ้ายังไม่เลือก ให้เลือกก่อน
      setSelectedElementId(id);
    }
  };

  const handlePositionChange = (
    id: string,
    newPos: { x: number; y: number }
  ) => {
    // เช็คว่า ID นี้เป็น Main Image ("image") หรือไม่
    if (["message", "author", "image"].includes(id)) {
      // คำนวณ Delta
      const currentX = dragPositions[id as keyof typeof dragPositions].x;
      const currentY = dragPositions[id as keyof typeof dragPositions].y;

      // newPos คือตำแหน่งสัมพัทธ์ใน container ที่ scale แล้ว
      // เราต้องแปลงกลับเป็น base scale (1024)
      const unscaledNewX = newPos.x / scale;
      const unscaledNewY = newPos.y / scale;

      const deltaX = unscaledNewX - currentX;
      const deltaY = unscaledNewY - currentY;

      // ส่ง Delta ไปให้ Parent update
      onDragEnd({ active: { id }, delta: { x: deltaX, y: deltaY } });
    } else {
      // ... Logic สำหรับ TextElement/ImageElement (Dynamic)
      if (id.startsWith("img-")) {
        onUpdateImageElement(id, { x: newPos.x / scale, y: newPos.y / scale });
      } else {
        onUpdateTextElement(id, { x: newPos.x / scale, y: newPos.y / scale });
      }
    }
  };

  const handleSizeChange = (id: string, newSize: ElementSize) => {
    const baseWidth = newSize.width / scale;
    const baseHeight = newSize.height / scale;

    if (["message", "author", "image"].includes(id)) {
      onSizeChange(id, { width: baseWidth, height: baseHeight });
    } else if (id.startsWith("img-")) {
      onUpdateImageElement(id, { width: baseWidth, height: baseHeight });
    } else {
      onUpdateTextElement(id, { width: baseWidth, height: baseHeight });
    }
  };

  // ในส่วน handleUpdateImageElement ภายใน CardPreview ให้ใช้ prop ที่รับมาแทน
  // (ลบ dummy function ที่สร้างไว้ก่อนหน้านี้ออก)

  // ✅ แก้ไข renderDraggableElement ให้รองรับ Main Image (id="image")
  const renderDraggableElement = (
    id: string,
    basePosition: { x: number; y: number },
    baseSize: ElementSize,
    children: React.ReactNode,
    mode: "desktop" | "mobile",
    options: any = {}
  ) => {
    // ตรวจสอบประเภท Element
    const isImage = id.startsWith("img-"); // รูปเสริม
    const isMainImage = id === "image"; // ✅ รูปหลัก (Custom Image)
    const isStatic = ["message", "author"].includes(id); // Static อื่นๆ
    const isText = !isImage && !isMainImage && !isStatic; // Text

    const isSelected = selectedElementId === id;

    // ✅ แสดง Toolbar ถ้าเป็น Text, Image เสริม, หรือ Main Image
    const showToolbar = isSelected && (isText || isImage || isMainImage);

    return (
      <DraggableElement
        id={`${id}-${mode}`}
        position={{
          x: basePosition.x * (mode === "desktop" ? scale : 1), // Use scale for desktop, 1 for mobile
          y: basePosition.y * (mode === "desktop" ? scale : 1), // Use scale for desktop, 1 for mobile
        }}
        size={{
          width: baseSize.width * (mode === "desktop" ? scale : 1), // Use scale for desktop, 1 for mobile
          height: baseSize.height * (mode === "desktop" ? scale : 1), // Use scale for desktop, 1 for mobile
        }}
        containerRef={containerRef}
        onClick={(e) => handleElementClick(id, e)}
        onPositionChange={(newPos) => handlePositionChange(id, newPos)}
        onSizeChange={(newSize) => handleSizeChange(id, newSize)}
        // ส่ง prop เพื่อบอกว่าถูกเลือกหรือไม่ (ต้องไปแก้ DraggableElement เพิ่ม)
        isSelected={isSelected} // ส่ง prop นี้ด้วย
        {...options}
      >
        {children}

        {/* ✅ Toolbar Logic */}
        {showToolbar && (
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 bg-white shadow-lg rounded-lg p-1 z-50 no-drag"
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ pointerEvents: "auto" }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isImage) {
                  setEditingImageId(id);
                } else if (isMainImage) {
                  setEditingImageId("image"); // ✅ เปิด Modal สำหรับ Main Image
                } else {
                  setEditingElementId(id);
                }
              }}
              onTouchEnd={(e) => {
                // ... logic เหมือน onClick
                e.preventDefault();
                e.stopPropagation();
                if (isImage) {
                  setEditingImageId(id);
                } else if (isMainImage) {
                  setEditingImageId("image");
                } else {
                  setEditingElementId(id);
                }
              }}
              className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              <Pencil size={16} />
            </button>

            {/* ปุ่มลบ (แสดงเฉพาะ Text และ Image เสริม - ไม่แสดงให้ Main Image) */}
            {/* หรือถ้าจะให้ลบ Main Image ได้ ก็ต้องเพิ่ม Logic */}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isMainImage) {
                  // ✅ เรียก onRemoveCustomImage ถ้ามี
                  if (onRemoveCustomImage) {
                    onRemoveCustomImage();
                  }
                } else if (isImage) {
                  onDeleteImageElement(id);
                } else {
                  onDeleteTextElement(id);
                }
                setSelectedElementId(null);
              }}
              onTouchEnd={(e) => {
                // ... logic เหมือน onClick
                e.preventDefault();
                e.stopPropagation();
                if (isMainImage) {
                  if (onRemoveCustomImage) {
                    onRemoveCustomImage();
                  }
                } else if (isImage) {
                  onDeleteImageElement(id);
                } else {
                  onDeleteTextElement(id);
                }
                setSelectedElementId(null);
              }}
              className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </DraggableElement>
    );
  };

  const renderMessageElement = () => {
    return renderDraggableElement(
      "message",
      dragPositions.message,
      elementSizes.message,
      <div
        id="message"
        className="cursor-move select-none w-full h-full flex items-center justify-center font-tintin"
        style={{
          fontSize: `${
            calculateFontSize(textPosition.fontSize, elementSizes.message, {
              width: 200,
              height: 100,
            }) * scale
          }px`,
          color: textPosition.color,
          fontFamily: textPosition.fontFamily,
          fontWeight: "600",
          lineHeight: "1.4",
          textAlign: textMessageAlign,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {cardData.messageText}
      </div>,
      "desktop",
      { minSize: { width: 100, height: 50 } }
    );
  };

  const renderAuthorElement = () => {
    if (!cardData.authorName) return null;

    return renderDraggableElement(
      "author",
      dragPositions.author,
      elementSizes.author,
      <div
        id="author"
        className="cursor-move select-none rounded-xl w-full h-full flex items-center justify-center font-tintin"
        style={{
          fontSize: `${
            calculateFontSize(textPosition.fontSize, elementSizes.author, {
              width: 150,
              height: 40,
            }) * scale
          }px`,
          color: textPosition.color,
          fontFamily: textPosition.fontFamily,
          fontWeight: "600",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        ด้วยรักจาก {cardData.authorName}
      </div>,
      "desktop",
      { minSize: { width: 80, height: 30 } }
    );
  };

  // ✅ ปรับ renderImageElement (Preview)
  const renderImageElement = () => {
    if (!customImageBase64) return null;

    console.log("customImageBase64", customImageBase64);

    return renderDraggableElement(
      "image", // ID ของ Main Image
      dragPositions.image,
      elementSizes.image,
      <div
        id="image"
        className="cursor-move select-none w-full h-full relative group/child"
      >
        <div className="relative w-full h-full">
          <img
            src={customImageBase64}
            alt="Custom"
            className="w-full h-full object-cover object-center transition-all duration-300"
            style={{
              borderRadius: mainImageConfig.shape === "circle" ? "50%" : "0",
              ...getShapeStyle(mainImageConfig.shape, mainImageConfig.blur),
            }}
            draggable={false}
          />
        </div>
      </div>,
      "desktop", // Default mode (จะถูก override ใน loop ถ้ามี) แต่ function นี้มักถูกเรียกใน loop แยก mode อยู่แล้ว
      {
        minSize: { width: 100, height: 100 },
        maintainAspectRatio: true,
        aspectRatio: 1,
      }
    );
  };

  const renderTextElements = () => {
    return cardData.textElements?.map((element: TextElement) => {
      return renderDraggableElement(
        element.id,
        { x: element.x, y: element.y },
        { width: element.width, height: element.height },
        <div
          className="w-full h-full p-2 whitespace-pre-wrap break-words"
          style={{
            color: element.color,
            textAlign: element.textAlign,
            fontSize: `${(element.fontSize || 24) * scale}px`,
            fontFamily: "fonttintin",
            lineHeight: 1.4,
            fontWeight: element.fontWeight || "normal",
            fontStyle: element.fontStyle || "normal",
          }}
        >
          {element.text || "คลิกเพื่อแก้ไข"}
        </div>,
        "desktop",
        { minSize: { width: 80, height: 30 } }
      );
    });
  };

  const editingElement = editingElementId
    ? cardData.textElements?.find((e: TextElement) => e.id === editingElementId)
    : null;

  // Helper function ใหม่สำหรับ Render Element แบบไม่ Scale (ใช้ Base Value ตรงๆ)
  // เพื่อใช้ใน Desktop Export View
  const renderExportElement = (
    id: string,
    basePosition: { x: number; y: number },
    baseSize: ElementSize,
    children: React.ReactNode,
    styleOverride: React.CSSProperties = {}
  ) => {
    // ใน Export View เราจะ Render แบบ Absolute Position ตรงๆ ตามค่า Base (1024x768)
    // ไม่ต้องใส่ DraggableElement เพราะเราแค่ต้องการ "ภาพนิ่ง" เพื่อ Screenshot
    return (
      <div
        key={`export-${id}`}
        id={`export-${id}`}
        style={{
          position: "absolute",
          left: `${basePosition.x}px`,
          top: `${basePosition.y}px`,
          width: `${baseSize.width}px`,
          height: `${baseSize.height}px`,
          transform: "translate(-50%, -50%)", // Center origin เหมือน Draggable
          ...styleOverride,
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      {/* Modal Editor */}
      {editingElementId && editingElement && (
        <EditModal
          element={editingElement}
          onSave={(updates) => {
            onUpdateTextElement(editingElementId, updates);
            setEditingElementId(null);
          }}
          onDelete={() => {
            onDeleteTextElement(editingElementId);
            setEditingElementId(null);
          }}
          onCancel={() => setEditingElementId(null)}
        />
      )}

      {/* Modal Image Editor */}
      {editingImageId &&
        // เช็คว่าเป็น Main Image หรือ Image Element ปกติ
        (editingImageId === "image" ||
          cardData.imageElements?.find((e) => e.id === editingImageId)) && (
          <ImageEditModal
            element={
              editingImageId === "image"
                ? ({
                    id: "image",
                    url: customImageBase64,
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    opacity: 1,
                    rotation: 0, // Dummy values
                    shape: mainImageConfig.shape,
                    blur: mainImageConfig.blur,
                  } as ImageElement)
                : (cardData.imageElements?.find(
                    (e) => e.id === editingImageId
                  ) as ImageElement)
            }
            onSave={(updates) => {
              if (editingImageId === "image") {
                // อัปเดต State ของ Main Image
                setMainImageConfig((prev) => ({ ...prev, ...updates }));
              } else {
                onUpdateImageElement(editingImageId, updates);
              }
              setEditingImageId(null);
            }}
            onDelete={() => {
              if (editingImageId === "image") {
                // ✅ เรียก onRemoveCustomImage ถ้ามี
                if (onRemoveCustomImage) {
                  onRemoveCustomImage();
                }
              } else {
                onDeleteImageElement(editingImageId);
              }
              setEditingImageId(null);
              setSelectedElementId(null);
            }}
            onCancel={() => setEditingImageId(null)}
          />
        )}

      <div
        ref={containerRef}
        className={`card-preview-container ${
          isFullSize ? "w-full" : "w-64"
        } mx-auto relative group/parent cursor-pointer h-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg`}
        style={{
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onClick={handleBackgroundClick}
        onTouchStart={handleBackgroundClick}
      >
        <div className="relative w-full h-full">
          {/* Background Image */}
          <div
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
            style={{
              backgroundImage: `url("${backgroundImageBase64}")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />

          {/* ========================================== */}
          {/* 1. Interactive View (Mobile/Desktop Interactive) */}
          {/* ========================================== */}
          <div className="interactive-layer w-full h-full absolute top-0 left-0">
            {/* ใช้ Logic เดิมที่มี DraggableElement และ Scale */}
            {renderMessageElement()}
            {renderAuthorElement()}
            {renderImageElement()}
            {renderTextElements()}
          </div>

          {/* ========================================== */}
          {/* 2. Export View (Hidden, Base Size 1024x768) */}
          {/* ========================================== */}
          <div
            id="desktop-export-view"
            className="absolute top-0 left-0 pointer-events-none opacity-0"
            style={{
              width: "1024px",
              height: "768px",
              // เราจะซ่อนมันไว้ แต่ต้องให้ html2canvas เห็นตอน Clone
              // ใช้ visibility: hidden หรือ display: none อาจทำให้ html2canvas มองไม่เห็นในบางเคส
              // แต่ถ้าเราจะ Clone node นี้ไปแปะใน Container ใหม่ มันโอเค
              zIndex: -1000,
              transform: `scale(${scale})`, // Scale ให้พอดีกับ Container เพื่อไม่ให้ล้น (แต่ตอน Export เราจะ Reset Scale นี้)
              transformOrigin: "top left",
            }}
          >
            {/* Render แบบ Static ตามขนาดจริง */}
            {/* Message */}
            {renderExportElement(
              "message-export",
              dragPositions.message,
              elementSizes.message,
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: `${calculateFontSize(
                    textPosition.fontSize,
                    elementSizes.message,
                    { width: 200, height: 100 }
                  )}px`, // ไม่คูณ Scale
                  color: textPosition.color,
                  fontFamily: "fonttintin",
                  textAlign: textMessageAlign,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                  fontWeight: "600",
                }}
              >
                {cardData.messageText}
              </div>
            )}

            {/* Author */}
            {cardData.authorName &&
              renderExportElement(
                "author-export",
                dragPositions.author,
                elementSizes.author,
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${calculateFontSize(
                      textPosition.fontSize,
                      elementSizes.author,
                      { width: 150, height: 40 }
                    )}px`, // ไม่คูณ Scale
                    color: textPosition.color,
                    fontFamily: "fonttintin",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                  }}
                >
                  ด้วยรักจาก {cardData.authorName}
                </div>
              )}

            {/* Custom Image */}
            {customImageBase64 &&
              renderExportElement(
                "image-export",
                dragPositions.image,
                elementSizes.image,
                <img
                  src={customImageBase64}
                  alt="Custom"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    // ใช้ Config เดียวกับ Preview
                    borderRadius:
                      mainImageConfig.shape === "circle" ? "50%" : "0",
                    ...getShapeStyle(
                      mainImageConfig.shape,
                      mainImageConfig.blur
                    ),
                  }}
                />
              )}

            {/* Text Elements */}
            {cardData.textElements?.map((el: TextElement) =>
              renderExportElement(
                `text-${el.id}-export`,
                { x: el.x, y: el.y },
                { width: el.width, height: el.height },
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    color: el.color,
                    textAlign: el.textAlign,
                    fontSize: `${el.fontSize || 24}px`, // ไม่คูณ Scale
                    fontFamily: "fonttintin",
                    lineHeight: 1.4,
                    fontWeight: el.fontWeight || "normal",
                    fontStyle: el.fontStyle || "normal",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    padding: "8px",
                  }}
                >
                  {el.text}
                </div>
              )
            )}

            {/* Image Elements */}
            {cardData.imageElements?.map((el: ImageElement) =>
              renderExportElement(
                `image-${el.id}-export`,
                { x: el.x, y: el.y },
                { width: el.width, height: el.height },
                <img
                  src={el.url}
                  alt="Image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: el.shape === "circle" ? "50%" : "0",
                    ...getShapeStyle(el.shape, el.blur),
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
