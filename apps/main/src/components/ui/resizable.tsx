"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const layoutStorageKey = "bobob:workbench-layout";
const defaultLeftWidth = 280;
const defaultRightWidth = 340;
const minLeftWidth = 220;
const minRightWidth = 280;
const minCenterWidth = 560;
const handleWidth = 8;

function clampPanelWidth(value: number, min: number, max: number) {
  return Math.max(min, Math.min(Math.round(value), max));
}

function readStoredLayout() {
  if (typeof window === "undefined") return { left: defaultLeftWidth, right: defaultRightWidth };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(layoutStorageKey) ?? "{}") as Partial<{ left: number; right: number }>;
    return {
      left: typeof parsed.left === "number" ? parsed.left : defaultLeftWidth,
      right: typeof parsed.right === "number" ? parsed.right : defaultRightWidth,
    };
  } catch {
    return { left: defaultLeftWidth, right: defaultRightWidth };
  }
}

export function ResizablePanelGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [layout, setLayout] = React.useState({ left: defaultLeftWidth, right: defaultRightWidth });
  const [activeHandle, setActiveHandle] = React.useState<"left" | "right" | null>(null);
  const panels = React.Children.toArray(children);

  React.useEffect(() => {
    setLayout(readStoredLayout());
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(layoutStorageKey, JSON.stringify(layout));
  }, [layout]);

  const updateFromPointer = React.useCallback(
    (clientX: number, handle: "left" | "right") => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const available = Math.min(rect.width, 1600);
      const maxLeft = Math.max(minLeftWidth, available - layout.right - minCenterWidth - handleWidth * 2);
      const maxRight = Math.max(minRightWidth, available - layout.left - minCenterWidth - handleWidth * 2);

      setLayout((current) => {
        if (handle === "left") {
          return {
            ...current,
            left: clampPanelWidth(clientX - rect.left, minLeftWidth, Math.max(minLeftWidth, available - current.right - minCenterWidth - handleWidth * 2)),
          };
        }
        return {
          ...current,
          right: clampPanelWidth(rect.right - clientX, minRightWidth, Math.max(minRightWidth, available - current.left - minCenterWidth - handleWidth * 2)),
        };
      });

      if (maxLeft < layout.left || maxRight < layout.right) {
        setLayout((current) => ({
          left: clampPanelWidth(current.left, minLeftWidth, maxLeft),
          right: clampPanelWidth(current.right, minRightWidth, maxRight),
        }));
      }
    },
    [layout.left, layout.right],
  );

  React.useEffect(() => {
    if (!activeHandle) return;

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateFromPointer(event.clientX, activeHandle);
    };
    const onPointerUp = () => setActiveHandle(null);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [activeHandle, updateFromPointer]);

  const nudge = React.useCallback((handle: "left" | "right", delta: number) => {
    setLayout((current) => ({
      ...current,
      [handle]: Math.max(handle === "left" ? minLeftWidth : minRightWidth, current[handle] + delta),
    }));
  }, []);

  const handleClassName = "relative hidden cursor-col-resize bg-transparent transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:block";
  const gridTemplateColumns = `${layout.left}px ${handleWidth}px minmax(${minCenterWidth}px,1fr) ${handleWidth}px ${layout.right}px`;
  const style = { "--bobob-grid-columns": gridTemplateColumns } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={cn("grid grid-cols-1 overflow-hidden lg:grid-cols-[var(--bobob-grid-columns)] lg:gap-0", className)}
      style={style}
      data-resizable-layout={`${layout.left}:${layout.right}:${minCenterWidth}`}
      {...props}
    >
      {panels[0]}
      <div
        role="separator"
        data-resizable-handle="left"
        tabIndex={0}
        aria-label="Resize left sidebar"
        className={handleClassName}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setActiveHandle("left");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") nudge("left", -20);
          if (event.key === "ArrowRight") nudge("left", 20);
        }}
      />
      {panels[1]}
      <div
        role="separator"
        data-resizable-handle="right"
        tabIndex={0}
        aria-label="Resize right sidebar"
        className={handleClassName}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setActiveHandle("right");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") nudge("right", 20);
          if (event.key === "ArrowRight") nudge("right", -20);
        }}
      />
      {panels[2]}
    </div>
  );
}

export function ResizablePanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0", className)} {...props} />;
}
