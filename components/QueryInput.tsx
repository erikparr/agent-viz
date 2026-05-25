"use client";

import { useState, useCallback } from "react";
import { Button } from "./ui/Button";

interface QueryInputProps {
  onSubmit: (query: string, isPreset?: boolean) => void;
  onContact: () => void;
  disabled?: boolean;
}

const PRESET_QUERIES = [
  "Explore Erik's project portfolio",
  "Show skills & capabilities overview",
  "What is Erik's experience with AI and agentic systems?",
  "Show resume",
];

export function QueryInput({ onSubmit, onContact, disabled }: QueryInputProps) {
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
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          loading={disabled}
          className="px-4"
        >
          RUN
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_QUERIES.map((q) => (
          <Button
            key={q}
            variant="secondary"
            size="sm"
            onClick={() => {
              setValue(q);
              if (!disabled) onSubmit(q, true);
            }}
            disabled={disabled}
            className="min-h-[44px] py-2"
          >
            {q}
          </Button>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={onContact}
          disabled={disabled}
          className="min-h-[44px] py-2"
        >
          Contact Erik
        </Button>
      </div>
    </div>
  );
}
