// Image from public/. Add `chrome` to wrap it in the window frame with a shadow.
//   <Image src="dive-example-jobs.png" alt="Jobs explorer" chrome />
import * as React from "react";

export function Image({ src, alt = "", chrome = false, maxWidth }: { src: string; alt?: string; chrome?: boolean; maxWidth?: number | string }) {
  const url = `${import.meta.env.BASE_URL}${src}`;
  if (chrome) {
    return (
      <div className="img-chrome" data-anim="pop" style={maxWidth ? { maxWidth } : undefined}>
        <img src={url} alt={alt} />
      </div>
    );
  }
  return <img className="img-plain" data-anim="pop" src={url} alt={alt} style={maxWidth ? { maxWidth } : undefined} />;
}
