import { type CardType } from "./types";

import CardType1 from "../../assets/activity_mother/2.webp";
import CardType2 from "../../assets/activity_mother/4.webp";
import CardType3 from "../../assets/activity_mother/6.webp";
import CardType4 from "../../assets/activity_mother/8.webp";
import CardType5 from "../../assets/activity_mother/9.webp";

import CardFatherType1 from "../../assets/activity_father/17.webp";
import CardFatherType2 from "../../assets/activity_father/14.webp";
import CardFatherType3 from "../../assets/activity_father/19.webp";
import CardFatherType4 from "../../assets/activity_father/21.webp";

export const CARD_TYPES: CardType[] = [
  {
    id: "gentle-bloom",
    name: "อ้อมใจแห่งรักแท้ (Unfading Warmth)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/n2af4rms0iaqsh74q8b3xgnk",
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
      "https://assets-manager.ssdapp.net/public/file/h9ytals9mwcs5viqq16e4w5e",
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
      "https://assets-manager.ssdapp.net/public/file/sj45qy3rxz80bnw85kgmwqpz",
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
      "https://assets-manager.ssdapp.net/public/file/dcw3dbylu5hwlcpc4gqrhn4j",
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
      "https://assets-manager.ssdapp.net/public/file/j16xj08qvru0d4c9c0w8yw90",
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

export const FATHER_DAY_CARD_TYPES: CardType[] = [
  {
    id: "heart-of-memories",
    name: "หัวใจแห่งความทรงจำ (Heart of Memories)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/s8njvyj207pj5098978gny46",
    messageImage: CardFatherType1.src,
    description:
      "ทุกชั้นของภาพซ้อนกันเป็นหัวใจ ดุจความทรงจำที่เก็บไว้ในหัวใจพ่อเสมอ การ์ดสไตล์กระดาษฉลุในโทนสีเหลือง ถ่ายทอดช่วงเวลาระหว่างพ่อและลูกผ่านกิจกรรมเล็กๆ แต่อัดแน่นด้วยความรัก ทุกเรื่องราวของเรา…มีพ่อเป็นหัวใจของความสุขเสมอ",
    theme: "heart-of-memories",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#c7ab7f",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "line-art-love",
    name: "รักที่วาดด้วยเส้นของหัวใจ (Line Art Love)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/hb79og1u06c2kyyssumyb0rg",
    messageImage: CardFatherType2.src,
    description:
      "ลายเส้นแบบเรียบง่ายแต่ลึกซึ้ง สื่อถึงความผูกพันที่ไม่เคยขาดตอน และเป็นสัญลักษณ์ของการเติบโตที่พ่อจะคอยสนับสนุนอยู่เสมอ",
    theme: "line-art-love",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#0d0d0b",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "warm-hug-illustration",
    name: "อ้อมกอดที่อบอุ่นที่สุดในโลก (Warm Hug Illustration)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/ozvzr8oo9fi1y2qsaqtga0vj",
    messageImage: CardFatherType3.src,
    description:
      "ภาพสไตล์มินิมอล ลายล้อมไปด้วยดอกไม้ สื่อถึงอ้อมกอดของพ่อ…คือที่พักใจที่อบอุ่นที่สุดไม่ว่าจะกี่ปีผ่านไป",
    theme: "warm-hug-illustration",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#c4aa80",
      fontFamily: "font-tintin",
      textAlign: "center",
    },
  },
  {
    id: "guiding-light-love",
    name: "แสงสว่างแห่งความรัก (The Guiding Light of Love)",
    coverImage:
      "https://assets-manager.ssdapp.net/public/file/soly1k55munfmbcotulhs9v1",
    messageImage: CardFatherType4.src,
    description:
      "ภาพเงาพ่อที่จูงมือลูกสาว สื่อถึงการนำทางในทุกย่างก้าวของชีวิต แม้ในวันที่โลกดูมืดมิด พ่อก็คือแสงสว่างที่อบอุ่นและมั่นคงเสมอมา",
    theme: "guiding-light-love",
    textPosition: {
      x: 10,
      y: 60,
      width: 80,
      fontSize: 18,
      color: "#96846b",
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
