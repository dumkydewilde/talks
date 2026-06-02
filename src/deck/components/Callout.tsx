// Emphasised callout / pull-quote box with a colored left border.
//   <Callout accent="watermelon">One column away from the truth.</Callout>
import * as React from "react";
import { paletteVar } from "../engine/tokens";

export function Callout({ accent = "sky", children }: { accent?: string; children?: React.ReactNode }) {
  return (
    <div className="callout" data-anim="fade-up" style={{ borderLeftColor: paletteVar(accent) }}>
      {children}
    </div>
  );
}
