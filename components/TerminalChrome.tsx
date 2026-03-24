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
    <fieldset className={`relative border border-border-accent p-0 flex flex-col max-h-[90vh] ${className}`}>
      {title && (
        <legend className={`ml-4 px-2 text-sm ${colorClass}`}>
          {title}
        </legend>
      )}
      <div className="px-4 py-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-none">
        {children}
      </div>
    </fieldset>
  );
}
