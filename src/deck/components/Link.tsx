// Styled external link with an auto-detected brand/link icon.
//   <Link url="linkedin.com/in/dumkydewilde" />            → LinkedIn icon + text
//   <Link url="github.com/x/y" label="The wrapper" />      → GitHub icon + custom label
//   <Link url="motherduck.com" icon="globe" />             → explicit icon override
import * as React from "react";
import { FA_ICONS, iconForHost } from "./fa-icons";

export function Link({ url, label, icon }: { url: string; label?: string; icon?: string }) {
  const href = url.startsWith("http") || url.startsWith("mailto:") ? url : `https://${url}`;
  let host = "";
  try { host = new URL(href).host; } catch { host = url; }
  const Ico = icon ? (FA_ICONS[icon] ?? FA_ICONS.link) : iconForHost(host);
  return (
    <a className="link-pill" href={href} target="_blank" rel="noreferrer" data-anim="fade-up">
      <Ico size="1.1em" />
      <span>{label ?? url}</span>
    </a>
  );
}
