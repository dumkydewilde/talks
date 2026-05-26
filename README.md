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

1. Create `src/talks/<slug>/deck.tsx` and `src/talks/<slug>/main.tsx`.
2. Create `<slug>/index.html` in the project root with a `<script type="module" src="/src/talks/<slug>/main.tsx">` tag.
3. Add the slug to `rollupOptions.input` in `vite.config.ts`.
4. Add an entry to the `talks` array in `src/index/IndexPage.tsx`.
5. Commit and push — GH Actions builds and deploys.
