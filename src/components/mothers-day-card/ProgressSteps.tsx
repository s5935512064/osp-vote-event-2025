import React from "react";
import { Heart, Sparkles, Flower2 } from "lucide-react";
import { type StepType } from "./types";

interface ProgressStepsProps {
  currentStep: StepType;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
}) => {
  const steps = [
    { id: "select", label: "เลือกการ์ด", icon: Heart },
    { id: "customize", label: "ปรับแต่ง", icon: Sparkles },
    { id: "preview", label: "ดาวน์โหลดการ์ด", icon: Flower2 },
  ];

  return (
    <div className="flex justify-center items-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted =
            steps.findIndex((s) => s.id === currentStep) > index;
          const IconComponent = step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-[#0a3254] text-white scale-110"
                      : isCompleted
                      ? "bg-[#0a3254]/50 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <IconComponent size={20} />
                </div>
                <span
                  className={`text-xs sm:text-sm mt-2 transition-colors text-center whitespace-nowrap duration-300 ${
                    isActive ? "text-[#0a3254] font-semibold" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 transition-colors duration-300 ${
                    isCompleted ? "bg-[#0a3254]/50" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
