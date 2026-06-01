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

function Divider() {
  return <div className="w-px bg-border-muted self-stretch" aria-hidden />;
}

export function SiteNav() {
  const pathname = usePathname();
  const [theme, toggleTheme] = useTheme();

  return (
    <nav
      aria-label="Site"
      className="absolute top-4 right-4 z-10 flex items-stretch bg-bg-surface/85 backdrop-blur-sm border border-border-muted text-[10px] font-mono"
    >
      {/* Segment: nav links */}
      <div className="flex items-center gap-4 px-4 py-2">
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
      </div>

      <Divider />

      {/* Segment: theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="flex items-center gap-4 px-4 py-2 hover:bg-bg-elevated/50 transition-colors focus-visible:outline-none focus-visible:bg-bg-elevated/50"
      >
        <span
          className={
            theme === "dark" ? "text-text-primary" : "text-text-secondary"
          }
        >
          {theme === "dark" ? "[dark]" : "dark"}
        </span>
        <span
          className={
            theme === "light" ? "text-text-primary" : "text-text-secondary"
          }
        >
          {theme === "light" ? "[light]" : "light"}
        </span>
      </button>

      <Divider />

      {/* Segment: source */}
      <a
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        className="flex items-center px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        src ↗
      </a>
    </nav>
  );
}
