import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, id, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = React.useId();

  return (
    <select
      id={id ?? generatedId}
      className={cn(
        "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
