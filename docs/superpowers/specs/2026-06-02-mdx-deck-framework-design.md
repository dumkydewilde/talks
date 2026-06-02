# MDX Deck Framework — Design

**Date:** 2026-06-02
**Goal:** A reusable, text-editor-friendly slide system so talks can be authored as one MDX
file per slide, picking from a fixed set of templates and components, with a dev-only
drag-and-drop tool to reorder slides. First consumer: `ams-dbt-meetup-2026-06`, seeded
from the `infrastructure-for-answers` talk.

## Scope

- **In:** shared framework under `src/deck/`; the new `ams-dbt-meetup-2026-06` talk with a
  starter set of slides ported from the infra talk; a dev-only browser arrange tool.
- **Out (non-goals):** migrating the existing `infrastructure-for-answers` deck (stays on its
  current bespoke code, untouched and deployed); authoring net-new narrative content beyond
  the faithful port.

## Authoring model

One `.mdx` file per slide in `src/talks/<talk>/slides/`. Frontmatter picks the template and
colors; the body fills regions with a small shared slot vocabulary and inline components.

```mdx
---
template: golden-split
ratio: 2/3-1/3        # golden-split only: 1/3-2/3 | 2/3-1/3
variant: sand          # slide background: sand | ink
leftColor: sky         # palette: sand ink white sky sun garden watermelon duck
---
<Left>
## dbt is becoming an answer engine
Prose, written as Markdown.
</Left>
<Right>
<Image src="duck.png" chrome />
</Right>
```

### Slot vocabulary (shared, positional)

`<Left> <Right> <Top> <Bottom> <Center> <Block>`. Slots **self-place** via CSS grid areas;
the template defines the grid and supplies each region's presentation (panel class, divider,
background color) through `SlotContext`. A slot used in a template that doesn't define its
region logs a dev warning. Single-region templates (`center-title`, `big-center`,
`top-title`, `feature-image`, `title`) need no slot tags — the whole body is the content.

### Templates (registry: name → component + flags)

Requested set plus two needed additions (`title`, `feature-image`):

- `four-block` — 4 cards, icons (`<Block icon title>`)
- `three-block` / `two-block` — cards with images (`<Block image caption>`)
- `golden-split` — `ratio` 1/3-2/3 or 2/3-1/3, color-selectable (`<Left>`/`<Right>`)
- `half-and-half` — 50/50, color-selectable (`<Left>`/`<Right>`)
- `left-title` — narrow title column + content column
- `big-center` — big number/stat centered
- `center-title` — large centered title only
- `top-title` — title at top, content below (single flow)
- `title` *(addition)* — full-bleed image + scrim, content + `<Right>` QR slot
- `feature-image` *(addition)* — full-bleed image + side gradient + content

### Components (inline tag vocabulary)

`<Image src alt chrome>`, `<CodeBlock language>` (also via fenced code blocks),
`<Terminal title>` / `<Chrome title>` (window frame), `<Icon name size>` (duck icons),
`<QR url label>` (generated from URL at runtime — no asset prep), `<Callout accent>`,
`<Stat value label accent>`.

MDX markdown elements map to brand-styled output via `MDXProvider`
(`h1`→headline, `h2`→sub-headline, `h3`→eyebrow, `p`→body, fenced code→`CodeBlock`, etc.),
so authors don't import anything per file.

## Ordering & config (YAML)

- `src/talks/<talk>/order.yaml` — explicit ordered list of slide ids (filenames sans `.mdx`).
  Chosen as YAML so the arrange tool can rewrite it cleanly and a human can edit it trivially.
- `src/talks/<talk>/talk.yaml` — deck meta (title, subtitle, author, event, date, slideUrl,
  handle). YAML for editability.

Loaded via `import.meta.glob('./slides/*.mdx', { eager: true })` in the talk's `main.tsx`;
`?raw` import + `js-yaml` parses the two YAML files. `orderSlides()` maps ids → modules,
applies the order, and warns on missing/extra ids.

## Engine

Lifted from the infra deck into `src/deck/engine/`: design tokens, the global `DECK_CSS`,
the `Slide` shell (variant/scatter/badge), ambient `BlobScatter`, and the navigation engine
(keyboard/click/wheel/fullscreen/progress). `Deck` takes `slides` + `config` props.
`SlideRenderer` reads each slide's frontmatter, looks up the template, and renders the MDX
body inside it wrapped in `MDXProvider`.

## Build tooling

- `@mdx-js/rollup` + `remark-frontmatter` + `remark-mdx-frontmatter` + `remark-gfm`, with
  `providerImportSource: '@mdx-js/react'`, added to `vite.config.ts` (enforce: pre).
- `qrcode.react` for `<QR>`. `js-yaml` (+ `@types/js-yaml`) for config. `@dnd-kit/*` for the
  arrange tool.
- New multi-page input `ams-dbt-meetup-2026-06/index.html` → talk `main.tsx`.
- `src/mdx.d.ts` declares `*.mdx` modules for `tsc`.

## Arrange tool (dev-only)

- Gated behind `import.meta.env.DEV` and `?arrange` in the talk entry; renders the real
  slides as scaled live thumbnails in a grid, drag-and-drop reorder via `@dnd-kit`.
- A Vite dev-server plugin adds middleware for `POST /__arrange/save` that rewrites the
  talk's `order.yaml`. Middleware is registered only in `serve` mode, so it never ships to
  the built site — no production runtime/security surface.

## Files

```
src/deck/
  engine/   Deck.tsx Slide.tsx SlideRenderer.tsx tokens.ts deck-css.ts loadSlides.ts
  templates/ index.ts + one file per template
  components/ Image CodeBlock Terminal Icon QR Callout Stat .tsx
  slots/ slots.tsx (Left Right Top Bottom Center Block + SlotContext)
  mdx-components.tsx
  arrange/ ArrangeView.tsx vitePlugin.ts
src/talks/ams-dbt-meetup-2026-06/
  slides/*.mdx  order.yaml  talk.yaml  main.tsx
ams-dbt-meetup-2026-06/index.html
src/mdx.d.ts
```

## Seeded slides (first cut)

title, speaker (half-and-half), motherduck-for-agents (four-block),
dashboards-as-code (two-block), where-we-are (feature-image), and the
average-order-value trap sequence: trap-setup (top-title + Terminal),
trap-catch (golden-split), trap-reveal (big-center + Stat).

## Verification

`npm run dev`, load the talk, screenshot each seeded slide in the browser; confirm the
arrange tool renders thumbnails and reorders. `npm run build` (tsc + vite) must pass.
