// Full-bleed image templates.
// title: hero image + dark scrim, <Left> content column + <Right> (typically a QR).
// feature-image: full-bleed image with a side gradient and stacked content (single region).

import * as React from "react";
import { SlotProvider, type SlotMap } from "../slots/slots";
import type { TemplateProps } from "./types";

const TITLE_MAP: SlotMap = {
  left: { gridArea: "main", className: "" },
  right: { gridArea: "qr", className: "", style: { justifySelf: "center", alignSelf: "center" } },
};

export function Title({ fm, children }: TemplateProps) {
  const image = fm.image as string | undefined;
  return (
    <>
      {image && <img className="title-image" src={`${import.meta.env.BASE_URL}${image}`} alt="" />}
      <div className="title-scrim" />
      <SlotProvider value={TITLE_MAP}>
        <div className="title-grid" style={{ gridTemplateAreas: '"main qr"' }}>{children}</div>
      </SlotProvider>
    </>
  );
}

export function FeatureImage({ fm, children }: TemplateProps) {
  const image = fm.image as string | undefined;
  const inkScrim = fm.variant === "ink";
  return (
    <div className="image-stage">
      {image && <img className="image-stage__img" src={`${import.meta.env.BASE_URL}${image}`} alt={(fm.imageAlt as string) ?? ""} />}
      <div className={`image-stage__scrim ${inkScrim ? "image-stage__scrim--ink" : ""}`} />
      <div className="image-stage__content prose stagger">{children}</div>
    </div>
  );
}
