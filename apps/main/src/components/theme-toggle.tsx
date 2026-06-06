"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ClientDictionary } from "@/features/i18n/dictionaries";

export function ThemeToggle({ dictionary }: { dictionary: ClientDictionary }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const value = mounted ? theme ?? "system" : "system";

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="sr-only">{dictionary.nav.theme}</span>
      <Button variant="ghost" size="icon" aria-label={dictionary.nav.theme} onClick={() => setTheme(value === "dark" ? "light" : "dark")}>
        {value === "light" ? <Sun className="h-4 w-4" /> : value === "dark" ? <Moon className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
      </Button>
      <Select
        value={value}
        onChange={(event) => setTheme(event.target.value)}
        className="h-8 w-28"
        aria-label={dictionary.nav.theme}
      >
        <option value="system">{dictionary.theme.system}</option>
        <option value="light">{dictionary.theme.light}</option>
        <option value="dark">{dictionary.theme.dark}</option>
      </Select>
    </label>
  );
}
