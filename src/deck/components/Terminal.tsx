// Window chrome with traffic-light dots and a title bar. Wrap a fenced code block
// (becomes a CodeBlock) or any content. Optional colored bottom bar for a callout:
//   <Terminal title="orders.sql" footerLabel="conversion" footer="… = €169.90" footerColor="sun">
//   ```sql
//   …
//   ```
//   </Terminal>
// <Chrome> is an alias for non-terminal framing (e.g. a screenshot via <Image>).

import * as React from "react";
import { paletteVar } from "../engine/tokens";

function ChromeTitlebar({ title }: { title?: string }) {
  return (
    <div className="chrome-titlebar">
      <div className="chrome-dots">
        <span className="chrome-dot chrome-dot--close" />
        <span className="chrome-dot chrome-dot--min" />
        <span className="chrome-dot chrome-dot--max" />
      </div>
      {title && <div className="chrome-title">{title}</div>}
    </div>
  );
}

export function Terminal({
  title, footer, footerLabel, footerColor = "sun", children, maxWidth,
}: {
  title?: string;
  /** Right-side text in the bottom callout bar. */
  footer?: React.ReactNode;
  /** Left-side eyebrow label in the bottom bar. */
  footerLabel?: string;
  /** Bottom bar background (palette name or CSS color). */
  footerColor?: string;
  children?: React.ReactNode;
  maxWidth?: number | string;
}) {
  return (
    <div className="chrome" data-anim="fade-up" style={maxWidth ? { maxWidth } : undefined}>
      <ChromeTitlebar title={title} />
      {children}
      {(footer || footerLabel) && (
        <div className="chrome-footer" style={{ background: paletteVar(footerColor) }}>
          {footerLabel && <div className="chrome-footer__label eyebrow">{footerLabel}</div>}
          {footer && <div className="chrome-footer__value">{footer}</div>}
        </div>
      )}
    </div>
  );
}

export const Chrome = Terminal;
