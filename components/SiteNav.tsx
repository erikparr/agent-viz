"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "home" },
  { href: "/styleguide", label: "styleguide" },
];

const SOURCE_URL = "https://github.com/erikparr/agent-viz";

type Theme = "dark" | "light";

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark"
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  return [theme, toggle];
}

export function SiteNav() {
  const pathname = usePathname();
  const [theme, toggleTheme] = useTheme();

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

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-accent"
      >
        <span className={theme === "dark" ? "text-text-primary" : ""}>
          {theme === "dark" ? "[dark]" : "dark"}
        </span>
        <span className="text-border-muted" aria-hidden>
          ·
        </span>
        <span className={theme === "light" ? "text-text-primary" : ""}>
          {theme === "light" ? "[light]" : "light"}
        </span>
      </button>

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
