"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Move,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DraggableBoxProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: "box" | "text";
  text?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  onUpdate: (id: number, updates: any) => void;
  onDelete: (id: number) => void;
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "e" | "s" | "w" | null;

export function DraggableBox({
  id,
  x,
  y,
  width,
  height,
  color,
  type = "box",
  text = "",
  textColor = "#ffffff",
  textAlign = "left",
  onUpdate,
  onDelete,
}: DraggableBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(text);

  const boxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, boxX: 0, boxY: 0 });
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    boxX: 0,
    boxY: 0,
  });

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if ((e.target as HTMLElement).classList.contains("resize-handle")) return;
    if (isEditing) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      boxX: x,
      boxY: y,
    };
  };

  const handleResizeStart = (
    handle: ResizeHandle,
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
      width,
      height,
      boxX: x,
      boxY: y,
    };
  };

  // Handle mouse/touch move
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;
        onUpdate(id, {
          x: Math.max(0, dragStartRef.current.boxX + deltaX),
          y: Math.max(0, dragStartRef.current.boxY + deltaY),
        });
      }

      if (isResizing && resizeHandle) {
        const deltaX = clientX - resizeStartRef.current.x;
        const deltaY = clientY - resizeStartRef.current.y;
        const minSize = 80;

        let newWidth = resizeStartRef.current.width;
        let newHeight = resizeStartRef.current.height;
        let newX = resizeStartRef.current.boxX;
        let newY = resizeStartRef.current.boxY;

        if (resizeHandle.includes("e")) {
          newWidth = Math.max(minSize, resizeStartRef.current.width + deltaX);
        }
        if (resizeHandle.includes("w")) {
          const potentialWidth = resizeStartRef.current.width - deltaX;
          if (potentialWidth >= minSize) {
            newWidth = potentialWidth;
            newX = resizeStartRef.current.boxX + deltaX;
          }
        }
        if (resizeHandle.includes("s")) {
          newHeight = Math.max(minSize, resizeStartRef.current.height + deltaY);
        }
        if (resizeHandle.includes("n")) {
          const potentialHeight = resizeStartRef.current.height - deltaY;
          if (potentialHeight >= minSize) {
            newHeight = potentialHeight;
            newY = resizeStartRef.current.boxY + deltaY;
          }
        }

        onUpdate(id, {
          x: Math.max(0, newX),
          y: Math.max(0, newY),
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, isResizing, resizeHandle, id, onUpdate, x, y, width, height]);

  const handleTextClick = (e: React.MouseEvent) => {
    if (type === "text" && !isEditing) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleTextSave = () => {
    onUpdate(id, { text: editingText });
    setIsEditing(false);
  };

  const handleTextChange = (newAlign: "left" | "center" | "right") => {
    onUpdate(id, { textAlign: newAlign });
  };

  const handleColorChange = (newColor: string) => {
    onUpdate(id, { textColor: newColor });
  };

  const commonEmojis = [
    "😀",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "✨",
    "💡",
    "🚀",
    "⭐",
    "👋",
    "💪",
    "🎨",
    "📝",
    "✅",
    "❌",
    "🌟",
    "🎯",
  ];

  return (
    <div
      ref={boxRef}
      className={cn(
        "absolute border-2 rounded-lg backdrop-blur-sm transition-shadow",
        color,
        (isDragging || isResizing) && "shadow-2xl ring-2 ring-primary/50"
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: isDragging
          ? "grabbing"
          : type === "text" && !isEditing
          ? "text"
          : "grab",
        touchAction: "none",
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 bg-background/60 backdrop-blur-sm border-b border-border/50 rounded-t-lg z-10">
        <div className="flex items-center gap-1">
          <Move className="w-3 h-3 text-muted-foreground" />
          {type === "text" && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Palette className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-48"
                  onClick={(e: any) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      "#ffffff",
                      "#000000",
                      "#ef4444",
                      "#f59e0b",
                      "#10b981",
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                      "#fbbf24",
                      "#14b8a6",
                    ].map((c) => (
                      <button
                        key={c}
                        className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: c,
                          borderColor: c === textColor ? "#fff" : "transparent",
                        }}
                        onClick={() => handleColorChange(c)}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleTextChange("left")}
              >
                <AlignLeft
                  className={cn(
                    "w-3 h-3",
                    textAlign === "left" && "text-primary"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleTextChange("center")}
              >
                <AlignCenter
                  className={cn(
                    "w-3 h-3",
                    textAlign === "center" && "text-primary"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleTextChange("right")}
              >
                <AlignRight
                  className={cn(
                    "w-3 h-3",
                    textAlign === "right" && "text-primary"
                  )}
                />
              </Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {type === "text" ? (
        <div
          className="absolute inset-0 pt-10 pb-2 px-4 overflow-hidden"
          onClick={handleTextClick}
        >
          {isEditing ? (
            <div
              className="h-full flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                ref={textareaRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={handleTextSave}
                className="flex-1 w-full bg-transparent border border-border/50 rounded px-2 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                style={{ color: textColor }}
                placeholder="Type your text here..."
              />
              <div className="flex flex-wrap gap-1 pb-1 max-h-20 overflow-y-auto">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-lg hover:scale-125 transition-transform"
                    onClick={() => setEditingText(editingText + emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="h-full flex items-center justify-center p-2 cursor-text"
              style={{
                color: textColor,
                textAlign: textAlign,
              }}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap break-words w-full">
                {text || "Click to edit..."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-8 pt-12 pointer-events-none">
          <div className="text-center">
            <Maximize2 className="w-8 h-8 mx-auto mb-2 text-foreground/40" />
            <p className="text-xs text-muted-foreground hidden sm:block">
              {Math.round(width)} × {Math.round(height)}
            </p>
          </div>
        </div>
      )}

      {/* Resize Handles */}
      <div
        className="resize-handle absolute -top-1 -left-1 w-4 h-4 bg-primary rounded-full cursor-nw-resize border-2 border-background hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart("nw", e)}
        onTouchStart={(e) => handleResizeStart("nw", e)}
      />
      <div
        className="resize-handle absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full cursor-ne-resize border-2 border-background hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart("ne", e)}
        onTouchStart={(e) => handleResizeStart("ne", e)}
      />
      <div
        className="resize-handle absolute -bottom-1 -left-1 w-4 h-4 bg-primary rounded-full cursor-sw-resize border-2 border-background hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart("sw", e)}
        onTouchStart={(e) => handleResizeStart("sw", e)}
      />
      <div
        className="resize-handle absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full cursor-se-resize border-2 border-background hover:scale-125 transition-transform"
        onMouseDown={(e) => handleResizeStart("se", e)}
        onTouchStart={(e) => handleResizeStart("se", e)}
      />

      {/* Edge handles - hidden on small screens */}
      <div
        className="resize-handle hidden md:block absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-primary/80 rounded-full cursor-n-resize hover:scale-110 transition-transform"
        onMouseDown={(e) => handleResizeStart("n", e)}
        onTouchStart={(e) => handleResizeStart("n", e)}
      />
      <div
        className="resize-handle hidden md:block absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-primary/80 rounded-full cursor-s-resize hover:scale-110 transition-transform"
        onMouseDown={(e) => handleResizeStart("s", e)}
        onTouchStart={(e) => handleResizeStart("s", e)}
      />
      <div
        className="resize-handle hidden md:block absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 bg-primary/80 rounded-full cursor-w-resize hover:scale-110 transition-transform"
        onMouseDown={(e) => handleResizeStart("w", e)}
        onTouchStart={(e) => handleResizeStart("w", e)}
      />
      <div
        className="resize-handle hidden md:block absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-8 bg-primary/80 rounded-full cursor-e-resize hover:scale-110 transition-transform"
        onMouseDown={(e) => handleResizeStart("e", e)}
        onTouchStart={(e) => handleResizeStart("e", e)}
      />
    </div>
  );
}
