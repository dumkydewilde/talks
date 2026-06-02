// Render one loaded slide: pick its template from frontmatter, wrap the MDX body in
// the MDX provider + the template, inside the Slide shell.

import * as React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Slide } from "./Slide";
import { MDX_COMPONENTS } from "../mdx-components";
import { TEMPLATES } from "../templates";
import type { LoadedSlide } from "./loadSlides";

export function SlideRenderer({ slide, index, active }: { slide: LoadedSlide; index: number; active: boolean }) {
  const fm = slide.frontmatter;
  const def = TEMPLATES[fm.template];

  if (!def) {
    return (
      <Slide variant="sand" active={active} scatter={index}>
        <div className="tmpl-center">
          <div className="headline-md">Unknown template: {String(fm.template)}</div>
          <div className="body-md">Slide “{slide.id}”. Check the `template:` field in its frontmatter.</div>
        </div>
      </Slide>
    );
  }

  const variant = fm.variant ?? def.variant ?? "sand";
  const scatter = fm.scatter !== undefined ? fm.scatter : def.scatter === false ? false : index;
  const Body = slide.Body;
  const Template = def.Component;

  return (
    <Slide variant={variant} active={active} scatter={scatter} flush={def.flush} badge={!def.flush}>
      <Template fm={fm}>
        <MDXProvider components={MDX_COMPONENTS}>
          <Body />
        </MDXProvider>
      </Template>
    </Slide>
  );
}
