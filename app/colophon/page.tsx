import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon — Erik Parr",
  description: "How this site is built, what's in it, and what it's for.",
};

const STACK = [
  ["Next.js", "16.2", "App Router, Turbopack, RSC"],
  ["React", "19.2", "Server + client components"],
  ["Tailwind CSS", "v4", "Token-first via @theme + runtime CSS vars"],
  ["TypeScript", "5.9", "Strict mode"],
  ["Geist Mono", "—", "Monospace, Vercel"],
  ["Anthropic SDK", "0.80", "Streaming agent backend"],
  ["framer-motion", "12", "Modal / step / tab transitions"],
  ["three.js", "0.183", "Dither + FOAM 3D logo"],
];

const SOURCES = [
  ["Source", "github.com/erikparr/agent-viz", "https://github.com/erikparr/agent-viz"],
  ["Design tokens (Figma)", "Agent-viz Design System", "https://www.figma.com/design/5Q7sbK0JzshkjmOZVaHV61"],
  ["Live styleguide", "/styleguide", "/styleguide"],
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-border-accent border-b border-border-muted pb-2">
        {title}
      </h2>
      <div className="text-xs leading-relaxed text-text-primary">{children}</div>
    </section>
  );
}

export default function ColophonPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-2xl text-text-primary">Colophon</h1>
          <p className="text-xs text-text-secondary">
            How this site is built, what&rsquo;s in it, and what it&rsquo;s for.
          </p>
        </header>

        <Section title="About">
          <p>
            This is a portfolio site that doubles as its own design system case
            study. The agent answers questions about my work; the chrome around
            it is built from a small set of primitives I extracted as I went.
            Every visible decision — tokens, components, typography, motion — is
            documented in the{" "}
            <Link
              href="/styleguide"
              className="text-border-accent hover:text-text-primary transition-colors"
            >
              live styleguide
            </Link>
            .
          </p>
        </Section>

        <Section title="Stack">
          <ul className="space-y-1.5 font-mono">
            {STACK.map(([name, version, note]) => (
              <li key={name} className="grid grid-cols-[10rem_4rem_1fr] gap-3 text-[11px]">
                <span className="text-text-primary">{name}</span>
                <span className="text-text-secondary tabular-nums">{version}</span>
                <span className="text-text-secondary">{note}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Design system">
          <p className="mb-3">
            Tokens live in <code className="text-border-accent">app/globals.css</code> using
            Tailwind v4&rsquo;s <code className="text-border-accent">@theme</code> block, then
            indirected through runtime CSS variables so light and dark modes
            share one source of truth. Primitives live in{" "}
            <code className="text-border-accent">components/ui/</code> with a strict rule: a
            component only earns a spot here if it&rsquo;s used in 2+ places, has no domain
            knowledge, and composes via <code className="text-border-accent">children</code>.
          </p>
          <p>
            The same tokens are mirrored as Figma Variables (one-way sync, code
            → Figma) so designs in Figma stay aligned with what ships. Five
            collections, 43 variables. The contract is the system.
          </p>
        </Section>

        <Section title="Build approach">
          <p>
            Built incrementally with{" "}
            <a
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-border-accent hover:text-text-primary transition-colors"
            >
              Claude Code
            </a>{" "}
            as the orchestration layer — pair-programming the design system into
            existence one extraction at a time. No frameworks beyond Next.js,
            Tailwind, and a handful of well-chosen libraries. No Storybook
            (deliberate: this site&rsquo;s styleguide IS the docs).
          </p>
        </Section>

        <Section title="Sources">
          <ul className="space-y-1.5 font-mono">
            {SOURCES.map(([label, display, href]) => {
              const external = href.startsWith("http");
              return (
                <li key={label} className="grid grid-cols-[10rem_1fr] gap-3 text-[11px]">
                  <span className="text-text-secondary">{label}</span>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-border-accent transition-colors"
                    >
                      {display} ↗
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-text-primary hover:text-border-accent transition-colors"
                    >
                      {display}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>

        <footer className="border-t border-border-muted pt-4 text-[10px] text-text-secondary">
          <p>
            Erik Parr · Design Engineer · designs &amp; engineers from prototype
            to production · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
