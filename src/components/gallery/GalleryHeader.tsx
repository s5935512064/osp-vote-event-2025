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
import { motion } from "framer-motion";
import { RULES_LIST } from "./constants";
import type { DeviceType } from "./types";
import eventLogo from "../../assets/5.webp";

import { TableOfContents, Vote } from "lucide-react";
interface GalleryHeaderProps {
  deviceType: DeviceType;
}

export function GalleryHeader({ deviceType }: GalleryHeaderProps) {
  const campaignName = "WE'RE PROUD OF YOU";

  if (deviceType === "desktop") {
    return (
      <div className="text-white w-fit shrink-0 flex flex-col gap-2 items-center justify-center leading-none  p-4 rounded-2xl h-fit ">
        <SparklesText className=" text-3xl md:text-5xl lg:text-7xl font-permanent-marker text-center text-nowrap drop-shadow-2xl">
          {/* {campaignName} */}
          <div className="w-full max-w-xl relative">
            <motion.img
              src={
                "https://assets-manager.ssdapp.net/public/file/f6p3fil1k6bjzxz9ckdig5hw"
              }
              alt="Event Logo"
              className="w-full  object-contain"
            />
          </div>
        </SparklesText>

        <p className="text-center text-sm md:text-base font-prompt max-w-xl drop-shadow-2xl -mt-2">
          ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน{" "}
          <span className="text-nowrap">ดิ โอลด์ สยาม พลาซ่า</span>{" "}
          เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย
        </p>

        <div className="flex items-center justify-center gap-2">
          <a
            href="https://theoldsiam.co.th/en/blogs/the-old-siam-were-proud-of-you-vote-for-authentic-thai-silk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="facebook_osp"
          >
            <Button
              variant="default"
              className="relative  rainbow-gradient hover:scale-105 transition-all duration-300"
            >
              <TableOfContents className="w-4 h-4" />
              อ่านบทความ
            </Button>
          </a>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="relative  rainbow-gradient hover:scale-105 transition-all duration-300"
              >
                <Vote className="w-4 h-4" />
                กติกาการโหวต
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full font-prompt !max-h-[calc(100vh-50px)] overflow-y-auto">
              <DialogHeader className="text-left">
                <DialogTitle>
                  กติกาการร่วมโหวตกิจกรรม The Old Siam: We're Proud of You
                </DialogTitle>
                <DialogDescription asChild>
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
        } font-prompt max-w-lg -mt-2`}
      >
        ร่วมโหวตความงามของชุดผ้าไหมไทยภายใน{" "}
        <span className="text-nowrap">ดิ โอลด์ สยาม พลาซ่า</span>{" "}
        เพื่อสนับสนุนเอกลักษณ์ และอนุรักษ์สมบัติทางวัฒนธรรมไทย
      </p>

      <div className="flex items-center justify-center gap-2">
        <a
          href="https://theoldsiam.co.th/en/blogs/the-old-siam-were-proud-of-you-vote-for-authentic-thai-silk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="facebook_osp"
        >
          <Button
            variant="default"
            className="relative  rainbow-gradient hover:scale-105 transition-all duration-300"
          >
            <TableOfContents className="w-4 h-4" />
            อ่านบทความ
          </Button>
        </a>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="relative  rainbow-gradient hover:scale-105 transition-all duration-300"
            >
              <Vote className="w-4 h-4" />
              กติกาการโหวต
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full font-prompt !max-h-[calc(100vh-50px)]  overflow-y-auto">
            <DialogHeader className="!text-left">
              <DialogTitle>
                กติกาการร่วมโหวตกิจกรรม The Old Siam: We're Proud of You
              </DialogTitle>
              <DialogDescription asChild>
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
