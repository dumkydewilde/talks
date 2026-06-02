// Emphasised line. Two shapes:
//   <Callout accent="watermelon">One column away from the truth.</Callout>   → colored text
//   <Callout box accent="sun" label="READ THIS" title="Headline.">detail line</Callout>
//        → filled box: accent background, ink text, optional tag + bold headline. Readable
//          where colored-text-on-sand washes out.
import * as React from "react";
import { paletteVar } from "../engine/tokens";

export function Callout({
  accent = "sky", box = false, label, title, children,
}: {
  accent?: string;
  /** Render as a filled box (accent background, ink text) instead of colored text. */
  box?: boolean;
  /** Small tag chip at the start of a box callout, e.g. "READ THIS". */
  label?: string;
  /** Bold headline line inside a box callout; children become the detail line. */
  title?: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (box) {
    return (
      <div className="callout-box" data-anim="fade-up" style={{ background: paletteVar(accent) }}>
        {label && <span className="callout-box__label">{label}</span>}
        <div className="callout-box__text">
          {title && <span className="callout-box__title">{title}</span>}
          {children && <span className="callout-box__detail">{children}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className="callout" data-anim="fade-up" style={{ color: paletteVar(accent) }}>
      {children}
    </div>
  );
}
