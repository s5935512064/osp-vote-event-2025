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
    | "gentle-bloom";
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

export interface CardData {
  cardType: CardType;
  coverText: string;
  messageText: string;
  authorName: string;
  customImage?: string;
}

export interface ElementSize {
  width: number;
  height: number;
}

export type StepType = "select" | "customize" | "preview";
