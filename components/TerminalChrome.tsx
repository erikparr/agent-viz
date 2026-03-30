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
    <fieldset className={`relative border border-border-accent p-0 max-w-full overflow-hidden ${className}`}>
      {title && (
        <legend className={`ml-4 px-2 text-sm ${colorClass}`}>
          {title}
        </legend>
      )}
      <div className="px-4 py-3 overflow-hidden">
        {children}
      </div>
    </fieldset>
  );
}
