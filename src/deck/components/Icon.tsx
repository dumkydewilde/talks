// Icons. Two sources:
//   <Icon name="hybrid" />        → duck/brand SVG from public/duck-icons
//   <Icon name="fa:linkedin" />   → Font Awesome glyph (react-icons), see fa-icons.tsx
import * as React from "react";
import { FA_ICONS } from "./fa-icons";

const DUCK_ICONS: Record<string, string> = {
  extract: "duck-icons/extract.svg",
  correct: "duck-icons/correct.svg",
  observe: "duck-icons/observe.svg",
  compile: "duck-icons/compile.svg",
  wrap: "duck-icons/wrap.svg",
  evaluate: "duck-icons/evaluate.svg",
  promote: "duck-icons/promote.svg",
  operate: "duck-icons/operate.svg",
  mcp: "duck-icons/mcp.svg",
  hybrid: "duck-icons/hybrid.svg",
  perUser: "duck-icons/per-user-db.svg",
  "per-user-db": "duck-icons/per-user-db.svg",
  dives: "duck-icons/dives.svg",
};

export function Icon({ name, size = 80, color }: { name: string; size?: number; color?: string }) {
  if (name.startsWith("fa:")) {
    const Fa = FA_ICONS[name.slice(3)];
    if (!Fa) {
      if (import.meta.env.DEV) console.warn(`<Icon name="${name}"> not in the Font Awesome set.`);
      return null;
    }
    return <Fa size={size} color={color} />;
  }
  const src = DUCK_ICONS[name];
  if (!src) {
    if (import.meta.env.DEV) console.warn(`<Icon name="${name}"> not found in icon set.`);
    return null;
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}${src}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: "block", width: size, height: size, objectFit: "contain" }}
    />
  );
}
