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
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  campaignData?: CampaignDataResponse | null;
}

export function GalleryHeader({
  deviceType,
  layoutMode,
  setLayoutMode,
  campaignData,
}: GalleryHeaderProps) {
  const campaignName = campaignData?.campaign.name || "WE'RE PROUD OF YOU";

  if (deviceType === "desktop") {
    return (
      <div className="text-white w-fit shrink-0 flex flex-col gap-2 items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 leading-none bg-accent-foreground/15 p-4 rounded-2xl shadow-2xl">
        <SparklesText className="text-3xl md:text-5xl lg:text-7xl font-permanent-marker text-center text-nowrap drop-shadow-2xl">
          {campaignName}
        </SparklesText>
        <p className="text-center text-sm md:text-base font-prompt max-w-lg drop-shadow-2xl">
          ร่วมโหวต "ผ้าไหมไทยผ่านความภาคภูมิใจของ ดิ โอลด์ สยาม"
          และส่งต่อพลังแห่งความเท่าเทียม ความเข้าใจ และความรักในความเป็นตัวเอง
        </p>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="default"
            size="lg"
            onClick={() =>
              setLayoutMode(layoutMode === "scattered" ? "grid" : "scattered")
            }
          >
            {layoutMode === "grid" ? "โชว์แบบกระจาย" : "โชว์แบบตาราง"}
          </Button>

          <Button variant="default" size="lg">
            อ่านบทความ
          </Button>

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
        ร่วมโหวต "ชุดผ้าไหมไทย" ที่คุณชอบที่สุด
        ในเดือนแห่งความหลากหลายและความภาคภูมิใจ
      </p>
      {campaignData && (
        <p className="text-center text-xs text-white/80">
          {campaignData.stats.totalSubmissions} รายการ |{" "}
          {campaignData.stats.totalVotes} โหวต
        </p>
      )}

      <div className="flex items-center justify-center gap-2">
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
