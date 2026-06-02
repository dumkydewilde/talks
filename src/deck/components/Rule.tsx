// Accent rule (short colored bar). Use <Rule /> in MDX — a capitalized component is
// reliably resolved through the provider, unlike a literal <hr/> which MDX renders as a
// native element. Markdown `---` thematic breaks also map to this via mdx-components.
import * as React from "react";
import { paletteVar } from "../engine/tokens";

export function Rule({ accent = "sky" }: { accent?: string }) {
  return <div className="accent-rule" data-anim="grow-x" style={{ background: paletteVar(accent) }} />;
}
