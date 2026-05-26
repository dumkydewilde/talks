import{j as e,r,c as o}from"./index-BmO-qL8p.js";const t={sand:"#F4EFEA",ink:"#383838",white:"#FFFFFF",sky:"#6FC2FF",duck:"#FF9538",muted:"#888888",mutedDark:"#A8A8A8"},n=`
@font-face {
  font-family: 'Aeonik Mono';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('/talks/AeonikMono-Regular.woff2') format('woff2');
}
@import url('https://fonts.googleapis.com/css2?family=Cousine:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --sand: ${t.sand};
  --ink: ${t.ink};
  --white: ${t.white};
  --sky: ${t.sky};
  --duck: ${t.duck};
  --muted: ${t.muted};
  --muted-dark: ${t.mutedDark};
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
`,s=[{slug:"infrastructure-for-answers",title:"Infrastructure for Answers",eyebrow:"Amsterdam AE Meetup · 27 May 2026",subtitle:"Engineering an analytics team for the agent era. Levels of agentic SQL, semantic context, and dbt as the new job."}];function i(){return e.jsxs(r.Fragment,{children:[e.jsx("style",{children:n}),e.jsxs("main",{className:"page",children:[e.jsx("div",{className:"eyebrow",children:"Dumky de Wilde"}),e.jsxs("h1",{className:"headline",children:["Talks",e.jsx("span",{className:"duckfeet",children:"."})]}),e.jsx("p",{className:"subtitle",children:"Decks and notes from talks I've given. Built in the MotherDuck visual style — keyboard, click, or wheel to navigate."}),e.jsx("section",{className:"talks",children:s.map(a=>e.jsxs("a",{className:"talk-card",href:`/talks/${a.slug}/`,children:[e.jsxs("div",{children:[e.jsx("div",{className:"talk-card-eyebrow",children:a.eyebrow}),e.jsx("div",{className:"talk-card-title",children:a.title}),e.jsx("div",{className:"talk-card-subtitle",children:a.subtitle})]}),e.jsx("div",{className:"talk-card-arrow","aria-hidden":"true",children:"→"})]},a.slug))}),e.jsx("footer",{className:"footer",children:e.jsx("a",{href:"https://github.com/dumkydewilde/talks",children:"github.com/dumkydewilde/talks ↗"})})]})]})}o.createRoot(document.getElementById("root")).render(e.jsx(i,{}));
