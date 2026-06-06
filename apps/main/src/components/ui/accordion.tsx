"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: Array<{ title: string; content: React.ReactNode }>;
  className?: string;
}) {
  const [open, setOpen] = React.useState(0);

  return (
    <div className={cn("divide-y rounded-md border", className)}>
      {items.map((item, index) => (
        <div key={item.title}>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
            onClick={() => setOpen(open === index ? -1 : index)}
          >
            {item.title}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open === index && "rotate-180")} />
          </button>
          {open === index ? <div className="px-4 pb-4 text-sm text-muted-foreground">{item.content}</div> : null}
        </div>
      ))}
    </div>
  );
}
