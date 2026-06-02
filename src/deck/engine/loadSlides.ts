// Resolve the per-talk slide modules (from import.meta.glob) against the explicit
// YAML order list. Slide id = the .mdx filename without extension.

import type { ComponentType } from "react";
import type { Frontmatter } from "../templates/types";

export type SlideModule = {
  frontmatter: Frontmatter;
  default: ComponentType;
};

export type LoadedSlide = {
  id: string;
  frontmatter: Frontmatter;
  Body: ComponentType;
};

function idFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.mdx$/, "");
}

/**
 * @param modules result of import.meta.glob('./slides/*.mdx', { eager: true })
 * @param order   ordered list of slide ids from order.yaml
 */
export function orderSlides(modules: Record<string, unknown>, order: string[]): LoadedSlide[] {
  const byId = new Map<string, SlideModule>();
  for (const [path, mod] of Object.entries(modules)) {
    byId.set(idFromPath(path), mod as SlideModule);
  }

  const used = new Set<string>();
  const slides: LoadedSlide[] = [];
  for (const id of order) {
    const mod = byId.get(id);
    if (!mod) {
      console.warn(`order.yaml references "${id}" but no slides/${id}.mdx exists — skipping.`);
      continue;
    }
    used.add(id);
    slides.push({ id, frontmatter: mod.frontmatter ?? ({ template: "center-title" } as Frontmatter), Body: mod.default });
  }
  for (const id of byId.keys()) {
    if (!used.has(id)) console.warn(`slides/${id}.mdx exists but is not listed in order.yaml — not shown.`);
  }
  return slides;
}
