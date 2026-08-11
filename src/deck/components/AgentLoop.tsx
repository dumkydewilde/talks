// Animated "an agent is a while-loop" diagram, for audiences who have never seen one:
// you ask → it thinks → it calls a tool → it reads the result → a plain check sends it
// round again or ships the answer. Self-contained: it runs its own phase timer (like
// <Carousel> and <LoopDiagram>), so it needs no `active` prop from the engine.
//   <AgentLoop />                // ~2.1s per phase
//   <AgentLoop interval={2600} />
import * as React from "react";
import { useEffect, useState } from "react";

type NodeId = "chat" | "think" | "act" | "check" | "gate" | "answer";
type WireId = "w1" | "w2" | "w3" | "w4" | "w5" | "w6";

type Phase = {
  label: string;
  detail: string;
  node: NodeId;
  wire: WireId;
  dot: { x: number; y: number };
  payload?: { text: string; x: number; y: number };
  status?: "err" | "ok";
};

// Geometry lives in a single 960 × 540 coordinate space; the HTML nodes convert to
// percentages so the whole thing scales with the slide.
const PHASES: Phase[] = [
  {
    label: "You ask",
    detail: "Plain words in a text box. That is still the entire interface.",
    node: "chat", wire: "w1", dot: { x: 228, y: 153 },
    payload: { text: '"turn this CSV into a page"', x: 190, y: 96 },
  },
  {
    label: "It thinks",
    detail: "Your words, plus whatever else it has been given: your files, your standing instructions, its own notes.",
    node: "think", wire: "w2", dot: { x: 412, y: 153 },
    payload: { text: "plan: open the file first", x: 325, y: 240 },
  },
  {
    label: "It calls a tool",
    detail: "A tool is a function someone wrote. Read a file, run the code, search the docs. Ordinary, boring, reliable.",
    node: "act", wire: "w3", dot: { x: 592, y: 153 },
    payload: { text: 'read_file("expenses.csv")', x: 505, y: 240 },
  },
  {
    label: "It reads the result",
    detail: "Output and errors come back and become context it did not have a second ago.",
    node: "check", wire: "w4", dot: { x: 685, y: 268 },
    payload: { text: "dates are text, not dates", x: 810, y: 268 },
    status: "err",
  },
  {
    label: "Not done, go again",
    detail: "A dumb if-statement: is there an answer yet, and are there turns left? If not, round two.",
    node: "gate", wire: "w5", dot: { x: 325, y: 300 },
    payload: { text: "turn 2 of 30", x: 325, y: 262 },
  },
  {
    label: "Answer",
    detail: "It stops when the check says so, not when it feels finished.",
    node: "answer", wire: "w6", dot: { x: 700, y: 470 },
    payload: { text: "expenses.html", x: 640, y: 505 },
    status: "ok",
  },
];

const WIRES: Record<WireId, string> = {
  w1: "M 204 153 L 242 153",
  w2: "M 400 153 L 422 153",
  w3: "M 580 153 L 602 153",
  w4: "M 685 202 L 685 360 L 598 360",
  w5: "M 402 360 L 325 360 L 325 206",
  w6: "M 497 404 L 497 470 L 802 470",
};

function nodeShadow(lit: boolean) {
  return lit ? "-6px 6px 0 var(--ink)" : "-3px 3px 0 rgba(56,56,56,0.4)";
}

/** Absolute box in the 960 × 540 space, expressed as percentages. */
function box(x: number, y: number, w: number, h: number): React.CSSProperties {
  return {
    position: "absolute",
    left: `${(x / 960) * 100}%`,
    top: `${(y / 540) * 100}%`,
    width: `${(w / 960) * 100}%`,
    height: `${(h / 540) * 100}%`,
  };
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: "var(--aeonik)",
  fontSize: "clamp(13px, 1.35vw, 24px)",
  letterSpacing: "-0.01em",
  textAlign: "center",
  lineHeight: 1.1,
};
const SUB_STYLE: React.CSSProperties = {
  fontFamily: "var(--inter)",
  fontSize: "clamp(9px, 0.82vw, 14px)",
  color: "var(--muted)",
  marginTop: 3,
  textAlign: "center",
  lineHeight: 1.2,
};

function Step({
  x, lit, background, title, sub, subColor,
}: {
  x: number;
  lit: boolean;
  background: string;
  title: string;
  sub: string;
  subColor?: string;
}) {
  return (
    <div
      style={{
        ...box(x, 108, 150, 94),
        background,
        border: "2px solid var(--ink)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px",
        transition: "box-shadow 0.3s, transform 0.3s",
        transform: lit ? "scale(1.04)" : "scale(1)",
        boxShadow: nodeShadow(lit),
      }}
    >
      <div style={TITLE_STYLE}>{title}</div>
      <div style={{ ...SUB_STYLE, ...(subColor ? { color: subColor } : null) }}>{sub}</div>
    </div>
  );
}

export function AgentLoop({ interval = 2100 }: { interval?: number }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 1) % PHASES.length), interval);
    return () => window.clearInterval(id);
  }, [interval]);

  const current = PHASES[phase];
  const isLit = (id: NodeId) => current.node === id;
  const dotColor =
    current.status === "err" ? "var(--watermelon)" :
    current.status === "ok" ? "var(--garden)" :
    "var(--sun)";

  return (
    <div
      data-anim="fade-up"
      style={{
        position: "relative",
        width: "min(96%, calc(62vh * 1.778), 1180px)",
        aspectRatio: "960 / 540",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <defs>
          <marker id="agentloop-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--rule)" />
          </marker>
        </defs>

        {/* dashed boundary: the program around the model */}
        <rect x="232" y="52" rx="22" ry="22" width="560" height="386" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="8 5" strokeLinecap="round" />
        <text x="512" y="42" textAnchor="middle" fontFamily="var(--aeonik)" fontSize="15" fontStyle="italic" fill="var(--muted)">
          the loop: about 40 lines of ordinary code
        </text>

        {/* static wires */}
        {(Object.keys(WIRES) as WireId[]).map((id) => (
          <path key={id} d={WIRES[id]} fill="none" stroke="var(--rule)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#agentloop-arrow)" />
        ))}

        {/* glow on the active wire */}
        {(Object.keys(WIRES) as WireId[]).map((id) => (
          <path
            key={`g-${id}`}
            d={WIRES[id]}
            fill="none"
            stroke={id === current.wire ? dotColor : "transparent"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={id === current.wire ? "14 10" : undefined}
            style={{
              animation: id === current.wire ? "a-loop-dash 0.75s linear infinite" : undefined,
              opacity: id === current.wire ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        ))}

        {/* branch labels */}
        <text x="365" y="350" textAnchor="middle" fontFamily="var(--mono)" fontSize="14" fill="var(--muted)">no</text>
        <text x="516" y="446" textAnchor="start" fontFamily="var(--mono)" fontSize="14" fill="var(--muted)">yes</text>

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

      {/* you (chat box) */}
      <div
        style={{
          ...box(34, 100, 170, 106),
          background: "var(--white)",
          border: "2px solid var(--ink)",
          borderRadius: 10,
          overflow: "hidden",
          transition: "box-shadow 0.3s, transform 0.3s",
          transform: isLit("chat") ? "scale(1.03)" : "scale(1)",
          boxShadow: nodeShadow(isLit("chat")),
        }}
      >
        <div style={{ height: "30%", background: "var(--sky)", borderBottom: "2px solid var(--ink)", display: "flex", alignItems: "center", padding: "0 10px" }}>
          <span style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(10px, 0.9vw, 15px)", letterSpacing: "0.14em", textTransform: "uppercase" }}>You</span>
        </div>
        <div style={{ padding: "8px 10px", fontFamily: "var(--inter)", fontSize: "clamp(10px, 0.9vw, 15px)", lineHeight: 1.3, color: "var(--ink)" }}>
          a sentence about what you want
        </div>
      </div>

      <Step x={250} lit={isLit("think")} background="var(--sun)" title="Think" sub="plan · recall instructions" />
      <Step x={430} lit={isLit("act")} background="var(--garden)" title="Call a tool" sub="read · run · search · write" subColor="rgba(255,255,255,0.8)" />
      <Step x={610} lit={isLit("check")} background="var(--sky)" title="Read result" sub="output and errors" />

      {/* the check that makes it a loop */}
      <div
        style={{
          ...box(402, 320, 190, 84),
          background: "var(--ink)",
          color: "var(--sand)",
          border: "2px solid var(--ink)",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow 0.3s, transform 0.3s",
          transform: isLit("gate") ? "scale(1.04)" : "scale(1)",
          boxShadow: isLit("gate") ? "-6px 6px 0 var(--sun)" : "-3px 3px 0 rgba(56,56,56,0.4)",
        }}
      >
        <div style={{ ...TITLE_STYLE, color: "var(--sand)" }}>Done? Turns left?</div>
        <div style={{ ...SUB_STYLE, color: "rgba(244,239,234,0.7)" }}>an if-statement, nothing more</div>
      </div>

      {/* final answer */}
      <div
        style={{
          ...box(802, 428, 142, 84),
          background: "var(--white)",
          border: "2px solid var(--ink)",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow 0.3s, transform 0.3s",
          transform: isLit("answer") ? "scale(1.04)" : "scale(1)",
          boxShadow: isLit("answer") ? "-6px 6px 0 var(--garden)" : "-3px 3px 0 rgba(56,56,56,0.4)",
        }}
      >
        <div style={TITLE_STYLE}>Answer</div>
        <div style={SUB_STYLE}>one page, done</div>
      </div>

      {/* floating payload */}
      {current.payload && (
        <div
          style={{
            position: "absolute",
            left: `${(current.payload.x / 960) * 100}%`,
            top: `${(current.payload.y / 540) * 100}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "0.85em",
            lineHeight: 1.35,
            color: current.status === "err" ? "#B33A2E" : current.status === "ok" ? "#0E7E6F" : "var(--ink)",
            background: current.status === "err" ? "#FFF6F5" : current.status === "ok" ? "#F0FDFB" : "var(--white)",
            border: `1.5px solid ${current.status === "err" ? "var(--watermelon)" : current.status === "ok" ? "var(--garden)" : "var(--rule)"}`,
            borderRadius: 5,
            padding: "3px 9px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            fontFamily: "var(--mono)",
            zIndex: 15,
          }}
        >
          {current.payload.text}
        </div>
      )}

      {/* step indicator (bottom-left) */}
      <div
        style={{
          position: "absolute",
          left: "0%",
          bottom: "0%",
          maxWidth: "30%",
          background: "var(--ink)",
          color: "var(--sand)",
          border: "2px solid var(--ink)",
          padding: "clamp(10px, 0.9vw, 16px) clamp(12px, 1vw, 18px)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div className="eyebrow" style={{ color: dotColor }}>{String(phase + 1).padStart(2, "0")} / {current.label}</div>
        <div className="body-sm" style={{ color: "var(--sand)" }}>{current.detail}</div>
      </div>
    </div>
  );
}
