import * as React from "react";
import { cn } from "@/lib/utils";

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
