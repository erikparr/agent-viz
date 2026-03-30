"use client";

interface TerminalChromeProps {
  title?: string;
  colorClass?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalChrome({
  title,
  colorClass = "text-border-accent",
  children,
  className = "",
}: TerminalChromeProps) {
  return (
    <div className={`relative border border-border-accent overflow-hidden ${className}`}>
      {title && (
        <div
          className={`absolute top-0 left-4 -translate-y-1/2 px-2 text-sm bg-bg-primary ${colorClass}`}
        >
          {title}
        </div>
      )}
      <div className="px-4 py-3 pt-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
