// Block-grid templates. An optional <Top> header spans the full width (grid-column
// 1 / -1); each <Block> auto-places into the grid below. four-block uses icons,
// three/two-block typically use images — but a <Block> accepts either.

import * as React from "react";
import { SlotProvider, type SlotMap } from "../slots/slots";
import type { TemplateProps } from "./types";

const HEADER_MAP: SlotMap = {
  top: { className: "block-header", gridArea: "auto", style: { gridColumn: "1 / -1" } },
};

function BlockGrid({ children, n }: { children: React.ReactNode; n: 2 | 3 | 4 | 5 }) {
  return (
    <SlotProvider value={HEADER_MAP}>
      <div className="block-stack">
        <div className={`block-grid block-grid--${n} stagger`}>{children}</div>
      </div>
    </SlotProvider>
  );
}

export const FiveBlock = ({ children }: TemplateProps) => <BlockGrid n={5}>{children}</BlockGrid>;
export const FourBlock = ({ children }: TemplateProps) => <BlockGrid n={4}>{children}</BlockGrid>;
export const ThreeBlock = ({ children }: TemplateProps) => <BlockGrid n={3}>{children}</BlockGrid>;
export const TwoBlock = ({ children }: TemplateProps) => <BlockGrid n={2}>{children}</BlockGrid>;
