"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "home" },
  { href: "/styleguide", label: "styleguide" },
];

const SOURCE_URL = "https://github.com/erikparr/agent-viz";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Site"
      className="fixed top-4 right-4 z-40 flex items-center gap-3 px-3 py-1.5 bg-bg-surface/85 backdrop-blur-sm border border-border-muted text-[10px] font-mono"
    >
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary transition-colors"
            }
          >
            {active ? `[${item.label}]` : item.label}
          </Link>
        );
      })}
      <span className="text-border-muted" aria-hidden>
        ·
      </span>
      <a
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        className="text-text-secondary hover:text-text-primary transition-colors"
      >
        src ↗
      </a>
    </nav>
  );
}
