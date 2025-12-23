import { useState, useEffect } from 'react';

/**
 * Calculate the scale factor for a container to match a background image with object-fit: cover
 *
 * @param imageWidth - Original width of the background image
 * @param imageHeight - Original height of the background image
 * @returns The scale factor to apply to keep content in sync with the background
 */
export function useBackgroundScale(imageWidth: number, imageHeight: number): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate how object-fit: cover scales the background image
      // It scales to the larger of width-ratio or height-ratio to ensure full coverage
      const widthRatio = viewportWidth / imageWidth;
      const heightRatio = viewportHeight / imageHeight;

      // object-fit: cover uses the larger ratio to ensure the image covers the container
      const backgroundScale = Math.max(widthRatio, heightRatio);

      setScale(backgroundScale);
    };

    // Calculate on mount
    calculateScale();

    // Recalculate on window resize
    window.addEventListener('resize', calculateScale);

    // Cleanup
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [imageWidth, imageHeight]);

  return scale;
}
