import React from "react";
import { Button } from "@/components/ui/button";
import { SparklesText } from "../magicui/sparkles-text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RULES_LIST } from "./constants";
import type { DeviceType, LayoutMode, CampaignDataResponse } from "./types";

interface GalleryHeaderProps {
  deviceType: DeviceType;
}

export function GalleryHeader({ deviceType }: GalleryHeaderProps) {
  const campaignName = "WE'RE PROUD OF YOU";

  if (deviceType === "desktop") {
    return (
      <div className="text-white w-fit shrink-0 flex flex-col gap-2 items-center justify-center leading-none  p-4 rounded-2xl h-fit ">
        <SparklesText className="text-3xl md:text-5xl lg:text-7xl font-permanent-marker text-center text-nowrap drop-shadow-2xl">
          {campaignName}
        </SparklesText>
        <p className="text-center text-sm md:text-base font-prompt max-w-xl drop-shadow-2xl">
          ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน ดิ โอลด์ สยาม พลาซ่า
          เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย
        </p>

        <div className="flex items-center justify-center gap-2">
          <a
            href="https://theoldsiam.co.th/en/blogs/the-old-siam-were-proud-of-you-vote-for-authentic-thai-silk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="facebook_osp"
          >
            <Button variant="default" size="lg">
              อ่านบทความ
            </Button>
          </a>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="lg">
                กติกาการโหวต
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full font-prompt">
              <DialogHeader className="text-left">
                <DialogTitle>
                  กติกาการร่วมโหวตกิจกรรม The Old Siam: We're Proud of You
                </DialogTitle>
                <DialogDescription>
                  <ul className="list-decimal pl-4 text-sm">
                    {RULES_LIST.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white w-full flex flex-col gap-2 items-center justify-start absolute top-0 left-0 right-0 z-50 leading-none">
      <SparklesText
        className={`${
          deviceType === "mobile" ? "text-3xl" : "text-4xl"
        } font-permanent-marker text-center`}
      >
        {campaignName}
      </SparklesText>
      <p
        className={`text-center ${
          deviceType === "mobile" ? "text-sm" : "text-sm"
        } font-prompt max-w-lg`}
      >
        ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน ดิ โอลด์ สยาม พลาซ่า
        เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย
      </p>

      <div className="flex items-center justify-center gap-2">
        <a
          href="https://theoldsiam.co.th/en/blogs/the-old-siam-were-proud-of-you-vote-for-authentic-thai-silk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="facebook_osp"
        >
          <Button variant="default" size="lg">
            อ่านบทความ
          </Button>
        </a>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="lg">
              กติกาการโหวต
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full font-prompt">
            <DialogHeader className="!text-left">
              <DialogTitle>
                กติกาการร่วมโหวตกิจกรรม The Old Siam: We're Proud of You
              </DialogTitle>
              <DialogDescription>
                <ul className="list-decimal pl-4 text-sm">
                  {RULES_LIST.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
