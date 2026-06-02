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

export type Align = "left" | "center" | "right";
const ALIGN_ITEMS: Record<Align, React.CSSProperties["alignItems"]> = { left: "flex-start", center: "center", right: "flex-end" };

type SlotProps = { children?: React.ReactNode; color?: string; align?: Align };

function Region({ region, color, align, children }: SlotProps & { region: RegionName }) {
  const map = React.useContext(SlotContext);
  const cfg = map[region];
  const alignStyle: React.CSSProperties = align ? { textAlign: align, alignItems: ALIGN_ITEMS[align] } : {};
  if (!cfg) {
    if (import.meta.env.DEV) console.warn(`<${region}> slot is not used by this template; rendering inline.`);
    return <div className="prose stagger" style={alignStyle}>{children}</div>;
  }
  const bg = color ? paletteVar(color) : undefined;
  return (
    <section
      className={`slot prose stagger ${cfg.className ?? ""}`}
      style={{ gridArea: cfg.gridArea ?? region, ...(bg ? { background: bg } : null), ...cfg.style, ...alignStyle }}
    >
      {children}
    </section>
  );
}

export const Left = (p: SlotProps) => <Region region="left" {...p} />;
export const Right = (p: SlotProps) => <Region region="right" {...p} />;
export const Top = (p: SlotProps) => <Region region="top" {...p} />;
export const Bottom = (p: SlotProps) => <Region region="bottom" {...p} />;
export const Center = (p: SlotProps) => <Region region="center" {...p} />;

/**
 * One card in a block grid. Two shapes:
 *   <Block icon="hybrid" title="Hybrid execution">Description prose…</Block>
 *   <Block image="dive-example-jobs.png" caption="Jobs explorer" />
 */
export function Block({
  icon, image, title, caption, align, color, children,
}: {
  icon?: string;
  image?: string;
  title?: string;
  caption?: string;
  align?: Align;
  /** Card background: a palette name (watermelon, garden, sun, sky, …) or raw CSS color. */
  color?: string;
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
  const style: React.CSSProperties = {};
  if (align) { style.textAlign = align; style.alignItems = ALIGN_ITEMS[align]; }
  if (color) style.background = paletteVar(color);
  return (
    <div className="block-card" style={style}>
      {icon && <Icon name={icon} size={80} />}
      {title && <div className="block-card__title">{title}</div>}
      {children && <div className="block-card__desc">{children}</div>}
    </div>
  );
}
