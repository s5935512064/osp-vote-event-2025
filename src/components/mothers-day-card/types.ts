export interface CardType {
  id: string;
  name: string;
  coverImage: string;
  messageImage: string;
  description: string;
  theme:
    | "blue-serenity"
    | "white-grace"
    | "blooming-devotion"
    | "timeless-affection"
    | "gentle-bloom"
    | "heart-of-memories"
    | "line-art-love"
    | "warm-hug-illustration"
    | "guiding-light-love";

  textPosition: {
    x: number;
    y: number;
    width: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    textAlign: "left" | "center" | "right";
  };
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
}

export type ShapeType = "rectangle" | "circle" | "heart";

export interface ImageElement {
  id: string;
  url: string; // Base64 or URL
  x: number;
  y: number;
  width: number;
  height: number;
  shape: ShapeType;
  blur: number; // Blur radius in px
  opacity: number; // 0-1
  rotation: number; // degrees
}

export interface CardData {
  cardType: CardType;
  coverText: string;
  messageText: string;
  authorName: string;
  customImage?: string;
  textElements?: TextElement[];
  imageElements?: ImageElement[];
}

export interface ElementSize {
  width: number;
  height: number;
}

export type StepType = "select" | "customize" | "preview";
