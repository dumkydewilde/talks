// Window chrome with traffic-light dots and a title bar. Wrap a fenced code block
// (becomes a CodeBlock) or any content:
//   <Terminal title="agent.log">
//   ```log
//   > User: ...
//   ```
//   </Terminal>
// <Chrome> is an alias for non-terminal framing (e.g. a screenshot via <Image>).

import * as React from "react";

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

export function Terminal({ title, children, maxWidth }: { title?: string; children?: React.ReactNode; maxWidth?: number | string }) {
  return (
    <div className="chrome" data-anim="fade-up" style={maxWidth ? { maxWidth } : undefined}>
      <ChromeTitlebar title={title} />
      {children}
    </div>
  );
}

export const Chrome = Terminal;
