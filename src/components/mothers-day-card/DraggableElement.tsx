import React, { useCallback, useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ResizeHandle } from "./ResizeHandle";
import type { ElementSize } from "./types";

interface DraggableElementProps {
  id: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: ElementSize;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: ElementSize) => void;
  minSize?: ElementSize;
  maxSize?: ElementSize;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  containerRef?: React.RefObject<HTMLElement> | any;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  id,
  children,
  position,
  size,
  onPositionChange,
  onSizeChange,
  minSize = { width: 50, height: 30 },
  maxSize = { width: 650, height: 500 },
  maintainAspectRatio = false,
  aspectRatio = 1,
  containerRef,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // ลดความซับซ้อน - ใช้ pixel อย่างเดียว
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `translate(-50%, -50%)`,
    zIndex: 10,
    width: `${size.width}px`,
    height: `${size.height}px`,
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
  };

  const handleResize = useCallback(
    (deltaX: number, deltaY: number, handle: string) => {
      let newWidth = size.width;
      let newHeight = size.height;

      if (maintainAspectRatio) {
        // คำนวณขนาดใหม่โดยรักษา aspect ratio
        let baseDelta = 0;

        switch (handle) {
          case "top-left":
            baseDelta = Math.max(-deltaX, -deltaY);
            break;
          case "top-right":
            baseDelta = Math.max(deltaX, -deltaY);
            break;
          case "bottom-left":
            baseDelta = Math.max(-deltaX, deltaY);
            break;
          case "bottom-right":
            baseDelta = Math.max(deltaX, deltaY);
            break;
          case "top":
            baseDelta = -deltaY;
            break;
          case "bottom":
            baseDelta = deltaY;
            break;
          case "left":
            baseDelta = -deltaX;
            break;
          case "right":
            baseDelta = deltaX;
            break;
        }

        // คำนวณขนาดใหม่โดยรักษา aspect ratio
        if (aspectRatio >= 1) {
          // landscape หรือ square
          newWidth = Math.max(
            minSize.width,
            Math.min(maxSize.width, size.width + baseDelta)
          );
          newHeight = newWidth / aspectRatio;

          // ตรวจสอบว่า height ไม่เกินขีดจำกัด
          if (newHeight > maxSize.height) {
            newHeight = maxSize.height;
            newWidth = newHeight * aspectRatio;
          }
          if (newHeight < minSize.height) {
            newHeight = minSize.height;
            newWidth = newHeight * aspectRatio;
          }
        } else {
          // portrait
          newHeight = Math.max(
            minSize.height,
            Math.min(maxSize.height, size.height + baseDelta)
          );
          newWidth = newHeight * aspectRatio;

          // ตรวจสอบว่า width ไม่เกินขีดจำกัด
          if (newWidth > maxSize.width) {
            newWidth = maxSize.width;
            newHeight = newWidth / aspectRatio;
          }
          if (newWidth < minSize.width) {
            newWidth = minSize.width;
            newHeight = newWidth / aspectRatio;
          }
        }
      } else {
        // ปกติ (ไม่รักษา aspect ratio)
        switch (handle) {
          case "top-left":
            newWidth = Math.max(
              minSize.width,
              Math.min(maxSize.width, size.width - deltaX)
            );
            newHeight = Math.max(
              minSize.height,
              Math.min(maxSize.height, size.height - deltaY)
            );
            break;
          case "top-right":
            newWidth = Math.max(
              minSize.width,
              Math.min(maxSize.width, size.width + deltaX)
            );
            newHeight = Math.max(
              minSize.height,
              Math.min(maxSize.height, size.height - deltaY)
            );
            break;
          case "bottom-left":
            newWidth = Math.max(
              minSize.width,
              Math.min(maxSize.width, size.width - deltaX)
            );
            newHeight = Math.max(
              minSize.height,
              Math.min(maxSize.height, size.height + deltaY)
            );
            break;
          case "bottom-right":
            newWidth = Math.max(
              minSize.width,
              Math.min(maxSize.width, size.width + deltaX)
            );
            newHeight = Math.max(
              minSize.height,
              Math.min(maxSize.height, size.height + deltaY)
            );
            break;
          case "top":
            newHeight = Math.max(
              minSize.height,
              Math.min(maxSize.height, size.height - deltaY)
            );
            break;
          case "bottom":
            newHeight = Math.max(
              minSize.height,
              Math.min(maxSize.height, size.height + deltaY)
            );
            break;
          case "left":
            newWidth = Math.max(
              minSize.width,
              Math.min(maxSize.width, size.width - deltaX)
            );
            break;
          case "right":
            newWidth = Math.max(
              minSize.width,
              Math.min(maxSize.width, size.width + deltaX)
            );
            break;
        }
      }

      onSizeChange({ width: newWidth, height: newHeight });
    },
    [size, onSizeChange, minSize, maxSize, maintainAspectRatio, aspectRatio]
  );

  const transformStyle = transform
    ? {
        ...baseStyle,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) translate(-50%, -50%)`,
        zIndex: 1000,
      }
    : baseStyle;

  return (
    <div
      ref={setNodeRef}
      style={transformStyle}
      {...listeners}
      {...attributes}
      className="group hover:border-2 hover:border-pink-500"
    >
      {children}
      <ResizeHandle onResize={handleResize} />
    </div>
  );
};
