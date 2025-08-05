import type { Event } from "./types";
import MothersDayImage from "../assets/activity_mother/Happy Mother Day.webp?url";

export const events: Event[] = [
  {
    id: "mothers-day-event",
    title: "The Old Siam: Mother's Day 2025",
    subtitle: "ร่วมแสดงความรักและความกตัญญูต่อคุณแม่",
    description:
      "12 สิงหาคมปีนี้ ให้ ดิโอลด์ สยาม พลาซ่า เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณแม่ ร่วมกิจกรรมพิเศษและชมคอลเลกชันผ้าไหมไทยสุดพิเศษ พร้อมรับของที่ระลึกสำหรับคุณแม่ที่รัก",
    href: "/event/2025/mothers-day-activity",
    image: MothersDayImage,
    status: "active",
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
  },
  {
    id: "pride-month-vote",
    title: "The Old Siam: We're Proud of You",
    subtitle: "ผ้าไหมไทยผ่านความภาคภูมิใจของ ดิ โอลด์ สยาม",
    image:
      "https://assets-manager.ssdapp.net/public/file/ppmfyud6wyaj8fjuvz4koui7",
    description:
      "ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน ดิ โอลด์ สยาม พลาซ่า เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย",
    href: "/event/2025/pride-month-vote",
    status: "active",
    startDate: "2025-07-01",
    endDate: "2025-08-17",
    tags: ["Pride", "ภาพถ่าย", "ประกวด", "LGBTQ+"],
    slug: "pride-month-vote",
    year: "2025",
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
