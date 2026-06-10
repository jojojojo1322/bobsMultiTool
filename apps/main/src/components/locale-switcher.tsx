"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { localeLabels, locales, stripLocale, withLocale, type Locale } from "@/features/i18n/config";
import type { ClientDictionary } from "@/features/i18n/dictionaries";

export function LocaleSwitcher({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ClientDictionary;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (nextLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.push(withLocale(stripLocale(pathname || "/"), nextLocale));
  };

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
      <span className="sr-only">{dictionary.nav.language}</span>
      <Button variant="ghost" size="icon" aria-label={dictionary.nav.language}>
        <Globe2 className="h-4 w-4" />
      </Button>
      <Select
        value={locale}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        className="h-8 w-28 px-2 sm:w-36 sm:px-3"
        aria-label={dictionary.nav.language}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </Select>
    </label>
  );
}
