import React, { useState, useRef, useEffect } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  X,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TextElement } from "./types";

interface EditableTextProps {
  element: TextElement;
  onUpdate: (id: string, updates: Partial<TextElement>) => void;
  onDelete: (id: string) => void;
  scale?: number;
}

export const EditableText: React.FC<EditableTextProps> = ({
  element,
  onUpdate,
  onDelete,
  scale = 1,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(element.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // textareaRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setLocalText(element.text);
  }, [element.text]);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(element.id, { text: localText });
  };

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

  return (
    <div className="w-full h-full relative group/editable">
      {/* Toolbar - Show on Hover or Editing */}
      <div className="no-drag absolute -top-12 left-0 right-0 flex justify-center opacity-0 group-hover/parent:opacity-100 transition-opacity z-50">
        <div className="bg-white/90 backdrop-blur border rounded-lg shadow-lg flex items-center p-1 gap-1">
          {/* Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100"
              >
                <Palette className="w-4 h-4" style={{ color: element.color }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 no-drag">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`w-6 h-6 rounded-full border-2 ${
                      element.color === c
                        ? "border-blue-500"
                        : "border-transparent"
                    } hover:scale-110 transition-transform`}
                    style={{ backgroundColor: c }}
                    onClick={() => onUpdate(element.id, { color: c })}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Alignments */}
          <Button
            variant={element.textAlign === "left" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdate(element.id, { textAlign: "left" })}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={element.textAlign === "center" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdate(element.id, { textAlign: "center" })}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={element.textAlign === "right" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdate(element.id, { textAlign: "right" })}
          >
            <AlignRight className="w-4 h-4" />
          </Button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(element.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        className="w-full h-full"
        onDoubleClick={() => setIsEditing(true)}
        onTouchEnd={(e) => {
          // Simple double tap detection could go here, but for now use button or long press
          // Or just make it always editable on click if preferred
          setIsEditing(true);
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onBlur={handleBlur}
            className="no-drag w-full h-full bg-transparent resize-none focus:outline-none p-2"
            style={{
              color: element.color,
              textAlign: element.textAlign,
              fontSize: `${element.fontSize || 24}px`, // Use style font size directly
              fontFamily: element.fontFamily || "fonttintin",
              lineHeight: 1.4,
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleBlur();
            }}
          />
        ) : (
          <div
            className="w-full h-full p-2 whitespace-pre-wrap break-words"
            style={{
              color: element.color,
              textAlign: element.textAlign,
              fontSize: `${element.fontSize || 24}px`,
              fontFamily: element.fontFamily || "fonttintin",
              lineHeight: 1.4,
              cursor: "text",
            }}
          >
            {element.text || "ดับเบิ้ลคลิกเพื่อแก้ไข"}
          </div>
        )}
      </div>
    </div>
  );
};
