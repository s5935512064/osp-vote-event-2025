import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, HelpCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VoteFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  reason: string;
  customReason?: string;
}

interface VoteFormProps {
  formData: VoteFormData;
  onFormDataChange: (data: VoteFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  onPhoneChange?: (phone: string) => void;
}

const VOTE_REASONS = [
  {
    id: "attractive",
    text: "ชุดนี้ดูดีมาก ถ้าได้ใส่คงโดดเด่น สง่างามน่าดู",
  },
  {
    id: "explore",
    text: "เห็นชุดแล้วอยากไปเดินดูชุดอื่นๆที่ ดิ โอลด์ สยาม",
  },
  {
    id: "elegant",
    text: "ชุดผ้าไหมที่ ดิ โอลด์ สยาม อลังการสวยงามมาก",
  },
  {
    id: "quality",
    text: "เห็นแล้วรู้เลยว่าการตัดเย็บ คุณภาพดีมากเลยไว้ใจร้านที่ ดิ โอลด์ สยามได้เลย",
  },
  {
    id: "other",
    text: "อื่นๆ (โปรดระบุ)",
  },
];

export function VoteForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
  onPhoneChange,
}: VoteFormProps) {
  const updateFormData = (updates: Partial<VoteFormData>) => {
    const newData = { ...formData, ...updates };
    onFormDataChange(newData);

    if (updates.phone && onPhoneChange) {
      onPhoneChange(updates.phone);
    }
  };

  useEffect(() => {
    if (formData.phone && onPhoneChange) {
      onPhoneChange(formData.phone);
    }
  }, [formData.phone, onPhoneChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!formData.address) {
      alert("กรุณากรอกที่อยู่ในการติดต่อ");
      return;
    }

    if (!formData.reason) {
      alert("กรุณาเลือกเหตุผลที่ชอบชุดในภาพนี้");
      return;
    }

    if (
      formData.reason === "อื่นๆ (โปรดระบุ)" &&
      !formData.customReason?.trim()
    ) {
      alert("กรุณาระบุเหตุผลอื่นๆ");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ""))) {
      alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return;
    }

    onSubmit();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
        กรอกข้อมูลเพื่อโหวต
      </h4>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3254] focus:border-transparent"
              placeholder="ชื่อ"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            นามสกุล *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3254] focus:border-transparent"
            placeholder="นามสกุล"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เบอร์โทรศัพท์ * (10 หลัก)
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                updateFormData({ phone: value });
              }
            }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3254] focus:border-transparent"
            placeholder="0812345678"
            maxLength={10}
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          เบอร์โทรศัพท์จะใช้สำหรับตรวจสอบสิทธิ์การโหวต
        </p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ที่อยู่ในการติดต่อ *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3254] focus:border-transparent resize-none"
            placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
            rows={3}
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ระบุที่อยู่สำหรับการติดต่อและจัดส่งของรางวัล (ถ้ามี)
        </p>
      </div>

      {/* Vote Reason Question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#0a3254]" />
            <span>ทำไมคุณถึงชอบชุดในภาพนี้? *</span>
          </div>
        </label>
        <div className="space-y-3">
          {VOTE_REASONS.map((reason) => (
            <motion.label
              key={reason.id}
              className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.reason === reason.text
                  ? "border-[#0a3254] bg-[#0a3254]/5 shadow-sm"
                  : "border-gray-300 hover:border-[#0a3254]/50 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="reason"
                  value={reason.text}
                  checked={formData.reason === reason.text}
                  onChange={(e) => updateFormData({ reason: e.target.value })}
                  className="mt-1 w-4 h-4 text-[#0a3254] border-gray-300 focus:ring-[#0a3254]"
                  required
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  {reason.text}
                </span>
              </div>
            </motion.label>
          ))}
        </div>

        {/* Custom Reason Text Area */}
        <AnimatePresence>
          {formData.reason === "อื่นๆ (โปรดระบุ)" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <textarea
                value={formData.customReason || ""}
                onChange={(e) =>
                  updateFormData({ customReason: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3254] focus:border-transparent resize-none"
                placeholder="โปรดระบุเหตุผลที่คุณชอบชุดในภาพนี้..."
                rows={3}
                required={formData.reason === "อื่นๆ (โปรดระบุ)"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-[#0a3254] hover:bg-[#0a3254]/90 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "กำลังส่งโหวต..." : "ยืนยันการโหวต"}
        </motion.button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="py-3 px-6 h-full"
          disabled={isSubmitting}
        >
          ยกเลิก
        </Button>
      </div>
    </motion.form>
  );
}
