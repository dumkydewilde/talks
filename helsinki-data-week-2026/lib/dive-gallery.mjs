// Public gallery screenshots, kept local for presenting without a network.
const gallery = 'https://motherduck.com/dive-gallery/dives/'
const images = 'https://motherduck-com-web-prod.s3.us-east-1.amazonaws.com/dive-snippets/'

export const diveExamples = [
  {
    title: 'DuckDB PyPI downloads',
    slug: 'duckdb-pypi-download-stats-by-mehdio-2026-03-24',
    image: 'pypi-downloads.webp',
    sourceImage: 'screenshots/1774364461669-bd162d89e2376e4a-0808e24e-0e61-40d0-b1e8-f03c61d88775.png',
    description: 'Line and bar charts over DuckDB downloads, with a dataset you can query directly.',
    capability: 'Charts + queryable data',
  },
  {
    title: 'Dive into pivoting',
    slug: 'dive-into-pivoting',
    image: 'pivoting.webp',
    sourceImage: '1773162453312-Dive%20Into%20Pivoting.png',
    description: 'A practical starting point: explore your data and build pivot queries by dragging fields into rows, columns, filters, and values.',
    capability: 'Interactive analysis',
  },
  {
    title: 'Database explorer',
    slug: 'database-explorer-f8b99c',
    image: 'database-explorer.webp',
    sourceImage: '1779803014941-database_explorer_dive.png',
    description: 'Immediate utility: navigate databases, schemas, tables, and inferred relationships, then inspect column distributions.',
    capability: 'A useful tool, not just a chart',
  },
  {
    title: 'A home fit for you',
    slug: 'a-home-fit-for-you',
    image: 'home-fit.webp',
    sourceImage: 'screenshots/1782146498709-2d02fe60f16fb135-eef2cd67-419d-46c7-9262-d857f97ba86c.png',
    description: 'Maps, custom color schemes, and a clear information hierarchy. Adjust what matters to you and compare US counties.',
    capability: 'Maps + custom visual design',
  },
  {
    title: 'Financial briefing book',
    slug: 'financial-reporting-briefing-book',
    image: 'finance.webp',
    sourceImage: 'screenshots/1779384880537-57ceceb1f294db72-80177546-8c91-41cf-a592-90d0c07edeba.png',
    description: 'A finance workflow: income statements, balance sheets, cash flow, and equity for Dow Jones companies.',
    capability: 'Financial reporting',
  },
  {
    title: 'Nikola Jokić career arc',
    slug: 'nikola-joki-career-arc',
    image: 'jokic.webp',
    sourceImage: 'screenshots/1781811479088-de0375d18243ccf6-ce1a94c5-fb81-4b9c-b9bf-65e70f8e95f5.png',
    description: 'Visual storytelling through Jokić’s scoring, playmaking, and triple-double evolution. Shape the experience around the story.',
    capability: 'Visual storytelling',
  },
  {
    title: 'NBA game quality',
    slug: 'nba-game-quality-explorer-2025-26-by-matson',
    image: 'nba-quality.webp',
    sourceImage: 'screenshots/1771984375888-2d47ee87-fe5c-46b6-99d1-f7585fbe826e.png',
    description: 'A heatmap with cross-filtering, switchable axes, and a game-quality distribution. Custom interactions beyond a standard chart picker.',
    capability: 'Heatmaps + cross-filtering',
  },
  {
    title: 'The vibe-coded web',
    slug: 'the-vibe-coded-web-measured-common-crawl',
    image: 'common-crawl.webp',
    sourceImage: 'screenshots/1789385031909-5e2760b46a3b5a81-2a80c76a-245f-4f10-99bb-7e456a290e62.png',
    description: 'Explore self-serve platforms in the Common Crawl web graph. An open dataset and a tutorial-backed path to working with data at scale.',
    capability: 'Open data at scale',
  },
  {
    title: 'Jev jobs',
    slug: 'jev-jobs',
    image: 'jev-jobs.webp',
    sourceImage: 'screenshots/1792051536923-e03f56eb5c4d9a1a-7f4fcf42-ac0a-4b41-ae0e-499b6b11a228.png',
    description: 'AI SQL inside a Dive: answer questions about job descriptions with prompt_jev(), then rank jobs by how well they match.',
    capability: 'AI functions inside the workflow',
  },
].map(example => ({ ...example, url: `${gallery}${example.slug}/`, sourceImage: `${images}${example.sourceImage}` }))
