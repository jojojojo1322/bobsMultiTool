import * as React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      className={cn("border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80", className)}
      {...props}
    />
  );
}
