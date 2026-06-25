import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ClientDictionary } from "@/features/i18n/dictionaries";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/play", label: "Play" },
  { href: "/search", label: "Search" },
  { href: "/tools", label: "Tools" },
];

export function ContentNav({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          bobob.app
        </Link>
        <nav className="flex w-full min-w-0 items-center gap-1 overflow-x-auto sm:w-auto sm:justify-end">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <ThemeToggle dictionary={dictionary} />
        </nav>
      </div>
    </header>
  );
}
