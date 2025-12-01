import type { Event } from "./types";

export const events: Event[] = [
  {
    id: "fathers-day-2025",
    title: "วันพ่อแห่งชาติ 2568",
    subtitle: "ร่วมแสดงความรักและความกตัญญูต่อคุณพ่อ กับ ดิ โอลด์ สยาม พลาซ่า",
    description:
      "5 ธันวาคมปีนี้ ให้ ดิโอลด์ สยาม พลาซ่า เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณพ่อ",
    href: "/event/2025/fathers-day-activity",
    image:
      "https://assets-manager.ssdapp.net/public/file/kxu8j5qhie633kw024n3b7tw",
    status: "active",
    startDate: "2025-11-26",
    endDate: "2025-12-10",
    tags: ["วันพ่อ", "ครอบครัว", "วัฒนธรรมไทย", "กิจกรรมพิเศษ", "fathersday"],
    slug: "fathers-day-activity",
    year: "2025",
    isHot: true,
  },
  {
    id: "loy-krathong-thai-silk-2568",
    title: "ลอยกระทงผ้าไทยออนไลน์ 2568",
    subtitle:
      "ร่วมสืบสาน รักษา และต่อยอด พระราชปณิธานผ้าไทย กับ ดิ โอลด์ สยาม พลาซ่า (Silk Market of Thailand)",
    description:
      "เฉลิมฉลองเทศกาลลอยกระทงกับกิจกรรมออนไลน์สุดพิเศษจาก ดิ โอลด์ สยาม พลาซ่า สืบสานวัฒนธรรมไทยและร่วมอนุรักษ์ผ้าไทยผ่านกิจกรรมลอยกระทงผ้าไทยออนไลน์",
    href: "https://theoldsiam.co.th/loykrathong",
    image:
      "https://res.cloudinary.com/dndcgytjh/image/upload/v1761998610/ubaipia6olwrqhr35lkg.webp",
    status: "active",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    tags: [
      "ลอยกระทง",
      "ผ้าไทย",
      "ออนไลน์",
      "วัฒนธรรมไทย",
      "กระทง",
      "loykrathong",
      "silkmarket",
    ],
    slug: "loy-krathong-thai-silk",
    year: "2025",
    isHot: false,
  },
  {
    id: "mothers-day-event",
    title: "Love is Unconditional | The Old Siam Plaza",
    subtitle: "ร่วมแสดงความรักและความกตัญญูต่อคุณแม่",
    description:
      "12 สิงหาคมปีนี้ ให้ ดิโอลด์ สยาม พลาซ่า เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณแม่ ร่วมกิจกรรมพิเศษและชมคอลเลกชันผ้าไหมไทยสุดพิเศษ พร้อมรับของที่ระลึกสำหรับคุณแม่ที่รัก",
    href: "/event/2025/mothers-day-activity",
    image:
      "https://assets-manager.ssdapp.net/public/file/ppmfyud6wyaj8fjuvz4koui7",
    status: "ended",
    startDate: "2025-08-08",
    endDate: "2025-08-30",
    tags: [
      "การ์ดอวยพร",
      "วันแม่",
      "ครอบครัว",
      "ผ้าไหมไทย",
      "กิจกรรมพิเศษ",
      "motherdays",
    ],
    slug: "mothers-day-activity",
    year: "2025",
    isHot: false,
  },
  {
    id: "pride-month-vote",
    title: "We're Proud of You | The Old Siam Plaza",
    subtitle: "ผ้าไหมไทยผ่านความภาคภูมิใจของ ดิ โอลด์ สยาม",
    image:
      "https://res.cloudinary.com/dndcgytjh/image/upload/v1752777677/ejowcreczyfw5ui42ztj.webp",
    description:
      "ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน ดิ โอลด์ สยาม พลาซ่า เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย",
    href: "/event/2025/pride-month-vote",
    status: "ended",
    startDate: "2025-07-01",
    endDate: "2025-08-17",
    tags: ["Pride", "ภาพถ่าย", "ประกวด", "LGBTQ+"],
    slug: "pride-month-vote",
    year: "2025",
    isHot: false,
  },
];

export function getActiveEvents(): Event[] {
  return events.filter((event) => event.status === "active");
}

export function getUpcomingEvents(): Event[] {
  return events.filter((event) => event.status === "coming-soon");
}

export function getAllEvents(): Event[] {
  return events;
}

export function getEventBySlug(year: string, slug: string): Event | undefined {
  return events.find((event) => event.year === year && event.slug === slug);
}

export function getEventsByYear(year: string): Event[] {
  return events.filter((event) => event.year === year);
}
