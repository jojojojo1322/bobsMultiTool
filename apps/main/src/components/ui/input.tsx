import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", id, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = React.useId();

  return (
    <input
      id={id ?? generatedId}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
