// Template registry: frontmatter `template:` name → component + layout flags.
import type { TemplateDef } from "./types";
import { GoldenSplit, HalfAndHalf, LeftTitle } from "./splits";
import { FourBlock, ThreeBlock, TwoBlock } from "./blocks";
import { CenterTitle, BigCenter, TopTitle } from "./prose";
import { Title, FeatureImage } from "./images";

export const TEMPLATES: Record<string, TemplateDef> = {
  "golden-split": { Component: GoldenSplit, flush: true, scatter: false },
  "half-and-half": { Component: HalfAndHalf, flush: true, scatter: false },
  "left-title": { Component: LeftTitle, flush: true, scatter: false },
  "four-block": { Component: FourBlock },
  "three-block": { Component: ThreeBlock },
  "two-block": { Component: TwoBlock },
  "center-title": { Component: CenterTitle },
  "big-center": { Component: BigCenter },
  "top-title": { Component: TopTitle },
  "title": { Component: Title, variant: "ink", flush: true, scatter: false },
  "feature-image": { Component: FeatureImage, flush: true, scatter: false },
};

export type { TemplateProps, TemplateDef, Frontmatter } from "./types";
