"use client";

interface TerminalChromeProps {
  title?: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalChrome({
  title,
  accentColor = "var(--color-border-accent)",
  children,
  className = "",
}: TerminalChromeProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Top border with title */}
      <div className="flex items-center gap-0 text-sm" style={{ color: accentColor }}>
        <span>╭</span>
        {title && (
          <>
            <span>── </span>
            <span className="px-1">{title}</span>
            <span> ─</span>
          </>
        )}
        <span className="flex-1 overflow-hidden whitespace-nowrap">
          {"─".repeat(200)}
        </span>
        <span>╮</span>
      </div>

      {/* Content with side borders */}
      <div className="flex">
        <span className="text-sm" style={{ color: accentColor }}>│</span>
        <div className="flex-1 min-w-0 px-3 py-2">
          {children}
        </div>
        <span className="text-sm" style={{ color: accentColor }}>│</span>
      </div>

      {/* Bottom border */}
      <div className="flex items-center text-sm" style={{ color: accentColor }}>
        <span>╰</span>
        <span className="flex-1 overflow-hidden whitespace-nowrap">
          {"─".repeat(200)}
        </span>
        <span>╯</span>
      </div>
    </div>
  );
}
