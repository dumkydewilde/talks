// Shared positional slot vocabulary: <Left> <Right> <Top> <Bottom> <Center> <Block>.
// Slots self-place via CSS grid areas. The active template supplies each region's
// presentation (panel classes, divider, background) through SlotContext, so the same
// slot tag looks right in any template that declares it.

import * as React from "react";
import { paletteVar } from "../engine/tokens";
import { Icon } from "../components/Icon";

export type RegionName = "left" | "right" | "top" | "bottom" | "center";

export type SlotConfig = {
  className?: string;
  style?: React.CSSProperties;
  /** CSS grid-area to occupy; defaults to the region name. */
  gridArea?: string;
};

export type SlotMap = Partial<Record<RegionName, SlotConfig>>;

const SlotContext = React.createContext<SlotMap>({});

export function SlotProvider({ value, children }: { value: SlotMap; children: React.ReactNode }) {
  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
}

function Region({ region, color, children }: { region: RegionName; color?: string; children: React.ReactNode }) {
  const map = React.useContext(SlotContext);
  const cfg = map[region];
  if (!cfg) {
    if (import.meta.env.DEV) console.warn(`<${region}> slot is not used by this template; rendering inline.`);
    return <div className="prose stagger">{children}</div>;
  }
  const bg = color ? paletteVar(color) : undefined;
  return (
    <section
      className={`slot prose stagger ${cfg.className ?? ""}`}
      style={{ gridArea: cfg.gridArea ?? region, ...(bg ? { background: bg } : null), ...cfg.style }}
    >
      {children}
    </section>
  );
}

export const Left = ({ children, color }: { children?: React.ReactNode; color?: string }) =>
  <Region region="left" color={color}>{children}</Region>;
export const Right = ({ children, color }: { children?: React.ReactNode; color?: string }) =>
  <Region region="right" color={color}>{children}</Region>;
export const Top = ({ children, color }: { children?: React.ReactNode; color?: string }) =>
  <Region region="top" color={color}>{children}</Region>;
export const Bottom = ({ children, color }: { children?: React.ReactNode; color?: string }) =>
  <Region region="bottom" color={color}>{children}</Region>;
export const Center = ({ children, color }: { children?: React.ReactNode; color?: string }) =>
  <Region region="center" color={color}>{children}</Region>;

/**
 * One card in a block grid. Two shapes:
 *   <Block icon="hybrid" title="Hybrid execution">Description prose…</Block>
 *   <Block image="dive-example-jobs.png" caption="Jobs explorer" />
 */
export function Block({
  icon, image, title, caption, children,
}: {
  icon?: string;
  image?: string;
  title?: string;
  caption?: string;
  children?: React.ReactNode;
}) {
  if (image) {
    return (
      <div className="block-card block-card--image">
        <div className="block-img-wrap">
          <img src={`${import.meta.env.BASE_URL}${image}`} alt={caption ?? ""} />
        </div>
        {(caption || children) && <div className="block-card__caption">{caption ?? children}</div>}
      </div>
    );
  }
  return (
    <div className="block-card">
      {icon && <Icon name={icon} size={80} />}
      {title && <div className="block-card__title">{title}</div>}
      {children && <div className="block-card__desc">{children}</div>}
    </div>
  );
}
