// QR code generated from a URL at runtime — no asset prep.
//   <QR url="github.com/dumkydewilde/talks" label="Follow along" />
import * as React from "react";
import { QRCodeSVG } from "qrcode.react";

export function QR({ url, label, size = 200 }: { url: string; label?: string; size?: number }) {
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <div className="qr-card" data-anim="pop">
      <QRCodeSVG value={href} size={size} bgColor="#FFFFFF" fgColor="#383838" level="M" style={{ width: "min(18vw, 220px)", height: "auto" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {label && <div className="eyebrow" style={{ color: "var(--ink)", lineHeight: 1 }}>{label}</div>}
        <div className="body-sm" style={{ fontFamily: "var(--mono)", color: "var(--muted)", lineHeight: 1.25 }}>{url}</div>
      </div>
    </div>
  );
}
