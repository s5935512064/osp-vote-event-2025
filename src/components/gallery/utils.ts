import type { Dimensions, DeviceType, GalleryImage } from "./types";

export const getDeviceType = (width: number): DeviceType => {
  if (width <= 640) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
};

export const getViewportDimensions = (): Dimensions => {
  if (typeof window === "undefined") {
    return { width: 1200, height: 800 };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width: Math.max(width - 40, 320),
    height: Math.max(height - 40, 400),
  };
};

export const getScreenSizeCategory = (
  width: number,
  height: number
): "small" | "medium" | "large" | "xlarge" => {
  const area = width * height;
  const aspectRatio = width / height;
  const isUltrawide = aspectRatio > 2.3;

  if (area < 1366 * 768) return "small";
  if (area < 1920 * 1080) return "medium";
  if (area < 2560 * 1440 || isUltrawide) return "large";
  return "xlarge";
};

export const getResponsiveImageSizes = (
  containerWidth: number,
  containerHeight: number = 800
) => {
  const screenCategory = getScreenSizeCategory(containerWidth, containerHeight);

  const baseSizes = {
    xlarge: { width: 320, height: 400 },
    large: { width: 240, height: 300 },
    medium: { width: 200, height: 250 },
    small: { width: 160, height: 200 },
  };

  const area = containerWidth * containerHeight;
  const aspectRatio = containerWidth / containerHeight;

  const baseScaleFactors = {
    small: 1.0,
    medium: 1.2,
    large: 1.5,
    xlarge: 1.8,
  };

  let aspectMultiplier = 1.0;
  if (aspectRatio > 2.0) {
    aspectMultiplier = 1.15;
  } else if (aspectRatio < 1.5) {
    aspectMultiplier = 0.9;
  }

  let areaMultiplier = 1.0;
  if (area > 3840 * 2160) {
    areaMultiplier = 1.3;
  } else if (area > 5120 * 1440) {
    areaMultiplier = 1.2;
  }

  const finalScaleFactor =
    baseScaleFactors[screenCategory] * aspectMultiplier * areaMultiplier;

  return {
    xlarge: {
      width: Math.round(baseSizes.xlarge.width * finalScaleFactor),
      height: Math.round(baseSizes.xlarge.height * finalScaleFactor),
    },
    large: {
      width: Math.round(baseSizes.large.width * finalScaleFactor),
      height: Math.round(baseSizes.large.height * finalScaleFactor),
    },
    medium: {
      width: Math.round(baseSizes.medium.width * finalScaleFactor),
      height: Math.round(baseSizes.medium.height * finalScaleFactor),
    },
    small: {
      width: Math.round(baseSizes.small.width * finalScaleFactor),
      height: Math.round(baseSizes.small.height * finalScaleFactor),
    },
  } as const;
};

export const getImageDimensions = (
  size: GalleryImage["size"],
  scale: number = 1,
  containerWidth: number = 1200,
  containerHeight: number = 800
): Dimensions => {
  const responsiveSizes = getResponsiveImageSizes(
    containerWidth,
    containerHeight
  );
  const config = responsiveSizes[size];
  return {
    width: config.width * scale,
    height: config.height * scale,
  };
};
