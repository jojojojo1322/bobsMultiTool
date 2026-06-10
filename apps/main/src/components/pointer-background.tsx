"use client";

import * as React from "react";

export function PointerBackground() {
  const ref = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));
        element.style.setProperty("--bobob-pointer-x", `${clampedX}%`);
        element.style.setProperty("--bobob-pointer-y", `${clampedY}%`);
        element.style.setProperty("--bobob-grid-x", `${(clampedX - 50) * -0.18}px`);
        element.style.setProperty("--bobob-grid-y", `${(clampedY - 50) * -0.18}px`);
        element.style.setProperty("--bobob-parallax-x", `${(clampedX - 50) * -0.05}px`);
        element.style.setProperty("--bobob-parallax-y", `${(clampedY - 50) * -0.05}px`);
        element.style.setProperty("--bobob-sweep-x", `${(clampedX - 50) * 0.08}px`);
        element.style.setProperty("--bobob-sweep-y", `${(clampedY - 50) * 0.08}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bobob-pointer-background" />
    </div>
  );
}
