import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  children: React.ReactNode;
  backgroundImage: string;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({
  children,
  backgroundImage,
}) => {
  const { setNodeRef } = useDroppable({
    id: "card-area",
  });

  return (
    <div
      ref={setNodeRef}
      className="relative w-full h-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "visible",
        minHeight: "100%",
        minWidth: "100%",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {children}
    </div>
  );
};
