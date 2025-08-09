import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import { DraggableElement } from "./DraggableElement";
import { DroppableArea } from "./DroppableArea";
import { type CardData, type ElementSize } from "./types";
import { calculateFontSize } from "./utils";
import { useMediaQuery } from "react-responsive";

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
  onDragEnd: (event: any) => void;
  onSizeChange: (elementId: string, newSize: ElementSize) => void;
  textMessageAlign: "left" | "center" | "right";
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  isFullSize = true,
  dragPositions,
  elementSizes,
  onDragEnd,
  onSizeChange,
  textMessageAlign,
}) => {
  const { textPosition } = cardData.cardType;
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [backgroundImageBase64, setBackgroundImageBase64] =
    useState<string>("");
  const [customImageBase64, setCustomImageBase64] = useState<string>("");
  // const [textMessageAlign, setTextMessageAlign] = useState<
  //   "left" | "center" | "right"
  // >(textPosition.textAlign as any);

  // คำนวณ scale factors สำหรับ mobile
  const getScaleFactors = () => {
    if (isDesktop) {
      return {
        position: 1,
        size: 1,
      };
    }

    const containerWidth = containerRef.current?.offsetWidth || 400;
    const containerHeight = containerRef.current?.offsetHeight || 300;

    const baseWidth = 1024;
    const baseHeight = 768;

    const scaleX = containerWidth / baseWidth;
    const scaleY = containerHeight / baseHeight;
    const scaleFactor = Math.min(scaleX, scaleY);

    return {
      position: scaleFactor,
      size: scaleFactor,
    };
  };

  // สร้าง mobile positions และ sizes
  const getMobilePositions = () => {
    const { position: positionScale } = getScaleFactors();
    return {
      message: {
        x: dragPositions.message.x * positionScale,
        y: dragPositions.message.y * positionScale,
      },
      author: {
        x: dragPositions.author.x * positionScale,
        y: dragPositions.author.y * positionScale,
      },
      image: {
        x: dragPositions.image.x * positionScale,
        y: dragPositions.image.y * positionScale,
      },
    };
  };

  const getMobileSizes = () => {
    const { size: sizeScale } = getScaleFactors();
    return {
      message: {
        width: elementSizes.message.width * sizeScale,
        height: elementSizes.message.height * sizeScale,
      },
      author: {
        width: elementSizes.author.width * sizeScale,
        height: elementSizes.author.height * sizeScale,
      },
      image: {
        width: elementSizes.image.width * sizeScale,
        height: elementSizes.image.height * sizeScale,
      },
    };
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const mobilePositions = getMobilePositions();
  const mobileSizes = getMobileSizes();
  const scaleFactors = getScaleFactors();

  // สร้าง DraggableElement component
  const createDraggableElement = (
    id: string,
    position: { x: number; y: number },
    size: ElementSize,
    children: React.ReactNode,
    options: {
      minSize?: ElementSize;
      maintainAspectRatio?: boolean;
      aspectRatio?: number;
    } = {}
  ) => (
    <DraggableElement
      id={id}
      position={position}
      size={size}
      containerRef={containerRef}
      onPositionChange={(pos) => {
        const { position: positionScale } = scaleFactors;
        const deltaX = (pos.x - position.x) / positionScale;
        const deltaY = (pos.y - position.y) / positionScale;
        onDragEnd({
          active: { id },
          delta: { x: deltaX, y: deltaY },
        });
      }}
      onSizeChange={(newSize) => {
        const { size: sizeScale } = scaleFactors;
        const deltaWidth = (newSize.width - size.width) / sizeScale;
        const deltaHeight = (newSize.height - size.height) / sizeScale;
        const currentDesktopSize = {
          width: size.width / sizeScale,
          height: size.height / sizeScale,
        };
        onSizeChange(id, {
          width: currentDesktopSize.width + deltaWidth,
          height: currentDesktopSize.height + deltaHeight,
        });
      }}
      minSize={options.minSize}
      maintainAspectRatio={options.maintainAspectRatio}
      aspectRatio={options.aspectRatio}
    >
      {children}
    </DraggableElement>
  );

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

  useEffect(() => {
    const convertImage = async () => {
      try {
        const base64 = await imageUrlToBase64(cardData.cardType.messageImage);
        if (cardData.customImage) {
          const customImageBase64 = await imageUrlToBase64(
            cardData.customImage
          );
          setCustomImageBase64(customImageBase64);
        }
        setBackgroundImageBase64(base64);
      } catch (error) {
        console.error("Failed to convert image to base64:", error);
        setBackgroundImageBase64("");
        setCustomImageBase64("");
      }
    };
    convertImage();
  }, [cardData.cardType.messageImage, cardData.customImage]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
    >
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
      >
        <DroppableArea backgroundImage={cardData.cardType.messageImage}>
          <div
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
            style={{
              backgroundImage: `url("${backgroundImageBase64}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Desktop Version (Hidden on Mobile) */}
          <div id="desktop" className={`${!isDesktop ? "hidden" : "block"}`}>
            {createDraggableElement(
              "message",
              dragPositions.message,
              elementSizes.message,
              <div
                id="message"
                className="cursor-move select-none  w-full h-full flex items-center justify-center font-tintin"
                style={{
                  fontSize: `${calculateFontSize(
                    textPosition.fontSize,
                    elementSizes.message,
                    { width: 200, height: 100 }
                  )}px`,
                  color: textPosition.color,
                  fontFamily: textPosition.fontFamily,
                  fontWeight: "600",
                  lineHeight: "1.4",
                  textAlign: textMessageAlign,
                }}
              >
                {cardData.messageText}
              </div>,
              { minSize: { width: 100, height: 50 } }
            )}

            {cardData.authorName &&
              createDraggableElement(
                "author",
                dragPositions.author,
                elementSizes.author,
                <div
                  id="author"
                  className="cursor-move select-none  rounded-xl w-full h-full flex items-center justify-center font-tintin"
                  style={{
                    fontSize: `${calculateFontSize(
                      textPosition.fontSize,
                      elementSizes.author,
                      { width: 150, height: 40 }
                    )}px`,
                    color: textPosition.color,
                    fontFamily: textPosition.fontFamily,
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  ด้วยรักจาก {cardData.authorName}
                </div>,
                { minSize: { width: 80, height: 30 } }
              )}

            {customImageBase64 &&
              createDraggableElement(
                "image",
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
                      className={`w-full h-full object-cover object-center transition-all duration-300 rounded-full`}
                      draggable={false}
                    />
                  </div>
                </div>,
                {
                  minSize: { width: 100, height: 100 },
                  maintainAspectRatio: true,
                  aspectRatio: 1,
                }
              )}
          </div>

          {/* Mobile Version (Hidden on Desktop) */}
          <div id="mobile" className={`${!isDesktop ? "block" : "hidden"}`}>
            {createDraggableElement(
              "message",
              mobilePositions.message,
              mobileSizes.message,
              <div
                className="cursor-move select-none w-full h-full flex items-center justify-center font-tintin"
                style={{
                  fontSize: `${calculateFontSize(
                    textPosition.fontSize, // เพิ่ม scale factor
                    mobileSizes.message,
                    { width: 200, height: 100 }
                  )}px`,
                  color: textPosition.color,
                  fontFamily: textPosition.fontFamily,
                  fontWeight: "600",
                  lineHeight: "1.4",
                  textAlign: textMessageAlign,
                }}
              >
                {cardData.messageText}
              </div>,
              { minSize: { width: 80, height: 40 } }
            )}

            {cardData.authorName &&
              createDraggableElement(
                "author",
                mobilePositions.author,
                mobileSizes.author,
                <div
                  className="cursor-move select-none  rounded-xl w-full h-full flex items-center justify-center font-tintin"
                  style={{
                    fontSize: `${calculateFontSize(
                      textPosition.fontSize,
                      mobileSizes.author,
                      { width: 150, height: 40 }
                    )}px`,
                    color: textPosition.color,
                    fontFamily: textPosition.fontFamily,
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  ด้วยรักจาก {cardData.authorName}
                </div>,
                { minSize: { width: 60, height: 25 } }
              )}

            {customImageBase64 &&
              createDraggableElement(
                "image",
                mobilePositions.image,
                mobileSizes.image,
                <div className="cursor-move select-none w-full h-full relative group/child">
                  <div className="relative w-full h-full">
                    <img
                      src={customImageBase64}
                      alt="Custom"
                      className={`w-full h-full object-cover object-center transition-all duration-300 rounded-full`}
                      draggable={false}
                    />
                  </div>
                </div>,
                {
                  minSize: { width: 60, height: 60 },
                  maintainAspectRatio: true,
                  aspectRatio: 1,
                }
              )}
          </div>
        </DroppableArea>
      </div>
    </DndContext>
  );
};
