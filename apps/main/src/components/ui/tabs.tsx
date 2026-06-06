"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: Array<{ value: string; label: string; content: React.ReactNode }>;
  defaultValue?: string;
  className?: string;
}) {
  const [value, setValue] = React.useState(defaultValue ?? tabs[0]?.value);

  return (
    <div className={className}>
      <div className="inline-flex rounded-md border bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
              value === tab.value && "bg-background text-foreground shadow-sm",
            )}
            onClick={() => setValue(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs.find((tab) => tab.value === value)?.content}</div>
    </div>
  );
}
