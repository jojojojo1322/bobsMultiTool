import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = React.useId();

  return (
    <textarea
      id={id ?? generatedId}
      className={cn(
        "flex min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-colors",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
