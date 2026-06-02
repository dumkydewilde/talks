// Big number / headline stat.  <Stat value="€169.90" label="Actual answer" accent="sky" />
import * as React from "react";
import { paletteVar } from "../engine/tokens";

export function Stat({ value, label, accent }: { value: string; label?: string; accent?: string }) {
  return (
    <div className="stat" data-anim="pop">
      <div className="stat__value" style={accent ? { color: paletteVar(accent) } : undefined}>{value}</div>
      {label && <div className="stat__label">{label}</div>}
    </div>
  );
}
