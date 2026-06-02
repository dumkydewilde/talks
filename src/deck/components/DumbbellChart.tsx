// Min-max ("dumbbell") chart: one connecting line per row from a start value to an end
// value, an open dot at the start and a filled dot at the end, plus the delta on the
// right. Rows can be grouped by an optional `group` field. Reusable for any
// before/after comparison — defaults to the DABstep baseline→explicit-schema lift.
//
//   <DumbbellChart />                                  // DABstep default
//   <DumbbellChart rows={[{group:"A",label:"x",from:10,to:40}, …]}
//                  startLabel="Before" endLabel="After" unit="%" />
import * as React from "react";
import { paletteVar } from "../engine/tokens";

export type DumbbellRow = { group?: string; label: string; from: number; to: number };

const DABSTEP_ROWS: DumbbellRow[] = [
  { group: "Gemini Flash", label: "Hard", from: 7.2, to: 44.4 },
  { group: "Gemini Flash", label: "Easy", from: 47.8, to: 72.5 },
  { group: "Gemini Flash", label: "Overall", from: 13.9, to: 49.0 },
  { group: "Claude Opus", label: "Hard", from: 31.2, to: 59.9 },
  { group: "Claude Opus", label: "Easy", from: 59.4, to: 72.5 },
  { group: "Claude Opus", label: "Overall", from: 35.9, to: 62.0 },
];

export function DumbbellChart({
  rows = DABSTEP_ROWS,
  min = 0,
  max = 100,
  unit = "%",
  deltaUnit = "pp",
  startLabel = "Baseline",
  endLabel = "Explicit schema",
  accent = "sun",
  ticks = [0, 25, 50, 75, 100],
}: {
  rows?: DumbbellRow[];
  min?: number;
  max?: number;
  unit?: string;
  deltaUnit?: string;
  startLabel?: string;
  endLabel?: string;
  /** Connecting-line + filled-dot color (palette name or CSS color). */
  accent?: string;
  ticks?: number[];
}) {
  const accentColor = paletteVar(accent);
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  const fmt = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}${unit}`;

  // shared column grid so the axis header, group rows and data rows all align
  const GRID = "minmax(56px, 0.9fr) minmax(0, 4fr) minmax(54px, 0.8fr)";

  let lastGroup: string | undefined;

  return (
    <div className="dumbbell" data-anim="fade-up" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "clamp(4px, 0.6vw, 10px)" }}>
      {/* legend */}
      <div style={{ display: "flex", gap: "clamp(16px, 2vw, 32px)", alignItems: "center" }}>
        <Legend filled={false} accentColor={accentColor} label={startLabel} />
        <Legend filled accentColor={accentColor} label={endLabel} />
      </div>

      {/* axis ticks */}
      <div style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center" }}>
        <span />
        <div style={{ position: "relative", height: "1.4em", margin: "0 10px" }}>
          {ticks.map((t) => (
            <span key={t} style={{ position: "absolute", left: `${pct(t)}%`, transform: "translateX(-50%)", fontFamily: "var(--mono)", fontSize: "clamp(10px, 0.85vw, 14px)", color: "var(--muted)" }}>{t}{unit}</span>
          ))}
        </div>
        <span />
      </div>

      {rows.map((r, i) => {
        const header = r.group && r.group !== lastGroup ? r.group : null;
        lastGroup = r.group;
        const delta = r.to - r.from;
        const x0 = pct(r.from);
        const x1 = pct(r.to);
        return (
          <React.Fragment key={i}>
            {header && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: i === 0 ? 0 : "clamp(5px, 0.7vw, 12px)" }}>
                <span className="eyebrow" style={{ color: "var(--ink)", whiteSpace: "nowrap" }}>{header}</span>
                <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--inter)", fontWeight: 400, fontSize: "clamp(13px, 1.1vw, 19px)", color: "var(--ink)" }}>{r.label}</span>

              {/* track */}
              <div style={{ position: "relative", height: "clamp(30px, 3vw, 44px)", margin: "0 10px" }}>
                {/* gridlines */}
                {ticks.map((t) => (
                  <span key={t} style={{ position: "absolute", left: `${pct(t)}%`, top: 0, bottom: 0, width: 1, background: "var(--rule)", opacity: 0.5 }} />
                ))}
                {/* connecting min-max line (sits below the value labels) */}
                <span style={{ position: "absolute", top: "72%", left: `${Math.min(x0, x1)}%`, width: `${Math.abs(x1 - x0)}%`, height: 4, background: accentColor, transform: "translateY(-50%)", borderRadius: 2 }} />
                {/* start (open) dot + value */}
                <Dot x={x0} filled={false} accentColor={accentColor} />
                <Value x={x0} text={fmt(r.from)} />
                {/* end (filled) dot + value */}
                <Dot x={x1} filled accentColor={accentColor} />
                <Value x={x1} text={fmt(r.to)} />
              </div>

              <span style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(13px, 1.15vw, 20px)", color: "var(--ink)", textAlign: "right", whiteSpace: "nowrap" }}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(1)}{deltaUnit}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Legend({ filled, accentColor, label }: { filled: boolean; accentColor: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--ink)", background: filled ? accentColor : "var(--white)" }} />
      <span className="eyebrow" style={{ color: "var(--muted)" }}>{label}</span>
    </span>
  );
}

function Dot({ x, filled, accentColor }: { x: number; filled: boolean; accentColor: string }) {
  return (
    <span style={{ position: "absolute", top: "72%", left: `${x}%`, transform: "translate(-50%, -50%)", width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--ink)", background: filled ? accentColor : "var(--white)", zIndex: 2 }} />
  );
}

function Value({ x, text }: { x: number; text: string }) {
  return (
    <span style={{ position: "absolute", top: 0, left: `${x}%`, transform: "translate(-50%, -2px)", fontFamily: "var(--mono)", fontSize: "clamp(10px, 0.9vw, 15px)", color: "var(--ink)", whiteSpace: "nowrap" }}>{text}</span>
  );
}
