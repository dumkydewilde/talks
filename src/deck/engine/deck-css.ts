// Global stylesheet for the deck framework. One <style> injected by <Deck>.
// Ported from the infrastructure-for-answers deck and extended with the
// template/component classes the MDX authoring layer needs.

import { TOKENS } from "./tokens";

export const DECK_CSS = `
@font-face {
  font-family: 'Aeonik Mono'; font-weight: 400; font-style: normal; font-display: swap;
  src: url('${import.meta.env.BASE_URL}AeonikMono-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Aeonik Fono'; font-weight: 400; font-style: normal; font-display: swap;
  src: url('${import.meta.env.BASE_URL}AeonikFono-Regular.woff2') format('woff2');
}
@import url('https://fonts.googleapis.com/css2?family=Cousine:wght@400;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --sand: ${TOKENS.color.sand};
  --ink: ${TOKENS.color.ink};
  --white: ${TOKENS.color.white};
  --code-header: ${TOKENS.color.codeHeader};
  --duck: ${TOKENS.color.duck};
  --sun: ${TOKENS.color.sun};
  --garden: ${TOKENS.color.garden};
  --watermelon: ${TOKENS.color.watermelon};
  --sky: ${TOKENS.color.sky};
  --muted: ${TOKENS.color.muted};
  --muted-dark: ${TOKENS.color.mutedDark};
  --rule: ${TOKENS.color.rule};
  --aeonik: ${TOKENS.font.aeonik};
  --inter: ${TOKENS.font.inter};
  --mono: ${TOKENS.font.mono};
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root {
  height: 100%; width: 100%; overflow: hidden;
  background: #000;
  font-family: var(--inter);
  -webkit-font-smoothing: antialiased;
}

.deck { position: relative; width: 100%; height: 100%; overflow: hidden; }
.nav-zone {
  position: absolute; top: 0; bottom: 0; width: clamp(48px, 6vw, 96px); z-index: 8;
  background: transparent; border: 0; padding: 0; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: var(--muted);
  opacity: 0; transition: opacity 0.18s ease, background 0.18s ease;
}
.nav-zone:hover, .nav-zone:focus-visible {
  opacity: 1; background: linear-gradient(90deg, rgba(56,56,56,0.06), rgba(56,56,56,0)); outline: none;
}
.nav-zone--right { right: 0; }
.nav-zone--right:hover, .nav-zone--right:focus-visible { background: linear-gradient(270deg, rgba(56,56,56,0.06), rgba(56,56,56,0)); }
.nav-zone--left { left: 0; }
.nav-zone:disabled { cursor: default; opacity: 0; pointer-events: none; }
.slide--ink ~ .nav-zone:hover { background: linear-gradient(90deg, rgba(244,239,234,0.08), rgba(244,239,234,0)); color: var(--sand); }
.slide--ink ~ .nav-zone--right:hover { background: linear-gradient(270deg, rgba(244,239,234,0.08), rgba(244,239,234,0)); }

.slide {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  opacity: 0; transform: translateY(14px); pointer-events: none;
  transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden; padding: 5vw 8vw; justify-content: center;
}
.slide.active { opacity: 1; transform: translateY(0); pointer-events: auto; }
.slide--flush { padding: 0; }
.slide--sand { background-color: var(--sand); color: var(--ink); }
.slide--ink  { background-color: var(--ink); color: var(--sand); }

@keyframes a-fade-up   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes a-fade-left { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes a-pop       { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes a-grow-x    { from { opacity: 0; transform: scaleX(0); transform-origin: left center; } to { opacity: 1; transform: scaleX(1); transform-origin: left center; } }
@keyframes a-loop-dash { to { stroke-dashoffset: -28; } }
@keyframes chat-cursor-blink { 0%, 55% { opacity: 0.55; } 56%, 100% { opacity: 0; } }

.slide:not(.active) [data-anim],
.slide:not(.active) .stagger > * { opacity: 0; }
.slide.active [data-anim="fade-up"]   { animation: a-fade-up 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active [data-anim="fade-left"] { animation: a-fade-left 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active [data-anim="pop"]       { animation: a-pop 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active [data-anim="grow-x"]    { animation: a-grow-x 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active .stagger > * { animation: a-fade-up 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active .stagger > *:nth-child(1) { animation-delay: 0.25s; }
.slide.active .stagger > *:nth-child(2) { animation-delay: 0.45s; }
.slide.active .stagger > *:nth-child(3) { animation-delay: 0.65s; }
.slide.active .stagger > *:nth-child(4) { animation-delay: 0.85s; }
.slide.active .stagger > *:nth-child(5) { animation-delay: 1.05s; }
.slide.active .stagger > *:nth-child(6) { animation-delay: 1.25s; }

.progress { position: absolute; bottom: 0; left: 0; height: 3px; background: var(--sky); transition: width 0.4s ease; z-index: 10; }
.slide-counter { position: absolute; bottom: 16px; right: 24px; font-family: var(--aeonik); font-size: 13px; letter-spacing: 0.16em; color: var(--muted); z-index: 10; }
.fullscreen-toggle {
  position: absolute; bottom: 12px; right: 84px; z-index: 11;
  display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px;
  background: rgba(244, 239, 234, 0.85); color: var(--ink); border: 1.5px solid var(--ink);
  border-radius: 4px; cursor: pointer; padding: 0; opacity: 0.55;
  transition: opacity 0.2s ease, transform 0.15s ease, background 0.2s ease;
}
.fullscreen-toggle:hover { opacity: 1; transform: translateY(-1px); }
.slide.active.slide--ink ~ .fullscreen-toggle { background: rgba(56, 56, 56, 0.65); color: var(--sand); border-color: var(--sand); }
.deck-badge { position: absolute; top: 20px; right: 24px; width: 28px; height: 20px; opacity: 0.65; z-index: 5; pointer-events: none; }
.deck-badge svg { width: 100%; height: 100%; display: block; }

/* ── Typography ── */
.eyebrow            { font-family: var(--aeonik); font-size: clamp(13px, 1.1vw, 22px); letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.eyebrow--watermelon{ color: var(--watermelon); }
.eyebrow--sun       { color: var(--sun); }
.eyebrow--sky       { color: var(--sky); }
.eyebrow--garden    { color: var(--garden); }
.headline-xxl { font-family: var(--aeonik); font-weight: 400; font-size: clamp(48px, min(9vw, 14vh), 160px); letter-spacing: -0.02em;  line-height: 1.0;  text-transform: uppercase; }
.headline-xl  { font-family: var(--aeonik); font-weight: 400; font-size: clamp(40px, min(7vw, 11vh), 120px); letter-spacing: -0.015em; line-height: 1.05; text-transform: uppercase; }
.headline-lg  { font-family: var(--aeonik); font-weight: 400; font-size: clamp(28px, min(4.5vw, 8vh), 76px);  letter-spacing: -0.01em;  line-height: 1.1;  text-transform: uppercase; }
.headline-md  { font-family: var(--aeonik); font-weight: 400; font-size: clamp(22px, min(3vw, 5.5vh), 48px);  letter-spacing: -0.01em;  line-height: 1.15; text-transform: uppercase; }
.body-lg { font-family: var(--inter); font-weight: 300; font-size: clamp(18px, 1.9vw, 30px); line-height: 1.45; }
.body-md { font-family: var(--inter); font-weight: 300; font-size: clamp(15px, 1.4vw, 22px); line-height: 1.5; }
.body-sm { font-family: var(--inter); font-weight: 300; font-size: clamp(12px, 1vw, 16px); line-height: 1.5; }
.bigstat { font-family: var(--aeonik); font-weight: 400; font-size: clamp(80px, min(18vw, 28vh), 220px); letter-spacing: -0.03em; line-height: 1.0; }
.accent-rule { height: 4px; width: clamp(80px, 10vw, 200px); background: var(--sky); }

/* MDX prose defaults (inside .prose containers) */
.prose { display: flex; flex-direction: column; gap: clamp(12px, 1.4vw, 24px); }
/* Box components must not collapse when a flex column runs tall. */
.img-chrome, .img-plain, .accent-rule, .qr-card, .chrome, .callout, .stat, .block-card { flex-shrink: 0; }
.prose a { color: inherit; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--sky); }
.prose ul { list-style: none; display: flex; flex-direction: column; gap: clamp(8px, 0.8vw, 14px); }
.prose li { position: relative; padding-left: 1.4em; font-family: var(--inter); font-weight: 300; font-size: clamp(15px, 1.4vw, 22px); line-height: 1.5; }
.prose li::before { content: ""; position: absolute; left: 0; top: 0.4em; width: 0.7em; height: 0.7em; background: var(--sky); border: 2px solid var(--ink); }
.prose code.inline { font-family: var(--mono); font-size: 0.85em; background: var(--code-header); border: 1px solid var(--rule); border-radius: 3px; padding: 0.05em 0.35em; }
.prose strong { font-weight: 600; }

/* Link pill: icon + text, used by <Link>. */
.link-pill { display: inline-flex; align-items: center; gap: 0.5em; align-self: flex-start; font-family: var(--mono); font-size: clamp(13px, 1.05vw, 18px); color: var(--ink); text-decoration: none; padding: 0.4em 0.7em; border: 2px solid var(--ink); background: var(--white); line-height: 1; }
.link-pill:hover { background: var(--sand); }
.link-pill svg { flex-shrink: 0; }
.slide--ink .link-pill { color: var(--sand); background: transparent; border-color: var(--sand); }
.slide--ink .link-pill:hover { background: rgba(244,239,234,0.1); }

/* ── Window chrome / code ── */
.chrome { background: var(--white); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--ink); border-radius: 2px; overflow: hidden; color: var(--ink); text-align: left; width: 100%; max-width: 100%; }
.chrome-titlebar { display: flex; align-items: center; gap: 12px; min-height: 46px; padding: 12px 16px; background: var(--sand); border-bottom: 2px solid var(--ink); }
.chrome-dots { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; }
.chrome-dot { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--ink); flex-shrink: 0; }
.chrome-dot--close { background: var(--watermelon); }
.chrome-dot--min   { background: var(--sun); }
.chrome-dot--max   { background: var(--garden); }
.chrome-title { font-family: var(--aeonik); font-weight: 400; font-size: clamp(12px, 1.1vw, 20px); letter-spacing: 0.04em; line-height: 1.2; text-transform: uppercase; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chrome-body { background: var(--white); color: var(--ink); }
.chrome-body--code { padding: clamp(16px, 2vw, 36px); font-family: var(--mono); font-size: clamp(14px, 1.3vw, 26px); line-height: 1.4; white-space: pre; overflow-x: auto; tab-size: 4; text-align: left; }
.chrome-footer { display: flex; align-items: baseline; justify-content: space-between; gap: clamp(12px, 1.5vw, 28px); padding: clamp(12px, 1.4vw, 22px) clamp(16px, 1.8vw, 30px); border-top: 2px solid var(--ink); text-align: left; }
.chrome-footer__label { color: var(--ink); flex-shrink: 0; }
.chrome-footer__value { font-family: var(--aeonik); font-size: clamp(18px, 2vw, 38px); letter-spacing: -0.01em; line-height: 1.05; color: var(--ink); white-space: nowrap; }

/* Chat transcript variant for agent/user exchanges inside terminal chrome. */
.chat-terminal__body { display: flex; flex-direction: column; background: var(--white); }
.chat-terminal__messages { display: flex; flex-direction: column; gap: clamp(10px, 1vw, 18px); padding: clamp(18px, 2vw, 34px); }
.chat-row { display: flex; width: 100%; }
.chat-row--user { justify-content: flex-end; }
.chat-row--agent, .chat-row--result { justify-content: flex-start; }
.chat-row--result { margin-top: clamp(-8px, -0.5vw, -4px); }
.chat-bubble { max-width: min(74%, 860px); border: 0; border-radius: 18px; padding: clamp(12px, 1.15vw, 20px) clamp(15px, 1.4vw, 24px); box-shadow: none; display: flex; flex-direction: column; gap: clamp(5px, 0.5vw, 10px); color: var(--ink); }
.chat-row--user .chat-bubble { background: color-mix(in srgb, var(--sky) 78%, white); border-bottom-right-radius: 5px; }
.chat-row--agent .chat-bubble { background: color-mix(in srgb, var(--sand) 72%, white); border-bottom-left-radius: 5px; }
.chat-row--result .chat-bubble { max-width: max-content; flex-direction: row; align-items: baseline; gap: 0.65em; padding: clamp(7px, 0.7vw, 11px) clamp(12px, 1vw, 18px); border-radius: 999px; background: color-mix(in srgb, var(--sun) 58%, white); }
.chat-bubble__label { display: none; font-family: var(--aeonik); font-size: clamp(10px, 0.8vw, 14px); letter-spacing: 0.14em; line-height: 1; text-transform: uppercase; color: var(--ink); opacity: 0.58; }
.chat-row--result .chat-bubble__label { display: block; }
.chat-bubble__content { font-family: var(--mono); font-size: clamp(14px, 1.2vw, 23px); line-height: 1.35; overflow-wrap: anywhere; }
.chat-row--result .chat-bubble__content { font-size: clamp(13px, 1vw, 19px); }
.chat-bubble__content .body-md { font: inherit; line-height: inherit; margin: 0; }
.chat-bubble__content p { margin: 0; }
.chat-bubble__content code.inline { font-size: 0.95em; background: transparent; border: 0; padding: 0; color: var(--ink); }
.chat-input { display: flex; align-items: center; gap: 0.2em; min-height: clamp(44px, 4.4vw, 66px); margin: 0 clamp(18px, 2vw, 34px) clamp(18px, 2vw, 34px); padding: 0 clamp(16px, 1.8vw, 30px); border: 2px solid var(--ink); border-radius: 2px; box-shadow: -5px 5px 0 var(--ink); background: var(--sand); color: var(--muted-dark); font-family: var(--mono); font-size: clamp(13px, 1.05vw, 20px); }
.chat-input__placeholder:empty::before { content: "Type a message..."; }
.chat-input__cursor { display: inline-block; width: 0.08em; height: 1.05em; background: var(--ink); animation: chat-cursor-blink 1.1s steps(1, end) infinite; }

/* ── Split frame (golden-split, half-and-half, left-title) ── full-bleed, edge to edge */
.split-frame { position: relative; z-index: 1; flex: 1; width: 100%; height: 100%; min-height: 0; background: var(--sand); overflow: hidden; display: grid; }
.split-panel { min-width: 0; min-height: 0; padding: clamp(34px, 5vw, 84px); display: flex; flex-direction: column; justify-content: center; gap: clamp(14px, 1.8vw, 28px); }
.split-panel--center { align-items: center; text-align: center; }
.split-panel--visual { padding: clamp(28px, 4vw, 70px); align-items: center; justify-content: center; }
.split-divider-right { border-right: 2px solid var(--ink); }
.split-divider-left { border-left: 2px solid var(--ink); }
/* Headlines in a narrow split column must fit vertically — scale below the hero sizes. */
.split-panel .headline-xl { font-size: clamp(26px, min(4vw, 7vh), 64px); }
.split-panel .headline-lg { font-size: clamp(23px, min(3.4vw, 6vh), 54px); }

/* ── Block grids (four/three/two-block) ── */
.block-stack { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: clamp(18px, 2.2vw, 38px); }
.block-grid { display: grid; gap: clamp(14px, 1.6vw, 28px); }
.block-grid--5 { grid-template-columns: repeat(5, 1fr); }
.block-grid--4 { grid-template-columns: repeat(4, 1fr); }
.block-grid--3 { grid-template-columns: repeat(3, 1fr); }
.block-grid--2 { grid-template-columns: repeat(2, 1fr); }
.block-header { margin-bottom: clamp(4px, 0.6vw, 12px); }
.block-card { background: var(--white); border: 2px solid var(--ink); box-shadow: -7px 7px 0 var(--ink); padding: clamp(16px, 1.5vw, 30px); display: flex; flex-direction: column; gap: clamp(8px, 0.9vw, 16px); min-height: clamp(170px, 21vh, 320px); }
.block-card__title { font-family: var(--aeonik); font-size: clamp(17px, 1.8vw, 32px); text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.05; }
.block-card__desc { font-family: var(--inter); font-weight: 300; font-size: clamp(12px, 1vw, 17px); line-height: 1.5; color: var(--ink); margin-top: auto; }
.block-illu { display: flex; align-items: center; justify-content: center; height: clamp(78px, 12vh, 156px); margin-bottom: clamp(4px, 0.6vw, 10px); }
.block-illu img { max-width: 100%; max-height: 100%; object-fit: contain; }
.block-card--image { padding: 0; overflow: hidden; min-height: clamp(220px, 40vh, 480px); }
.block-card--image .block-img-wrap { flex: 1; min-height: 0; overflow: hidden; position: relative; }
.block-card--image img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
.block-card__caption { padding: clamp(8px,0.8vw,14px) clamp(12px,1.2vw,20px); border-top: 2px solid var(--ink); background: var(--sand); font-family: var(--aeonik); font-size: clamp(13px, 1.1vw, 20px); text-transform: uppercase; letter-spacing: 0.04em; }

/* ── Callout / Stat ── */
.callout { font-family: var(--inter); font-weight: 500; font-size: clamp(16px, 1.7vw, 28px); line-height: 1.35; }
.callout-box { display: flex; align-items: flex-start; gap: clamp(12px, 1.2vw, 20px); padding: clamp(16px, 1.6vw, 26px) clamp(18px, 1.8vw, 30px); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--ink); color: var(--ink); text-align: left; align-self: flex-start; max-width: 100%; }
.callout-box__label { flex-shrink: 0; font-family: var(--aeonik); font-size: clamp(12px, 1vw, 17px); letter-spacing: 0.12em; text-transform: uppercase; color: var(--sand); background: var(--ink); padding: 0.4em 0.6em; line-height: 1; }
.callout-box__text { display: flex; flex-direction: column; gap: clamp(4px, 0.5vw, 9px); min-width: 0; }
.callout-box__title { font-family: var(--inter); font-weight: 600; font-size: clamp(16px, 1.6vw, 26px); line-height: 1.25; color: var(--ink); }
.callout-box__detail { font-family: var(--mono); font-size: clamp(13px, 1.1vw, 19px); line-height: 1.4; color: var(--ink); }
.tmpl-center .callout-box { align-self: center; }
.stat { display: flex; flex-direction: column; align-items: center; gap: 0.4vw; }
.stat__value { font-family: var(--aeonik); font-weight: 400; font-size: clamp(64px, min(15vw, 24vh), 200px); letter-spacing: -0.03em; line-height: 1.0; }
.stat__label { font-family: var(--aeonik); font-size: clamp(13px, 1.1vw, 22px); letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }

/* ── Carousel ── auto-advancing image slideshow.
   Slides are stacked in a single grid cell, so the carousel sizes to the TALLEST
   slide (no fixed height, no letterbox whitespace). */
.carousel { position: relative; width: 100%; display: grid; }
.carousel__slide { grid-area: 1 / 1; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.6s ease; pointer-events: none; }
.carousel__slide.is-active { opacity: 1; pointer-events: auto; }
.carousel__slide > * { max-width: 100%; }
/* By default, carousel image cards size to the rendered image dimensions. */
.carousel__slide .block-card--image { width: auto; height: auto; min-height: 0; gap: 0; }
.carousel__slide .block-img-wrap { flex: none; width: auto; height: auto; overflow: hidden; }
.carousel__slide .block-card--image img,
.carousel__slide > img { width: auto; height: auto; max-width: 100%; max-height: 66vh; object-fit: initial; }
/* Passing objectFit gives images a stable viewport and applies that fit mode. */
.carousel.carousel--fit .block-card--image { width: 100%; }
.carousel.carousel--fit .block-img-wrap { width: 100%; height: min(58vh, 620px); }
.carousel.carousel--fit .block-card--image img { width: 100%; height: 100%; max-width: none; max-height: none; object-fit: var(--carousel-object-fit); object-position: top; }
.carousel.carousel--fit .carousel__slide > img { width: 100%; height: min(66vh, 620px); object-fit: var(--carousel-object-fit); object-position: top; }
.carousel__dots { position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
.carousel__dot { width: 11px; height: 11px; border-radius: 999px; border: 2px solid var(--ink); background: transparent; cursor: pointer; padding: 0; transition: background 0.2s ease; }
.carousel__dot.is-active { background: var(--ink); }
.slide--ink .carousel__dot { border-color: var(--sand); }
.slide--ink .carousel__dot.is-active { background: var(--sand); }

/* ── Image with chrome ── */
.img-plain { display: block; max-width: 100%; max-height: 60vh; object-fit: contain; }
.img-chrome { background: var(--white); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--ink); overflow: hidden; max-width: 100%; }
.img-chrome img { display: block; width: 100%; height: auto; }

/* ── Full-bleed image stage (feature-image, title) ── */
.image-stage { position: relative; flex: 1; width: 100%; min-height: 0; overflow: hidden; }
.image-stage__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.image-stage__scrim { position: absolute; inset: 0; background: linear-gradient(90deg, var(--sand) 0%, var(--sand) 30%, rgba(244,239,234,0.92) 55%, rgba(244,239,234,0.55) 70%, rgba(244,239,234,0) 90%); pointer-events: none; }
.image-stage__scrim--ink { background: linear-gradient(90deg, rgba(56,56,56,0.94) 0%, rgba(56,56,56,0.86) 35%, rgba(56,56,56,0.45) 60%, rgba(56,56,56,0) 85%); }
.image-stage__content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 4vw 5vw; max-width: min(62vw, 920px); gap: clamp(14px, 1.8vw, 28px); }

.title-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0.92; }
.title-scrim { position: absolute; inset: 0; background: rgba(21, 31, 34, 0.66); }
.title-grid { position: relative; z-index: 1; height: 100%; display: grid; grid-template-columns: 1.7fr 1fr; align-items: center; gap: 4vw; padding: 5vw 6vw; }

/* ── QR card ── */
.qr-card { background: var(--white); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--ink); color: var(--ink); display: flex; flex-direction: column; gap: 12px; padding: clamp(16px, 1.6vw, 26px); align-items: center; text-align: center; }
.qr-card svg, .qr-card img { width: min(18vw, 220px); height: auto; aspect-ratio: 1 / 1; display: block; margin: 0 auto; }

/* ── Mermaid diagram ── */
.mermaid-wrap { display: flex; flex-direction: column; gap: clamp(10px, 1.2vw, 18px); width: 100%; align-items: center; }
.mermaid-wrap--with-code { display: grid; grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr); align-items: center; gap: clamp(18px, 2vw, 34px); }
.mermaid-figure { display: flex; align-items: center; justify-content: center; width: 100%; min-width: 0; }
.mermaid-svg { width: 100%; display: flex; justify-content: center; }
.mermaid-svg svg { width: 100%; max-width: 100%; height: auto; max-height: 52vh; }
/* Mermaid draws node borders at 1px; thicken them to match the brutalist frames. */
.mermaid-svg .node rect, .mermaid-svg .node circle, .mermaid-svg .node polygon,
.mermaid-svg .node path, .mermaid-svg .cluster rect { stroke-width: 2px; }
.mermaid-svg .edgePath .path, .mermaid-svg .flowchart-link { stroke-width: 2px; }
.mermaid-placeholder { min-height: clamp(180px, 30vh, 340px); display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 13px; color: var(--muted); }
.mermaid-source { margin: 0; background: var(--ink); color: var(--sand); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--muted-dark); padding: clamp(14px, 1.4vw, 22px); font-family: var(--mono); font-size: clamp(11px, 0.95vw, 15px); line-height: 1.65; white-space: pre; overflow: hidden; text-align: left; }
.mermaid-caption { font-family: var(--mono); font-size: clamp(11px, 0.9vw, 14px); color: var(--muted); text-align: center; }
.mermaid-wrap--with-code .mermaid-caption { grid-column: 1 / -1; }
.slide--ink .mermaid-source { border-color: var(--muted-dark); box-shadow: -8px 8px 0 rgba(0,0,0,0.35); }

/* ── Single-region template wrappers ── */
.tmpl-center { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: clamp(16px, 2vw, 34px); text-align: center; }
.tmpl-top { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: clamp(16px, 2vw, 32px); }

@media (prefers-reduced-motion: reduce) {
  .slide { transition: opacity 0.3s ease; }
  .slide.active [data-anim], .slide.active .stagger > * { animation: a-fade-up 0.3s ease both; transform: none !important; }
}
`;
