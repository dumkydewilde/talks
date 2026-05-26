// MotherDuck shape primitives. Inline SVG re-drawings of the six most-used shapes
// from `motherduck-design-illustration/assets/shapes/`. Re-drawn as SVG so they can
// scale and take arbitrary fill / stroke colors via props (the original PNGs are
// fixed-color and don't tint via CSS).
//
// Pattern spec: motherduck-design-illustration/references/shapes-catalog.md
//
// All shapes share: 3-4 px ink stroke (`stroke-width="4"` against viewBox 100),
// rounded corners where applicable, no drop shadow. Pair with an accent fill
// matching the role (sky / sun / garden / watermelon) or use `fill="none"` for
// pure outline mode (CloudOutline ships as outline by default).

import * as React from "react";

const INK = "#383838";

interface ShapeProps {
  /** Final rendered width in pixels. Height scales proportionally to the shape's viewBox aspect ratio. */
  size?: number;
  /** Solid fill color. Pass a brand token like "var(--sky)" or "var(--sun)". Use "none" for outline-only. */
  fill?: string;
  /** Stroke color. Defaults to ink. */
  stroke?: string;
  /** Stroke width relative to the viewBox (default 4 against viewBox 100, matching ~3 px at 80 px rendered size). */
  strokeWidth?: number;
  /** Optional accessibility label. If omitted the shape is decorative (`aria-hidden`). */
  ariaLabel?: string;
  /** Inline overrides. */
  style?: React.CSSProperties;
}

/* ------------------------------------------------------------------------- */
/* CloudOutline — matches `assets/shapes/cloud 1.png`. Pure outline cloud,    */
/* the only shape in the library designed as a true outline container.       */
/* Use to wrap an emphasized word.                                            */
/* ------------------------------------------------------------------------- */
export function CloudOutline({ size = 220, fill = "none", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size * (110 / 220)} viewBox="0 0 220 110"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28 75 Q12 70 12 55 Q12 35 35 32 Q40 18 60 18 Q72 18 80 26 Q95 8 120 12 Q145 16 152 36 Q165 32 180 38 Q205 46 205 65 Q205 85 180 87 Q160 88 152 80 Q140 95 118 92 Q98 90 88 80 Q75 90 60 88 Q40 86 28 75 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Oval — matches `assets/shapes/oval.png`. Horizontal ellipse, default fill  */
/* is garden. Use for confident emphasis ("yes, this one").                   */
/* ------------------------------------------------------------------------- */
export function Oval({ size = 200, fill = "var(--garden)", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size * (100 / 200)} viewBox="0 0 200 100"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="50" rx="92" ry="42" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Badge — matches `assets/shapes/badge.png`. Four-lobed rounded clover,      */
/* default fill is sky. Use as a sticker-style "look here" highlight.         */
/* ------------------------------------------------------------------------- */
export function Badge({ size = 140, fill = "var(--sky)", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M70 8
           Q92 8 95 30
           Q118 28 124 50
           Q138 60 128 80
           Q138 100 118 108
           Q112 130 88 128
           Q78 138 60 130
           Q40 138 30 122
           Q10 120 10 100
           Q-2 80 12 64
           Q4 42 26 36
           Q34 14 56 14
           Q60 8 70 8 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Decision — matches `assets/shapes/decision.png`. Slanted rounded square    */
/* (decision diamond). Default fill is sky. Use as flowchart decision node.   */
/* ------------------------------------------------------------------------- */
export function Decision({ size = 140, fill = "var(--sky)", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size * (110 / 140)} viewBox="0 0 140 110"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M70 6
           L128 50 Q138 56 128 64
           L74 102 Q70 106 66 102
           L12 64 Q2 56 12 50
           L66 8 Q70 4 74 8 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* CircleShape — matches `assets/shapes/circle.png`. Round node, default     */
/* fill is sun. Generic step / state in a flow.                               */
/* ------------------------------------------------------------------------- */
export function CircleShape({ size = 120, fill = "var(--sun)", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* SquareShape — matches `assets/shapes/square.png`. Rounded square node,     */
/* default fill is watermelon. Punchy block emphasis.                         */
/* ------------------------------------------------------------------------- */
export function SquareShape({ size = 120, fill = "var(--watermelon)", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="108" height="108" rx="10" ry="10"
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Spark — bonus, matches `assets/shapes/spark.png`. Diamond rotated 45° with */
/* rounded corners. Use for "this is new" / highlight star. Default sun.      */
/* ------------------------------------------------------------------------- */
export function Spark({ size = 100, fill = "var(--sun)", stroke = INK, strokeWidth = 4, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="22" width="56" height="56" rx="10" ry="10" transform="rotate(45 50 50)"
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Organic decoration shapes. These don't have PNG counterparts in            */
/* assets/shapes/ — the asset library is for foreground primitives            */
/* (flowchart nodes, data primitives, word encapsulators), while the          */
/* organic shapes below are for ambient page-edge decoration (the loose       */
/* outlines on motherduck.com page edges). They live here, in the same        */
/* canonical file as the asset-mirror primitives, so all brand shape          */
/* drawing is one import away.                                                */
/* ------------------------------------------------------------------------- */

/** Long horizontal bean. Use for top-left or bottom edge scatter. */
export function Bean({ size = 320, fill = "none", stroke = INK, strokeWidth = 2, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size * (140 / 320)} viewBox="0 0 320 140"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M30 78 Q12 38 70 28 Q140 18 210 26 Q290 36 300 80 Q290 122 220 122 Q150 124 90 116 Q40 110 30 78 Z"
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

/** Small soft pebble. Use as a tertiary accent in the scatter. */
export function Pebble({ size = 140, fill = "none", stroke = INK, strokeWidth = 2, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size * (100 / 140)} viewBox="0 0 140 100"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M18 50 Q14 18 60 14 Q108 14 126 38 Q138 64 118 84 Q90 96 56 90 Q24 84 18 50 Z"
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

/** Tilted teardrop / amoeba. Use for mid-edge scatter. */
export function Drop({ size = 170, fill = "none", stroke = INK, strokeWidth = 2, ariaLabel, style }: ShapeProps) {
  return (
    <svg width={size} height={size * (130 / 170)} viewBox="0 0 170 130"
         aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}
         role={ariaLabel ? "img" : undefined} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 78 Q10 38 58 22 Q108 12 142 36 Q166 62 150 96 Q124 122 78 116 Q34 112 22 78 Z"
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* EncapsulatedWord — convenience: drops a word inside a chosen shape.        */
/* Use for the brand-statement emphasis pattern.                              */
/* ------------------------------------------------------------------------- */
export function EncapsulatedWord({
  children,
  shape = "cloud",
  fill,
  color = INK,
}: {
  children: React.ReactNode;
  shape?: "cloud" | "oval" | "badge" | "square" | "spark";
  fill?: string;
  color?: string;
}) {
  const Comp = ({ cloud: CloudOutline, oval: Oval, badge: Badge, square: SquareShape, spark: Spark }[shape]) as React.FC<ShapeProps>;
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0.3em 0.6em" }}>
      <Comp
        fill={fill ?? (shape === "cloud" ? "none" : undefined)}
        size={200}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
      <span style={{ position: "relative", color, fontFamily: "var(--aeonik)", textTransform: "uppercase" }}>
        {children}
      </span>
    </span>
  );
}
