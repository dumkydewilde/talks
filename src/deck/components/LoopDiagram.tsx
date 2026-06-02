// Animated agentic-loop diagram: prompt → LLM → MCP → database → correction → answer.
// The model is one node; the value is the loop around it. Self-contained — it runs its
// own phase timer (like <Carousel>), so it needs no `active` prop from the engine.
//   <LoopDiagram />            // ~1.7s per phase
//   <LoopDiagram interval={2200} />
import * as React from "react";
import { useEffect, useState } from "react";

type LoopPhase = {
  label: string;
  detail: string;
  activeNode: "chat" | "llm" | "mcp" | "db";
  activeWire: "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
  dot: { x: number; y: number };
  payload?: { text: string; x: number; y: number };
  status?: "err" | "ok";
  highlightRow?: boolean;
};

const LOOP_PHASES: LoopPhase[] = [
  { label: "User prompt", detail: "What's the average order value?", activeNode: "chat", activeWire: "w1", dot: { x: 294, y: 118 }, payload: { text: '"average order value"', x: 230, y: 80 } },
  { label: "LLM plans", detail: "The model chooses a tool instead of guessing.", activeNode: "llm", activeWire: "w3", dot: { x: 441, y: 280 }, payload: { text: "query_warehouse(sql)", x: 500, y: 250 } },
  { label: "MCP executes", detail: "Tools expose the warehouse and return exact errors.", activeNode: "mcp", activeWire: "w5", dot: { x: 633, y: 424 }, payload: { text: "SELECT avg(order_total)", x: 555, y: 392 } },
  { label: "Database responds", detail: "Results, comments, and errors become new context.", activeNode: "db", activeWire: "w6", dot: { x: 633, y: 444 }, payload: { text: "amounts are cents", x: 555, y: 460 }, status: "err" },
  { label: "Loop corrects", detail: "The agent revises the query with the new evidence.", activeNode: "llm", activeWire: "w4", dot: { x: 501, y: 280 }, payload: { text: "divide by 100", x: 510, y: 240 } },
  { label: "Answer ships", detail: "A trace is left behind for evals and future context.", activeNode: "chat", activeWire: "w2", dot: { x: 294, y: 144 }, payload: { text: '"€169.90"', x: 230, y: 160 }, status: "ok", highlightRow: true },
];

const WIRE_PATHS: Record<LoopPhase["activeWire"], string> = {
  w1: "M 213 118 L 376 118",
  w2: "M 376 144 L 213 144",
  w3: "M 441 172 L 441 390",
  w4: "M 501 390 L 501 172",
  w5: "M 570 424 L 696 424",
  w6: "M 696 444 L 570 444",
};

export function LoopDiagram({ interval = 1700 }: { interval?: number }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 1) % LOOP_PHASES.length), interval);
    return () => window.clearInterval(id);
  }, [interval]);

  const current = LOOP_PHASES[phase];
  const isLit = (id: LoopPhase["activeNode"]) => current.activeNode === id;
  const dotColor =
    current.status === "err" ? "var(--watermelon)" :
    current.status === "ok" ? "var(--garden)" :
    "var(--sun)";

  return (
    <div
      data-anim="fade-up"
      style={{
        position: "relative",
        width: "min(96%, calc(64vh * 1.655), 1180px)",
        aspectRatio: "960 / 580",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 960 580"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <defs>
          <marker id="loop-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--rule)" />
          </marker>
        </defs>

        {/* dashed Agentic Loop boundary */}
        <rect x="310" y="42" rx="22" ry="22" width="640" height="470" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="8 5" strokeLinecap="round" />
        <text x="780" y="34" fontFamily="var(--aeonik)" fontSize="14" fontStyle="italic" fill="var(--muted)">Agentic Loop</text>

        {/* static wires */}
        {(Object.keys(WIRE_PATHS) as LoopPhase["activeWire"][]).map((id) => (
          <path key={id} d={WIRE_PATHS[id]} fill="none" stroke="var(--rule)" strokeWidth="2" strokeLinecap="round" markerEnd="url(#loop-arrow)" />
        ))}

        {/* glow on the active wire */}
        {(Object.keys(WIRE_PATHS) as LoopPhase["activeWire"][]).map((id) => (
          <path
            key={`g-${id}`}
            d={WIRE_PATHS[id]}
            fill="none"
            stroke={id === current.activeWire ? dotColor : "transparent"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={id === current.activeWire ? "14 10" : undefined}
            style={{
              animation: id === current.activeWire ? "a-loop-dash 0.75s linear infinite" : undefined,
              opacity: id === current.activeWire ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        ))}

        {/* travelling dot */}
        <circle
          cx={current.dot.x}
          cy={current.dot.y}
          r="7"
          fill={dotColor}
          stroke="var(--ink)"
          strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 8px ${dotColor})`, transition: "cx 0.55s ease, cy 0.55s ease, fill 0.2s ease" }}
        />
      </svg>

      {/* chat window (top-left) */}
      <div style={{ position: "absolute", left: "3.96%", top: "9.48%", width: "18.23%", height: "23.1%", background: "var(--white)", border: "2px solid var(--ink)", borderRadius: 10, overflow: "hidden", transition: "box-shadow 0.3s, transform 0.3s", transform: isLit("chat") ? "scale(1.03)" : "scale(1)", boxShadow: isLit("chat") ? "-6px 6px 0 var(--ink)" : "-3px 3px 0 rgba(56,56,56,0.5)" }}>
        <div style={{ height: "26%", background: "var(--sun)", borderBottom: "2px solid var(--ink)", display: "flex", alignItems: "center", padding: "0 10px", gap: 5 }}>
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", opacity: 0.25 }} />
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", opacity: 0.25 }} />
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", opacity: 0.25 }} />
        </div>
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: "0.85em", padding: "4px 8px", borderRadius: "8px 8px 2px 8px", background: "var(--code-header)", alignSelf: "flex-end", fontFamily: "var(--aeonik)", maxWidth: "85%" }}>avg order value?</div>
          {current.status === "ok" && (
            <div style={{ fontSize: "0.85em", padding: "4px 8px", borderRadius: "8px 8px 8px 2px", background: "var(--sun)", alignSelf: "flex-start", fontFamily: "var(--aeonik)", maxWidth: "85%" }}>€169.90</div>
          )}
        </div>
      </div>

      {/* LLM (yellow pill) */}
      <div style={{ position: "absolute", left: "38.75%", top: "14.14%", width: "20.63%", height: "15.17%", background: "var(--sun)", border: "2px solid var(--ink)", borderRadius: 999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "box-shadow 0.3s, transform 0.3s", transform: isLit("llm") ? "scale(1.03)" : "scale(1)", boxShadow: isLit("llm") ? "-6px 6px 0 var(--ink)" : "-3px 3px 0 rgba(56,56,56,0.4)" }}>
        <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(16px, 1.6vw, 28px)", letterSpacing: "-0.01em" }}>LLM</div>
        <div style={{ fontFamily: "var(--inter)", fontSize: "clamp(11px, 0.95vw, 16px)", color: "var(--muted)", marginTop: 2 }}>Reason · choose tool</div>
      </div>

      {/* MCP (green octagon) */}
      <div style={{ position: "absolute", left: "38.75%", top: "67.24%", width: "20.63%", height: "15.17%", transition: "transform 0.3s", transform: isLit("mcp") ? "scale(1.03)" : "scale(1)" }}>
        <div style={{ width: "100%", height: "100%", background: "var(--garden)", border: "2px solid var(--ink)", clipPath: "polygon(12% 0%, 88% 0%, 100% 30%, 100% 70%, 88% 100%, 12% 100%, 0% 70%, 0% 30%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--white)" }}>
          <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(16px, 1.5vw, 26px)", letterSpacing: "-0.01em" }}>MCP Server</div>
          <div style={{ fontFamily: "var(--inter)", fontSize: "clamp(11px, 0.95vw, 16px)", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>Tool call</div>
        </div>
      </div>

      {/* database table (bottom-right) */}
      <div style={{ position: "absolute", left: "72.71%", top: "60%", width: "23%", transition: "transform 0.3s", transform: isLit("db") ? "scale(1.03)" : "scale(1)" }}>
        <div style={{ fontSize: "0.9em", color: "var(--muted)", marginBottom: 4, fontFamily: "var(--mono)" }}>orders</div>
        <table style={{ width: "100%", fontSize: "0.85em", borderCollapse: "separate", borderSpacing: 0, border: "1.5px solid var(--rule)", borderRadius: 8, overflow: "hidden", background: "var(--white)", fontFamily: "var(--inter)" }}>
          <thead>
            <tr>
              {["order_id", "total", "ts"].map((h) => (
                <th key={h} style={{ background: "var(--code-header)", padding: "4px 8px", textAlign: "left", fontSize: "0.9em", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--muted)", fontFamily: "var(--mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[["A-001", "16990", "08:02"], ["A-002", "8400", "08:14"], ["A-003", "23110", "09:01"], ["A-004", "12500", "09:33"]].map((row, i) => (
              <tr key={row[0]} style={current.highlightRow && i === 0 ? { background: "rgba(255,222,0,0.4)", fontWeight: 700, transition: "background 0.3s" } : { transition: "background 0.3s" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "3px 8px", borderTop: "1px solid var(--code-header)", fontFamily: j === 1 ? "var(--mono)" : "var(--inter)" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* floating payload */}
      {current.payload && (
        <div style={{ position: "absolute", left: `${(current.payload.x / 960) * 100}%`, top: `${(current.payload.y / 580) * 100}%`, transform: "translate(-50%, -50%)", fontSize: "0.85em", lineHeight: 1.35, color: current.status === "err" ? "#B33A2E" : current.status === "ok" ? "#0E7E6F" : "var(--ink)", background: current.status === "err" ? "#FFF6F5" : current.status === "ok" ? "#F0FDFB" : "var(--white)", border: `1.5px solid ${current.status === "err" ? "var(--watermelon)" : current.status === "ok" ? "var(--garden)" : "var(--rule)"}`, borderRadius: 5, padding: "3px 9px", whiteSpace: "nowrap", pointerEvents: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", fontFamily: "var(--mono)", zIndex: 15 }}>
          {current.payload.text}
        </div>
      )}

      {/* step indicator (bottom-left) */}
      <div style={{ position: "absolute", left: "2%", bottom: "0%", maxWidth: "32%", background: "var(--ink)", color: "var(--sand)", border: "2px solid var(--ink)", padding: "clamp(10px, 0.9vw, 16px) clamp(12px, 1vw, 18px)", display: "flex", flexDirection: "column", gap: 4 }}>
        <div className="eyebrow" style={{ color: dotColor }}>{String(phase + 1).padStart(2, "0")} / {current.label}</div>
        <div className="body-sm" style={{ color: "var(--sand)" }}>{current.detail}</div>
      </div>
    </div>
  );
}
