import { Fragment } from "react";

const TOKENS = {
  sand: "#F4EFEA",
  ink: "#383838",
  white: "#FFFFFF",
  sky: "#6FC2FF",
  duck: "#FF9538",
  muted: "#888888",
  mutedDark: "#A8A8A8",
};

const CSS = `
@font-face {
  font-family: 'Aeonik Mono';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('${import.meta.env.BASE_URL}AeonikMono-Regular.woff2') format('woff2');
}
@import url('https://fonts.googleapis.com/css2?family=Cousine:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --sand: ${TOKENS.sand};
  --ink: ${TOKENS.ink};
  --white: ${TOKENS.white};
  --sky: ${TOKENS.sky};
  --duck: ${TOKENS.duck};
  --muted: ${TOKENS.muted};
  --muted-dark: ${TOKENS.mutedDark};
  --aeonik: 'Aeonik Mono', 'Cousine', ui-monospace, Menlo, monospace;
  --inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { min-height: 100%; }
body { background: var(--sand); color: var(--ink); font-family: var(--inter); -webkit-font-smoothing: antialiased; }

.page { max-width: 1100px; margin: 0 auto; padding: clamp(40px, 6vw, 100px) clamp(24px, 5vw, 80px) 120px; }

.eyebrow { font-family: var(--aeonik); font-weight: 400; font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.headline { font-family: var(--aeonik); font-weight: 400; font-size: clamp(48px, 9vw, 140px); letter-spacing: -0.03em; line-height: 1.02; text-transform: uppercase; }
.subtitle { font-family: var(--inter); font-weight: 300; font-size: clamp(18px, 2vw, 26px); color: var(--muted-dark); max-width: 52ch; line-height: 1.5; margin-top: 24px; }

.duckfeet { color: var(--duck); }

.talks { display: flex; flex-direction: column; gap: 28px; margin-top: 80px; }
.talk-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 32px;
  background: var(--white);
  border: 2px solid var(--ink);
  box-shadow: -8px 8px 0 var(--ink);
  padding: 28px 32px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.talk-card:hover { transform: translate(-3px, 3px); box-shadow: -5px 5px 0 var(--ink); }
.talk-card-eyebrow { font-family: var(--aeonik); font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky); margin-bottom: 8px; }
.talk-card-title { font-family: var(--aeonik); font-size: clamp(24px, 3vw, 40px); text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.05; }
.talk-card-subtitle { font-family: var(--inter); font-weight: 300; font-size: 18px; color: var(--muted-dark); margin-top: 10px; max-width: 52ch; }
.talk-card-arrow { font-family: var(--aeonik); font-size: 48px; color: var(--sky); }

.footer { margin-top: 100px; font-family: var(--aeonik); font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.footer a { color: var(--sky); text-decoration: none; }
`;

type Talk = {
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
};

const talks: Talk[] = [
  {
    slug: "infrastructure-for-answers",
    title: "Infrastructure for Answers",
    eyebrow: "Amsterdam AE Meetup · 27 May 2026",
    subtitle: "Engineering an analytics team for the agent era. Levels of agentic SQL, semantic context, and dbt as the new job.",
  },
];

export default function IndexPage() {
  return (
    <Fragment>
      <style>{CSS}</style>
      <main className="page">
        <div className="eyebrow">Dumky de Wilde</div>
        <h1 className="headline">
          Talks<span className="duckfeet">.</span>
        </h1>
        <p className="subtitle">Decks and notes from talks I've given. Built in the MotherDuck visual style — keyboard, click, or wheel to navigate.</p>
        <section className="talks">
          {talks.map((talk) => (
            <a key={talk.slug} className="talk-card" href={`${import.meta.env.BASE_URL}${talk.slug}/`}>
              <div>
                <div className="talk-card-eyebrow">{talk.eyebrow}</div>
                <div className="talk-card-title">{talk.title}</div>
                <div className="talk-card-subtitle">{talk.subtitle}</div>
              </div>
              <div className="talk-card-arrow" aria-hidden="true">→</div>
            </a>
          ))}
        </section>
        <footer className="footer">
          <a href="https://github.com/dumkydewilde/talks">github.com/dumkydewilde/talks ↗</a>
        </footer>
      </main>
    </Fragment>
  );
}
