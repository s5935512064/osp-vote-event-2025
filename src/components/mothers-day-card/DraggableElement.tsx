import React, { useState, useEffect, useRef } from "react";
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
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void; // ✅ เพิ่ม Prop onClick
  isSelected?: boolean; // ✅ เพิ่ม prop
}

type ResizeHandleType = "nw" | "ne" | "sw" | "se" | "n" | "s" | "w" | "e";

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
  onClick, // ✅ รับ Prop
  isSelected = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandleType | null>(
    null
  );

  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const hasMoved = useRef(false); // ✅ เพิ่มตัวแปรตรวจสอบว่ามีการขยับหรือไม่
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialX: 0,
    initialY: 0,
  });

  // Handle Drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).classList.contains("resize-handle")) return;
    // ✅ เพิ่มบรรทัดนี้: ถ้ากดที่ elements ที่มี class no-drag ไม่ต้องเริ่มลาก
    if ((e.target as HTMLElement).closest(".no-drag")) return;

    // ป้องกัน Default behavior เพื่อไม่ให้ browser scroll หรือ select text
    // e.preventDefault(); // Note: อาจต้องระวังถ้ามี elements ภายในที่ต้อง interact

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    hasMoved.current = false; // ✅ Reset สถานะการขยับ
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  // Handle Resize
  const handleResizeStart = (
    handle: ResizeHandleType,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsResizing(true);
    setResizeHandle(handle);
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      initialWidth: size.width,
      initialHeight: size.height,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        e.preventDefault(); // ป้องกัน scroll ขณะลากในมือถือ
        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;

        // ✅ ตรวจสอบว่าขยับจริงหรือไม่ (ป้องกันการขยับเล็กน้อยโดยไม่ตั้งใจถือเป็น drag)
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasMoved.current = true;
        }

        onPositionChange({
          x: dragStartRef.current.initialX + deltaX,
          y: dragStartRef.current.initialY + deltaY,
        });
      }

      if (isResizing && resizeHandle) {
        e.preventDefault();
        const deltaX = clientX - resizeStartRef.current.x;
        const deltaY = clientY - resizeStartRef.current.y;

        let newWidth = resizeStartRef.current.initialWidth;
        let newHeight = resizeStartRef.current.initialHeight;
        let newX = resizeStartRef.current.initialX;
        let newY = resizeStartRef.current.initialY;

        // Logic การ Resize ตามทิศทาง
        if (resizeHandle.includes("e")) {
          newWidth = Math.min(
            maxSize.width,
            Math.max(
              minSize.width,
              resizeStartRef.current.initialWidth + deltaX
            )
          );
        }
        if (resizeHandle.includes("w")) {
          const w = resizeStartRef.current.initialWidth - deltaX;
          if (w >= minSize.width && w <= maxSize.width) {
            newWidth = w;
            newX = resizeStartRef.current.initialX + deltaX;
          }
        }
        if (resizeHandle.includes("s")) {
          newHeight = Math.min(
            maxSize.height,
            Math.max(
              minSize.height,
              resizeStartRef.current.initialHeight + deltaY
            )
          );
        }
        if (resizeHandle.includes("n")) {
          const h = resizeStartRef.current.initialHeight - deltaY;
          if (h >= minSize.height && h <= maxSize.height) {
            newHeight = h;
            newY = resizeStartRef.current.initialY + deltaY;
          }
        }

        // Maintain Aspect Ratio Logic (Optional - Simplified)
        if (maintainAspectRatio) {
          if (resizeHandle.includes("e") || resizeHandle.includes("w")) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
        }

        // Update Position (ถ้ามีการเลื่อนซ้ายหรือบน)
        if (newX !== position.x || newY !== position.y) {
          onPositionChange({ x: newX, y: newY });
        }

        // Update Size
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);

      // ✅ ถ้าไม่ได้ขยับ และไม่ได้ Resize และมี onClick ให้เรียกใช้งาน
      if (!hasMoved.current && !isResizing && onClick) {
        onClick({} as React.MouseEvent); // สร้าง event object สำหรับ onClick
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMove, { passive: false });
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [
    isDragging,
    isResizing,
    resizeHandle,
    onPositionChange,
    onSizeChange,
    minSize,
    maxSize,
    maintainAspectRatio,
    aspectRatio,
    position,
    size,
    onClick, // ✅ dependency
  ]);

  // Common Handle Style
  const handleStyle =
    "absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full z-50";

  // ปรับ Logic การแสดง Handles
  // แสดงเมื่อ: isDragging OR isResizing OR isSelected (Desktop Hover ยังคงไว้น่าจะดี หรือเอาออกก็ได้ถ้าใช้ Click Select แทน)
  const showHandles = isDragging || isResizing || isSelected;

  return (
    <div
      ref={elementRef}
      className={`absolute group ${
        isDragging ? "cursor-grabbing" : "cursor-pointer" // เปลี่ยน cursor-grab เป็น cursor-pointer เพื่อสื่อว่าคลิกได้
      } ${isDragging || isResizing ? "z-50" : "z-10"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: "translate(-50%, -50%)", // Keep centering logic
        touchAction: "none", // สำคัญมากสำหรับมือถือ
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={onClick} // ✅ Bind onClick ที่ container
      // Note: ต้องระวัง handleDragStart ทับซ้อนกับ onClick
      // ใน handleEnd ของ Drag logic เดิมมีการเรียก onClick ถ้าไม่ได้ขยับ -> อันนี้ถูกต้องแล้ว
    >
      {/* Content */}
      <div
        className={`w-full h-full rounded-lg transition-shadow ${
          showHandles
            ? "ring-2 ring-blue-500 ring-offset-2" // แสดงกรอบเมื่อถูกเลือก
            : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1" // Desktop Hover Effect
        }`}
      >
        {children}
      </div>

      {/* Resize Handles - แสดงเฉพาะตอน Hover หรือกำลัง Drag/Resize */}
      <div
        className={`transition-opacity ${
          showHandles ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {/* Corners */}
        <div
          className={`${handleStyle} -top-2 -left-2 cursor-nw-resize`}
          onMouseDown={(e) => handleResizeStart("nw", e)}
          onTouchStart={(e) => handleResizeStart("nw", e)}
        />
        <div
          className={`${handleStyle} -top-2 -right-2 cursor-ne-resize`}
          onMouseDown={(e) => handleResizeStart("ne", e)}
          onTouchStart={(e) => handleResizeStart("ne", e)}
        />
        <div
          className={`${handleStyle} -bottom-2 -left-2 cursor-sw-resize`}
          onMouseDown={(e) => handleResizeStart("sw", e)}
          onTouchStart={(e) => handleResizeStart("sw", e)}
        />
        <div
          className={`${handleStyle} -bottom-2 -right-2 cursor-se-resize`}
          onMouseDown={(e) => handleResizeStart("se", e)}
          onTouchStart={(e) => handleResizeStart("se", e)}
        />

        {/* Edges (Optional - เพิ่มถ้าต้องการ) */}
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 cursor-n-resize..." ... /> */}
      </div>
    </div>
  );
};
