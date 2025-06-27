"use client";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type DeviceType = "mobile" | "tablet" | "desktop";

export default function RuleAccordition() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="!text-white w-fit z-20"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          กติกาการร่วมโหวตกิจกรรม The Old Siam: We're Proud of You
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <ul className="list-decimal pl-4 text-sm ">
            <li>
              ชมภาพลุคชุดผ้าไหมไทย
              ของผู้เข้าร่วมกิจกรรมที่แสดงอยู่บนหน้าเว็บไซต์
            </li>
            <li>เลือกโหวต 1 รูปที่คุณชื่นชอบที่สุด</li>
            <li>
              กรอกข้อมูลให้ครบถ้วน ได้แก่ ชื่อ-นามสกุล
              และเบอร์โทรศัพท์ที่สามารถติดต่อได้
            </li>
            <li>ผู้ร่วมกิจกรรม 1 ท่าน สามารถโหวตได้เพียง 1 ครั้งเท่านั้น</li>
            <li>หมดเขตร่วมโหวต วันที่ 14 กรกฎาคม 2568 เวลา 23.59 น.</li>
            <li>
              สุ่มรายชื่อผู้โชคดีจากผู้ร่วมโหวตที่ทำตามกติกาครบถ้วนจำนวน 10 ท่าน
            </li>
            <li>
              ของรางวัล: บัตรกำนัลสำหรับใช้ในศูนย์การค้า The Old Siam มูลค่า
              1,500 บาท
            </li>
            <li>
              ประกาศผลผู้โชคดี วันที่ 15 กรกฎาคม 2568 ทาง Facebook และ LINE
              Official Account ของศูนย์การค้า
            </li>
            <li>คำตัดสินของคณะกรรมการถือเป็นที่สิ้นสุด</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
