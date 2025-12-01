import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { type CardType } from "./types";

interface CardTypeItemProps {
  cardType: CardType;
  isSelected: boolean;
  color?: string;
  onSelect: (cardType: CardType) => void;
}

export const CardTypeItem: React.FC<CardTypeItemProps> = ({
  cardType,
  isSelected,
  onSelect,
  color,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(cardType);
    },
    [cardType, onSelect]
  );

  const primaryColor = "#ffdb4d";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative cursor-pointer group rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isSelected ? "shadow-xl" : "hover:shadow-xl"
      }`}
      onClick={handleClick}
    >
      <div className="aspect-[4/3] relative">
        <img
          src={cardType.coverImage}
          alt={cardType.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="group-hover:opacity-100 w-full flex justify-center items-center h-full opacity-0 absolute bottom-0 left-0 p-4">
        <Button
          type="button"
          variant={"fatherDay"}
          onClick={handleClick}
          className={` px-8 py-3 rounded-lg z-10 text-lg`}
        >
          เลือกการ์ด
        </Button>
        <div className="absolute inset-0 bg-black opacity-75 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
};
