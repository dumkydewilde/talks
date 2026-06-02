# MDX Deck Framework

This is the handoff an agent should read before creating or extending a slide deck.
New decks should use the shared MDX framework under `src/deck/`. The older
`src/talks/infrastructure-for-answers/` deck is a legacy bespoke React deck and does
not need to be copied for new work.

## Local Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

During development, Vite serves decks at `http://localhost:5173/<slug>/`. Production
uses the `/talks/` base path.

## New Deck Checklist

1. Pick a URL slug, for example `example-talk-2026-06`.
2. Create `src/talks/<slug>/slides/`.
3. Add one `.mdx` file per slide. The filename without `.mdx` is the slide id.
4. Create `src/talks/<slug>/order.yaml` with slide ids in presentation order.
5. Create `src/talks/<slug>/talk.yaml` with deck metadata.
6. Create `src/talks/<slug>/main.tsx`.
7. Create `<slug>/index.html` in the repository root.
8. Add the page to `build.rollupOptions.input` in `vite.config.ts`.
9. Add the talk to `src/index/IndexPage.tsx`.
10. Run `npm run build`.

Use `src/talks/ams-dbt-meetup-2026-06/` as the canonical example.

## Required Files

`src/talks/<slug>/main.tsx`:

```tsx
import { createRoot } from "react-dom/client";
import yaml from "js-yaml";
import { Deck } from "../../deck/engine/Deck";
import { ArrangeView } from "../../deck/arrange/ArrangeView";
import { orderSlides } from "../../deck/engine/loadSlides";
import orderRaw from "./order.yaml?raw";
import configRaw from "./talk.yaml?raw";

const TALK_ID = "<slug>";

const modules = import.meta.glob("./slides/*.mdx", { eager: true });
const order = (yaml.load(orderRaw) as string[]) ?? [];
const config = (yaml.load(configRaw) as Record<string, unknown>) ?? {};
const slides = orderSlides(modules, order);

const root = createRoot(document.getElementById("root")!);
const arrange = import.meta.env.DEV && new URLSearchParams(location.search).has("arrange");

root.render(arrange ? <ArrangeView talkId={TALK_ID} slides={slides} /> : <Deck slides={slides} config={config} />);
```

`src/talks/<slug>/talk.yaml`:

```yaml
title: Example Talk
subtitle: A short practical subtitle.
author: Dumky de Wilde
event: Example Event
date: June 2026
slideUrl: https://dumkydewilde.github.io/talks/<slug>/
handle: "@dumkydewilde"
```

`src/talks/<slug>/order.yaml`:

```yaml
# Intro
- title
- speaker

# Main section
- first-idea
- second-idea
```

`<slug>/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example Talk</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/talks/<slug>/main.tsx"></script>
  </body>
</html>
```

## Slide Authoring

Each slide is one `.mdx` file with frontmatter. `template` selects the layout. The
body can use normal Markdown plus the shared MDX component vocabulary, without imports.

```mdx
---
template: golden-split
ratio: 2/3-1/3
variant: sand
leftColor: sky
rightColor: white
---

<Left>

## dbt is becoming an answer engine

Prose is written as Markdown.

</Left>

<Right>

<Image src="dive-example-jobs.png" alt="Jobs explorer" chrome />

</Right>
```

Slide ids come from filenames, not frontmatter. A slide file named
`first-idea.mdx` must be listed as `first-idea` in `order.yaml` to appear.
`orderSlides()` warns in the browser console when `order.yaml` references missing
slides or when slide files are not listed.

## Frontmatter

Common fields:

- `template`: required layout name.
- `variant`: slide background, usually `sand` or `ink`.
- `ratio`: split ratio for `golden-split`, either `1/3-2/3` or `2/3-1/3`.
- `leftColor`, `rightColor`: panel colors for split templates.
- `image`: full-bleed image for image templates.
- `imagePosition`: CSS object-position for image templates when needed.

Palette names used across the framework: `sand`, `ink`, `white`, `sky`, `sun`,
`garden`, `watermelon`, `duck`.

## Templates

Templates are registered in `src/deck/templates/index.ts`.

- `title`: full-bleed image title slide with optional `<Right>` QR/content slot.
- `feature-image`: full-bleed image with side gradient and content.
- `center-title`: large centered title.
- `big-center`: centered large statistic or statement.
- `top-title`: title at top, content below in one flow.
- `golden-split`: two columns, `ratio` can be `1/3-2/3` or `2/3-1/3`.
- `half-and-half`: two equal columns.
- `left-title`: narrow title column plus main content column.
- `two-block`: two card blocks.
- `three-block`: three card blocks.
- `four-block`: four card blocks.
- `five-block`: five card blocks.

## Slots

Slots are positional wrappers. Use only the slots a template expects.

- `<Left>` and `<Right>` for split layouts.
- `<Top>`, `<Bottom>`, and `<Center>` for templates that define those regions.
- `<Block>` for block templates.

`<Block>` accepts `icon`, `title`, `image`, and `caption` depending on the template:

```mdx
<Block icon="mcp" title="Tools">
Expose the warehouse through MCP.
</Block>

<Block image="dive-example-jobs.png" caption="Jobs explorer" />
```

If a slot is used in a template that does not define that region, the framework logs a
development warning.

## Components

These components are exposed through `src/deck/mdx-components.tsx`, so slide files do
not import them.

- `<Image src alt chrome align maxWidth>`: image from `public/`; `chrome` wraps it in a
  window frame.
- `<CodeBlock language code>`: highlighted code. Fenced code blocks map to this
  automatically. Supported languages are `python`, `sql`, `yaml`, and `log`.
- `<Terminal title footer footerLabel footerColor maxWidth>`: window frame for code or
  arbitrary content.
- `<Chrome>`: alias for `<Terminal>`.
- `<ChatTerminal title inputPlaceholder maxWidth>`: framed chat transcript.
- `<ChatBubble role>`: chat row inside `<ChatTerminal>`; roles are `user`, `agent`, and
  `result`.
- `<Icon name size color>`: duck icon by name, or Font Awesome with `fa:<name>`.
- `<QR url label>`: runtime-generated QR code.
- `<Callout accent box label title>`: colored emphasis line or filled callout box.
- `<Stat value label accent>`: large value plus label.
- `<Link url label icon>`: external link pill with auto-detected or explicit icon.
- `<Rule accent>`: short colored accent rule. Markdown `---` maps to this.
- `<Carousel interval objectFit>`: auto-advancing carousel around child slides/images.
- `<LoopDiagram interval>`: animated agentic-loop diagram.
- `<DumbbellChart rows min max unit deltaUnit startLabel endLabel accent ticks>`:
  before/after dumbbell chart with sensible defaults.
- `<OptimizationTriangle vertices center>`: three-way trade-off diagram.

Duck icon names are defined in `src/deck/components/Icon.tsx`. Font Awesome icon names
are the curated keys in `src/deck/components/fa-icons.tsx`, used as `fa:github`,
`fa:linkedin`, `fa:database`, and similar.

## Markdown Mapping

Raw Markdown elements are styled by the MDX provider:

- `#` maps to the large headline style.
- `##` maps to medium headline style.
- `###` maps to eyebrow text.
- Paragraphs map to body text.
- Fenced code blocks map to `<CodeBlock>`.
- Blockquotes map to `<Callout>`.
- `---` maps to `<Rule>`.

## Arrange Mode

When `npm run dev` is running, append `?arrange` to a deck URL:

```text
http://localhost:5173/<slug>/?arrange
```

Arrange mode renders live thumbnails, lets you drag slides into a new order, and saves
back to `src/talks/<slug>/order.yaml` through the dev-only Vite middleware at
`POST /__arrange/save`. The middleware is registered only in Vite serve mode and does
not ship in the built site.

## Verification

Before handing off a new or changed deck:

1. Run `npm run build`.
2. Run `npm run dev` and open `http://localhost:5173/<slug>/`.
3. Check several slides manually in the browser.
4. Open `http://localhost:5173/<slug>/?arrange`, reorder one slide, save, and confirm
   `order.yaml` changed as expected. Revert the reorder if it was only a test.
5. Confirm new images live in `public/` and are referenced without a leading slash, for
   example `<Image src="example.png" />`.

## Common Pitfalls

- Do not create `deck.tsx` for new decks unless you intentionally need a bespoke React
  deck.
- Do not import shared components inside slide `.mdx` files; add reusable components to
  `src/deck/mdx-components.tsx` instead.
- Do not forget `vite.config.ts`; a deck without a Rollup input will not build as a
  deployed page.
- Do not use slide files that are missing from `order.yaml`; they will not render.
- Keep generated or talk-specific images in `public/`, because MDX components build URLs
  from `import.meta.env.BASE_URL`.
