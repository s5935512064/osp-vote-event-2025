// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Google Analytics configuration
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "";

// Log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events happening
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track vote events
export const trackVote = (imageId: string, imageName: string) => {
  event({
    action: "vote",
    category: "gallery",
    label: `${imageId}-${imageName}`,
  });
};

// Track image view
export const trackImageView = (imageId: string, imageName: string) => {
  event({
    action: "view_image",
    category: "gallery",
    label: `${imageId}-${imageName}`,
  });
};
