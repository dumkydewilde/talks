// MotherDuck brand design tokens shared across every talk built on the framework.
// Colors and fonts mirror the modern-brutalism MotherDuck identity.

export const TOKENS = {
  color: {
    sand: "#F4EFEA",
    ink: "#383838",
    white: "#FFFFFF",
    codeHeader: "#ECE5DD",
    duck: "#FF9538",
    sun: "#FFDE00",
    garden: "#16AA98",
    watermelon: "#FF7169",
    sky: "#6FC2FF",
    muted: "#888888",
    mutedDark: "#A8A8A8",
    rule: "#D6CDBE",
  },
  font: {
    aeonik: "'Aeonik Mono', 'Cousine', ui-monospace, Menlo, monospace",
    inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Cousine', ui-monospace, Menlo, monospace",
  },
} as const;

/** Brand palette names usable in frontmatter (e.g. `leftColor: sky`). */
export type ColorName =
  | "sand" | "ink" | "white" | "duck" | "sun" | "garden" | "watermelon" | "sky";

/** Resolve a palette name to its CSS custom property. Falls back to sand. */
export function paletteVar(name?: string): string {
  if (!name) return "var(--sand)";
  const known: Record<string, string> = {
    sand: "var(--sand)", ink: "var(--ink)", white: "var(--white)",
    duck: "var(--duck)", sun: "var(--sun)", garden: "var(--garden)",
    watermelon: "var(--watermelon)", sky: "var(--sky)",
  };
  return known[name] ?? name; // allow raw CSS values too
}
