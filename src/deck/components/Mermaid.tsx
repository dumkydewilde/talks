// Mermaid diagram rendered at runtime, themed to the brand palette. Write the diagram
// as plain text and it becomes an SVG — no asset prep, no Figma round-trip.
//
//   <Mermaid chart={`
//     flowchart LR
//       A[CSV] --> B{Agent}
//       B --> C[One page]
//   `} />
//
//   <Mermaid caption="How a project grows" maxWidth={860} chart={`…`} />
//
// Mermaid is ~500 kB, so it is imported dynamically: decks that never use this component
// never download it. `code` shows the source next to the diagram, which is handy when the
// point of the slide is that a few lines of text produced the picture.
import * as React from "react";
import { TOKENS } from "../engine/tokens";

const THEME_VARIABLES = {
  fontFamily: TOKENS.font.aeonik,
  fontSize: "17px",
  // nodes
  primaryColor: TOKENS.color.sky,
  primaryTextColor: TOKENS.color.ink,
  primaryBorderColor: TOKENS.color.ink,
  secondaryColor: TOKENS.color.sun,
  secondaryTextColor: TOKENS.color.ink,
  secondaryBorderColor: TOKENS.color.ink,
  tertiaryColor: TOKENS.color.garden,
  tertiaryTextColor: TOKENS.color.ink,
  tertiaryBorderColor: TOKENS.color.ink,
  // canvas + edges
  background: "transparent",
  mainBkg: TOKENS.color.sky,
  lineColor: TOKENS.color.ink,
  textColor: TOKENS.color.ink,
  edgeLabelBackground: TOKENS.color.sand,
  clusterBkg: "transparent",
  clusterBorder: TOKENS.color.mutedDark,
  titleColor: TOKENS.color.ink,
  // sequence / state extras, so those diagram types stay on-brand too
  actorBkg: TOKENS.color.sky,
  actorBorder: TOKENS.color.ink,
  actorTextColor: TOKENS.color.ink,
  noteBkgColor: TOKENS.color.sun,
  noteBorderColor: TOKENS.color.ink,
  labelBoxBkgColor: TOKENS.color.sun,
  labelBoxBorderColor: TOKENS.color.ink,
};

let initialized = false;
let idCounter = 0;

export function Mermaid({
  chart,
  caption,
  code = false,
  maxWidth,
}: {
  /** The diagram definition, e.g. `flowchart LR\n  A --> B`. */
  chart: string;
  /** Small line under the diagram. */
  caption?: string;
  /** Also show the diagram source beside the picture. */
  code?: boolean;
  maxWidth?: number | string;
}) {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);
  // Strip the leading indentation that template literals in MDX inevitably add.
  const source = React.useMemo(() => dedent(chart), [chart]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            themeVariables: THEME_VARIABLES,
            // useMaxWidth: false emits the SVG at its natural size instead of pinning an
            // inline max-width, which lets the CSS below scale it up to fill the slide.
            flowchart: { curve: "basis", padding: 14, useMaxWidth: false },
          });
          initialized = true;
        }
        const { svg } = await mermaid.render(`mmd-${++idCounter}`, source);
        if (!cancelled) setSvg(svg);
      } catch (err) {
        if (import.meta.env.DEV) console.warn("<Mermaid> failed to render:", err);
        if (!cancelled) setFailed(true);
      }
    })();
    return () => { cancelled = true; };
  }, [source]);

  const style: React.CSSProperties = maxWidth ? { maxWidth } : {};

  return (
    <div className={`mermaid-wrap ${code ? "mermaid-wrap--with-code" : ""}`} data-anim="fade-up" style={style}>
      <div className="mermaid-figure">
        {svg && <div className="mermaid-svg" dangerouslySetInnerHTML={{ __html: svg }} />}
        {/* Reserve the space while mermaid loads so the slide doesn't jump on stage. */}
        {!svg && <div className="mermaid-placeholder">{failed ? "diagram unavailable" : ""}</div>}
      </div>
      {code && <pre className="mermaid-source">{source}</pre>}
      {caption && <div className="mermaid-caption">{caption}</div>}
    </div>
  );
}

/** Remove the common leading whitespace so indented MDX template literals still parse. */
function dedent(text: string): string {
  const lines = text.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length);
  const pad = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(pad)).join("\n");
}
