// Image from public/. Add `chrome` to wrap it in the window frame with a shadow.
// `align` (left|center|right) positions it within a column.
//   <Image src="dive-example-jobs.png" alt="Jobs explorer" chrome align="center" />
import * as React from "react";

type Align = "left" | "center" | "right";
const SELF: Record<Align, React.CSSProperties["alignSelf"]> = { left: "flex-start", center: "center", right: "flex-end" };

export function Image({ src, alt = "", chrome = false, align, maxWidth }: {
  src: string; alt?: string; chrome?: boolean; align?: Align; maxWidth?: number | string;
}) {
  const url = `${import.meta.env.BASE_URL}${src}`;
  const style: React.CSSProperties = {};
  if (maxWidth) style.maxWidth = maxWidth;
  if (align) style.alignSelf = SELF[align];
  return chrome
    ? <div className="img-chrome" data-anim="pop" style={style}><img src={url} alt={alt} /></div>
    : <img className="img-plain" data-anim="pop" src={url} alt={alt} style={style} />;
}
