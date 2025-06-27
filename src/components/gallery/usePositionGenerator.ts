import { useCallback } from "react";
import type { Dimensions, Position, GalleryImage } from "./types";
import { getImageDimensions } from "./utils";

export const usePositionGenerator = (
  containerDimensions: Dimensions,
  images: GalleryImage[]
) => {
  const generateRandomPositions = useCallback((): Position[] => {
    const { width, height } = containerDimensions;
    const positions: Position[] = [];
    const padding = 20;
    const minDistance = 30;

    const centerX = width / 2;
    const centerY = height / 2;
    const exclusionWidth = height <= 780 ? 500 : 700;
    const exclusionHeight = height <= 780 ? 100 : 200;

    const bottomLeftExclusionWidth = 100;
    const bottomLeftExclusionHeight = 100;

    const availableZones = [
      {
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: centerY - exclusionHeight / 2 - 20,
      },
      {
        x: bottomLeftExclusionWidth + 20,
        y: centerY + exclusionHeight / 2 + 20,
        width: width - (bottomLeftExclusionWidth + 20) - padding,
        height: height - (centerY + exclusionHeight / 2 + 20) - padding,
      },
      {
        x: padding,
        y: centerY - exclusionHeight / 2,
        width: centerX - exclusionWidth / 2 - 20,
        height: exclusionHeight,
      },
      {
        x: centerX + exclusionWidth / 2 + 20,
        y: centerY - exclusionHeight / 2,
        width: width - (centerX + exclusionWidth / 2 + 20) - padding,
        height: exclusionHeight,
      },
      {
        x: padding,
        y: padding,
        width: bottomLeftExclusionWidth,
        height: height - bottomLeftExclusionHeight - 40 - padding,
      },
    ];

    const validZones = availableZones.filter(
      (zone) => zone.width > 100 && zone.height > 100
    );

    const isInExclusionZone = (
      x: number,
      y: number,
      width: number,
      height: number
    ): boolean => {
      const centerExclusionX1 = centerX - exclusionWidth / 2;
      const centerExclusionY1 = centerY - exclusionHeight / 2;
      const centerExclusionX2 = centerX + exclusionWidth / 2;
      const centerExclusionY2 = centerY + exclusionHeight / 2;

      const overlapCenter = !(
        x + width < centerExclusionX1 ||
        x > centerExclusionX2 ||
        y + height < centerExclusionY1 ||
        y > centerExclusionY2
      );

      return overlapCenter;
    };

    images.forEach((image, index) => {
      const randomScale = 0.8 + Math.random() * 0.4;
      const dimensions = getImageDimensions(
        image.size,
        randomScale,
        width,
        height
      );

      let attempts = 0;
      let position: Position = { x: 0, y: 0, scale: randomScale };
      let validPosition = false;

      while (!validPosition && attempts < 150) {
        let x, y;

        if (attempts < 100 && validZones.length > 0) {
          const zone =
            validZones[Math.floor(Math.random() * validZones.length)];
          x =
            zone.x + Math.random() * Math.max(0, zone.width - dimensions.width);
          y =
            zone.y +
            Math.random() * Math.max(0, zone.height - dimensions.height);

          const maxX = Math.max(zone.x, zone.x + zone.width - dimensions.width);
          const maxY = Math.max(
            zone.y,
            zone.y + zone.height - dimensions.height
          );

          x = Math.max(zone.x, Math.min(x, maxX));
          y = Math.max(zone.y, Math.min(y, maxY));
        } else {
          x =
            padding +
            Math.random() * Math.max(0, width - dimensions.width - padding * 2);
          y =
            padding +
            Math.random() *
              Math.max(0, height - dimensions.height - padding * 2);
        }

        x = Math.max(padding, Math.min(x, width - dimensions.width - padding));
        y = Math.max(
          padding,
          Math.min(y, height - dimensions.height - padding)
        );

        position = { x, y, scale: randomScale };

        const inExclusionZone = isInExclusionZone(
          position.x,
          position.y,
          dimensions.width,
          dimensions.height
        );

        const noCollision = positions.every((existingPos) => {
          const existingDimensions = getImageDimensions(
            images[positions.indexOf(existingPos)].size,
            existingPos.scale
          );

          const centerX1 = position.x + dimensions.width / 2;
          const centerY1 = position.y + dimensions.height / 2;
          const centerX2 = existingPos.x + existingDimensions.width / 2;
          const centerY2 = existingPos.y + existingDimensions.height / 2;

          const distance = Math.sqrt(
            Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2)
          );

          const requiredDistance = Math.max(
            (dimensions.width + existingDimensions.width) / 4 + minDistance,
            (dimensions.height + existingDimensions.height) / 4 + minDistance
          );

          return distance > requiredDistance;
        });

        validPosition = !inExclusionZone && noCollision;
        attempts++;
      }

      if (!validPosition) {
        const safeCorners = [
          { x: padding, y: padding },
          { x: width - dimensions.width - padding, y: padding },
          {
            x: width - dimensions.width - padding,
            y: height - dimensions.height - padding,
          },
        ];

        const corner = safeCorners[index % safeCorners.length];
        position = { ...corner, scale: randomScale };
      }

      positions.push(position);
    });

    return positions;
  }, [containerDimensions, images]);

  const generateCenterPositions = useCallback((): Position[] => {
    const { width, height } = containerDimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    return images.map(() => ({
      x: centerX - 100,
      y: centerY - 125,
      scale: 1,
    }));
  }, [containerDimensions, images]);

  const generateRandomZIndexes = useCallback((): number[] => {
    const baseZIndex = 10;
    const maxZIndex = 25;

    return Array.from(
      { length: images.length },
      () => baseZIndex + Math.floor(Math.random() * (maxZIndex - baseZIndex))
    );
  }, [images]);

  return {
    generateRandomPositions,
    generateCenterPositions,
    generateRandomZIndexes,
  };
};
