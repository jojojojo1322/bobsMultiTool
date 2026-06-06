"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "left",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <aside
        className={cn(
          "fixed top-0 h-full w-80 border bg-background p-4 shadow-xl",
          side === "left" ? "left-0" : "right-0",
        )}
      >
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close sheet">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </aside>
    </div>
  );
}
