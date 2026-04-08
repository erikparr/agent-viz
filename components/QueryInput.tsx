"use client";

import { useState, useCallback } from "react";

interface QueryInputProps {
  onSubmit: (query: string, isPreset?: boolean) => void;
  disabled?: boolean;
}

const PRESET_QUERIES = [
  "Explore Erik's project portfolio",
  "Show skills & capabilities overview",
  "What is Erik's experience with AI and agentic systems?",
  "What tech stack does Erik work with?",
  "Describe Erik's most recent work",
  "Show resume",
];

export function QueryInput({ onSubmit, disabled }: QueryInputProps) {
  var [value, setValue] = useState("");

  var handleSubmit = useCallback(() => {
    var trimmed = value.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
    }
  }, [value, disabled, onSubmit]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-bg-surface px-3 py-2 border border-border-muted">
        <span className="text-border-accent font-bold select-none">&gt;</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ask about Erik's work..."
          disabled={disabled}
          aria-label="Portfolio query"
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary outline-none focus-visible:ring-0 text-sm"
        />
        {!disabled && value.trim() && (
          <span className="cursor-blink text-border-accent">_</span>
        )}
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="text-xs px-4 py-1.5 bg-border-accent text-black font-bold disabled:opacity-30 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-1 focus-visible:ring-offset-bg-primary transition-all"
        >
          RUN
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => {
              setValue(q);
              if (!disabled) onSubmit(q, true);
            }}
            disabled={disabled}
            className="text-xs px-3 py-2 min-h-[44px] border border-border-muted text-text-secondary hover:border-border-accent hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none transition-colors disabled:opacity-30"
          >
            {q}
          </button>
        ))}
        <a
          href="mailto:erik@erikparr.com?subject=Hello%20Erik"
          className="text-xs px-3 py-2 min-h-[44px] border border-border-accent text-border-accent hover:bg-border-accent hover:text-black focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none transition-colors inline-flex items-center"
        >
          Contact Erik
        </a>
      </div>
    </div>
  );
}
