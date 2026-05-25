"use client";

import { useEffect, useState } from "react";
import { TerminalChrome } from "@/components/ui/TerminalChrome";
import { Modal } from "@/components/ui/Modal";
import { Button, ButtonLink } from "@/components/ui/Button";

const SEMANTIC_COLORS = [
  { name: "bg/primary", className: "bg-bg-primary", varName: "--bg-primary" },
  { name: "bg/surface", className: "bg-bg-surface", varName: "--bg-surface" },
  { name: "bg/elevated", className: "bg-bg-elevated", varName: "--bg-elevated" },
  { name: "border/accent", className: "bg-border-accent", varName: "--border-accent" },
  { name: "border/muted", className: "bg-border-muted", varName: "--border-muted" },
  { name: "text/primary", className: "bg-text-primary", varName: "--text-primary" },
  { name: "text/secondary", className: "bg-text-secondary", varName: "--text-secondary" },
];

const STEP_COLORS = [
  { name: "step/thinking", className: "bg-step-thinking", varName: "--step-thinking" },
  { name: "step/code", className: "bg-step-code", varName: "--step-code" },
  { name: "step/tool", className: "bg-step-tool", varName: "--step-tool" },
  { name: "step/result", className: "bg-step-result", varName: "--step-result" },
  { name: "step/final", className: "bg-step-final", varName: "--step-final" },
  { name: "step/error", className: "bg-step-error", varName: "--step-error" },
];

const TYPE_RAMP = [7, 8, 9, 10, 11, 12, 13, 14, 18, 24];

const RADII = [
  { name: "xs", value: 1.5 },
  { name: "sm", value: 2 },
  { name: "md", value: 3 },
  { name: "lg", value: 4 },
  { name: "full", value: 9999 },
];

function useCssVar(varName: string) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    function read() {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      setValue(v);
    }
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [varName]);

  return value;
}

function Swatch({
  name,
  className,
  varName,
}: {
  name: string;
  className: string;
  varName: string;
}) {
  const hex = useCssVar(varName);
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`w-full aspect-square border border-border-muted ${className}`}
      />
      <div className="text-[10px] text-text-primary">{name}</div>
      <div className="text-[9px] text-text-secondary font-mono">{hex || "—"}</div>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between border-b border-border-muted pb-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-border-accent">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-[10px] text-text-secondary tabular-nums">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg" | "xl">("sm");

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl text-text-primary">Design System</h1>
          <p className="text-xs text-text-secondary">
            Live reference for the design tokens and UI primitives used across this site.
            All values are sourced from <code className="text-border-accent">app/globals.css</code> and{" "}
            <code className="text-border-accent">components/ui/</code>.
          </p>
        </header>

        {/* Foundations — Colors */}
        <Section title="Color · Semantic" count={SEMANTIC_COLORS.length}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {SEMANTIC_COLORS.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
        </Section>

        <Section title="Color · Step" count={STEP_COLORS.length}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {STEP_COLORS.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
        </Section>

        {/* Foundations — Typography */}
        <Section title="Typography" count={TYPE_RAMP.length + 1}>
          <div className="text-[10px] text-text-secondary mb-3">
            font/mono — Geist Mono
          </div>
          <div className="space-y-2">
            {TYPE_RAMP.slice().reverse().map((px) => (
              <div key={px} className="flex items-baseline gap-4 border-b border-border-muted/40 pb-2">
                <span className="text-[10px] text-text-secondary tabular-nums w-12 shrink-0">
                  size/{px}
                </span>
                <span
                  className="text-text-primary"
                  style={{ fontSize: `${px}px`, lineHeight: 1.3 }}
                >
                  The quick brown fox jumps over the lazy dog · 0123456789
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Foundations — Radii */}
        <Section title="Radius" count={RADII.length}>
          <div className="flex flex-wrap gap-6 items-end">
            {RADII.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 bg-bg-elevated border border-border-muted"
                  style={{
                    borderRadius: r.value === 9999 ? "9999px" : `${r.value}px`,
                  }}
                />
                <div className="text-[10px] text-text-primary">{r.name}</div>
                <div className="text-[9px] text-text-secondary tabular-nums">
                  {r.value === 9999 ? "full" : `${r.value}px`}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Primitives — Button */}
        <Section title="Primitive · Button">
          <p className="text-[10px] text-text-secondary mb-3">
            <code className="text-border-accent">components/ui/Button.tsx</code>
            {" — "}
            Three variants × three sizes. <code className="text-border-accent">loading</code>{" "}
            and <code className="text-border-accent">disabled</code> states.{" "}
            <code className="text-border-accent">prefix</code>/<code className="text-border-accent">suffix</code>{" "}
            slots for icons. <code className="text-border-accent">ButtonLink</code> is the{" "}
            <code className="text-border-accent">&lt;a&gt;</code> counterpart.
          </p>

          {/* Variants × Sizes grid */}
          <div className="space-y-4">
            {(["primary", "secondary", "ghost"] as const).map((variant) => (
              <div key={variant} className="space-y-2">
                <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">
                  variant={variant}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {(["xs", "sm", "md"] as const).map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      size={size}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* States */}
          <div className="mt-6 space-y-2">
            <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">
              states
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">default</Button>
              <Button variant="primary" disabled>
                disabled
              </Button>
              <Button variant="primary" loading>
                loading
              </Button>
              <Button variant="secondary" prefix={<span>→</span>}>
                with prefix
              </Button>
              <Button variant="secondary" suffix={<span>↗</span>}>
                with suffix
              </Button>
            </div>
          </div>

          {/* ButtonLink */}
          <div className="mt-6 space-y-2">
            <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">
              ButtonLink (anchor)
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="#" variant="secondary">
                internal link
              </ButtonLink>
              <ButtonLink
                href="https://vercel.com/geist/button"
                external
                variant="ghost"
                suffix={<span>↗</span>}
              >
                [external link]
              </ButtonLink>
            </div>
          </div>
        </Section>

        {/* Primitives — TerminalChrome */}
        <Section title="Primitive · TerminalChrome">
          <p className="text-[10px] text-text-secondary mb-3">
            <code className="text-border-accent">components/ui/TerminalChrome.tsx</code>
            {" — "}
            Window-style shell. Accepts <code className="text-border-accent">title</code> + children.
          </p>
          <TerminalChrome title="example title">
            <p className="text-xs text-text-primary">
              Any content goes inside. Used as the chrome for modals, panels, and the main app surface.
            </p>
          </TerminalChrome>
        </Section>

        {/* Primitives — Modal */}
        <Section title="Primitive · Modal">
          <p className="text-[10px] text-text-secondary mb-3">
            <code className="text-border-accent">components/ui/Modal.tsx</code>
            {" — "}
            Backdrop + animated container + ESC + body scroll lock + close button.
            Props: <code className="text-border-accent">open, onClose, title, size?, scrollable?, children</code>.
          </p>
          <div className="flex flex-wrap gap-2">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setModalSize(s);
                  setModalOpen(true);
                }}
                className="text-[10px] px-3 py-1.5 border border-border-muted text-text-secondary hover:border-border-accent hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none"
              >
                open size={s}
              </button>
            ))}
          </div>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={`Modal · size=${modalSize}`}
            size={modalSize}
          >
            <p className="text-xs text-text-primary">
              This is the <code className="text-border-accent">Modal</code> primitive,
              rendered at size <code className="text-border-accent">{modalSize}</code>.
            </p>
            <p className="text-[10px] text-text-secondary">
              Press <kbd className="px-1 border border-border-muted">Esc</kbd>, click outside, or use [close].
            </p>
          </Modal>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border-muted pt-4 text-[10px] text-text-secondary">
          <p>
            When adding a new primitive: it must be used in 2+ places, have no domain knowledge,
            and compose via <code className="text-border-accent">children</code> over heavy props.
            Tokens live in <code className="text-border-accent">app/globals.css</code>; mirror in Figma via{" "}
            <code className="text-border-accent">docs/superpowers/specs/2026-05-22-design-system-tokens-figma-sync-design.md</code>.
          </p>
        </footer>
      </div>
    </div>
  );
}
