# The future of data teams · Helsinki Data Week

A MotherDuck-branded [Slidev](https://sli.dev) presentation for [The Data Team’s New Tools](https://luma.com/flock-in-Helsinki), Helsinki Bryggeri Brewhouse.

**15 slides / 15 minutes**, then **4 panel slides** and a resources slide. Adrian’s dlt talk sits between them. All slides have presenter notes; the talk timings total exactly 15 minutes, including the demo.

## Run

Node.js 22.12+ required.

```sh
npm ci
npm run dev
```

- Slides: <http://localhost:3030>
- Presenter notes: <http://localhost:3030/presenter/1>
- Panel: <http://localhost:3030/16>
- Arrow keys / Space: navigate; `o`: overview. The header’s **Fullscreen** button enters fullscreen; click **Exit fullscreen** or press Esc to leave. Presenter mode is in the bottom-left toolbar.

## Visuals & interactions

| Slide | Interaction |
| --- | --- |
| 2 | Your real subagent-spacing analysis: highlight one anonymous writer while keeping the overview. |
| 3 | Three longer, densely joined agent-to-agent excerpts, preserving original spacing without explanatory captions. |
| 4 | Text-only transition asking how to make faster tools work for us. |
| 5 | Highlight the room’s show-of-hands answer; not an online poll. |
| 6 | Static learning-loop visualization using Google’s six Design Sprint phases. No slider or numeric performance claim. |
| 7 | Two-part “how”: models handle more complex work faster and earn trust; people supply domain knowledge, set boundaries, and review exceptions without becoming a bottleneck. |
| 10 | Local 31.55-second interview-insights recording. Autoplays muted from the start on entry; pauses on leave. Native play/pause, seeking, volume, and fullscreen. No live Dive or login required. |
| 11 | Five-stage diagram: Dive app → Flight loading data → human review/edit → Flight running SQL analysis with Jev → Dive with insights. |
| 12 | **Your nine favourite Dives on one slide**, in an image-first 3×3 grid. Click to enlarge and open the public gallery page; Esc closes. |
| 17 | Non-linear panel-topic menu with follow-up questions. |
| 20 | Speaker LinkedIn pages, interview-insights recipe, and public Dive. |

## Edit

- `slides.md`: slide copy, sequence, timings, and presenter notes.
- `style.css`: MotherDuck colors, local fonts, and layouts.
- `components/`: interactive pieces.
- `config.ts`: original agent-spacing and interview Dive links; optional Flight link.
- `public/examples/`: locally bundled screenshots, so the deck doesn’t depend on a live dashboard.
- `lib/dive-gallery.mjs`: the nine favourite Dives, capability notes, public links, and screenshot provenance.
- `public/gallery/`: optimized local copies of the public gallery screenshots.

### Before presenting

1. Rehearse slide 10's local recording: it autoplays muted on entry and restarts on return. Use the native controls to unmute, pause, or seek; click Play if the browser blocks autoplay. It needs no MotherDuck login. The agent chart's optional live link in `config.ts` still needs your account; access has not been verified here. Do not change database sharing just for the slides.
2. Use the recording to explain load → discover/classify → inspect evidence → revise the codebook. Describe only actions and results actually visible; the slides themselves never run a Flight, query, or model call.
3. The recording is a saved demonstration, not a live result or a claim of classifier accuracy. Do not describe a staged edit as a completed writeback. Theme counts are not population prevalence. Original walkthrough screenshots remain available in `public/examples/` but are not shown on slide 10.
4. Confirm Amy’s quote wording/attribution and panelists’ current titles. The quote came from the supplied notes, not a verified publication.
5. Agree the handover order with Adrian. His demo is intentionally not scripted here.

## Build & check

```sh
npm test
npm run test:ui
npm run build
npm run preview
```

Browser tests require Chromium: `npx playwright install chromium`. They check all 20 slides, image loading, footer overlaps, follow-along QR placement and links, resources, keyboard behavior, video playback/seeking/pause-on-leave, workflow-diagram order, and interactive controls against a production build.

The talks repository builds this deck into its Pages site at <https://dumkydewilde.github.io/talks/helsinki-data-week-2026/> with hash-based slide navigation. For a standalone local build, run `npm run build`.

## Sources & provenance

- Existing talks: [dumkydewilde/talks](https://github.com/dumkydewilde/talks). Fonts, mascot, and wordmark are reused from that archive. Your current talks framework is React/MDX; this deck is a separate Slidev project as requested.
- Brand accents and word encapsulation: Valise’s `motherduck-design-slides` and `motherduck-design-illustration` skills. Sky is the primary accent, garden the supporting accent, and orange stays with the duck. The retained, currently unused `BrandWord` component uses the canonical `CloudOutline` geometry from `motherduck-design-dive/artifacts/shape-primitives.tsx`. The existing editorial layout and sentence-case Fono display typography are retained.
- Learning loop: [Google’s Design Sprint Kit](https://designsprintkit.withgoogle.com/methodology/overview), with its six phases shown across three expanding/narrowing diamonds. Original SVG paths depict an unclear problem, competing possibilities, and a tested approach. Visual inspiration: [Design Sprint Ltd’s process diagram](https://design-sprint.com/wp-content/uploads/2020/12/design-sprint-process.png). The return path carries evidence into the next question; the shapes are conceptual, not quantitative.
- Event names, session order, and panelists: [Luma event](https://luma.com/flock-in-Helsinki).
- Product behavior: local MotherDuck docs for Flights, Dives, MCP, AI SQL. Public references: [Flights](https://motherduck.com/docs/concepts/flights/), [Dives](https://motherduck.com/docs/key-tasks/dives/).
- Interview demo: neighboring `../interview-insights/` project, saved Dive `1906be4c-8caf-480d-b349-13783ed74f1f`. Slide 10 uses Dumky's `Screen Recording 2026-10-28 at 09.46.26.mov`, repackaged without re-encoding as `public/examples/interview-insights.mp4` (31.55 seconds, original H.264 video and AAC audio). `interview-insights-poster.jpg` is the first frame. Original walkthrough screenshots are retained but not displayed. Source dataset: [Anthropic/AnthropicInterviewer](https://huggingface.co/datasets/Anthropic/AnthropicInterviewer).
- Dive overview: the nine public gallery pages supplied in the brief. `lib/dive-gallery.mjs` records the exact page and original screenshot URL for each. Local WebP copies preserve the original colors and content; no live embedding or authentication is needed for the slides. `scripts/download-gallery.mjs <staging-directory>` downloads the original PNGs for refreshing the local copies.
- Agent-spacing analysis: recovered from the October 26 conversation and existing local extraction of October 24–25 OpenCode sessions. The chart uses **real metrics**, not fabricated data: 599 total messages, 19 sessions, 569 messages passing the >15-word chart filter. Code spans, URLs, paths, and IDs were stripped before measuring spaces per 100 non-space characters. Lines are ±45-minute medians per writer, broken across >90-minute gaps. Pooled early/late statistics are labeled separately.

### Privacy of the agent example

`lib/agent-spacing.json` contains only timestamps, anonymous writer numbers, message class, and numeric spacing scores. The follow-up slide in `slides.md` deliberately includes **three curated, non-identifying excerpts**, with original spelling and spacing preserved. No full transcripts, session titles, original IDs, or file paths are bundled. The excerpts are separate messages, not a controlled before/after. Source timestamps are recorded in the presenter notes for verification against the local export.

To regenerate the metrics from your local extraction:

```sh
node scripts/prepare-agent-spacing.mjs /path/to/spacing/out/conversation.json
```

This is a descriptive observation from one set of sessions—not a benchmark or evidence of model intent, token savings, or correctness.
