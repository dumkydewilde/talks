// Duck/brand icons, served from public/duck-icons. Usage: <Icon name="hybrid" size={80} />
import * as React from "react";

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

export function Icon({ name, size = 80 }: { name: string; size?: number }) {
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
