// Shared types for slide templates. A template receives the slide's frontmatter and
// the rendered MDX body (its slots) as children, and lays them out.

import * as React from "react";

export type Frontmatter = {
  template: string;
  variant?: "sand" | "ink";
  scatter?: number | false;
  [key: string]: unknown;
};

export type TemplateProps = {
  fm: Frontmatter;
  children: React.ReactNode;
};

export type TemplateDef = {
  Component: React.FC<TemplateProps>;
  /** Default slide background if frontmatter doesn't set `variant`. */
  variant?: "sand" | "ink";
  /** Full-bleed (no slide padding). */
  flush?: boolean;
  /** Suppress ambient scatter for dense/full-bleed templates. */
  scatter?: false;
};
