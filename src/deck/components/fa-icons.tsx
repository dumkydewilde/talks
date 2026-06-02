// Font Awesome (react-icons/fa6) icon registry. A curated, named set usable from
// <Link icon="..."> and <Icon name="fa:..."> so slides get real brand/UI icons
// without per-file imports. Add entries here as needed.

import * as React from "react";
import {
  FaLinkedin, FaGithub, FaXTwitter, FaYoutube, FaGlobe, FaLink,
  FaArrowUpRightFromSquare, FaEnvelope, FaDatabase, FaCode, FaBook,
  FaFilePdf, FaCheck, FaArrowRight, FaRss,
} from "react-icons/fa6";

export type IconComponent = React.ComponentType<{ size?: number | string; color?: string }>;

export const FA_ICONS: Record<string, IconComponent> = {
  linkedin: FaLinkedin,
  github: FaGithub,
  x: FaXTwitter,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  globe: FaGlobe,
  link: FaLink,
  external: FaArrowUpRightFromSquare,
  email: FaEnvelope,
  database: FaDatabase,
  code: FaCode,
  book: FaBook,
  pdf: FaFilePdf,
  check: FaCheck,
  "arrow-right": FaArrowRight,
  blog: FaRss,
};

/** Pick a brand/link icon from a URL host. Falls back to a generic external-link glyph. */
export function iconForHost(host: string): IconComponent {
  const h = host.toLowerCase();
  if (h.includes("linkedin")) return FaLinkedin;
  if (h.includes("github")) return FaGithub;
  if (h.includes("twitter") || h === "x.com" || h.endsWith(".x.com")) return FaXTwitter;
  if (h.includes("youtube") || h.includes("youtu.be")) return FaYoutube;
  if (h.startsWith("mailto:") || h.includes("@")) return FaEnvelope;
  return FaArrowUpRightFromSquare;
}
