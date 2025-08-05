import React, { useState, useCallback, useEffect } from "react";

interface ResizeHandleProps {
  onResize: (deltaX: number, deltaY: number, handle: string) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
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

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, handleType: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const isTouch = 'touches' in e;
      const startX = isTouch ? e.touches[0].clientX : e.clientX;
      const startY = isTouch ? e.touches[0].clientY : e.clientY;

      const handleMove = (e: MouseEvent | TouchEvent) => {
        const isTouchMove = 'touches' in e;
        const currentX = isTouchMove ? e.touches[0].clientX : e.clientX;
        const currentY = isTouchMove ? e.touches[0].clientY : e.clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        onResize(deltaX, deltaY, handleType);
      };

      const handleEnd = () => {
        setIsResizing(false);
        document.removeEventListener(isTouch ? "touchmove" : "mousemove", handleMove);
        document.removeEventListener(isTouch ? "touchend" : "mouseup", handleEnd);
      };

      document.addEventListener(isTouch ? "touchmove" : "mousemove", handleMove);
      document.addEventListener(isTouch ? "touchend" : "mouseup", handleEnd);
    },
    [onResize]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handleType: string) => {
      handleStart(e, handleType);
    },
    [handleStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, handleType: string) => {
      handleStart(e, handleType);
    },
    [handleStart]
  );

  return (
    <>
      {/* Corner handles */}
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-nw-resize border-2 border-white shadow-sm"
        style={{ 
          top: "-6px", 
          left: "-6px", 
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "top-left")}
        onTouchStart={(e) => handleTouchStart(e, "top-left")}
      />
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-ne-resize border-2 border-white shadow-sm"
        style={{ 
          top: "-6px", 
          right: "-6px", 
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "top-right")}
        onTouchStart={(e) => handleTouchStart(e, "top-right")}
      />
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-sw-resize border-2 border-white shadow-sm"
        style={{ 
          bottom: "-6px", 
          left: "-6px", 
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
        onTouchStart={(e) => handleTouchStart(e, "bottom-left")}
      />
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize border-2 border-white shadow-sm"
        style={{ 
          bottom: "-6px", 
          right: "-6px", 
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
        onTouchStart={(e) => handleTouchStart(e, "bottom-right")}
      />

      {/* Side handles */}
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-n-resize border-2 border-white shadow-sm"
        style={{
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "top")}
        onTouchStart={(e) => handleTouchStart(e, "top")}
      />
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-s-resize border-2 border-white shadow-sm"
        style={{
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "bottom")}
        onTouchStart={(e) => handleTouchStart(e, "bottom")}
      />
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-w-resize border-2 border-white shadow-sm"
        style={{
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "left")}
        onTouchStart={(e) => handleTouchStart(e, "left")}
      />
      <div
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-e-resize border-2 border-white shadow-sm"
        style={{
          right: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          ...(isMobile && { width: "12px", height: "12px" })
        }}
        onMouseDown={(e) => handleMouseDown(e, "right")}
        onTouchStart={(e) => handleTouchStart(e, "right")}
      />
    </>
  );
};
