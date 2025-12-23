import { useState, useEffect } from "react";

// Background image dimensions (original size)
const BACKGROUND_IMAGE_WIDTH = 1536;
const BACKGROUND_IMAGE_HEIGHT = 1024;

/**
 * Calculate the scale factor for a container to match a background image with object-fit: cover
 *
 * @returns The scale factor to apply to keep content in sync with the background
 */
export function useBackgroundScale(): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate how object-fit: cover scales the background image
      // It scales to the larger of width-ratio or height-ratio to ensure full coverage
      const widthRatio = viewportWidth / BACKGROUND_IMAGE_WIDTH;
      const heightRatio = viewportHeight / BACKGROUND_IMAGE_HEIGHT;

      // object-fit: cover uses the larger ratio to ensure the image covers the container
      const backgroundScale = Math.max(widthRatio, heightRatio);

      setScale(backgroundScale);
    };

    // Calculate on mount
    calculateScale();

    // Recalculate on window resize
    window.addEventListener("resize", calculateScale);

    // Cleanup
    return () => {
      window.removeEventListener("resize", calculateScale);
    };
  }, []);

  return scale;
}
