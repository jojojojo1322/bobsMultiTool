"use client";

import * as React from "react";

export function PointerBackground() {
  const ref = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<number | null>(null);
  const targetRef = React.useRef({ x: 50, y: 50 });
  const renderedRef = React.useRef({ x: 50, y: 50 });

  React.useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const writePointerVariables = (x: number, y: number) => {
      element.style.setProperty("--bobob-pointer-x", `${x}%`);
      element.style.setProperty("--bobob-pointer-y", `${y}%`);
      element.style.setProperty("--bobob-grid-x", `${(x - 50) * -0.18}px`);
      element.style.setProperty("--bobob-grid-y", `${(y - 50) * -0.18}px`);
      element.style.setProperty("--bobob-parallax-x", `${(x - 50) * -0.05}px`);
      element.style.setProperty("--bobob-parallax-y", `${(y - 50) * -0.05}px`);
      element.style.setProperty("--bobob-sweep-x", `${(x - 50) * 0.08}px`);
      element.style.setProperty("--bobob-sweep-y", `${(y - 50) * 0.08}px`);
      element.style.setProperty("--bobob-ray-rotation", `${(x - 50) * 0.012}deg`);
    };

    const animatePointer = () => {
      const target = targetRef.current;
      const rendered = renderedRef.current;
      const nextX = rendered.x + (target.x - rendered.x) * 0.18;
      const nextY = rendered.y + (target.y - rendered.y) * 0.18;

      renderedRef.current = { x: nextX, y: nextY };
      writePointerVariables(nextX, nextY);

      const xDone = Math.abs(target.x - nextX) < 0.04;
      const yDone = Math.abs(target.y - nextY) < 0.04;
      if (xDone && yDone) {
        renderedRef.current = target;
        writePointerVariables(target.x, target.y);
        frameRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(animatePointer);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      targetRef.current = {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      };

      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(animatePointer);
      }
    };

    writePointerVariables(50, 50);
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
