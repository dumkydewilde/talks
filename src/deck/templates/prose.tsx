// Single-region prose templates — the whole MDX body is the content, no slot tags.
// center-title: large centered title. big-center: centered big number/stat.
// top-title: title with text/components stacked below.

import * as React from "react";
import type { TemplateProps } from "./types";

export const CenterTitle = ({ children }: TemplateProps) => (
  <div className="tmpl-center prose stagger">{children}</div>
);

export const BigCenter = ({ children }: TemplateProps) => (
  <div className="tmpl-center prose stagger">{children}</div>
);

export const TopTitle = ({ children }: TemplateProps) => (
  <div className="tmpl-top prose stagger">{children}</div>
);
