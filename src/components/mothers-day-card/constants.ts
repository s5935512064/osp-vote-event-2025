import { type CardType } from "./types";

import CardType1 from "../../assets/activity_mother/2.webp";
import CardType2 from "../../assets/activity_mother/4.webp";
import CardType3 from "../../assets/activity_mother/6.webp";
import CardType4 from "../../assets/activity_mother/8.webp";
import CardType5 from "../../assets/activity_mother/9.webp";

export const CARD_TYPES: CardType[] = [
  {
    id: "gentle-bloom",
    name: "อ้อมใจแห่งรักแท้ (Unfading Warmth)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/cbp2yyevr95ohw7ccuj69ims",
    messageImage: CardType1.src,
    description:
      "รักแท้…ไม่ต้องพูดมาก แค่มีแม่อยู่ตรงนั้น…ก็เพียงพอแล้ว มาร่วมเติมเต็มความทรงจำแห่งความอบอุ่นในวันแม่ ด้วยหัวใจที่เปล่งประกาย ที่ ดิ โอลด์ สยาม",
    theme: "gentle-bloom",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#09387a",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "white-grace",
    name: "ความอ่อนโยนบริสุทธิ์ (Pure Tenderness)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/ks7ohcgxcnxrdqp4q42ajjy8",
    messageImage: CardType2.src,
    description:
      "เมื่อคำว่ารักไม่ต้องมีเงื่อนไข… ความรักของแม่ก็เปรียบเสมือนกลีบดอกไม้สีขาวบริสุทธิ์ ที่โอบกอดเราด้วยความอ่อนโยนไม่เปลี่ยนแปลง ร่วมบอกรักคุณแม่ด้วยหัวใจที่บริสุทธิ์ที่สุด ที่ ดิ โอลด์ สยาม",
    theme: "white-grace",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#4c7dc2",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "blooming-devotion",
    name: "ความรักที่เบ่งบานไม่มีที่สิ้นสุด (Everlasting Bloom of Love)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/tpliugec57r589f7k7bexjtk",
    messageImage: CardType3.src,
    description:
      "แม่คือดอกไม้แห่งรัก ที่เบ่งบานอยู่ในใจเราทุกวันไม่ว่าเวลาจะผ่านไปนานแค่ไหน… ขอเชิญร่วมแบ่งปันช่วงเวลาแสนอบอุ่นในวันแม่ กับความรักที่ไม่มีวันโรยรา ที่ ดิ โอลด์ สยาม",
    theme: "blooming-devotion",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#c22731",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "timeless-affection",
    name: "ความรักที่ไม่มีวันเก่า (Elegant & Eternal)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/up4mj3qii9ppkfb9tgvuk5fr",
    messageImage: CardType4.src,
    description:
      "จากวันแรกจนวันนี้ ความรักของแม่ยังคงมั่นคงและงดงามเสมอ เหมือนดอกไม้ที่ผลิบานด้วยความหมายอันลึกซึ้ง ร่วมเฉลิมฉลองวันแม่ไปกับบรรยากาศแสนอบอุ่น ณ ดิ โอลด์ สยาม",
    theme: "timeless-affection",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#4a351b",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "blue-serenity",
    name: "สายลมแห่งความสงบ (Calmness of Love)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/csvwqvj60faznvugfe702nsd",
    messageImage: CardType5.src,
    description:
      "ในอ้อมกอดของแม่...เรารู้สึกปลอดภัย ราวกับอยู่ท่ามกลางทุ่งดอกไม้และผีเสื้อในวันที่อากาศแสนดี มอบความรักกลับคืนแด่ผู้หญิงที่ยิ่งใหญ่ที่สุดในชีวิต ที่ ดิ โอลด์ สยาม",
    theme: "blue-serenity",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#223766",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
];

// Constants
export const TEXT_WIDTH_FACTOR = 0.6;
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 1600;
export const DEFAULT_CARD_WIDTH = 400;
export const PREVIEW_CARD_WIDTH = 256;
export const DEFAULT_CARD_HEIGHT = 300;

// Max sizes for different element types
export const ELEMENT_MAX_SIZES = {
  message: { width: 300, height: 200 },
  author: { width: 200, height: 80 },
  image: { width: 150, height: 150 }, // ← ตั้งให้เป็น square
} as const;

export const ELEMENT_MIN_SIZES = {
  message: { width: 100, height: 50 },
  author: { width: 80, height: 30 },
  image: { width: 40, height: 40 }, // ← ตั้งให้เป็น square
} as const;
