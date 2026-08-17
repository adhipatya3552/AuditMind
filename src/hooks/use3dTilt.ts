import { useState, useRef, useCallback } from "react";

interface TiltOptions {
  maxRotation?: number; // degrees
  scale?: number;
  speed?: number;
}

export function use3dTilt({
  maxRotation = 10,
  scale = 1.02,
}: TiltOptions = {}) {
  const [style, setStyle] = useState<{
    transform: string;
    transition: string;
    glareX: number;
    glareY: number;
    isHovered: boolean;
  }>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxRotation;
      const rotateX = -((y - centerY) / centerY) * maxRotation;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: "transform 0.1s ease-out",
        glareX,
        glareY,
        isHovered: true,
      });
    },
    [maxRotation, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  }, []);

  return { ref, style, handleMouseMove, handleMouseLeave };
}
