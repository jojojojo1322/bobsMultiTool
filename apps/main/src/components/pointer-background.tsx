"use client";

import * as React from "react";

export function PointerBackground() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--bobob-pointer-x", `${Math.max(0, Math.min(100, x))}%`);
      element.style.setProperty("--bobob-pointer-y", `${Math.max(0, Math.min(100, y))}%`);
      element.style.setProperty("--bobob-parallax-x", `${(x - 50) * -0.08}px`);
      element.style.setProperty("--bobob-parallax-y", `${(y - 50) * -0.08}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bobob-pointer-background" />
    </div>
  );
}
