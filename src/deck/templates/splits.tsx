// Two-column split templates: golden-split (1.618:1 either way), half-and-half (50/50),
// and left-title (narrow title column + wide content). All color-selectable per panel
// via frontmatter `leftColor` / `rightColor`. Authors fill <Left> and <Right>.

import * as React from "react";
import { SlotProvider, type SlotMap } from "../slots/slots";
import { paletteVar } from "../engine/tokens";
import type { TemplateProps } from "./types";

function SplitFrame({ fm, children, columns, leftClass, rightClass }: TemplateProps & {
  columns: string;
  leftClass: string;
  rightClass: string;
}) {
  const leftColor = fm.leftColor as string | undefined;
  const rightColor = fm.rightColor as string | undefined;
  const map: SlotMap = {
    left: { className: leftClass, gridArea: "left", style: leftColor ? { background: paletteVar(leftColor) } : undefined },
    right: { className: rightClass, gridArea: "right", style: rightColor ? { background: paletteVar(rightColor) } : undefined },
  };
  return (
    <SlotProvider value={map}>
      <div className="split-frame" style={{ gridTemplateColumns: columns, gridTemplateAreas: '"left right"' }}>
        {children}
      </div>
    </SlotProvider>
  );
}

export function GoldenSplit(props: TemplateProps) {
  const ratio = props.fm.ratio as string | undefined;
  const columns = ratio === "2/3-1/3" ? "1.618fr 1fr" : "1fr 1.618fr";
  return <SplitFrame {...props} columns={columns} leftClass="split-panel split-divider-right" rightClass="split-panel split-panel--center split-panel--visual" />;
}

export function HalfAndHalf(props: TemplateProps) {
  return <SplitFrame {...props} columns="1fr 1fr" leftClass="split-panel split-divider-right" rightClass="split-panel split-panel--center split-panel--visual" />;
}

export function LeftTitle(props: TemplateProps) {
  return <SplitFrame {...props} columns="0.8fr 1.2fr" leftClass="split-panel split-divider-right" rightClass="split-panel" />;
}
