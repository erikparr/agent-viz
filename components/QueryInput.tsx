"use client";

import { useState, useCallback } from "react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

const PRESET_QUERIES = [
  "Compare the AI strategies of Apple and Google",
  "What are the top 3 most populated cities in Europe?",
  "Find recent breakthroughs in quantum computing",
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
      {/* Terminal prompt input */}
      <div className="flex items-center gap-2 bg-[var(--color-bg-surface)] px-3 py-2 border border-[var(--color-border-muted)] rounded-sm">
        <span className="text-[var(--color-border-accent)] font-bold select-none">&gt;</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter a research query..."
          disabled={disabled}
          className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none text-sm"
        />
        {!disabled && value.trim() && (
          <span className="cursor-blink text-[var(--color-border-accent)]">_</span>
        )}
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="text-xs px-2 py-1 bg-[var(--color-border-accent)] text-black font-bold disabled:opacity-30 hover:brightness-110 transition-all"
        >
          RUN
        </button>
      </div>

      {/* Preset queries */}
      <div className="flex flex-wrap gap-2">
        {PRESET_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => {
              setValue(q);
              if (!disabled) onSubmit(q);
            }}
            disabled={disabled}
            className="text-xs px-2 py-1 border border-[var(--color-border-muted)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-accent)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-30"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
