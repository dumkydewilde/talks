# talks

Decks and notes from talks by Dumky de Wilde. Live at <https://dumkydewilde.github.io/talks/>.

## Stack

- Vite multi-page (no router)
- React 18 + TypeScript
- Inline CSS, MotherDuck visual system
- Deployed via GitHub Actions to GitHub Pages

## Local development

```bash
npm install
npm run dev       # serves at http://localhost:5173/
npm run build     # builds to ./dist/
npm run preview   # serves the built site at http://localhost:4173/talks/
```

## Adding a new talk

Prefer the shared MDX deck framework for new talks. The older
`infrastructure-for-answers` deck is a legacy bespoke React deck and can stay as-is.
The Helsinki Data Week 2026 deck is a standalone Slidev subproject in
[`helsinki-data-week-2026/`](helsinki-data-week-2026/), built into the Pages site by
the root `npm run build` command.

1. Create `src/talks/<slug>/slides/`, one `.mdx` file per slide.
2. Create `src/talks/<slug>/order.yaml` with slide ids in presentation order.
3. Create `src/talks/<slug>/talk.yaml` with deck metadata.
4. Create `src/talks/<slug>/main.tsx` using the MDX loader pattern from
   `src/talks/ams-dbt-meetup-2026-06/main.tsx`.
5. Create `<slug>/index.html` in the project root with a
   `<script type="module" src="/src/talks/<slug>/main.tsx">` tag.
6. Add the slug to `rollupOptions.input` in `vite.config.ts`.
7. Add an entry to the `talks` array in `src/index/IndexPage.tsx`.
8. Run `npm run build`.

For the full agent handoff, including MDX frontmatter, templates, slots, components,
and arrange mode, see [`docs/deck-framework.md`](docs/deck-framework.md).
