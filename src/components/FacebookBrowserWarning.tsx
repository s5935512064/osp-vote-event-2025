import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, AlertTriangle, Smartphone } from "lucide-react";
import { detectBrowser, openInExternalBrowser } from "@/lib/browserDetection";

interface FacebookBrowserWarningProps {
  showAlways?: boolean;
  className?: string;
}

export function FacebookBrowserWarning({
  showAlways = false,
  className = "",
}: FacebookBrowserWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [browserInfo, setBrowserInfo] = useState(detectBrowser());
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const info = detectBrowser();
    setBrowserInfo(info);

    // เช็คว่าผู้ใช้เคย dismiss ไปแล้วหรือไม่
    const dismissed = localStorage.getItem("fb_browser_warning_dismissed");

    if (info.isFacebookBrowser || info.isInstagramBrowser || showAlways) {
      setIsVisible(true);
    }
  }, [showAlways]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("fb_browser_warning_dismissed", "true");
  };

  const handleOpenExternal = () => {
    openInExternalBrowser();
    handleDismiss();
  };

  const getBrowserName = () => {
    if (browserInfo.isFacebookBrowser) return "Facebook";
    if (browserInfo.isInstagramBrowser) return "Instagram";
    return "In-App Browser";
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            {/* <motion.button
              onClick={handleDismiss}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 hover:bg-white/20 rounded-full transition-colors absolute top-0 right-0"
            >
              <X className="w-4 h-4" />
            </motion.button> */}
            <div className="flex flex-col items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    คุณกำลังใช้ {getBrowserName()} Browser
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    ทำให้ฟังก์ชันโหวต ไลค์ หรือแชร์ไม่สามารถใช้งานได้
                    กรุณาเปิดใน Chrome, Safari หรือ Browser ปกติ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center ">
                <motion.button
                  onClick={handleOpenExternal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-center "
                >
                  <ExternalLink className="w-3 h-3" />
                  เปิดใน Browser
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Modal version สำหรับใช้เมื่อมีปัญหาการทำงาน
export function FacebookBrowserModal({
  isOpen,
  onClose,
  title = "เพื่อประสบการณ์ที่ดีกว่า",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}) {
  const browserInfo = detectBrowser();

  const handleOpenExternal = () => {
    openInExternalBrowser();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
            <Smartphone className="w-12 h-12 mx-auto mb-3 text-white/90" />
            <h3 className="text-lg font-bold">{title}</h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-3">
              <p className="text-gray-600 leading-relaxed">
                คุณกำลังใช้{" "}
                <span className="font-semibold text-blue-600">
                  {getBrowserName(browserInfo)} Browser
                </span>
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>ปัญหาที่อาจพบ:</strong>
                </p>
                <ul className="text-xs text-amber-700 mt-1 space-y-1">
                  <li>• การโหวตไม่ทำงาน</li>
                  <li>• การกดไลค์ไม่ตอบสนอง</li>
                  <li>• การแชร์มีปัญหา</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500">
                เพื่อประสบการณ์การใช้งานที่ดีที่สุด กรุณาเปิดหน้านี้ใน:
              </p>

              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Chrome
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Safari
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Edge
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <motion.button
                onClick={handleOpenExternal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                เปิดใน Browser ปกติ
              </motion.button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all"
              >
                ดำเนินการต่อ (อาจมีปัญหา)
              </motion.button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              แนะนำให้เปิดใน Browser ปกติเพื่อการใช้งานที่สมบูรณ์
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper function
function getBrowserName(browserInfo: ReturnType<typeof detectBrowser>) {
  if (browserInfo.isFacebookBrowser) return "Facebook";
  if (browserInfo.isInstagramBrowser) return "Instagram";
  return "In-App";
}
