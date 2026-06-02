// Slide shell: background variant, ambient outline scatter, corner duck-feet badge.
// Templates render their layout as children inside this shell.

import * as React from "react";
import { CloudOutline, Oval, Badge, Bean, Pebble, Drop } from "../../shared/shape-primitives";

export function DuckfeetLogo({ size = 120, fill = "var(--duck)" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size * (124 / 170)} viewBox="0 0 170 124" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.29998 86.3001C4.29998 86.3001 52 120.4 54.9 122.1C57.7 123.8 61.8 124.2 65.4 122.8C69 121.4 71.7 118.2 72.5 115C73.4 111.8 84.3 54.2001 84.3 54.2001C84.4 53.4001 84.7 51.1001 83.5 48.9001C81.8 45.9001 78 44.3001 74.6 45.3001C71.9 46.1001 70.5 48.1001 70.1 48.8001C69.5 49.9001 68.4 51.7001 66.4 53.3001C64.9 54.5001 63.4 55.2001 62.7 55.5001C56.6 58.0001 49.8 55.9001 45.9 50.9001C43.5 47.8001 39.2 46.6001 35.4 48.1001C31.6 49.6001 29.4 53.5001 29.7 57.4001C30.4 63.6001 26.9 69.8001 20.7 72.3001C17.4 73.6001 13.9 73.6001 10.8 72.6001C10.1 72.4001 7.59998 71.8001 5.09998 73.2001C1.99998 74.8001 0.399981 78.6001 1.19998 82.0001C1.79998 84.3001 3.59998 85.8001 4.29998 86.3001Z" fill={fill} />
      <path d="M83.7999 11.6002C83.7999 11.6002 100.8 67.8002 102 70.8002C103.2 73.9002 106.2 76.7002 109.9 77.8002C113.6 78.9002 117.7 78.0002 120.3 76.0002C122.9 74.0002 166.8 35.1002 166.8 35.1002C167.4 34.6002 169 32.9002 169.4 30.4002C169.9 27.0002 167.8 23.4002 164.6 22.1002C162 21.1002 159.6 21.8002 158.9 22.1002C157.8 22.6002 155.8 23.3002 153.3 23.4002C151.3 23.5002 149.8 23.1002 149 22.9002C142.7 21.1002 138.5 15.3002 138.5 9.00024C138.4 5.10024 135.8 1.50024 131.9 0.400236C127.9 -0.699764 123.8 1.00024 121.7 4.30024C118.4 9.70024 111.9 12.4002 105.5 10.6002C102.1 9.60024 99.2999 7.50024 97.4999 4.80024C96.9999 4.20024 95.3999 2.20024 92.5999 1.70024C89.1999 1.10024 85.4999 3.10024 84.0999 6.20024C82.9999 8.60024 83.5999 10.8002 83.7999 11.6002Z" fill={fill} />
    </svg>
  );
}

function DeckBadge({ variant }: { variant: "sand" | "ink" }) {
  return (
    <div className="deck-badge">
      <DuckfeetLogo size={28} fill={variant === "ink" ? "var(--muted-dark)" : "var(--ink)"} />
    </div>
  );
}

type Pos = { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string };

function place(pos: Pos, size: number, opacity: number, stroke: string, Shape: React.FC<any>) {
  return (
    <Shape size={size} fill="none" stroke={stroke} strokeWidth={2}
      style={{ position: "absolute", pointerEvents: "none", opacity, ...pos }} />
  );
}

/** Deterministic ambient scatter of 2-3 outline shapes, picked from `seed`. */
function BlobScatter({ seed = 0, dark = false }: { seed?: number; dark?: boolean }) {
  const stroke = dark ? "var(--muted-dark)" : "var(--ink)";
  const base = dark ? 0.22 : 0.3;
  const layouts: React.ReactNode[][] = [
    [
      <React.Fragment key="a">{place({ top: -55, left: -90 }, 340, base, stroke, Bean)}</React.Fragment>,
      <React.Fragment key="b">{place({ top: "38%", right: -40 }, 160, base - 0.06, stroke, Pebble)}</React.Fragment>,
      <React.Fragment key="c">{place({ bottom: -30, right: "22%" }, 220, base - 0.1, stroke, CloudOutline)}</React.Fragment>,
    ],
    [
      <React.Fragment key="a">{place({ top: -40, right: -60 }, 260, base, stroke, CloudOutline)}</React.Fragment>,
      <React.Fragment key="b">{place({ bottom: 40, left: -50 }, 200, base - 0.07, stroke, Drop)}</React.Fragment>,
      <React.Fragment key="c">{place({ top: "55%", left: "60%" }, 140, base - 0.1, stroke, Pebble)}</React.Fragment>,
    ],
    [
      <React.Fragment key="a">{place({ top: -30, left: "55%" }, 220, base, stroke, Oval)}</React.Fragment>,
      <React.Fragment key="b">{place({ bottom: -40, left: -40 }, 280, base - 0.08, stroke, Bean)}</React.Fragment>,
    ],
    [
      <React.Fragment key="a">{place({ top: 40, left: -30 }, 160, base, stroke, Pebble)}</React.Fragment>,
      <React.Fragment key="b">{place({ bottom: -20, right: -30 }, 220, base - 0.05, stroke, Badge)}</React.Fragment>,
      <React.Fragment key="c">{place({ top: "60%", right: "30%" }, 130, base - 0.12, stroke, CloudOutline)}</React.Fragment>,
    ],
  ];
  return <>{layouts[Math.abs(seed) % layouts.length]}</>;
}

export function Slide({
  variant, active, children, scatter, flush = false, badge = true,
}: {
  variant: "sand" | "ink";
  active: boolean;
  children: React.ReactNode;
  /** slide index for a stable scatter layout, or false to suppress scatter */
  scatter?: number | false;
  flush?: boolean;
  badge?: boolean;
}) {
  return (
    <div className={`slide slide--${variant} ${flush ? "slide--flush" : ""} ${active ? "active" : ""}`}>
      {scatter !== false && <BlobScatter seed={typeof scatter === "number" ? scatter : 0} dark={variant === "ink"} />}
      {children}
      {badge && <DeckBadge variant={variant} />}
    </div>
  );
}
