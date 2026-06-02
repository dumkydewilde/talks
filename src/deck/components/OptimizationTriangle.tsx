// The three competing dimensions of an answer agent, drawn as a triangle: improving
// one usually trades against the others, so you optimise all three together rather than
// just buying a bigger model. Defaults to accuracy / speed / cost; pass `vertices` to
// reuse the shape. Order is [apex, bottom-left, bottom-right].
//   <OptimizationTriangle />
//   <OptimizationTriangle center="trade-offs" vertices={[…]} />
import * as React from "react";
import { paletteVar } from "../engine/tokens";

export type TriangleVertex = { label: string; sub?: string; color?: string };

const DEFAULT_VERTICES: TriangleVertex[] = [
  { label: "Accuracy", sub: "correctness", color: "garden" },
  { label: "Speed", sub: "turns to answer", color: "sky" },
  { label: "Cost", sub: "$ per question", color: "watermelon" },
];

// viewBox points for [apex, bottom-left, bottom-right]
const PTS = [
  { x: 340, y: 86 },
  { x: 96, y: 466 },
  { x: 584, y: 466 },
];
const VB = { w: 680, h: 560 };
const xp = (x: number) => `${(x / VB.w) * 100}%`;
const yp = (y: number) => `${(y / VB.h) * 100}%`;

export function OptimizationTriangle({
  vertices = DEFAULT_VERTICES,
  center,
}: {
  vertices?: TriangleVertex[];
  center?: string;
}) {
  const v = vertices.slice(0, 3);

  const labelStyle: React.CSSProperties = { position: "absolute", display: "flex", flexDirection: "column", gap: 2, maxWidth: "42%" };

  return (
    <div data-anim="pop" style={{ position: "relative", width: "min(94%, calc(54vh * 1.214), 660px)", aspectRatio: "680 / 560", margin: "0 auto" }}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
        <polygon
          points={PTS.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="var(--sun)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(-8px 8px 0 var(--ink))" }}
        />
        {/* center goal node */}
        <circle cx={VB.w / 2} cy={344} r="66" fill="var(--white)" stroke="var(--ink)" strokeWidth="2.5" />
        <text x={VB.w / 2} y={352} textAnchor="middle" fontFamily="var(--aeonik)" fontSize="22" letterSpacing="1" fill="var(--ink)">{(center ?? "The goal").toUpperCase()}</text>
        {PTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="16" fill={paletteVar(v[i]?.color)} stroke="var(--ink)" strokeWidth="2.5" />
        ))}
      </svg>

      {/* apex label */}
      <div style={{ ...labelStyle, left: "50%", top: 0, transform: "translate(-50%, -106%)", textAlign: "center", alignItems: "center" }}>
        <VertexLabel v={v[0]} />
      </div>
      {/* bottom-left label */}
      <div style={{ ...labelStyle, left: "1%", top: yp(PTS[1].y), transform: "translateY(28px)", textAlign: "left", alignItems: "flex-start" }}>
        <VertexLabel v={v[1]} />
      </div>
      {/* bottom-right label */}
      <div style={{ ...labelStyle, right: "1%", top: yp(PTS[2].y), transform: "translateY(28px)", textAlign: "right", alignItems: "flex-end" }}>
        <VertexLabel v={v[2]} />
      </div>
    </div>
  );
}

function VertexLabel({ v }: { v?: TriangleVertex }) {
  if (!v) return null;
  return (
    <>
      <span className="headline-md" style={{ lineHeight: 1, color: "var(--ink)" }}>{v.label}</span>
      {v.sub && <span className="eyebrow">{v.sub}</span>}
    </>
  );
}
