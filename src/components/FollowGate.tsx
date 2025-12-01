// src/components/FollowGate.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

// --- CONFIG ---
const FB_PAGE_ID = "285237088323824";
const FB_PAGE_URL = "https://www.facebook.com/Theoldsiamshoppingplaza";

// --- HOOK: สำหรับเรียกใช้ Logic ---
export const useFollowGate = () => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // ฟังก์ชันหลักที่ใช้ครอบปุ่มต่างๆ
  const gateKeeper = (actionFn: () => void) => {
    if (isFollowed) {
      actionFn();
    } else {
      setPendingAction(() => actionFn); // เก็บ function ไว้ทำทีหลัง
      setIsOpen(true); // เปิด Modal
    }
  };

  // Logic การเปิด Facebook และเช็คเมื่อกลับมา
  const handleOpenFacebook = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isFBApp = /FBAN|FBAV/i.test(navigator.userAgent);

    if (isMobile || isFBApp) {
      window.location.href = `fb://page/${FB_PAGE_ID}`;
      setTimeout(() => {
        if (!document.hidden) window.open(FB_PAGE_URL, "_blank");
      }, 500);
    } else {
      window.open(FB_PAGE_URL, "_blank");
    }

    // รอจับ Event เมื่อกลับมาหน้าเว็บ
    const checkReturn = () => {
      if (document.visibilityState === "visible") {
        setIsFollowed(true);
        setIsOpen(false);

        // Run action ที่ค้างไว้
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }

        Swal.fire({
          icon: "success",
          title: "ขอบคุณที่ติดตาม!",
          timer: 1500,
          showConfirmButton: false,
        });
        document.removeEventListener("visibilitychange", checkReturn);
      }
    };
    document.addEventListener("visibilitychange", checkReturn);
  };

  return {
    isOpen,
    setIsOpen,
    gateKeeper,
    handleOpenFacebook,
  };
};

// --- COMPONENT: ตัว Modal แสดงผล ---
interface FollowGateModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  handleOpenFacebook: () => void;
}

export const FollowGateModal = ({
  isOpen,
  setIsOpen,
  handleOpenFacebook,
}: FollowGateModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>

            <div className="mb-4 mt-2 flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ติดตามเพจเพื่อดาวน์โหลด
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              กรุณากดติดตามเพจ <b>The Old Siam Plaza</b>{" "}
              เพื่อรับสิทธิ์ดาวน์โหลดรูปภาพฟรี!
            </p>

            <div className="space-y-3">
              <button
                onClick={handleOpenFacebook}
                className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-transform active:scale-95"
              >
                <span>👍 ไปกดติดตามเพจ</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 text-xs hover:text-gray-600 underline mt-2"
              >
                ไว้คราวหลัง
              </button>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400">
                *ระบบจะปลดล็อกอัตโนมัติเมื่อกลับมาหน้านี้
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
