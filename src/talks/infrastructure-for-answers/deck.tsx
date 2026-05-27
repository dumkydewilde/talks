// MotherDuck presentation deck template (Dive-as-presentation).
// Reference implementation of the slide deck pattern in React + inline CSS:
// sand + ink slide variants, MotherDuck brand colors and typography,
// keyboard / click / wheel navigation, staggered animations, sky progress bar.
// Replace slide content with your own. Keep the styling tokens and navigation intact.

import { useState, useEffect, useCallback, Fragment } from "react";
import { useSQLQuery } from "../../shared/md-sdk";
import * as React from "react";
import { CloudOutline, Oval, Badge, Bean, Pebble, Drop } from "../../shared/shape-primitives";
import { QrCard, CodeBlock, DuckIcon } from "./components";
import {
  DECK_META, QR_FOLLOW, QR_MCP_MEMORY,
  TRANSITION_WHERE, TRAP_SETUP, TRAP_CATCH, TRAP_REVEAL, TRANSITION_WHY,
  LEVELS, LOOP_ANIM, LOOP_CODE, TRANSITION_CONTEXT, CONTEXT_STACK, COMMENT_ON,
  BENCHMARK, CONTEXT_BEATS, MANUAL_DRIFT, EVAL_LOOP, TRANSITION_SKILLS,
  MCP_MEMORY, TRANSITION_WAIT, DBT_SPLIT, DBT_STAGGER, CONTEXT_LAYER,
  ANSWER_WORKFLOW, ROLE_CHANGE, ACTIONS, ABOUT, PROPOSITIONS, DIVES, RESOURCES, CTA,
} from "./content";

const SLIDE_URL = DECK_META.slideUrl;

const TOKENS = {
  color: {
    sand: "#F4EFEA",
    ink: "#383838",
    white: "#FFFFFF",
    codeHeader: "#ECE5DD",
    duck: "#FF9538",
    sun: "#FFDE00",
    garden: "#16AA98",
    watermelon: "#FF7169",
    sky: "#6FC2FF",
    muted: "#888888",
    mutedDark: "#A8A8A8",
    rule: "#D6CDBE",
  },
  font: {
    aeonik: "'Aeonik Mono', 'Cousine', ui-monospace, Menlo, monospace",
    inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Cousine', ui-monospace, Menlo, monospace",
  },
};

const DECK_CSS = `
/* Aeonik Mono and Aeonik Fono are the licensed MotherDuck brand fonts.
   The plugin ships the woff2 files at:
     motherduck-design-illustration/assets/fonts/AeonikMono-Regular.woff2
     motherduck-design-illustration/assets/fonts/AeonikFono-Regular.woff2
   Host them at a URL the Dive can load (relative or absolute) and update the src below.
   The example URLs below assume the Dive is served from a host with the fonts at root.
   If the fonts can't load, the page falls through to Cousine (Google Fonts) as the closest substitute. */
@font-face {
  font-family: 'Aeonik Mono';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('${import.meta.env.BASE_URL}AeonikMono-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Aeonik Fono';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
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
  position: absolute;
  top: 0;
  bottom: 0;
  width: clamp(48px, 6vw, 96px);
  z-index: 8;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  opacity: 0;
  transition: opacity 0.18s ease, background 0.18s ease;
}
.nav-zone:hover,
.nav-zone:focus-visible {
  opacity: 1;
  background: linear-gradient(90deg, rgba(56,56,56,0.06), rgba(56,56,56,0));
  outline: none;
}
.nav-zone--right { right: 0; }
.nav-zone--right:hover,
.nav-zone--right:focus-visible {
  background: linear-gradient(270deg, rgba(56,56,56,0.06), rgba(56,56,56,0));
}
.nav-zone--left { left: 0; }
.nav-zone:disabled { cursor: default; opacity: 0; pointer-events: none; }
.slide--ink ~ .nav-zone:hover { background: linear-gradient(90deg, rgba(244,239,234,0.08), rgba(244,239,234,0)); color: var(--sand); }
.slide--ink ~ .nav-zone--right:hover { background: linear-gradient(270deg, rgba(244,239,234,0.08), rgba(244,239,234,0)); }
.slide {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  padding: 5vw 8vw;
  justify-content: center;
}
.slide.active { opacity: 1; transform: translateY(0); pointer-events: auto; }
.slide--sand    { background-color: var(--sand); color: var(--ink); }
.slide--ink { background-color: var(--ink); color: var(--sand); }

@keyframes a-fade-up   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes a-fade-left { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes a-pop       { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes a-grow-x    { from { opacity: 0; transform: scaleX(0); transform-origin: left center; } to { opacity: 1; transform: scaleX(1); transform-origin: left center; } }
@keyframes a-loop-dash { to { stroke-dashoffset: -28; } }
@keyframes a-loop-dot  { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18); } }

/* Illustration animations. Bound to stable class hooks inside duck SVGs.
   See skills/design/motherduck-design-illustration/references/animation-patterns.md */
@keyframes a-bob          { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes a-eye-open     { 0%, 92%, 100% { opacity: 1; } 95%, 97% { opacity: 0; } }
@keyframes a-eye-close    { 0%, 92%, 100% { opacity: 0; } 95%, 97% { opacity: 1; } }
@keyframes a-body-wiggle  { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2deg); } }
@keyframes a-banner-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
@keyframes a-bubble-wiggle{ 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-1.5deg); } }

.duck-rig         { animation: a-bob 3s cubic-bezier(0.5, 0, 0.5, 1) infinite; transform-origin: center; }
.duck-body        { transform-origin: 50% 100%; transform-box: fill-box; animation: a-body-wiggle 3.5s ease-in-out infinite; }
.duck-eyes-open   { opacity: 1; animation: a-eye-open  5s infinite; }
.duck-eyes-closed { opacity: 0; animation: a-eye-close 5s infinite; }
.duck-banner      { animation: a-banner-flash 4s ease-in-out infinite; }
.duck-chat-bubble { transform-origin: 50% 100%; transform-box: fill-box; animation: a-bubble-wiggle 3s ease-in-out infinite; }

.slide:not(.active) [data-anim],
.slide:not(.active) .stagger > *,
.slide:not(.active) .stagger-cards > * { opacity: 0; }

.slide.active [data-anim="fade-up"]   { animation: a-fade-up 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active [data-anim="fade-left"] { animation: a-fade-left 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active [data-anim="pop"]       { animation: a-pop 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active [data-anim="grow-x"]    { animation: a-grow-x 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }

.slide.active .stagger > * { animation: a-fade-up 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active .stagger > *:nth-child(1) { animation-delay: 0.30s; }
.slide.active .stagger > *:nth-child(2) { animation-delay: 0.55s; }
.slide.active .stagger > *:nth-child(3) { animation-delay: 0.80s; }
.slide.active .stagger > *:nth-child(4) { animation-delay: 1.05s; }
.slide.active .stagger > *:nth-child(5) { animation-delay: 1.30s; }

.slide.active .stagger-cards > * { animation: a-pop 0.55s cubic-bezier(0.2,0.8,0.2,1) both; }
.slide.active .stagger-cards > *:nth-child(1) { animation-delay: 0.40s; }
.slide.active .stagger-cards > *:nth-child(2) { animation-delay: 0.65s; }
.slide.active .stagger-cards > *:nth-child(3) { animation-delay: 0.90s; }

.progress { position: absolute; bottom: 0; left: 0; height: 3px; background: var(--sky); transition: width 0.4s ease; z-index: 10; }
.slide-counter { position: absolute; bottom: 16px; right: 24px; font-family: var(--aeonik); font-size: 13px; letter-spacing: 0.16em; color: var(--muted); z-index: 10; }
.fullscreen-toggle {
  position: absolute;
  bottom: 12px;
  right: 84px;
  z-index: 11;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(244, 239, 234, 0.85);
  color: var(--ink);
  border: 1.5px solid var(--ink);
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  opacity: 0.55;
  transition: opacity 0.2s ease, transform 0.15s ease, background 0.2s ease;
}
.fullscreen-toggle:hover { opacity: 1; transform: translateY(-1px); }
.slide--ink ~ .fullscreen-toggle,
.slide.active.slide--ink ~ .fullscreen-toggle { background: rgba(56, 56, 56, 0.65); color: var(--sand); border-color: var(--sand); }
.deck-badge { position: absolute; top: 20px; right: 24px; width: 28px; height: 20px; opacity: 0.65; z-index: 5; pointer-events: none; }
.deck-badge svg { width: 100%; height: 100%; display: block; }

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
.chrome { background: var(--white); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--ink); border-radius: 2px; overflow: hidden; color: var(--ink); }
.chrome-titlebar { display: flex; align-items: center; gap: 12px; min-height: 46px; padding: 12px 16px; background: var(--sand); border-bottom: 2px solid var(--ink); }
.chrome-dots { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; }
.chrome-dot { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--ink); flex-shrink: 0; }
.chrome-dot--close { background: var(--watermelon); }
.chrome-dot--min   { background: var(--sun); }
.chrome-dot--max   { background: var(--garden); }
.chrome-title { font-family: var(--aeonik); font-weight: 400; font-size: clamp(12px, 1.1vw, 20px); letter-spacing: 0.04em; line-height: 1.2; text-transform: uppercase; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chrome-body { background: var(--white); color: var(--ink); }
.chrome-body--code { padding: clamp(16px, 2vw, 36px); font-family: var(--mono); font-size: clamp(14px, 1.3vw, 26px); line-height: 1.4; white-space: pre; overflow-x: auto; }
.card { background: var(--white); border: 2px solid var(--ink); box-shadow: -8px 8px 0 var(--ink); padding: clamp(20px, 2vw, 36px); display: flex; flex-direction: column; gap: clamp(8px, 1vw, 16px); }
.split-frame { position: relative; z-index: 1; flex: 1; width: 100%; min-height: 0; border: 2px solid var(--ink); background: var(--sand); overflow: hidden; }
.split-panel { min-width: 0; min-height: 0; padding: clamp(40px, 6vw, 96px); display: flex; flex-direction: column; justify-content: center; gap: clamp(18px, 2.2vw, 36px); }
.split-panel--center { align-items: center; text-align: center; }
.split-panel--visual { padding: clamp(32px, 4.8vw, 80px); align-items: center; justify-content: center; }
.split-divider-right { border-right: 2px solid var(--ink); }
.split-divider-left { border-left: 2px solid var(--ink); }
.split-divider-top { border-top: 2px solid var(--ink); }
.split-band { min-height: clamp(72px, 12vh, 136px); padding: clamp(20px, 3vw, 40px); display: flex; align-items: center; justify-content: center; text-align: center; }
.split-list { display: flex; flex-direction: column; gap: clamp(18px, 2vw, 34px); margin-top: clamp(8px, 1vw, 18px); }
.split-list-item { display: grid; grid-template-columns: clamp(44px, 5vw, 72px) minmax(0, 1fr); align-items: center; gap: clamp(14px, 1.6vw, 24px); }
.split-icon { width: clamp(44px, 5vw, 72px); height: clamp(44px, 5vw, 72px); display: flex; align-items: center; justify-content: center; }
.split-icon svg,
.split-icon img { display: block; width: 100%; height: 100%; }
.split-art { width: min(100%, 520px); max-height: 52vh; }
.split-illustration-slot { width: 100%; min-height: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.split-illustration-slot svg,
.split-illustration-slot img { display: block; width: min(92%, 430px); height: auto; max-height: 68vh; }
.split-illustration-slot--sidebar { height: 100%; padding: clamp(32px, 5vh, 72px) clamp(16px, 3vw, 48px); }
.split-cta { font-family: var(--aeonik); font-size: clamp(18px, 2.2vw, 34px); letter-spacing: 0.08em; line-height: 1.25; text-transform: uppercase; color: var(--ink); }

.title-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.92;
}
.title-scrim {
  position: absolute;
  inset: 0;
  background: rgba(21, 31, 34, 0.66);
}
.qr-card {
  background: var(--white);
  border: 2px solid var(--ink);
  box-shadow: -8px 8px 0 var(--ink);
  color: var(--ink);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(16px, 1.6vw, 26px);
  align-items: center;
  text-align: center;
}
.qr-card img {
  width: min(18vw, 220px);
  aspect-ratio: 1 / 1;
  display: block;
  margin: 0 auto;
}
.qr-card--lg img { width: min(24vw, 320px); }

/* Full-bleed image with side gradient for hero-like image slides */
.image-stage {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}
.image-stage__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.image-stage__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--sand) 0%, var(--sand) 30%, rgba(244,239,234,0.92) 55%, rgba(244,239,234,0.55) 70%, rgba(244,239,234,0) 90%);
  pointer-events: none;
}
.image-stage__scrim--ink {
  background: linear-gradient(90deg, rgba(56,56,56,0.94) 0%, rgba(56,56,56,0.86) 35%, rgba(56,56,56,0.45) 60%, rgba(56,56,56,0) 85%);
}
.image-stage__content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4vw 5vw;
  max-width: min(60vw, 920px);
  gap: clamp(16px, 1.8vw, 28px);
}

/* Code highlight tweaks — keep monospace look but with subtle line cushion */
.chrome-body--code { tab-size: 4; }
.loop-wire {
  stroke: var(--rule);
  stroke-width: 4;
  stroke-linecap: round;
  fill: none;
}
.loop-wire--active {
  stroke: var(--sun);
  stroke-dasharray: 14 10;
  animation: a-loop-dash 0.75s linear infinite;
}
.loop-dot {
  position: absolute;
  width: 18px;
  height: 18px;
  margin-left: -9px;
  margin-top: -9px;
  border-radius: 999px;
  background: var(--sun);
  border: 2px solid var(--ink);
  box-shadow: 0 0 0 8px rgba(255, 222, 0, 0.24);
  transition: left 0.55s ease, top 0.55s ease, background 0.2s ease;
  animation: a-loop-dot 1s ease-in-out infinite;
  pointer-events: none;
}

@media (max-width: 820px) {
  .split-frame { overflow-y: auto; }
  .split-panel { padding: 36px 28px; }
  .split-band { min-height: 80px; }
}

@media (prefers-reduced-motion: reduce) {
  .slide { transition: opacity 0.3s ease; }
  .slide.active [data-anim],
  .slide.active .stagger > *,
  .slide.active .stagger-cards > * { animation: a-fade-up 0.3s ease both; transform: none !important; }

  .duck-rig, .duck-body,
  .duck-eyes-open, .duck-eyes-closed,
  .duck-banner, .duck-chat-bubble { animation: none !important; transform: none !important; }
  .duck-eyes-open   { opacity: 1; }
  .duck-eyes-closed { opacity: 0; }
}
`;

// ── Layout primitives ──
function HeroCenter({ children, gap = 32 }: { children: React.ReactNode; gap?: number }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, textAlign: "center" }}>
      {children}
    </div>
  );
}

function HeroLeft({ children, gap = 32 }: { children: React.ReactNode; gap?: number }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap }}>
      {children}
    </div>
  );
}

function AccentRule() {
  return <div className="accent-rule" data-anim="grow-x" style={{ animationDelay: "0.5s" }} />;
}

function DuckfeetLogo({ size = 120, fill = "var(--duck)" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size * (124 / 170)} viewBox="0 0 170 124" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.29998 86.3001C4.29998 86.3001 52 120.4 54.9 122.1C57.7 123.8 61.8 124.2 65.4 122.8C69 121.4 71.7 118.2 72.5 115C73.4 111.8 84.3 54.2001 84.3 54.2001C84.4 53.4001 84.7 51.1001 83.5 48.9001C81.8 45.9001 78 44.3001 74.6 45.3001C71.9 46.1001 70.5 48.1001 70.1 48.8001C69.5 49.9001 68.4 51.7001 66.4 53.3001C64.9 54.5001 63.4 55.2001 62.7 55.5001C56.6 58.0001 49.8 55.9001 45.9 50.9001C43.5 47.8001 39.2 46.6001 35.4 48.1001C31.6 49.6001 29.4 53.5001 29.7 57.4001C30.4 63.6001 26.9 69.8001 20.7 72.3001C17.4 73.6001 13.9 73.6001 10.8 72.6001C10.1 72.4001 7.59998 71.8001 5.09998 73.2001C1.99998 74.8001 0.399981 78.6001 1.19998 82.0001C1.79998 84.3001 3.59998 85.8001 4.29998 86.3001Z" fill={fill} />
      <path d="M83.7999 11.6002C83.7999 11.6002 100.8 67.8002 102 70.8002C103.2 73.9002 106.2 76.7002 109.9 77.8002C113.6 78.9002 117.7 78.0002 120.3 76.0002C122.9 74.0002 166.8 35.1002 166.8 35.1002C167.4 34.6002 169 32.9002 169.4 30.4002C169.9 27.0002 167.8 23.4002 164.6 22.1002C162 21.1002 159.6 21.8002 158.9 22.1002C157.8 22.6002 155.8 23.3002 153.3 23.4002C151.3 23.5002 149.8 23.1002 149 22.9002C142.7 21.1002 138.5 15.3002 138.5 9.00024C138.4 5.10024 135.8 1.50024 131.9 0.400236C127.9 -0.699764 123.8 1.00024 121.7 4.30024C118.4 9.70024 111.9 12.4002 105.5 10.6002C102.1 9.60024 99.2999 7.50024 97.4999 4.80024C96.9999 4.20024 95.3999 2.20024 92.5999 1.70024C89.1999 1.10024 85.4999 3.10024 84.0999 6.20024C82.9999 8.60024 83.5999 10.8002 83.7999 11.6002Z" fill={fill} />
    </svg>
  );
}

function DeckBadge({ variant }: { variant: "sand" | "ink" }) {
  return (
    <div className="deck-badge">
      <DuckfeetLogo size={28} fill={variant === "ink" ? "var(--muted-dark)" : "var(--ink)"} />
    </div>
  );
}

/* ── Ambient outline scatter ──
   Decoration on every slide. Pulls from the canonical shape-primitives:
   CloudOutline / Oval / Badge mirror the asset-library brand shapes
   (cloud 1.png, oval.png, badge.png) rendered as low-opacity outlines.
   Bean / Pebble / Drop are organic shapes also in shape-primitives.tsx,
   for the looser motherduck.com edge feel that the geometric asset library
   doesn't cover. */

type Pos = { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string };

function place(pos: Pos, size: number, opacity: number, stroke: string, Shape: React.FC<any>) {
  return (
    <Shape
      size={size}
      fill="none"
      stroke={stroke}
      strokeWidth={2}
      style={{ position: "absolute", pointerEvents: "none", opacity, ...pos }}
    />
  );
}

/* Ambient scatter: 2-3 outline shapes per slide, deterministic from a `seed`. */
function BlobScatter({ seed = 0, dark = false }: { seed?: number; dark?: boolean }) {
  const stroke = dark ? "var(--muted-dark)" : "var(--ink)";
  const base = dark ? 0.22 : 0.3;

  const layouts: React.ReactNode[][] = [
    [
      <React.Fragment key="a">{place({ top: -55, left: -90 }, 340, base,         stroke, Bean)}</React.Fragment>,
      <React.Fragment key="b">{place({ top: "38%", right: -40 }, 160, base - 0.06, stroke, Pebble)}</React.Fragment>,
      <React.Fragment key="c">{place({ bottom: -30, right: "22%" }, 220, base - 0.1, stroke, CloudOutline)}</React.Fragment>,
    ],
    [
      <React.Fragment key="a">{place({ top: -40, right: -60 }, 260, base,         stroke, CloudOutline)}</React.Fragment>,
      <React.Fragment key="b">{place({ bottom: 40, left: -50 }, 200, base - 0.07, stroke, Drop)}</React.Fragment>,
      <React.Fragment key="c">{place({ top: "55%", left: "60%" }, 140, base - 0.1, stroke, Pebble)}</React.Fragment>,
    ],
    [
      <React.Fragment key="a">{place({ top: -30, left: "55%" }, 220, base,         stroke, Oval)}</React.Fragment>,
      <React.Fragment key="b">{place({ bottom: -40, left: -40 }, 280, base - 0.08, stroke, Bean)}</React.Fragment>,
    ],
    [
      <React.Fragment key="a">{place({ top: 40, left: -30 }, 160, base,         stroke, Pebble)}</React.Fragment>,
      <React.Fragment key="b">{place({ bottom: -20, right: -30 }, 220, base - 0.05, stroke, Badge)}</React.Fragment>,
      <React.Fragment key="c">{place({ top: "60%", right: "30%" }, 130, base - 0.12, stroke, CloudOutline)}</React.Fragment>,
    ],
  ];

  return <>{layouts[Math.abs(seed) % layouts.length]}</>;
}

function Slide({
  variant,
  active,
  children,
  scatter,
  flush = false,
  badge = true,
}: {
  variant: "sand" | "ink";
  active: boolean;
  children: React.ReactNode;
  /** Pass the slide index for a stable per-slide outline layout. Set to `false`
   *  to suppress scatter on slides with their own decoration (typical for hero). */
  scatter?: number | false;
  flush?: boolean;
  badge?: boolean;
}) {
  return (
    <div className={`slide slide--${variant} ${active ? "active" : ""}`} style={flush ? { padding: 0 } : undefined}>
      {scatter !== false && (
        <BlobScatter seed={typeof scatter === "number" ? scatter : 0} dark={variant === "ink"} />
      )}
      {children}
      {badge && <DeckBadge variant={variant} />}
    </div>
  );
}

function HalfAndHalfTemplate({
  left,
  right,
  band,
  leftBackground = "var(--sky)",
  rightBackground = "var(--sand)",
  bandBackground = "var(--sky)",
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  /** Omit `band` for a pure 50/50 split with no bottom bar. */
  band?: React.ReactNode;
  leftBackground?: string;
  rightBackground?: string;
  bandBackground?: string;
}) {
  return (
    <div
      className="split-frame"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: band ? "minmax(0, 1fr) auto" : "1fr",
      }}
    >
      <section className="split-panel split-divider-right" style={{ background: leftBackground }}>
        {left}
      </section>
      <section className="split-panel split-panel--center split-panel--visual" style={{ background: rightBackground }}>
        {right}
      </section>
      {band && (
        <section className="split-band split-divider-top" style={{ gridColumn: "1 / -1", background: bandBackground }}>
          {band}
        </section>
      )}
    </div>
  );
}

function GoldenSplitTemplate({
  wide,
  narrow,
  wideSide = "left",
  wideBackground = "var(--sand)",
  narrowBackground = "var(--sky)",
}: {
  wide: React.ReactNode;
  narrow: React.ReactNode;
  wideSide?: "left" | "right";
  wideBackground?: string;
  narrowBackground?: string;
}) {
  const widePanel = (
    <section
      className={`split-panel ${wideSide === "left" ? "split-divider-right" : "split-divider-left"}`}
      style={{ background: wideBackground }}
    >
      {wide}
    </section>
  );
  const narrowPanel = (
    <section className="split-panel split-panel--center split-panel--visual" style={{ background: narrowBackground }}>
      {narrow}
    </section>
  );

  return (
    <div
      className="split-frame"
      style={{
        display: "grid",
        gridTemplateColumns: wideSide === "left" ? "1.618fr 1fr" : "1fr 1.618fr",
      }}
    >
      {wideSide === "left" ? (
        <>
          {widePanel}
          {narrowPanel}
        </>
      ) : (
        <>
          {narrowPanel}
          {widePanel}
        </>
      )}
    </div>
  );
}

const ICON_DUCKLINGS_SVG = String.raw`<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="58.9237" y="63.1768" width="73.5266" height="56.8236" rx="4.08352" fill="#F4EFEA"/>
<rect x="58.9237" y="63.1768" width="73.5266" height="56.8236" rx="4.08352" stroke="#383838" stroke-width="2"/>
<rect x="48.3354" y="52.5879" width="73.5266" height="56.8236" rx="4.08352" fill="#F4EFEA"/>
<rect x="48.3354" y="52.5879" width="73.5266" height="56.8236" rx="4.08352" stroke="#383838" stroke-width="2"/>
<g clip-path="url(#clip0_20298_27885)">
<rect x="36.7472" y="41" width="75.5266" height="58.8236" rx="5.08352" fill="#48BAAB"/>
<rect x="30.6375" y="36.0918" width="85.0931" height="21.1063" fill="#F4EFEA"/>
<rect x="30.6375" y="36.0918" width="85.0931" height="21.1063" stroke="#383838" stroke-width="2"/>
<circle cx="46.1591" cy="49.7983" r="2.35294" fill="#383838"/>
<circle cx="54.3944" cy="49.7983" r="2.35294" fill="#383838"/>
<circle cx="62.6298" cy="49.7983" r="2.35294" fill="#383838"/>
<path d="M49.189 68.0586H72.2953" stroke="#383838" stroke-width="2"/>
<path d="M58.0762 77.4707H100.734" stroke="#383838" stroke-width="2"/>
<path d="M49.189 86.8828H86.5146" stroke="#383838" stroke-width="2"/>
</g>
<rect x="37.7472" y="42" width="73.5266" height="56.8236" rx="4.08352" stroke="#383838" stroke-width="2"/>
<path d="M125.298 113.844C126.101 112.99 127.476 112.957 128.319 113.772L133.115 118.408C133.906 119.172 133.935 120.405 133.182 121.206L128.612 126.066C127.809 126.919 126.434 126.952 125.591 126.138L120.795 121.502C120.004 120.737 119.975 119.504 120.728 118.703L125.298 113.844Z" fill="#16AA98" stroke="#383838" stroke-width="2.15152" stroke-miterlimit="10"/>
<path d="M34.6009 57.5C25.9848 57.5 19 64.4848 19 73.1009V108C19 124.016 31.9837 137 48 137H121.5C124.538 137 127 134.538 127 131.5" stroke="#383838" stroke-width="2" stroke-dasharray="4 4"/>
<path d="M36.8511 50.6956C37.7661 49.7681 39.2945 49.7681 40.2095 50.6956L45.4167 55.9744C46.2752 56.8448 46.2752 58.2158 45.4167 59.0862L40.2095 64.365C39.2945 65.2925 37.7661 65.2925 36.8511 64.365L31.6439 59.0862C30.7854 58.2158 30.7854 56.8448 31.6439 55.9744L36.8511 50.6956Z" fill="#F4EFEA" stroke="#383838" stroke-width="2.15152" stroke-miterlimit="10"/>
<path d="M127.203 15.9464C128.325 15.2763 129.613 15.1293 130.786 15.4334C131.078 14.2543 131.82 13.1887 132.942 12.5187C135.175 11.185 138.066 11.9234 139.4 14.168C139.905 15.0193 140.114 15.965 140.057 16.8837C140.89 17.2709 141.62 17.9055 142.125 18.7568C143.459 21.0014 142.729 23.9023 140.496 25.236C139.374 25.9061 138.086 26.0531 136.913 25.749C136.621 26.9281 135.879 27.9937 134.757 28.6637C132.524 29.9975 129.633 29.259 128.299 27.0144C127.794 26.1631 127.585 25.2174 127.642 24.2987C126.809 23.9115 126.079 23.2769 125.574 22.4256C124.24 20.181 124.97 17.2801 127.203 15.9464Z" fill="#F4EFEA" stroke="#383838" stroke-width="2"/>
<path d="M121 20L109 20L90.5 20C86.0817 20 82.5 23.5817 82.5 28L82.5 36.5" stroke="#383838" stroke-width="2" stroke-miterlimit="3.99933" stroke-dasharray="4 4"/>
<path d="M82.5 33C84.1569 33 85.5 34.3431 85.5 36C85.5 37.6569 84.1569 39 82.5 39C80.8431 39 79.5 37.6569 79.5 36C79.5 34.3431 80.8431 33 82.5 33Z" fill="#383838"/>
<path d="M143.025 98.2557C143.337 97.9462 143.853 97.9517 144.158 98.2678L145.895 100.067C146.182 100.364 146.177 100.826 145.884 101.117L144.109 102.878C143.797 103.188 143.281 103.182 142.976 102.866L141.239 101.067C140.952 100.77 140.957 100.308 141.25 100.017L143.025 98.2557Z" fill="#F4EFEA" stroke="#383838" stroke-width="2.15152" stroke-miterlimit="10"/>
<path d="M44.86 132.487C45.4545 131.897 46.437 131.908 47.0188 132.51L50.3298 135.94C50.8757 136.505 50.8663 137.386 50.3084 137.94L46.9248 141.297C46.3303 141.887 45.3477 141.877 44.766 141.274L41.455 137.845C40.9091 137.28 40.9185 136.398 41.4764 135.845L44.86 132.487Z" fill="#F4EFEA" stroke="#383838" stroke-width="2.15152" stroke-miterlimit="10"/>
<path d="M22.2404 28.4091C22.7395 27.9139 23.5643 27.9227 24.0527 28.4285L26.8322 31.3072C27.2905 31.7819 27.2826 32.5217 26.8143 32.9865L23.9738 35.8051C23.4747 36.3003 22.6499 36.2915 22.1615 35.7857L19.382 32.907C18.9237 32.4323 18.9316 31.6925 19.3999 31.2277L22.2404 28.4091Z" fill="#F4EFEA" stroke="#383838" stroke-width="2.15152" stroke-miterlimit="10"/>
<defs>
<clipPath id="clip0_20298_27885">
<rect x="36.7472" y="41" width="75.5266" height="58.8236" rx="5.08352" fill="white"/>
</clipPath>
</defs>
</svg>`;
const ICON_CLOUD_DB_STORAGE_SVG = String.raw`<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M117.194 58.5816C113.883 58.5816 110.463 57.4074 108.276 54.9216C101.634 47.3727 91.8245 42.5908 80.803 42.5908C70.3656 42.5908 60.9689 46.87 54.3744 53.7571C51.1859 57.0871 46.3215 58.5816 41.7111 58.5816C30.6233 58.5816 21.5255 67.4186 21.5255 78.4999C21.5255 89.5812 30.4811 98.4182 41.7111 98.4182C46.3339 98.4182 51.2079 99.8856 54.4097 103.22C61.0352 110.12 70.3541 114.409 80.803 114.409C91.7173 114.409 101.518 109.616 108.243 102.052C110.447 99.5727 113.877 98.4182 117.194 98.4182C128.282 98.4182 137.38 89.5812 137.38 78.4999C137.38 67.4186 128.282 58.5816 117.194 58.5816Z" fill="#FFDE00" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M142.917 101.591C143.507 100.993 144.493 100.993 145.083 101.591L148.442 104.996C148.996 105.558 148.996 106.442 148.442 107.003L145.083 110.408C144.493 111.006 143.507 111.006 142.917 110.408L139.558 107.003C139.004 106.442 139.004 105.558 139.558 104.996L142.917 101.591Z" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M22.3131 125.628C23.9963 125.392 25.6149 125.861 26.8684 126.809C27.813 125.553 29.2404 124.658 30.9236 124.422C34.274 123.952 37.3688 126.275 37.8361 129.61C38.0134 130.874 37.7872 132.103 37.2554 133.166C38.0591 134.043 38.6143 135.162 38.7915 136.427C39.2588 139.761 36.9216 142.845 33.5712 143.315C31.8881 143.551 30.2694 143.082 29.016 142.134C28.0714 143.39 26.6439 144.285 24.9608 144.521C21.6104 144.991 18.5155 142.668 18.0482 139.334C17.871 138.069 18.0971 136.84 18.6289 135.777C17.8252 134.9 17.2701 133.781 17.0929 132.516C16.6255 129.182 18.9627 126.098 22.3131 125.628Z" stroke="#383838" stroke-width="2"/>
<path d="M114.092 15.1306C114.857 18.2331 107.286 22.7686 97.1815 25.2611C87.0771 27.7535 78.2654 27.259 77.5002 24.1565C76.7349 21.0541 84.3058 16.5185 94.4102 14.0261C104.515 11.5336 113.326 12.0282 114.092 15.1306Z" fill="white"/>
<path d="M114.092 15.1306C114.857 18.2331 107.286 22.7686 97.1815 25.2611C87.0771 27.7535 78.2654 27.259 77.5002 24.1565L83.407 48.1029C83.5223 48.5706 83.7916 48.9829 84.2086 49.2239C86.1237 50.3306 92.4635 53.189 103.405 50.4901C114.346 47.7913 118.629 42.3125 119.81 40.4422C120.067 40.0349 120.114 39.5446 119.998 39.077L114.092 15.1306Z" fill="white"/>
<path d="M114.092 15.1306C114.857 18.2331 107.286 22.7686 97.1815 25.2611C87.0771 27.7535 78.2654 27.259 77.5002 24.1565M114.092 15.1306C113.326 12.0282 104.515 11.5336 94.4102 14.0261C84.3058 16.5185 76.7349 21.0541 77.5002 24.1565M114.092 15.1306L119.998 39.077C120.114 39.5446 120.067 40.0349 119.81 40.4422C118.629 42.3125 114.346 47.7913 103.405 50.4901C92.4635 53.189 86.1237 50.3306 84.2086 49.2239C83.7916 48.9829 83.5223 48.5706 83.407 48.1029L77.5002 24.1565" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M117.038 26.984C117.911 30.5247 110.696 35.3502 100.921 37.7621C91.1458 40.174 81.0204 38.2741 80.1467 34.7334" stroke="#383838" stroke-width="2"/>
</svg>`;

function IconAsset({ svg }: { svg: string }) {
  return <span className="split-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

// DUCKS_ON_DATABASE_SVG: wrapped in duck-rig for bob; six eye paths classed as
// duck-eyes-open with matching duck-eyes-closed siblings appended for the
// cross-fade blink. Eye coordinates: big duck (195,277)+(237,277), mid duck
// (221,128)+(233,128), small duck (135,118)+(151,118).
const DUCKS_ON_DATABASE_SVG = String.raw`<svg width="417" height="411" viewBox="0 0 417 411" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g class="duck-rig">
<path d="M376.513 169.14C377.576 167.721 379.445 167.171 381.107 167.788L410.187 178.583C412.692 179.513 413.599 182.592 411.996 184.731L395.867 206.266C394.804 207.685 392.935 208.235 391.273 207.618L362.193 196.823C359.688 195.893 358.782 192.814 360.384 190.675L376.513 169.14Z" fill="#FFDE00" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M52.888 191.421H379.877V362.878C379.877 365.09 378.986 367.174 377.233 368.525C366.116 377.093 318.908 408.001 216.382 408.001C113.857 408.001 66.6493 377.093 55.5316 368.525C53.7792 367.174 52.888 365.09 52.888 362.878V191.421Z" fill="#F8F8F7" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M379.888 238.343C372.594 338.754 344.818 386.72 229.372 406.984V407.928C338.263 404.622 379.888 366.49 379.888 366.49V238.343Z" fill="#383838"/>
<path d="M379.877 190.879C379.877 211.799 306.678 228.758 216.382 228.758C126.087 228.758 52.888 211.799 52.888 190.879C52.888 169.959 126.087 153 216.382 153C306.678 153 379.877 169.959 379.877 190.879Z" fill="#383838" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M329.888 191C329.888 207.016 279.072 220 216.388 220C153.704 220 102.888 207.016 102.888 191C102.888 174.984 153.704 162 216.388 162C279.072 162 329.888 174.984 329.888 191Z" fill="#383838" stroke="#F8F8F7" stroke-width="2" stroke-miterlimit="10"/>
<path d="M295.888 191C295.888 200.389 260.295 208 216.388 208C172.481 208 136.888 200.389 136.888 191C136.888 181.611 172.481 174 216.388 174C260.295 174 295.888 181.611 295.888 191Z" fill="#383838" stroke="#F8F8F7" stroke-width="2" stroke-miterlimit="10"/>
<path class="duck-eyes-open" d="M200.888 277C200.888 283.627 198.193 289 194.868 289C191.86 289 189.367 284.602 188.92 278.855C188.898 278.571 189.056 278.304 189.313 278.181L195.235 275.341C195.772 275.084 195.765 274.316 195.223 274.068L190.064 271.707C189.753 271.565 189.588 271.219 189.685 270.892C190.734 267.365 192.662 265 194.868 265C198.193 265 200.888 270.373 200.888 277Z" fill="#383838"/>
<path class="duck-eyes-open" d="M242.888 277C242.888 283.627 240.193 289 236.868 289C233.86 289 231.367 284.602 230.92 278.855C230.898 278.571 231.056 278.304 231.313 278.181L237.235 275.341C237.772 275.084 237.765 274.316 237.223 274.068L232.064 271.707C231.753 271.565 231.588 271.219 231.685 270.892C232.734 267.365 234.662 265 236.868 265C240.193 265 242.888 270.373 242.888 277Z" fill="#383838"/>
<path d="M290.312 166.351C288.336 177.339 270.698 183.361 250.915 179.801C243.849 178.53 239.883 176.821 233.345 171.961C224.766 165.586 221.341 156.11 231.089 147.621C232.232 136.36 238.284 136.449 258.068 140.009C277.851 143.568 292.287 155.362 290.312 166.351Z" fill="#FFDE00" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M290.481 164.613C289.651 176.105 274.248 165.371 271.493 160.07C269.798 156.843 272.302 155.014 273.79 159.394C281.023 180.553 258.458 167.822 258.816 156.88" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M238.197 174.872C238.197 174.872 230.44 171.555 225.073 162.309C219.059 153.906 217.949 142.9 218.394 138.447C217.504 113.729 236.679 105.246 244.657 118.629C247.304 123.071 247.105 140.896 257.566 145.127L243.72 153.028L239.58 173.672L238.197 174.872Z" fill="#FFDE00"/>
<path d="M256.898 144.013C247.015 140.138 249.048 128.599 245.547 121.078C237.98 104.822 220.368 111.947 218.617 133.325C217.704 150.193 222.503 166.533 238.134 175.218" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path class="duck-eyes-open" d="M218.016 127.626C218.087 130.65 219.461 133.071 221.086 133.033C222.531 132.998 223.688 131.028 223.875 128.463C223.89 128.257 223.768 128.066 223.577 127.986L221.141 126.963C220.741 126.795 220.732 126.231 221.127 126.052L223.111 125.148C223.339 125.044 223.456 124.787 223.369 124.553C222.811 123.043 221.872 122.055 220.829 122.08C219.205 122.118 217.945 124.601 218.016 127.626Z" fill="#383838"/>
<path class="duck-eyes-open" d="M229.52 127.626C229.591 130.65 230.965 133.071 232.59 133.033C234.035 132.998 235.192 131.028 235.379 128.463C235.394 128.257 235.272 128.066 235.081 127.986L232.644 126.963C232.245 126.795 232.236 126.231 232.631 126.052L234.615 125.148C234.842 125.044 234.96 124.787 234.873 124.553C234.315 123.043 233.376 122.055 232.333 122.08C230.709 122.118 229.449 124.601 229.52 127.626Z" fill="#383838"/>
<path d="M236.208 140.072C230.222 139.581 227.905 136.248 225.864 133.856C224.34 135.549 220.784 139.363 208.088 139.585C202.288 139.013 195.232 138.95 195.313 142.342C195.421 146.865 209.072 145.97 214.936 144.625L217.087 145.063C223.161 151.704 229.725 149.687 235.583 144.773C238.932 145.308 239.774 140.364 236.208 140.072Z" fill="#FF7169"/>
<path d="M214.936 144.625L217.087 145.063C217.087 145.063 227.073 147.939 233.449 142.382M217.087 145.063C223.161 151.704 229.725 149.687 235.583 144.773C238.932 145.308 239.774 140.364 236.208 140.072C230.222 139.581 227.905 136.248 225.864 133.856C224.34 135.549 220.784 139.363 208.088 139.585M200.449 142.325C203.452 142.253 209.405 143.284 214.936 144.625M218.704 141.807C214.662 141.538 211.242 140.005 208.088 139.585M208.088 139.585C202.288 139.013 195.232 138.95 195.313 142.342C195.421 146.865 209.072 145.97 214.936 144.625" stroke="#383838" stroke-width="2"/>
<path d="M246.614 185.668C243.387 203.618 214.574 213.455 182.257 207.64C170.716 205.564 164.236 202.771 153.556 194.833C139.543 184.418 133.948 168.94 149.872 155.073C151.739 136.677 161.626 136.823 193.942 142.638C226.258 148.453 249.84 167.718 246.614 185.668Z" fill="white" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M246.89 182.83C245.535 201.603 220.373 184.069 215.872 175.409C213.104 170.137 217.195 167.15 219.624 174.304C231.44 208.868 194.58 188.072 195.165 170.198" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M161.483 199.589C161.483 199.589 148.812 194.17 140.045 179.066C130.22 165.341 128.407 147.362 129.134 140.087C127.68 99.7102 159.002 85.8528 172.035 107.714C176.359 114.97 176.034 144.089 193.122 151L170.504 163.905L163.742 197.629L161.483 199.589Z" fill="white"/>
<path d="M192.031 149.18C175.887 142.849 179.208 124 173.489 111.714C161.128 85.1592 132.359 96.7992 129.497 131.72C128.006 159.274 135.846 185.967 161.38 200.153" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path class="duck-eyes-open" d="M131.36 118.386C131.466 122.902 133.518 126.517 135.943 126.459C138.134 126.407 139.88 123.379 140.12 119.466C140.133 119.259 140.011 119.069 139.82 118.989L135.508 117.179C135.108 117.011 135.1 116.447 135.495 116.268L139.164 114.596C139.391 114.493 139.507 114.236 139.426 114C138.603 111.631 137.163 110.066 135.56 110.104C133.135 110.161 131.254 113.869 131.36 118.386Z" fill="#383838"/>
<path class="duck-eyes-open" d="M147.941 118.386C148.047 122.902 150.099 126.517 152.525 126.459C154.715 126.407 156.461 123.379 156.702 119.466C156.714 119.259 156.592 119.069 156.401 118.989L152.09 117.179C151.69 117.011 151.681 116.447 152.076 116.268L155.745 114.596C155.972 114.493 156.089 114.236 156.007 114C155.184 111.631 153.744 110.066 152.142 110.104C149.716 110.161 147.836 113.869 147.941 118.386Z" fill="#383838"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M142.684 127.191C145.848 130.886 151.602 134.955 160.865 135.701C167.832 136.261 165.683 143.918 161.083 144.279C158.93 144.448 155.619 148.229 152.014 151.662C147.984 155.501 144.183 157.252 139.467 157.372C130.959 157.589 126.534 148.69 125.803 143.877C116.735 145.972 95.6178 147.389 95.4397 140.392C95.3061 135.144 106.222 135.226 115.197 136.097C134.838 135.723 140.331 129.813 142.684 127.191ZM156.128 140.726C150.737 143.929 139.997 147.268 130.698 145.052C130.994 145.79 131.277 146.584 131.568 147.401C132.92 151.192 135.623 153.538 139.369 153.442C144.6 153.309 151.668 147.83 155.152 142.275C155.501 141.719 155.827 141.198 156.128 140.726Z" fill="#FF9538"/>
<path d="M130.698 145.052C139.997 147.268 150.737 143.929 156.128 140.726C155.827 141.198 155.501 141.719 155.152 142.275C151.668 147.83 144.6 153.309 139.369 153.442C135.623 153.538 132.92 151.192 131.568 147.401C131.277 146.584 130.994 145.79 130.698 145.052Z" fill="#383838"/>
<path d="M160.05 141.081C157.739 141.723 156.336 140.925 156.128 140.726C150.737 143.929 139.997 147.268 130.698 145.052M156.128 140.726C155.827 141.198 155.501 141.719 155.152 142.275C151.668 147.83 144.6 153.309 139.369 153.442C135.623 153.538 132.92 151.192 131.568 147.401C131.277 146.584 130.994 145.79 130.698 145.052M103.385 140.354C108.031 140.236 117.243 141.817 125.803 143.877C127.321 144.243 128.947 144.635 130.698 145.052M130.041 139.511C123.787 139.105 120.078 136.739 115.197 136.097M115.197 136.097C106.222 135.226 95.3061 135.144 95.4397 140.392C95.6178 147.389 116.735 145.972 125.803 143.877M115.197 136.097C134.838 135.723 140.331 129.813 142.684 127.191C145.848 130.886 151.602 134.955 160.865 135.701C167.832 136.261 165.683 143.918 161.083 144.279C158.93 144.448 155.619 148.229 152.014 151.662C147.984 155.501 144.183 157.252 139.467 157.372C130.959 157.589 126.534 148.69 125.803 143.877" stroke="#383838" stroke-width="2"/>
<path d="M69.9667 321.538L70.3123 322.051L70.9263 321.97L87.7734 319.76L87.1847 336.752L87.164 337.371L87.7063 337.666L102.636 345.787L92.1766 359.188L91.796 359.674L92.062 360.232L99.3682 375.583L83.0352 380.272L82.4418 380.443L82.3279 381.051L79.2222 397.766L63.2535 391.955L62.6716 391.743L62.223 392.169L49.8907 403.865L40.3854 389.773L40.0399 389.259L39.4268 389.34L22.5769 391.55L23.1675 374.559L23.1892 373.94L22.6458 373.645L7.71633 365.524L18.1756 352.123L18.5561 351.636L18.2901 351.079L10.9821 335.728L27.317 331.039L27.9114 330.868L28.0242 330.26L31.1301 313.544L47.0996 319.356L47.6806 319.568L48.1291 319.141L60.4616 307.445L69.9667 321.538Z" fill="#6FC2FF" stroke="#383838" stroke-width="2"/>
<path d="M169.735 12.0881L209.563 2.57474C212.545 1.86248 215.529 3.59495 216.383 6.44473L216.459 6.72386L218.771 16.1666C219.314 18.3846 218.445 20.6231 216.717 21.9468L217.166 23.7242C219.348 24.0971 221.194 25.7068 221.744 27.9514L224.012 37.2159C224.75 40.2309 222.875 43.2855 219.796 44.0209L179.969 53.5343C176.891 54.2696 173.811 52.3997 173.073 49.3852L170.805 40.1208C170.262 37.9026 171.131 35.6642 172.858 34.3405L172.41 32.5631C170.228 32.1903 168.381 30.5796 167.832 28.3349L165.52 18.8932C164.782 15.8782 166.657 12.8235 169.735 12.0881Z" fill="#16AA98" stroke="#383838" stroke-width="2" stroke-linejoin="bevel"/>
<g class="duck-eyes-closed" opacity="0">
  <path d="M189 278 Q195 282 201 278" stroke="#383838" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M231 278 Q237 282 243 278" stroke="#383838" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M218 128 Q221 131 224 128" stroke="#383838" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M229 128 Q232 131 236 128" stroke="#383838" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M131 118 Q135 121 140 118" stroke="#383838" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M148 118 Q152 121 157 118" stroke="#383838" stroke-width="2" stroke-linecap="round" fill="none"/>
</g>
</g>
</svg>`;

// CINEMA_DUCK_SVG: wrapped in duck-rig for bob only. The duck wears 3D glasses
// (red + blue lenses around y=60) which cover the eyes, so eye-swap blink does
// not apply. Same logic as the party-banner duck with sunglasses.
const CINEMA_DUCK_SVG = String.raw`<svg width="533" height="344" viewBox="0 0 533 344" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g class="duck-rig">
<path d="M316.363 226.063L319.002 312.395L245.281 312.077L245.284 311.324C245.284 311.324 303.599 290.636 309.384 274.692C316.997 253.634 309.144 225.429 309.144 225.429L316.363 226.063Z" fill="#FF9538" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M317.523 268.404L316.992 251.831L312.713 245.809C312.713 245.809 313.106 257.033 311.31 268.404C312.814 268.712 315.87 268.096 317.523 268.404Z" fill="#383838"/>
<path d="M400.317 253.41C380.683 280.836 325.414 276.325 276.871 243.335C259.535 231.552 251.099 222.242 239.857 201.365C225.107 173.973 228.251 144.27 265.523 132.788C283.275 103.639 301.905 108.066 350.448 141.057C398.991 174.048 419.951 225.984 400.317 253.41Z" fill="white" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M337.581 226.191L334.203 312.498L407.924 312.817L407.927 312.063C407.927 312.063 349.792 290.872 344.143 274.879C336.711 253.756 344.806 225.62 344.806 225.62L337.581 226.191Z" fill="#FF9538" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M342.352 267.797C341.8 265.038 341.019 251.195 341.249 247.055L336.421 245.675L336.421 267.797L342.352 267.797Z" fill="#383838"/>
<path d="M323.966 242.72C335.08 253.98 349.984 255.219 356.047 254.431C375.204 253.665 360.384 224.492 336.755 220.92C317.851 218.062 320.353 234.262 323.966 242.72Z" fill="white"/>
<path d="M355.529 254.408C349.505 255.202 334.696 253.965 323.659 242.664" stroke="#383838" stroke-width="2"/>
<path d="M405.488 217.356C396.83 245.484 361.878 221.916 345.476 201.721C341.238 196.503 338.239 191.511 337.251 187.693C334.272 176.36 343.439 172.443 344.939 187.233C345.516 192.818 345.673 197.623 345.476 201.721C343.151 250.086 291.517 199.902 299.832 168.547" fill="white"/>
<path d="M405.488 217.356C396.83 245.484 361.878 221.916 345.476 201.721C345.673 197.623 345.516 192.818 344.939 187.233C343.439 172.443 334.272 176.36 337.251 187.693C338.239 191.511 341.238 196.503 345.476 201.721C343.151 250.086 291.517 199.902 299.832 168.547C307.062 128.245 346.797 143.969 367.976 157.379C403.261 186.512 408.752 209.942 405.488 217.356Z" fill="white"/>
<path d="M298.825 169.029C289.576 202.983 351.015 259.747 344 188.138C342.578 173.324 333.354 177.161 336.28 188.528C341.002 207.178 393.474 254.152 404.613 218.831C407.931 211.441 403.019 185.172 368.757 155.47" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M212.175 82.8608C224.966 19.4965 281.459 10.755 295.058 55.1897C303.674 83.3398 292.555 108.521 306.051 134.35L220.127 196.778C221.035 178.611 218.576 125.741 212.595 104.706L211.926 99.9033C211.151 97.5183 210.156 99.0809 210.866 92.2938C211.198 89.1251 211.63 85.9782 212.175 82.8608Z" fill="white"/>
<path d="M306.054 134.351C292.154 111.207 303.676 83.3411 295.061 55.1909C281.602 11.2134 224.968 19.4976 212.177 82.8621C211.633 85.9795 211.07 94.7975 210.738 97.9661C211.763 120.718 221.961 156.209 219.938 169.632" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
<path d="M260.729 90.2265C245.597 88.2167 240.141 79.4601 235.264 73.1293C231.18 77.2308 221.667 86.4599 189.412 85.4034C174.762 83.2125 156.861 82.1506 156.634 90.7712C156.332 102.265 191.096 101.735 206.151 99.0693L211.556 100.455C226.127 118.088 243.046 113.806 258.541 102.08C266.974 103.865 269.741 91.4229 260.729 90.2265Z" fill="#FF9538"/>
<path d="M206.151 99.0693L211.556 100.455C211.556 100.455 241.738 109.292 258.633 96.0002M211.556 100.455C226.127 118.088 243.046 113.806 258.541 102.08C266.974 103.865 269.741 91.4229 260.729 90.2265C245.597 88.2167 240.141 79.4601 235.264 73.1293C231.18 77.2308 221.667 86.4599 189.412 85.4034M169.673 91.3839C177.304 91.5847 192.283 94.9615 206.151 99.0693M213.475 92.2669C203.25 91.0693 197.366 86.8718 189.412 85.4034M189.412 85.4034C174.762 83.2125 156.861 82.1506 156.634 90.7712C156.332 102.265 191.096 101.735 206.151 99.0693" stroke="#383838" stroke-width="2"/>
<path d="M284.648 55.9487L280.242 82.6019L248.185 75.1963L240.095 59.1101L239.375 57.6772L238.405 58.9547L229.418 70.7919L197.44 63.4032L202.083 39.8959L284.648 55.9487Z" fill="#818181" stroke="#383838" stroke-width="2"/>
<path d="M309.535 70.498C309.989 71.27 310.471 72.5601 310.829 74.1451C311.212 75.8412 311.435 77.7794 311.364 79.6012C311.293 81.4396 310.927 83.0622 310.218 84.2079C309.686 85.0666 308.954 85.6744 307.919 85.9183C306.677 76.1668 303.771 70.9617 300.463 68.8243C296.956 66.5579 293.291 67.9111 291.512 70.4713L282.131 80.6524L286.085 56.7271L309.535 70.498Z" fill="#383838" stroke="#383838" stroke-width="2"/>
<path d="M278.95 59.3192L276.014 75.969L252.059 70.8006L246.577 61.0836L247.769 53.3459L278.95 59.3192Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M203.18 59.1143L225.803 64.206L232.252 59.1898L232.716 50.458L205.908 45.5946L203.18 59.1143Z" fill="#2BA5FF" stroke="#383838" stroke-width="2"/>
<path opacity="0.5" d="M275.789 72.4675C276.041 70.2884 276.422 68.0112 276.787 65.997L269.239 58.2241C266.375 57.7027 263.197 57.1271 260.401 56.6189L275.789 72.4675Z" fill="white"/>
<path opacity="0.5" d="M228.032 61.4706C229.731 60.1317 231.654 58.7302 231.443 58.6881C231.443 58.6864 231.451 58.6084 231.466 58.4693L222.708 49.4498L215.028 48.0778L228.032 61.4706Z" fill="white"/>
<path d="M459.324 312.484H200.183" stroke="#383838" stroke-width="2"/>
<path d="M275.458 151.363C278.363 155.734 273.25 157.354 270.933 157.181C273.161 159.136 278.569 165.336 270.996 168.091C267.637 168.895 267.182 167.605 265.64 165.336C264.429 168.477 260.671 168.394 258.478 167.902C252.592 166.584 255.866 159.909 258.083 157.89C253.24 152.568 256.495 147.678 259.66 146.223C266.698 143.372 268.668 148.861 268.773 151.962C271.712 148.418 274.454 150.085 275.458 151.363Z" fill="#EFE8E0"/>
<path d="M265.415 159.23C266.12 162.06 266.164 163.976 265.64 165.336M265.64 165.336C264.429 168.477 260.671 168.394 258.478 167.902C252.592 166.584 255.866 159.909 258.083 157.89C253.24 152.568 256.495 147.678 259.66 146.223C266.698 143.372 268.668 148.861 268.773 151.962C271.712 148.418 274.454 150.085 275.458 151.363C278.363 155.734 273.25 157.354 270.933 157.181C273.161 159.136 278.569 165.336 270.996 168.091C267.637 168.895 267.182 167.605 265.64 165.336Z" stroke="#383838" stroke-width="2"/>
<path d="M263.052 157.711C255.364 153.069 261.959 147.416 263.17 145.892C251.883 148.993 256.102 155.32 258.957 157.856C251.224 166.908 258.364 167.411 261.995 168.247C262.05 168.262 262.107 168.275 262.164 168.287C262.109 168.274 262.052 168.261 261.995 168.247C257.253 167.04 258.961 159.85 263.052 157.711Z" fill="#E1D6CB"/>
<path d="M265.415 159.23C266.12 162.06 266.164 163.976 265.64 165.336M265.64 165.336C264.429 168.477 260.671 168.394 258.478 167.902C252.592 166.584 255.866 159.909 258.083 157.89C253.24 152.568 256.495 147.678 259.66 146.223C266.698 143.372 268.668 148.861 268.773 151.962C271.712 148.418 274.454 150.085 275.458 151.363C278.363 155.734 273.25 157.354 270.933 157.181C273.161 159.136 278.569 165.336 270.996 168.091C267.637 168.895 267.182 167.605 265.64 165.336Z" stroke="#383838" stroke-width="2"/>
<path d="M229.281 175.53C228.164 180.659 223.443 178.116 221.954 176.331C222.101 179.292 221.413 187.49 214.164 183.971C211.249 182.118 211.858 180.894 212.414 178.207C209.316 179.524 206.76 176.768 205.586 174.851C202.436 169.707 209.508 167.412 212.5 167.599C212.951 160.417 218.727 159.35 221.975 160.61C228.92 163.679 226.351 168.914 224.197 171.148C228.788 170.791 229.499 173.921 229.281 175.53Z" fill="#EFE8E0"/>
<path d="M216.641 173.796C215.1 176.272 213.755 177.637 212.414 178.207M212.414 178.207C209.316 179.524 206.76 176.768 205.586 174.851C202.436 169.707 209.508 167.412 212.5 167.599C212.951 160.417 218.727 159.35 221.975 160.61C228.92 163.679 226.351 168.914 224.197 171.148C228.788 170.791 229.499 173.921 229.281 175.53C228.164 180.659 223.443 178.116 221.954 176.331C222.101 179.292 221.413 187.49 214.164 183.971C211.249 182.118 211.858 180.894 212.414 178.207Z" stroke="#383838" stroke-width="2"/>
<path d="M216.088 171.042C214.07 162.291 222.72 163.092 224.656 162.9C214.573 156.955 212.967 164.388 213.134 168.203C201.252 168.952 205.861 174.428 207.787 177.617C207.816 177.667 207.845 177.717 207.876 177.767C207.847 177.717 207.818 177.668 207.787 177.617C205.354 173.373 211.705 169.594 216.088 171.042Z" fill="#E1D6CB"/>
<path d="M216.641 173.796C215.1 176.272 213.755 177.637 212.414 178.207M212.414 178.207C209.316 179.524 206.76 176.768 205.586 174.851C202.436 169.707 209.508 167.412 212.5 167.599C212.951 160.417 218.727 159.35 221.975 160.61C228.92 163.679 226.351 168.914 224.197 171.148C228.788 170.791 229.499 173.921 229.281 175.53C228.164 180.659 223.443 178.116 221.954 176.331C222.101 179.292 221.413 187.49 214.164 183.971C211.249 182.118 211.858 180.894 212.414 178.207Z" stroke="#383838" stroke-width="2"/>
<path d="M191.077 169.13C189.961 174.259 185.239 171.715 183.751 169.93C183.898 172.891 183.21 181.09 175.961 177.571C173.046 175.717 173.655 174.493 174.211 171.807C171.113 173.124 168.557 170.367 167.383 168.451C164.233 163.307 171.304 161.011 174.297 161.199C174.747 154.016 180.524 152.95 183.771 154.21C190.717 157.279 188.147 162.514 185.994 164.747C190.585 164.39 191.296 167.52 191.077 169.13Z" fill="#EFE8E0"/>
<path d="M178.438 167.395C176.897 169.872 175.552 171.237 174.211 171.807M174.211 171.807C171.113 173.124 168.557 170.367 167.383 168.451C164.233 163.307 171.304 161.011 174.297 161.199C174.747 154.016 180.524 152.95 183.771 154.21C190.717 157.279 188.147 162.514 185.994 164.747C190.585 164.39 191.296 167.52 191.077 169.13C189.961 174.259 185.239 171.715 183.751 169.93C183.898 172.891 183.21 181.09 175.961 177.571C173.046 175.717 173.655 174.493 174.211 171.807Z" stroke="#383838" stroke-width="2"/>
<path d="M177.885 164.642C175.867 155.891 184.517 156.692 186.453 156.501C176.37 150.555 174.764 157.989 174.931 161.803C163.049 162.552 167.658 168.028 169.584 171.217C169.613 171.267 169.642 171.317 169.673 171.367C169.644 171.318 169.614 171.268 169.584 171.217C167.15 166.973 173.502 163.194 177.885 164.642Z" fill="#E1D6CB"/>
<path d="M178.438 167.395C176.897 169.872 175.552 171.237 174.211 171.807M174.211 171.807C171.113 173.124 168.557 170.367 167.383 168.451C164.233 163.307 171.304 161.011 174.297 161.199C174.747 154.016 180.524 152.95 183.771 154.21C190.717 157.279 188.147 162.514 185.994 164.747C190.585 164.39 191.296 167.52 191.077 169.13C189.961 174.259 185.239 171.715 183.751 169.93C183.898 172.891 183.21 181.09 175.961 177.571C173.046 175.717 173.655 174.493 174.211 171.807Z" stroke="#383838" stroke-width="2"/>
<path d="M189.879 144.975C192.093 149.734 186.795 150.565 184.53 150.045C186.438 152.313 190.851 159.257 182.95 160.841C179.508 161.13 179.252 159.787 178.069 157.311C176.4 160.234 172.697 159.586 170.603 158.77C164.982 156.58 169.224 150.474 171.72 148.813C167.733 142.821 171.687 138.477 175.035 137.516C182.422 135.757 183.543 141.48 183.18 144.561C186.619 141.499 189.079 143.561 189.879 144.975Z" fill="#EFE8E0"/>
<path d="M178.766 151.241C179.037 154.145 178.792 156.046 178.069 157.311M178.069 157.311C176.4 160.234 172.697 159.586 170.603 158.77C164.982 156.58 169.224 150.474 171.72 148.813C167.733 142.821 171.687 138.477 175.035 137.516C182.422 135.757 183.543 141.48 183.18 144.561C186.619 141.499 189.079 143.561 189.879 144.975C192.093 149.734 186.795 150.565 184.53 150.045C186.438 152.313 190.851 159.257 182.95 160.841C179.508 161.13 179.252 159.787 178.069 157.311Z" stroke="#383838" stroke-width="2"/>
<path d="M176.659 149.383C169.758 143.637 177.129 139.041 178.555 137.717C166.93 139.084 170.148 145.974 172.589 148.91C163.582 156.695 170.565 158.267 174.028 159.64C174.081 159.663 174.135 159.685 174.19 159.706C174.137 159.684 174.083 159.662 174.028 159.64C169.522 157.733 172.293 150.882 176.659 149.383Z" fill="#E1D6CB"/>
<path d="M178.766 151.241C179.037 154.145 178.792 156.046 178.069 157.311M178.069 157.311C176.4 160.234 172.697 159.586 170.603 158.77C164.982 156.58 169.224 150.474 171.72 148.813C167.733 142.821 171.687 138.477 175.035 137.516C182.422 135.757 183.543 141.48 183.18 144.561C186.619 141.499 189.079 143.561 189.879 144.975C192.093 149.734 186.795 150.565 184.53 150.045C186.438 152.313 190.851 159.257 182.95 160.841C179.508 161.13 179.252 159.787 178.069 157.311Z" stroke="#383838" stroke-width="2"/>
<path d="M232.015 129.001C235.144 133.216 230.123 135.099 227.799 135.047C230.126 136.883 235.849 142.794 228.431 145.94C225.117 146.917 224.596 145.653 222.938 143.467C221.892 146.667 218.135 146.779 215.919 146.403C209.973 145.392 212.894 138.556 215.004 136.425C209.89 131.362 212.886 126.309 215.971 124.691C222.851 121.478 225.104 126.857 225.37 129.948C228.121 126.255 230.946 127.778 232.015 129.001Z" fill="#EFE8E0"/>
<path d="M222.395 137.381C223.247 140.171 223.391 142.082 222.938 143.467M222.938 143.467C221.892 146.667 218.135 146.779 215.919 146.403C209.973 145.392 212.894 138.556 215.004 136.425C209.89 131.362 212.886 126.309 215.971 124.691C222.851 121.478 225.104 126.857 225.37 129.948C228.121 126.255 230.946 127.778 232.015 129.001C235.144 133.216 230.123 135.099 227.799 135.047C230.126 136.883 235.849 142.794 228.431 145.94C225.117 146.917 224.596 145.653 222.938 143.467Z" stroke="#383838" stroke-width="2"/>
<path d="M219.956 135.987C212.037 131.752 218.329 125.763 219.458 124.178C208.348 127.863 212.891 133.962 215.874 136.345C208.623 145.788 215.78 145.918 219.449 146.564C219.505 146.576 219.562 146.586 219.62 146.596C219.564 146.585 219.507 146.575 219.449 146.564C214.651 145.606 215.982 138.336 219.956 135.987Z" fill="#E1D6CB"/>
<path d="M222.395 137.381C223.247 140.171 223.391 142.082 222.938 143.467M222.938 143.467C221.892 146.667 218.135 146.779 215.919 146.403C209.973 145.392 212.894 138.556 215.004 136.425C209.89 131.362 212.886 126.309 215.971 124.691C222.851 121.478 225.104 126.857 225.37 129.948C228.121 126.255 230.946 127.778 232.015 129.001C235.144 133.216 230.123 135.099 227.799 135.047C230.126 136.883 235.849 142.794 228.431 145.94C225.117 146.917 224.596 145.653 222.938 143.467Z" stroke="#383838" stroke-width="2"/>
<path d="M215.546 156.294C214.401 161.417 209.694 158.848 208.215 157.055C208.346 160.016 207.613 168.211 200.384 164.652C197.478 162.783 198.094 161.563 198.665 158.879C195.56 160.179 193.019 157.409 191.856 155.486C188.734 150.325 195.817 148.068 198.809 148.272C199.299 141.092 205.081 140.057 208.321 141.334C215.25 144.441 212.652 149.662 210.487 151.884C215.079 151.552 215.773 154.686 215.546 156.294Z" fill="#EFE8E0"/>
<path d="M202.916 154.491C201.362 156.959 200.009 158.316 198.665 158.879M198.665 158.879C195.56 160.179 193.019 157.409 191.856 155.486C188.734 150.325 195.817 148.068 198.809 148.272C199.299 141.092 205.081 140.057 208.321 141.334C215.25 144.441 212.652 149.662 210.487 151.884C215.079 151.552 215.773 154.686 215.546 156.294C214.401 161.417 209.694 158.848 208.215 157.055C208.346 160.016 207.613 168.211 200.384 164.652C197.478 162.783 198.094 161.563 198.665 158.879Z" stroke="#383838" stroke-width="2"/>
<path d="M202.377 151.735C200.407 142.973 209.052 143.821 210.99 143.64C200.939 137.64 199.293 145.064 199.438 148.88C187.552 149.563 192.132 155.065 194.04 158.264C194.069 158.314 194.098 158.364 194.129 158.415C194.1 158.365 194.071 158.315 194.04 158.264C191.63 154.007 198.002 150.263 202.377 151.735Z" fill="#E1D6CB"/>
<path d="M202.916 154.491C201.362 156.959 200.009 158.316 198.665 158.879M198.665 158.879C195.56 160.179 193.019 157.409 191.856 155.486C188.734 150.325 195.817 148.068 198.809 148.272C199.299 141.092 205.081 140.057 208.321 141.334C215.25 144.441 212.652 149.662 210.487 151.884C215.079 151.552 215.773 154.686 215.546 156.294C214.401 161.417 209.694 158.848 208.215 157.055C208.346 160.016 207.613 168.211 200.384 164.652C197.478 162.783 198.094 161.563 198.665 158.879Z" stroke="#383838" stroke-width="2"/>
<path d="M207.167 143.337C206.022 148.46 201.315 145.891 199.836 144.098C199.967 147.059 199.234 155.254 192.005 151.695C189.099 149.826 189.715 148.606 190.286 145.922C187.181 147.222 184.64 144.452 183.477 142.529C180.355 137.368 187.438 135.111 190.43 135.315C190.919 128.135 196.702 127.1 199.942 128.377C206.871 131.484 204.273 136.705 202.108 138.927C206.7 138.595 207.394 141.729 207.167 143.337Z" fill="#EFE8E0"/>
<path d="M194.537 141.534C192.982 144.002 191.63 145.359 190.286 145.922M190.286 145.922C187.181 147.222 184.64 144.452 183.477 142.529C180.355 137.368 187.438 135.111 190.43 135.315C190.919 128.135 196.702 127.1 199.942 128.377C206.871 131.484 204.273 136.705 202.108 138.927C206.7 138.595 207.394 141.729 207.167 143.337C206.022 148.46 201.315 145.891 199.836 144.098C199.967 147.059 199.234 155.254 192.005 151.695C189.099 149.826 189.715 148.606 190.286 145.922Z" stroke="#383838" stroke-width="2"/>
<path d="M193.998 138.777C192.028 130.016 200.673 130.864 202.611 130.683C192.56 124.683 190.914 132.107 191.059 135.923C179.173 136.606 183.753 142.108 185.661 145.307C185.69 145.357 185.719 145.407 185.75 145.457C185.721 145.408 185.692 145.358 185.661 145.307C183.251 141.05 189.623 137.306 193.998 138.777Z" fill="#E1D6CB"/>
<path d="M194.537 141.534C192.982 144.002 191.63 145.359 190.286 145.922M190.286 145.922C187.181 147.222 184.64 144.452 183.477 142.529C180.355 137.368 187.438 135.111 190.43 135.315C190.919 128.135 196.702 127.1 199.942 128.377C206.871 131.484 204.273 136.705 202.108 138.927C206.7 138.595 207.394 141.729 207.167 143.337C206.022 148.46 201.315 145.891 199.836 144.098C199.967 147.059 199.234 155.254 192.005 151.695C189.099 149.826 189.715 148.606 190.286 145.922Z" stroke="#383838" stroke-width="2"/>
<path d="M234.195 153.295C233.05 158.418 228.343 155.849 226.864 154.056C226.995 157.017 226.262 165.212 219.033 161.653C216.127 159.784 216.743 158.564 217.314 155.88C214.209 157.18 211.668 154.41 210.505 152.487C207.383 147.326 214.466 145.069 217.458 145.273C217.948 138.093 223.73 137.058 226.97 138.335C233.899 141.442 231.301 146.663 229.136 148.885C233.728 148.553 234.422 151.687 234.195 153.295Z" fill="#EFE8E0"/>
<path d="M221.565 151.492C220.011 153.96 218.658 155.317 217.314 155.88M217.314 155.88C214.209 157.18 211.668 154.41 210.505 152.487C207.383 147.326 214.466 145.069 217.458 145.273C217.948 138.093 223.73 137.058 226.97 138.335C233.899 141.442 231.301 146.663 229.136 148.885C233.728 148.553 234.422 151.687 234.195 153.295C233.05 158.418 228.343 155.849 226.864 154.056C226.995 157.017 226.262 165.212 219.033 161.653C216.127 159.784 216.743 158.564 217.314 155.88Z" stroke="#383838" stroke-width="2"/>
<path d="M221.026 148.735C219.056 139.974 227.701 140.822 229.639 140.641C219.588 134.641 217.942 142.065 218.088 145.881C206.202 146.564 210.781 152.066 212.689 155.265C212.718 155.315 212.747 155.365 212.778 155.415C212.749 155.366 212.72 155.316 212.689 155.265C210.279 151.008 216.651 147.264 221.026 148.735Z" fill="#E1D6CB"/>
<path d="M221.565 151.492C220.011 153.96 218.658 155.317 217.314 155.88M217.314 155.88C214.209 157.18 211.668 154.41 210.505 152.487C207.383 147.326 214.466 145.069 217.458 145.273C217.948 138.093 223.73 137.058 226.97 138.335C233.899 141.442 231.301 146.663 229.136 148.885C233.728 148.553 234.422 151.687 234.195 153.295C233.05 158.418 228.343 155.849 226.864 154.056C226.995 157.017 226.262 165.212 219.033 161.653C216.127 159.784 216.743 158.564 217.314 155.88Z" stroke="#383838" stroke-width="2"/>
<path d="M257.233 155.28C262.708 154.221 264.157 160.57 262.321 163.494C261.303 165.114 259.695 165.728 258.128 165.846C258.496 171.656 253.968 172.69 251.658 172.48C246.546 171.696 247.261 167.105 248.258 164.908C245.186 161.808 245.141 158.938 247.289 157.294C250.832 154.584 253.869 157.14 254.945 158.757C254.003 156.66 256.078 155.565 257.233 155.28Z" fill="#EFE8E0"/>
<path d="M251.896 164.374C249.195 163.347 247.516 159.291 247.639 157.486C244.482 159.184 246.688 163.162 248.186 164.94C246.177 171.663 250.945 172.78 253.826 172.417C253.978 172.404 254.138 172.378 254.307 172.34C254.154 172.37 253.994 172.396 253.826 172.417C250.577 172.698 251.411 167.266 251.896 164.374Z" fill="#E1D6CB"/>
<path d="M254.386 165.307C255.265 165.641 256.679 165.955 258.128 165.846M258.128 165.846C259.695 165.728 261.303 165.114 262.321 163.494C264.157 160.57 262.708 154.221 257.233 155.28C256.078 155.565 254.003 156.66 254.945 158.757C253.869 157.14 250.832 154.584 247.289 157.294C245.141 158.938 245.186 161.808 248.258 164.908C247.261 167.105 246.546 171.696 251.658 172.48C253.968 172.69 258.496 171.656 258.128 165.846Z" stroke="#383838" stroke-width="2"/>
<path d="M246.237 148.913C251.712 147.855 253.161 154.203 251.324 157.128C250.306 158.748 248.698 159.362 247.131 159.48C247.5 165.29 242.971 166.323 240.661 166.114C235.549 165.329 236.265 160.739 237.261 158.542C234.19 155.441 234.144 152.572 236.293 150.928C239.835 148.218 242.872 150.774 243.948 152.39C243.007 150.293 245.082 149.199 246.237 148.913Z" fill="#EFE8E0"/>
<path d="M240.9 158.008C238.199 156.98 236.519 152.925 236.642 151.12C233.485 152.817 235.691 156.796 237.189 158.573C235.18 165.296 239.948 166.413 242.83 166.051C242.981 166.038 243.141 166.012 243.311 165.973C243.158 166.004 242.997 166.03 242.83 166.051C239.58 166.332 240.415 160.9 240.9 158.008Z" fill="#E1D6CB"/>
<path d="M243.389 158.94C244.268 159.275 245.682 159.589 247.131 159.48M247.131 159.48C248.698 159.362 250.306 158.748 251.324 157.128C253.161 154.203 251.712 147.855 246.237 148.913C245.082 149.199 243.007 150.293 243.948 152.39C242.872 150.774 239.835 148.218 236.293 150.928C234.144 152.572 234.19 155.441 237.261 158.542C236.265 160.739 235.549 165.329 240.661 166.114C242.971 166.323 247.5 165.29 247.131 159.48Z" stroke="#383838" stroke-width="2"/>
<path d="M249.779 139.222C254.159 135.771 258.358 140.748 258.067 144.189C257.906 146.095 256.758 147.378 255.42 148.202C258.412 153.196 254.862 156.191 252.713 157.065C247.811 158.711 246.341 154.304 246.219 151.895C242.068 150.548 240.711 148.019 241.867 145.573C243.772 141.54 247.643 142.418 249.34 143.362C247.542 141.93 248.884 140.006 249.779 139.222Z" fill="#EFE8E0"/>
<path d="M249.207 149.752C246.336 150.077 242.984 147.244 242.265 145.584C240.238 148.54 244.023 151.064 246.17 151.956C247.468 158.852 252.217 157.657 254.611 156.014C254.74 155.933 254.871 155.837 255.003 155.725C254.881 155.822 254.75 155.918 254.611 156.014C251.853 157.754 250.103 152.544 249.207 149.752Z" fill="#E1D6CB"/>
<path d="M251.848 149.438C252.782 149.332 254.182 148.964 255.42 148.202M255.42 148.202C256.758 147.378 257.906 146.095 258.067 144.189C258.358 140.748 254.159 135.771 249.779 139.222C248.884 140.006 247.542 141.93 249.34 143.362C247.643 142.418 243.772 141.54 241.867 145.573C240.711 148.019 242.068 150.548 246.219 151.895C246.341 154.304 247.811 158.711 252.713 157.065C254.862 156.191 258.412 153.196 255.42 148.202Z" stroke="#383838" stroke-width="2"/>
<path d="M155.446 148.698C160.501 146.344 163.445 152.152 162.372 155.435C161.778 157.254 160.366 158.239 158.874 158.733C160.64 164.28 156.497 166.381 154.205 166.738C149.056 167.215 148.637 162.588 149.072 160.215C145.34 157.951 144.6 155.178 146.287 153.063C149.067 149.575 152.633 151.318 154.068 152.626C152.647 150.82 154.394 149.255 155.446 148.698Z" fill="#EFE8E0"/>
<path d="M152.472 158.815C149.603 158.473 146.99 154.946 146.672 153.165C144.02 155.577 147.125 158.902 149.009 160.263C148.689 167.273 153.586 167.201 156.294 166.151C156.437 166.101 156.587 166.038 156.742 165.959C156.601 166.026 156.451 166.09 156.294 166.151C153.21 167.211 152.703 161.739 152.472 158.815Z" fill="#E1D6CB"/>
<path d="M155.113 159.116C156.047 159.228 157.495 159.19 158.874 158.733M158.874 158.733C160.366 158.239 161.778 157.254 162.372 155.435C163.445 152.152 160.501 146.344 155.446 148.698C154.394 149.255 152.647 150.82 154.068 152.626C152.633 151.318 149.067 149.575 146.287 153.063C144.6 155.178 145.34 157.951 149.072 160.215C148.637 162.588 149.056 167.215 154.205 166.738C156.497 166.381 160.64 164.28 158.874 158.733Z" stroke="#383838" stroke-width="2"/>
<path d="M205.134 162.277C210.609 161.219 212.058 167.567 210.222 170.492C209.204 172.112 207.596 172.726 206.029 172.844C206.397 178.653 201.869 179.687 199.559 179.478C194.447 178.693 195.162 174.103 196.159 171.906C193.087 168.805 193.042 165.936 195.19 164.292C198.733 161.581 201.77 164.137 202.846 165.754C201.904 163.657 203.979 162.562 205.134 162.277Z" fill="#EFE8E0"/>
<path d="M199.797 171.372C197.096 170.345 195.417 166.289 195.54 164.484C192.383 166.182 194.589 170.16 196.087 171.938C194.078 178.661 198.846 179.778 201.727 179.415C201.879 179.402 202.039 179.376 202.208 179.338C202.056 179.368 201.895 179.394 201.727 179.415C198.478 179.696 199.313 174.264 199.797 171.372Z" fill="#E1D6CB"/>
<path d="M202.287 172.304C203.166 172.638 204.579 172.953 206.029 172.844M206.029 172.844C207.596 172.726 209.204 172.112 210.222 170.492C212.058 167.567 210.609 161.219 205.134 162.277C203.979 162.562 201.904 163.657 202.846 165.754C201.77 164.137 198.733 161.581 195.19 164.292C193.042 165.936 193.087 168.805 196.159 171.906C195.162 174.103 194.447 178.693 199.559 179.478C201.869 179.687 206.397 178.653 206.029 172.844Z" stroke="#383838" stroke-width="2"/>
<path d="M236.796 154.206C242.271 153.148 243.719 159.496 241.883 162.421C240.865 164.041 239.257 164.655 237.69 164.773C238.059 170.583 233.53 171.616 231.22 171.407C226.108 170.622 226.824 166.032 227.82 163.835C224.749 160.734 224.703 157.865 226.852 156.221C230.394 153.511 233.431 156.067 234.507 157.683C233.566 155.586 235.64 154.492 236.796 154.206Z" fill="#EFE8E0"/>
<path d="M231.458 163.3C228.758 162.273 227.078 158.218 227.201 156.413C224.044 158.11 226.25 162.089 227.748 163.866C225.739 170.589 230.507 171.706 233.388 171.344C233.54 171.331 233.7 171.305 233.87 171.266C233.717 171.297 233.556 171.323 233.388 171.344C230.139 171.625 230.974 166.193 231.458 163.3Z" fill="#E1D6CB"/>
<path d="M233.948 164.233C234.827 164.567 236.241 164.882 237.69 164.773M237.69 164.773C239.257 164.655 240.865 164.041 241.883 162.421C243.719 159.496 242.271 153.148 236.796 154.206C235.64 154.492 233.566 155.586 234.507 157.683C233.431 156.067 230.394 153.511 226.852 156.221C224.703 157.865 224.749 160.734 227.82 163.835C226.824 166.032 226.108 170.622 231.22 171.407C233.53 171.616 238.059 170.583 237.69 164.773Z" stroke="#383838" stroke-width="2"/>
<path d="M195.431 149.931C200.906 148.873 202.355 155.221 200.519 158.146C199.501 159.766 197.893 160.38 196.326 160.498C196.694 166.308 192.166 167.342 189.856 167.132C184.744 166.347 185.459 161.757 186.456 159.56C183.384 156.459 183.339 153.59 185.487 151.946C189.03 149.236 192.067 151.792 193.143 153.408C192.201 151.312 194.276 150.217 195.431 149.931Z" fill="#EFE8E0"/>
<path d="M190.094 159.026C187.393 157.999 185.714 153.943 185.837 152.138C182.68 153.836 184.886 157.815 186.384 159.592C184.375 166.315 189.143 167.432 192.024 167.069C192.176 167.056 192.336 167.031 192.505 166.992C192.353 167.022 192.192 167.048 192.024 167.069C188.775 167.35 189.61 161.919 190.094 159.026Z" fill="#E1D6CB"/>
<path d="M192.584 159.958C193.463 160.293 194.877 160.607 196.326 160.498M196.326 160.498C197.893 160.38 199.501 159.766 200.519 158.146C202.355 155.221 200.906 148.873 195.431 149.931C194.276 150.217 192.201 151.312 193.143 153.408C192.067 151.792 189.03 149.236 185.487 151.946C183.339 153.59 183.384 156.459 186.456 159.56C185.459 161.757 184.744 166.347 189.856 167.132C192.166 167.342 196.694 166.308 196.326 160.498Z" stroke="#383838" stroke-width="2"/>
<path d="M230.003 134.716C232.332 129.649 238.336 132.17 239.643 135.366C240.367 137.137 239.929 138.802 239.112 140.144C244.049 143.229 242.251 147.512 240.735 149.268C237.12 152.965 233.805 149.71 232.6 147.62C228.291 148.31 225.932 146.676 225.847 143.972C225.708 139.514 229.555 138.534 231.496 138.601C229.243 138.145 229.562 135.821 230.003 134.716Z" fill="#EFE8E0"/>
<path d="M234.284 144.353C231.876 145.949 227.601 144.952 226.206 143.801C225.746 147.356 230.266 147.88 232.583 147.698C236.877 153.247 240.562 150.022 241.946 147.469C242.024 147.339 242.096 147.194 242.164 147.033C242.099 147.175 242.026 147.321 241.946 147.469C240.282 150.274 236.353 146.431 234.284 144.353Z" fill="#E1D6CB"/>
<path d="M236.494 142.871C237.277 142.352 238.357 141.386 239.112 140.144M239.112 140.144C239.929 138.802 240.367 137.137 239.643 135.366C238.336 132.17 232.332 129.649 230.003 134.716C229.562 135.821 229.243 138.145 231.496 138.601C229.555 138.534 225.708 139.514 225.847 143.972C225.932 146.676 228.291 148.31 232.6 147.62C233.805 149.71 237.12 152.965 240.735 149.268C242.251 147.512 244.049 143.229 239.112 140.144Z" stroke="#383838" stroke-width="2"/>
<path d="M215.651 148.61C221.126 147.551 222.575 153.9 220.738 156.824C219.721 158.445 218.112 159.058 216.545 159.176C216.914 164.986 212.385 166.02 210.075 165.81C204.964 165.026 205.679 160.435 206.676 158.238C203.604 155.138 203.558 152.268 205.707 150.624C209.249 147.914 212.287 150.47 213.362 152.087C212.421 149.99 214.496 148.895 215.651 148.61Z" fill="#EFE8E0"/>
<path d="M210.314 157.704C207.613 156.677 205.934 152.621 206.056 150.816C202.899 152.514 205.105 156.492 206.603 158.27C204.594 164.993 209.363 166.11 212.244 165.747C212.395 165.734 212.555 165.708 212.725 165.67C212.572 165.7 212.411 165.726 212.244 165.747C208.995 166.028 209.829 160.596 210.314 157.704Z" fill="#E1D6CB"/>
<path d="M212.804 158.637C213.682 158.971 215.096 159.286 216.545 159.176M216.545 159.176C218.112 159.058 219.721 158.445 220.738 156.824C222.575 153.9 221.126 147.551 215.651 148.61C214.496 148.895 212.421 149.99 213.362 152.087C212.287 150.47 209.249 147.914 205.707 150.624C203.558 152.268 203.604 155.138 206.676 158.238C205.679 160.435 204.964 165.026 210.075 165.81C212.385 166.02 216.914 164.986 216.545 159.176Z" stroke="#383838" stroke-width="2"/>
<path d="M213.466 124.782C218.941 123.723 220.39 130.072 218.554 132.996C217.536 134.616 215.928 135.23 214.361 135.348C214.729 141.158 210.201 142.192 207.89 141.982C202.779 141.198 203.494 136.607 204.491 134.41C201.419 131.31 201.373 128.44 203.522 126.796C207.065 124.086 210.102 126.642 211.178 128.259C210.236 126.162 212.311 125.067 213.466 124.782Z" fill="#EFE8E0"/>
<path d="M208.129 133.876C205.428 132.849 203.749 128.793 203.872 126.989C200.714 128.686 202.921 132.665 204.418 134.442C202.409 141.165 207.178 142.282 210.059 141.919C210.21 141.906 210.371 141.881 210.54 141.842C210.387 141.872 210.226 141.898 210.059 141.919C206.81 142.201 207.644 136.769 208.129 133.876Z" fill="#E1D6CB"/>
<path d="M210.619 134.809C211.497 135.143 212.911 135.457 214.361 135.348M214.361 135.348C215.928 135.23 217.536 134.616 218.554 132.996C220.39 130.072 218.941 123.723 213.466 124.782C212.311 125.067 210.236 126.162 211.178 128.259C210.102 126.642 207.065 124.086 203.522 126.796C201.373 128.44 201.419 131.31 204.491 134.41C203.494 136.607 202.779 141.198 207.89 141.982C210.201 142.192 214.729 141.158 214.361 135.348Z" stroke="#383838" stroke-width="2"/>
<path d="M192.027 165.122C197.502 164.064 198.95 170.412 197.114 173.337C196.096 174.957 194.488 175.571 192.921 175.689C193.29 181.499 188.761 182.532 186.451 182.323C181.339 181.538 182.055 176.948 183.051 174.751C179.98 171.65 179.934 168.781 182.083 167.137C185.625 164.427 188.662 166.983 189.738 168.599C188.797 166.502 190.871 165.408 192.027 165.122Z" fill="#EFE8E0"/>
<path d="M186.69 174.217C183.989 173.189 182.309 169.134 182.432 167.329C179.275 169.026 181.481 173.005 182.979 174.782C180.97 181.505 185.738 182.622 188.62 182.26C188.771 182.247 188.931 182.221 189.101 182.182C188.948 182.213 188.787 182.239 188.62 182.26C185.371 182.541 186.205 177.109 186.69 174.217Z" fill="#E1D6CB"/>
<path d="M189.179 175.149C190.058 175.484 191.472 175.798 192.921 175.689M192.921 175.689C194.488 175.571 196.096 174.957 197.114 173.337C198.95 170.412 197.502 164.064 192.027 165.122C190.871 165.408 188.797 166.502 189.738 168.599C188.662 166.983 185.625 164.427 182.083 167.137C179.934 168.781 179.98 171.65 183.051 174.751C182.055 176.948 181.339 181.538 186.451 182.323C188.761 182.532 193.29 181.499 192.921 175.689Z" stroke="#383838" stroke-width="2"/>
<path d="M171.895 162.095C174.653 166.942 169.105 170.35 165.746 169.549C163.885 169.105 162.788 167.778 162.173 166.332C156.789 168.545 154.357 164.587 153.814 162.332C152.918 157.238 157.496 156.443 159.896 156.683C161.848 152.779 164.551 151.815 166.797 153.323C170.5 155.809 169.054 159.506 167.867 161.043C169.552 159.479 171.254 161.093 171.895 162.095Z" fill="#EFE8E0"/>
<path d="M161.568 159.957C161.675 157.07 164.977 154.178 166.726 153.716C164.106 151.27 161.045 154.636 159.842 156.624C152.83 156.878 153.302 161.753 154.569 164.365C154.63 164.505 154.706 164.648 154.797 164.796C154.719 164.661 154.643 164.517 154.569 164.365C153.261 161.378 158.673 160.426 161.568 159.957Z" fill="#E1D6CB"/>
<path d="M161.484 162.615C161.45 163.554 161.605 164.994 162.173 166.332M162.173 166.332C162.788 167.778 163.885 169.105 165.746 169.549C169.105 170.35 174.653 166.942 171.895 162.095C171.254 161.093 169.552 159.479 167.867 161.043C169.054 159.506 170.5 155.809 166.797 153.323C164.551 151.815 161.848 152.779 159.896 156.683C157.496 156.443 152.918 157.238 153.814 162.332C154.357 164.587 156.789 168.545 162.173 166.332Z" stroke="#383838" stroke-width="2"/>
<path d="M263.437 292.591L284.646 181.451C219.838 193.098 168.579 179.075 151.05 170.608L154.406 282.026C192.613 317.59 243.013 303.888 263.437 292.591Z" fill="#F8F8F7"/>
<path d="M272.027 185.352L255.025 295.848L259.09 294.224L279.005 184.084L272.027 185.352Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M256.241 186.643L240.492 300.606L245.864 299.114L265.796 185.63L256.241 186.643Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M236.39 187.082L223.837 303.259L230.93 302.456L247.521 187.017L236.39 187.082Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M161.358 175.693L162.569 286.664L158.783 283.691L155.125 173.512L161.358 175.693Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M178.655 180.658L174.238 294.145L169.142 291.448L169.143 178.325L178.655 180.658Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M198.551 184.656L192.402 301.047L184.834 299.074L186.777 182.556L198.551 184.656Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M210.588 185.874L203.087 303.055L212.296 303.737L223.98 186.998L210.588 185.874Z" fill="#E23F35" stroke="#383838" stroke-width="2"/>
<path d="M264.099 292.005L284.979 181.574C220.065 192.934 168.644 178.817 151.047 170.339L154.789 281.131C193.202 316.621 243.668 303.168 264.099 292.005Z" stroke="#383838" stroke-width="2"/>
<path d="M284.774 182.594C292.131 180.48 291.92 172.619 290.718 169.435C281.776 180.613 235.051 180.173 212.806 178.557C179.274 176.728 155.293 165.044 147.494 159.43C143.043 164.368 147.977 170.023 151.178 171.75C203.123 192.64 261.886 187.684 284.774 182.594Z" fill="white" stroke="#383838" stroke-width="2"/>
<path d="M291.511 158.374C294.416 162.745 289.303 164.365 286.986 164.192C289.214 166.147 294.622 172.347 287.05 175.102C283.69 175.906 283.235 174.617 281.693 172.348C280.482 175.488 276.724 175.405 274.531 174.913C268.645 173.595 271.919 166.92 274.136 164.902C269.293 159.579 272.548 154.689 275.713 153.234C282.751 150.384 284.721 155.872 284.826 158.973C287.765 155.429 290.507 157.097 291.511 158.374Z" fill="#EFE8E0"/>
<path d="M281.468 166.242C282.173 169.072 282.217 170.988 281.693 172.348M281.693 172.348C280.482 175.488 276.724 175.405 274.531 174.913C268.645 173.595 271.919 166.92 274.136 164.902C269.293 159.579 272.548 154.689 275.713 153.234C282.751 150.384 284.721 155.872 284.826 158.973C287.765 155.429 290.507 157.097 291.511 158.374C294.416 162.745 289.303 164.365 286.986 164.192C289.214 166.147 294.622 172.347 287.05 175.102C283.69 175.906 283.235 174.617 281.693 172.348Z" stroke="#383838" stroke-width="2"/>
<path d="M279.105 164.722C271.417 160.08 278.013 154.427 279.223 152.903C267.936 156.005 272.155 162.332 275.01 164.867C267.277 173.92 274.417 174.422 278.048 175.259C278.104 175.273 278.16 175.286 278.218 175.299C278.162 175.285 278.105 175.272 278.048 175.259C273.307 174.052 275.014 166.861 279.105 164.722Z" fill="#E1D6CB"/>
<path d="M281.468 166.242C282.173 169.072 282.217 170.988 281.693 172.348M281.693 172.348C280.482 175.488 276.724 175.405 274.531 174.913C268.645 173.595 271.919 166.92 274.136 164.902C269.293 159.579 272.548 154.689 275.713 153.234C282.751 150.384 284.721 155.872 284.826 158.973C287.765 155.429 290.507 157.097 291.511 158.374C294.416 162.745 289.303 164.365 286.986 164.192C289.214 166.147 294.622 172.347 287.05 175.102C283.69 175.906 283.235 174.617 281.693 172.348Z" stroke="#383838" stroke-width="2"/>
<path d="M301.179 197.362C306.312 196.266 305.94 201.616 304.927 203.708C307.564 202.354 315.318 199.603 315.098 207.658C314.611 211.078 313.244 211.028 310.567 211.628C313.044 213.908 311.585 217.372 310.322 219.232C306.933 224.221 301.928 218.724 300.866 215.92C294.136 218.469 290.784 213.645 290.594 210.166C290.529 202.573 296.357 202.758 299.28 203.799C297.063 199.764 299.622 197.826 301.179 197.362Z" fill="#EFE8E0"/>
<path d="M304.806 209.593C307.697 209.977 309.495 210.64 310.567 211.628M310.567 211.628C313.044 213.908 311.585 217.372 310.322 219.232C306.933 224.221 301.928 218.724 300.866 215.92C294.136 218.469 290.784 213.645 290.594 210.166C290.529 202.573 296.357 202.758 299.28 203.799C297.063 199.764 299.622 197.826 301.179 197.362C306.312 196.266 305.94 201.616 304.927 203.708C307.564 202.354 315.318 199.603 315.098 207.658C314.611 211.078 313.244 211.028 310.567 211.628Z" stroke="#383838" stroke-width="2"/>
<path d="M302.524 211.233C295.382 216.677 292.548 208.466 291.576 206.78C290.313 218.417 297.748 216.818 301.155 215.094C306.732 225.613 309.823 219.157 311.935 216.088C311.969 216.041 312.002 215.993 312.035 215.944C312.002 215.991 311.969 216.039 311.935 216.088C309.071 220.054 303.011 215.823 302.524 211.233Z" fill="#E1D6CB"/>
<path d="M304.806 209.593C307.697 209.977 309.495 210.64 310.567 211.628M310.567 211.628C313.044 213.908 311.585 217.372 310.322 219.232C306.933 224.221 301.928 218.724 300.866 215.92C294.136 218.469 290.784 213.645 290.594 210.166C290.529 202.573 296.357 202.758 299.28 203.799C297.063 199.764 299.622 197.826 301.179 197.362C306.312 196.266 305.94 201.616 304.927 203.708C307.564 202.354 315.318 199.603 315.098 207.658C314.611 211.078 313.244 211.028 310.567 211.628Z" stroke="#383838" stroke-width="2"/>
<path d="M269.407 168.542C274.059 171.617 270.652 177.166 267.294 177.971C265.433 178.417 263.855 177.73 262.653 176.718C258.851 181.126 254.892 178.696 253.388 176.93C250.285 172.793 254.008 170.014 256.258 169.142C256.232 164.777 258.207 162.695 260.893 163.024C265.32 163.566 265.702 167.518 265.339 169.425C266.134 167.269 268.382 167.938 269.407 168.542Z" fill="#EFE8E0"/>
<path d="M259.231 171.306C258.02 168.682 259.657 164.61 261.008 163.406C257.565 162.41 256.357 166.796 256.184 169.114C250.044 172.511 252.67 176.646 254.982 178.403C255.099 178.499 255.232 178.593 255.38 178.684C255.249 178.599 255.116 178.505 254.982 178.403C252.464 176.33 256.86 173.033 259.231 171.306Z" fill="#E1D6CB"/>
<path d="M260.357 173.714C260.751 174.568 261.541 175.782 262.653 176.718M262.653 176.718C263.855 177.73 265.433 178.417 267.294 177.971C270.652 177.166 274.059 171.617 269.407 168.542C268.382 167.938 266.134 167.269 265.339 169.425C265.702 167.518 265.32 163.566 260.893 163.024C258.207 162.695 256.232 164.777 256.258 169.142C254.008 170.014 250.285 172.793 253.388 176.93C254.892 178.696 258.851 181.126 262.653 176.718Z" stroke="#383838" stroke-width="2"/>
<path d="M248.971 167.47C253.623 170.544 250.216 176.094 246.858 176.898C244.997 177.344 243.419 176.657 242.217 175.645C238.415 180.054 234.456 177.624 232.952 175.858C229.849 171.721 233.572 168.941 235.822 168.069C235.796 163.705 237.771 161.623 240.457 161.951C244.884 162.494 245.266 166.445 244.903 168.353C245.698 166.196 247.946 166.865 248.971 167.47Z" fill="#EFE8E0"/>
<path d="M238.795 170.233C237.584 167.61 239.222 163.537 240.572 162.334C237.129 161.337 235.921 165.724 235.748 168.041C229.609 171.439 232.234 175.574 234.546 177.33C234.663 177.427 234.796 177.521 234.944 177.612C234.814 177.526 234.68 177.432 234.546 177.33C232.028 175.258 236.425 171.961 238.795 170.233Z" fill="#E1D6CB"/>
<path d="M239.921 172.641C240.315 173.495 241.105 174.709 242.217 175.645M242.217 175.645C243.419 176.657 244.997 177.344 246.858 176.898C250.216 176.094 253.623 170.544 248.971 167.47C247.946 166.865 245.698 166.196 244.903 168.353C245.266 166.445 244.884 162.494 240.457 161.951C237.771 161.623 235.796 163.705 235.822 168.069C233.572 168.941 229.849 171.721 232.952 175.858C234.456 177.624 238.415 180.054 242.217 175.645Z" stroke="#383838" stroke-width="2"/>
<path d="M286.259 232.22C289.333 227.567 294.883 230.974 295.687 234.332C296.133 236.193 295.446 237.772 294.434 238.974C298.843 242.775 296.413 246.734 294.647 248.238C290.51 251.341 287.73 247.618 286.858 245.369C282.494 245.394 280.412 243.419 280.741 240.734C281.283 236.307 285.234 235.925 287.142 236.288C284.985 235.493 285.654 233.245 286.259 232.22Z" fill="#EFE8E0"/>
<path d="M288.348 241.325C285.724 242.536 282.326 241.97 281.123 240.619C280.126 244.063 284.513 245.27 286.83 245.444C290.281 251.678 294.491 248.874 296.199 246.538C296.269 246.45 296.336 246.353 296.401 246.248C296.338 246.343 296.271 246.44 296.199 246.538C294.095 249.211 290.108 243.74 288.354 241.334L288.348 241.325Z" fill="#E1D6CB"/>
<path d="M291.43 241.27C292.284 240.876 293.498 240.086 294.434 238.974M294.434 238.974C295.446 237.772 296.133 236.193 295.687 234.332C294.883 230.974 289.333 227.567 286.259 232.22C285.654 233.245 284.985 235.493 287.142 236.287C285.234 235.925 281.283 236.307 280.741 240.734C280.412 243.419 282.494 245.394 286.858 245.369C287.73 247.618 290.51 251.341 294.647 248.238C296.413 246.734 298.843 242.775 294.434 238.974Z" stroke="#383838" stroke-width="2"/>
<path d="M152.181 104.964C157.581 103.57 159.418 109.818 157.765 112.849C156.849 114.529 155.281 115.241 153.725 115.455C154.45 121.231 149.994 122.542 147.675 122.475C142.525 122.007 142.956 117.381 143.816 115.126C140.559 112.221 140.337 109.36 142.38 107.587C145.749 104.664 148.938 107.028 150.111 108.575C149.043 106.54 151.046 105.32 152.181 104.964Z" fill="#EFE8E0"/>
<path d="M147.632 113.122C144.873 112.263 142.73 109.566 142.741 107.757C139.694 109.646 142.141 113.481 143.746 115.163C142.13 122.103 147.134 122.842 149.967 122.253C150.078 122.234 150.192 122.207 150.311 122.172C150.201 122.201 150.086 122.228 149.967 122.253C146.615 122.827 147.32 116.094 147.631 113.133L147.632 113.122Z" fill="#E1D6CB"/>
<path d="M149.957 115.147C150.854 115.426 152.285 115.654 153.725 115.455M153.725 115.455C155.282 115.241 156.849 114.529 157.765 112.849C159.418 109.817 157.581 103.57 152.181 104.964C151.046 105.32 149.043 106.54 150.111 108.575C148.938 107.028 145.749 104.663 142.38 107.587C140.337 109.36 140.559 112.221 143.816 115.126C142.956 117.381 142.525 122.007 147.675 122.475C149.994 122.542 154.45 121.231 153.725 115.455Z" stroke="#383838" stroke-width="2"/>
<path d="M116.762 157.05C114.975 151.767 121.071 149.476 124.216 150.902C125.959 151.692 126.783 153.203 127.112 154.74C132.819 153.591 134.453 157.939 134.557 160.257C134.468 165.427 129.823 165.337 127.512 164.646C124.854 168.107 122.017 168.539 120.098 166.632C116.935 163.487 119.059 160.133 120.516 158.849C118.565 160.064 117.2 158.156 116.762 157.05Z" fill="#EFE8E0"/>
<path d="M125.232 160.988C124.578 163.802 122.046 166.138 120.241 166.26C122.349 169.159 125.994 166.437 127.553 164.714C134.593 165.815 134.963 160.77 134.166 157.988C134.14 157.879 134.104 157.767 134.061 157.65C134.098 157.758 134.133 157.871 134.166 157.988C134.985 161.289 128.219 161.08 125.243 160.988L125.232 160.988Z" fill="#E1D6CB"/>
<path d="M127.081 158.52C127.294 157.604 127.415 156.161 127.112 154.74M127.112 154.74C126.783 153.203 125.959 151.692 124.216 150.902C121.071 149.476 114.975 151.767 116.762 157.05C117.2 158.156 118.565 160.064 120.516 158.849C119.059 160.133 116.935 163.487 120.098 166.632C122.017 168.539 124.854 168.107 127.512 164.646C129.823 165.337 134.468 165.427 134.557 160.257C134.453 157.939 132.819 153.591 127.112 154.74Z" stroke="#383838" stroke-width="2"/>
<path d="M304.458 271.105C307.532 266.452 313.082 269.859 313.886 273.217C314.332 275.078 313.645 276.656 312.633 277.859C317.042 281.66 314.612 285.619 312.846 287.123C308.709 290.226 305.93 286.503 305.057 284.254C300.693 284.279 298.611 282.304 298.94 279.619C299.482 275.191 303.433 274.81 305.341 275.172C303.184 274.378 303.854 272.129 304.458 271.105Z" fill="#EFE8E0"/>
<path d="M306.547 280.21C303.923 281.421 300.526 280.855 299.322 279.504C298.326 282.948 302.712 284.155 305.03 284.329C308.48 290.563 312.69 287.759 314.399 285.423C314.468 285.335 314.535 285.238 314.6 285.132C314.537 285.228 314.47 285.325 314.399 285.423C312.294 288.095 308.307 282.625 306.553 280.218L306.547 280.21Z" fill="#E1D6CB"/>
<path d="M309.63 280.154C310.483 279.76 311.697 278.97 312.633 277.859M312.633 277.859C313.645 276.656 314.332 275.078 313.887 273.217C313.082 269.859 307.533 266.452 304.458 271.105C303.854 272.129 303.184 274.378 305.341 275.172C303.433 274.81 299.482 275.191 298.94 279.619C298.611 282.304 300.693 284.279 305.057 284.254C305.93 286.503 308.709 290.226 312.846 287.123C314.612 285.619 317.042 281.66 312.633 277.859Z" stroke="#383838" stroke-width="2"/>
<path d="M224.83 166.579C227.904 161.926 233.454 165.333 234.258 168.691C234.704 170.552 234.017 172.131 233.005 173.333C237.414 177.134 234.984 181.093 233.218 182.597C229.081 185.7 226.302 181.977 225.429 179.728C221.065 179.753 218.983 177.778 219.312 175.093C219.854 170.665 223.805 170.284 225.713 170.646C223.556 169.852 224.226 167.604 224.83 166.579Z" fill="#EFE8E0"/>
<path d="M226.919 175.684C224.295 176.895 220.898 176.329 219.694 174.978C218.698 178.422 223.084 179.629 225.402 179.803C228.852 186.037 233.062 183.233 234.771 180.897C234.84 180.809 234.907 180.712 234.972 180.606C234.909 180.702 234.842 180.799 234.771 180.897C232.666 183.569 228.679 178.099 226.925 175.692L226.919 175.684Z" fill="#E1D6CB"/>
<path d="M230.002 175.629C230.855 175.235 232.069 174.445 233.005 173.333M233.005 173.333C234.017 172.131 234.704 170.552 234.258 168.691C233.454 165.333 227.904 161.926 224.83 166.579C224.226 167.603 223.556 169.852 225.713 170.646C223.805 170.284 219.854 170.665 219.312 175.093C218.983 177.778 221.065 179.753 225.429 179.728C226.302 181.977 229.081 185.7 233.218 182.597C234.984 181.093 237.414 177.134 233.005 173.333Z" stroke="#383838" stroke-width="2"/>
<path d="M242.267 128.175C245.341 123.523 250.891 126.93 251.695 130.288C252.141 132.149 251.454 133.727 250.442 134.929C254.851 138.731 252.421 142.69 250.655 144.194C246.518 147.297 243.738 143.574 242.866 141.325C238.502 141.35 236.42 139.375 236.748 136.689C237.291 132.262 241.242 131.88 243.15 132.243C240.993 131.449 241.662 129.2 242.267 128.175Z" fill="#EFE8E0"/>
<path d="M244.356 137.28C241.732 138.491 238.334 137.926 237.131 136.575C236.134 140.018 240.521 141.226 242.838 141.399C246.289 147.634 250.499 144.83 252.207 142.494C252.277 142.406 252.344 142.309 252.409 142.203C252.346 142.299 252.279 142.396 252.207 142.494C250.103 145.166 246.116 139.695 244.362 137.289L244.356 137.28Z" fill="#E1D6CB"/>
<path d="M247.438 137.225C248.292 136.831 249.506 136.041 250.442 134.929M250.442 134.929C251.454 133.727 252.141 132.149 251.695 130.288C250.891 126.93 245.341 123.523 242.267 128.175C241.662 129.2 240.993 131.448 243.15 132.243C241.242 131.88 237.291 132.262 236.748 136.689C236.42 139.375 238.502 141.35 242.866 141.325C243.738 143.574 246.518 147.297 250.655 144.194C252.421 142.69 254.851 138.731 250.442 134.929Z" stroke="#383838" stroke-width="2"/>
<path d="M171.414 264.781C174.91 264.928 177.82 263.843 178.198 260.103C179.261 248.816 162.973 229.532 153.87 225.028C153.469 224.826 152.729 224.675 151.833 224.585C152.542 220.093 152.171 213.684 152.092 207.704C152.092 207.704 151.356 195.256 151.176 181.601C120.303 194.926 110.925 217.213 110.887 232.762C110.731 270.147 167.321 287.27 174.404 282.169C179.017 278.846 176.479 271.003 171.414 264.781Z" fill="white" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
</g>
</svg>`;

/* ── Animated character assets ──
   Each ships with the duck-rig + duck-body + duck-feet + duck-eyes-open
   + duck-eyes-closed + duck-banner / duck-chat-bubble class hooks so the
   illustration animations defined in BASE_STYLE apply automatically. */

const CHAT_BUBBLE_DUCK_SVG = String.raw`<svg width="430" height="330" viewBox="0 0 430 330" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g class="duck-rig">
  <g class="duck-feet">
    <path d="M208.03 268.723L176 272L157.334 292.671L164.346 319.404L168.674 317.99C168.674 317.99 160 288 181 279C195.076 274.25 205.327 273.803 205.327 273.803L208.03 268.723Z" fill="#FF9538" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
    <path d="M168.4 277.959L169.169 276.995L210.381 272.631L210.477 273.76C210.477 273.76 201.111 275.979 190.624 279.51C180.138 283.03 168.4 277.959 168.4 277.959Z" fill="#383838"/>
    <path d="M132.503 325.693L137.499 324.504C137.499 324.504 132.669 302.246 143.161 285.224C149.974 274.213 166.01 263.387 166.01 263.387L159.078 261.43L123.042 290.471L132.492 325.691L132.503 325.693Z" fill="#FF9538" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
    <path d="M149.334 268.713L159.09 261.43L166.02 263.387L154.283 271.853L149.334 268.713Z" fill="#383838"/>
    <path d="M152.684 256.297C154.97 258.198 157.865 259.916 161.397 261.135C165.388 262.622 169.387 263.414 173.083 263.401" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
  </g>
  <g class="duck-body">
    <path d="M262.936 194.072C278.69 193.98 380.756 194.452 380.756 194.452C380.756 194.452 365.51 216.247 339.406 221.517C335.138 222.434 324.617 220.849 324.685 217.981C324.753 215.114 334.235 218.422 338.675 220.95C350.773 227.982 298.398 238.638 286.735 231.633C279.401 227.235 282.592 224.667 288.951 228.505C293.184 231.096 296.586 237.005 290.342 240.799C280.595 246.717 259.853 247.649 242.138 219.342" fill="white"/>
    <path d="M262.936 194.072C278.69 193.98 380.756 194.452 380.756 194.452C380.756 194.452 365.51 216.247 339.406 221.517C335.138 222.434 324.617 220.849 324.685 217.981C324.753 215.114 334.235 218.422 338.675 220.95C350.773 227.982 298.398 238.638 286.735 231.633C279.401 227.235 282.592 224.667 288.951 228.505C293.184 231.096 296.586 237.005 290.342 240.799C280.595 246.717 259.853 247.649 242.138 219.342" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
    <path d="M267 244C279 237 289 209 291.5 194H285.851C286.237 210.002 273.433 234.475 267 244Z" fill="#383838"/>
    <path d="M121.877 244.634C126.422 270.012 167.007 283.921 212.528 275.699C228.785 272.763 237.912 268.815 252.956 257.592C272.694 242.867 280.575 220.983 258.145 201.377C255.516 175.368 241.589 175.574 196.069 183.795C150.549 192.017 117.332 219.255 121.877 244.634Z" fill="white" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
    <path d="M181.841 187.226C161.951 193.855 141.271 197.58 120.307 197.639C85.1861 197.738 35.3755 197.371 35.3755 197.371C35.3755 197.371 52.6805 220.469 80.5201 224.385C85.0753 225.083 96.0613 222.753 95.8087 219.736C95.5561 216.719 85.7728 220.799 81.2542 223.742C68.9505 231.911 124.813 239.854 136.66 231.742C144.111 226.647 140.586 224.141 134.128 228.584C129.831 231.579 126.62 238.02 133.439 241.626C144.084 247.25 165.999 246.931 182.878 215.992" fill="white"/>
    <path d="M182.878 215.992C165.999 246.931 144.084 247.25 133.439 241.626C126.62 238.02 129.831 231.579 134.128 228.584C140.586 224.141 144.111 226.647 136.66 231.742C124.813 239.854 68.9505 231.911 81.2542 223.742C85.7728 220.799 95.5561 216.719 95.8087 219.736C96.0613 222.753 85.0753 225.083 80.5201 224.385C52.6805 220.469 35.3755 197.371 35.3755 197.371C35.3755 197.371 85.1861 197.738 120.307 197.639C141.271 197.58 161.951 193.855 181.841 187.226L184.29 186.41" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
    <path d="M241.789 264.315C241.789 264.315 259.638 256.653 271.986 235.299C285.825 215.893 288.379 190.475 287.355 180.189C289.404 123.102 245.283 103.51 226.925 134.418C220.835 144.677 221.292 185.846 197.223 195.618L229.082 213.864L238.608 261.543L241.789 264.315Z" fill="white"/>
    <path d="M198.76 193.048C221.5 184.097 216.822 157.448 224.878 140.077C242.289 102.533 282.813 118.99 286.843 168.363C288.945 207.32 277.901 245.059 241.934 265.116" stroke="#383838" stroke-width="2" stroke-miterlimit="10"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M261.762 157.171C258.101 162.526 251.351 168.512 240.284 169.934C231.959 171.003 234.799 181.754 240.321 182.082C242.905 182.236 247.002 187.456 251.439 192.171C256.399 197.444 261.012 199.772 266.664 199.755C276.861 199.724 281.852 186.956 282.56 180.116C293.493 182.72 318.833 183.889 318.803 173.98C318.781 166.549 305.71 167.097 294.992 168.685C271.455 168.934 264.672 160.789 261.762 157.171ZM246.131 176.858C252.699 181.177 265.678 185.477 276.738 181.972C276.41 183.028 276.098 184.164 275.777 185.331C274.29 190.749 271.135 194.175 266.644 194.189C260.375 194.208 251.719 186.734 247.354 179.011C246.917 178.238 246.508 177.515 246.131 176.858Z" fill="#FF9538"/>
    <path d="M276.738 181.972C265.678 185.477 252.699 181.177 246.131 176.858C246.508 177.515 246.917 178.238 247.354 179.011C251.719 186.734 260.375 194.208 266.644 194.189C271.135 194.175 274.29 190.749 275.777 185.331C276.098 184.164 276.41 183.028 276.738 181.972Z" fill="#383838"/>
  </g>
  <g class="duck-eyes-open">
    <path d="M277.358 148.87C277.221 154.725 274.571 159.411 271.438 159.336C268.59 159.269 266.324 155.29 266.038 150.169C266.026 149.962 266.148 149.771 266.338 149.691L272.31 147.175C272.709 147.006 272.718 146.444 272.324 146.264L267.162 143.904C266.935 143.8 266.819 143.544 266.899 143.308C267.954 140.168 269.835 138.084 271.933 138.134C275.066 138.208 277.495 143.015 277.358 148.87Z" fill="#383838"/>
    <path d="M252.555 148.87C252.419 154.725 249.768 159.411 246.635 159.336C243.787 159.269 241.521 155.29 241.235 150.169C241.223 149.962 241.345 149.771 241.536 149.691L247.508 147.175C247.907 147.006 247.915 146.444 247.521 146.264L242.359 143.904C242.132 143.8 242.017 143.544 242.096 143.308C243.151 140.168 245.033 138.084 247.13 138.134C250.263 138.208 252.692 143.015 252.555 148.87Z" fill="#383838"/>
  </g>
  <g class="duck-eyes-closed" opacity="0">
    <path d="M266 150 Q272 153 278 150" stroke="#383838" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M241 150 Q247 153 253 150" stroke="#383838" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>
  <g class="duck-chat-bubble">
    <rect x="1" y="4" width="428" height="92" rx="23" fill="white" stroke="#383838" stroke-width="2"/>
    <path d="M161.242 91.8555H197.258V127.843L161.242 91.8555Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M195.85 124.853L165.435 94.8212H162.154L198.068 130.419V94.8212H195.85V124.853Z" fill="#383838"/>
    <text x="215" y="62" text-anchor="middle" font-family="Aeonik Mono, Cousine, monospace" font-size="36" font-weight="400" fill="#383838" letter-spacing="0.06em">QUACK!</text>
  </g>
</g>
</svg>`;

const PARTY_BANNER_DUCK_SVG = String.raw`<svg width="537" height="449" viewBox="0 0 537 449" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="duck-deco">
    <path d="M346.604 97.3432C370.432 89.4776 393.567 87.1995 411.693 89.8447C429.866 92.4968 442.777 100.05 446.596 111.621C450.416 123.191 444.538 136.946 431.515 149.895C418.526 162.811 398.581 174.754 374.753 182.619C350.925 190.485 327.79 192.763 309.664 190.118C291.492 187.466 278.58 179.914 274.76 168.343C270.941 156.772 276.819 143.017 289.842 130.067C302.831 117.151 322.776 105.209 346.604 97.3432Z" fill="#16AA98" stroke="#383838" stroke-width="1.39697"/>
    <path d="M39.0082 361.278C36.6666 361.891 34.7964 363.395 33.6688 365.328C31.7386 364.196 29.3713 363.801 27.0297 364.415C22.3688 365.635 19.5751 370.385 20.7898 375.024C21.2504 376.783 22.2215 378.274 23.5037 379.38C22.9281 380.973 22.8123 382.748 23.2729 384.508C24.4876 389.147 29.2507 391.918 33.9117 390.698C36.2532 390.084 38.1235 388.581 39.251 386.647C41.1813 387.78 43.5486 388.174 45.8901 387.561C50.551 386.341 53.3447 381.591 52.1301 376.952C51.6694 375.192 50.6984 373.702 49.4161 372.595C49.9917 371.003 50.1076 369.227 49.6469 367.468C48.4322 362.829 43.6691 360.058 39.0082 361.278Z" fill="#FF7169" stroke="#383838" stroke-width="1.39697"/>
    <path d="M84.8082 200.466L73.0056 201.045L75.0238 212.049L65.8165 219.456L73.918 227.172L70.8231 238.577L81.9111 240.057L86.1125 251.102L95.9522 245.783L105.844 252.25L110.676 242.162L122.48 241.58L120.461 230.578L129.668 223.168L121.567 215.455L124.662 204.049L113.573 202.57L109.373 191.523L99.5332 196.844L89.6423 190.375L84.8082 200.466Z" fill="#6FC2FF" stroke="#383838" stroke-width="1.39697"/>
    <path d="M419.946 27.6667C418.444 25.4189 419.545 22.3589 422.136 21.5848L443.654 15.1538C446.813 14.2097 449.702 17.2624 448.585 20.3645L439.546 45.4684C438.429 48.5704 434.257 49.0809 432.425 46.3396L419.946 27.6667Z" fill="#FF7169" stroke="#383838" stroke-width="1.39283" stroke-miterlimit="10"/>
  </g>
  <g class="duck-rig">
    <g class="duck-banner">
      <rect x="0.711057" y="141.26" width="511.646" height="66.4322" transform="rotate(-1.04066 0.711057 141.26)" fill="#FFDE00" stroke="#383838" stroke-width="1.39697"/>
      <text x="256" y="187" text-anchor="middle" font-family="Aeonik Mono, Cousine, monospace" font-size="32" font-weight="400" fill="#383838" letter-spacing="0.08em">REPLACE THIS TEXT</text>
    </g>
    <g class="duck-feet">
      <path d="M299.571 351.733L301.619 421.984L241.635 421.642L241.639 421.029C241.639 421.029 289.111 404.261 293.837 391.295C300.055 374.169 293.698 351.209 293.698 351.209L299.571 351.733Z" fill="#FF9538" stroke="#383838" stroke-width="2.32829" stroke-miterlimit="10"/>
      <path d="M316.801 351.835L313.952 422.058L373.936 422.401L373.939 421.788C373.939 421.788 326.662 404.479 322.084 391.459C316.061 374.263 322.68 351.378 322.68 351.378L316.801 351.835Z" fill="#FF9538" stroke="#383838" stroke-width="2.32829" stroke-miterlimit="10"/>
    </g>
    <g class="duck-body">
      <path d="M382.246 330.568C377.326 358.291 334.717 373.256 287.076 363.994C270.062 360.686 260.524 356.315 244.832 343.953C224.244 327.734 216.124 303.757 239.746 282.454C242.663 254.03 257.253 254.338 304.894 263.6C352.534 272.862 387.166 302.845 382.246 330.568Z" fill="white" stroke="#383838" stroke-width="2.32829" stroke-miterlimit="10"/>
      <path d="M256.491 351.374C256.491 351.374 237.838 342.889 225.034 319.466C210.656 298.164 208.138 270.354 209.276 259.113C207.486 196.679 253.834 175.52 272.874 209.426C279.191 220.681 278.455 265.695 303.612 276.523L270.119 296.284L259.841 348.362L256.491 351.374Z" fill="white"/>
      <path d="M302.017 273.708C278.247 263.785 283.315 234.674 274.983 215.631C256.975 174.475 214.415 192.227 209.885 246.19C207.44 288.775 218.775 330.107 256.332 352.253" stroke="#383838" stroke-width="2.32829" stroke-miterlimit="10"/>
      <path d="M213.605 264.027C230.408 256.694 238.413 243.051 238.413 243.051C237.742 253.07 264.746 254.281 266.908 265.692C268.68 275.043 264.564 293.893 239.073 297.566C227.693 299.037 202.609 298.562 196.023 286.688C191.054 286.344 187.622 285.361 185.262 284.808C172.715 282.427 164.047 276.867 175.067 274.193C191.548 270.192 198.902 270.444 213.605 264.027Z" fill="#FF9538" stroke="#383838" stroke-width="2.32829" stroke-miterlimit="10"/>
      <path d="M276.021 217.145C286.236 217.578 290.375 221.25 290.375 229.632C290.334 237.436 289.631 252.307 276.518 252.307C266.293 252.425 243.184 248.643 243.184 229.632C243.184 220.682 247.903 217.102 259.701 217.102L273.858 217.102C274.608 217.102 275.328 217.116 276.021 217.145Z" fill="#383838"/>
      <path d="M187.611 229.632C187.611 220.682 192.33 217.102 204.128 217.102L218.285 217.102C230.083 217.102 234.802 220.682 234.802 229.632C234.802 248.643 211.693 252.425 201.468 252.307C188.355 252.307 187.652 237.436 187.611 229.632Z" fill="#383838"/>
      <path d="M276.021 217.145C286.236 217.578 290.375 221.25 290.375 229.632C290.334 237.436 289.631 252.307 276.518 252.307C266.293 252.425 243.184 248.643 243.184 229.632C243.184 220.682 247.903 217.102 259.701 217.102M243.184 229.632C241.832 228.693 238.262 227.377 234.802 229.632M259.701 217.102L218.285 217.102M218.285 217.102L204.128 217.102C192.33 217.102 187.611 220.682 187.611 229.632C187.652 237.436 188.355 252.307 201.468 252.307C211.693 252.425 234.802 248.643 234.802 229.632C234.802 220.682 230.083 217.102 218.285 217.102ZM321.253 237.725C321.182 221.324 317.031 217.216 300.5 217.186L276.021 217.145" stroke="#383838" stroke-width="2.33032" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;

const BOX_FOLDERS_SVG = String.raw`<svg width="356" height="431" viewBox="0 0 356 431" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g class="duck-rig">
  <g class="duck-body">
    <path d="M163.461 428.649L344.619 390.692C349.45 389.401 352.806 385.018 352.79 380.017L354.524 233.561C354.52 232.273 354.236 231.032 353.719 229.908L159.541 270.17C156.318 270.912 153.014 271.036 149.795 270.566L150.298 428.087C154.498 429.603 159.09 429.817 163.461 428.649Z" fill="#E8E8E8"/>
    <path d="M0.90211 204.083L1.35121 344.538C1.36633 349.266 3.90601 353.626 8.01132 355.971L146.85 426.494C147.959 427.128 149.113 427.659 150.298 428.087L149.795 270.566C149.683 270.549 149.571 270.532 149.459 270.514C146.526 270.047 143.669 269.086 141.015 267.647L2.43207 199.093C1.4562 200.524 0.896246 202.249 0.90211 204.083Z" fill="white"/>
    <path d="M173.589 160.944L7.91721 195.429C5.61614 195.908 3.68261 197.259 2.43207 199.093L141.015 267.647C143.669 269.086 146.526 270.047 149.459 270.514C149.571 270.532 149.683 270.549 149.795 270.566C153.014 271.036 156.318 270.912 159.541 270.17L353.719 229.908C352.81 227.934 351.183 226.321 349.095 225.453L193.002 162.781C186.863 160.229 180.097 159.589 173.589 160.944Z" fill="#383838"/>
    <path d="M2.43207 199.093C1.4562 200.524 0.896246 202.249 0.90211 204.083L1.35121 344.538C1.36633 349.266 3.90601 353.626 8.01132 355.971L146.85 426.494C147.959 427.128 149.113 427.659 150.298 428.087C154.498 429.603 159.09 429.817 163.461 428.649L344.619 390.692C349.45 389.401 352.806 385.018 352.79 380.017L354.524 233.561C354.52 232.273 354.236 231.032 353.719 229.908M150.298 428.087L149.795 270.566M149.795 270.566C153.014 271.036 156.318 270.912 159.541 270.17M149.795 270.566C149.683 270.549 149.571 270.532 149.459 270.514M2.43207 199.093C3.68261 197.259 5.61614 195.908 7.91721 195.429L173.589 160.944C180.097 159.589 186.863 160.229 193.002 162.781L349.095 225.453C351.183 226.321 352.81 227.934 353.719 229.908M2.43207 199.093L141.015 267.647C143.669 269.086 146.526 270.047 149.459 270.514M149.459 270.514C152.784 271.044 156.206 270.937 159.541 270.17L353.719 229.908" stroke="#383838" stroke-width="1.80415"/>
    <mask id="boxmask" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="-1" width="355" height="273">
      <path d="M141.017 267.663L2.43462 199.109L1.80157 1.12549L352.986 0.00259869L353.721 229.924L159.543 270.186C156.321 270.928 153.016 271.052 149.797 270.582C149.685 270.565 149.574 270.548 149.462 270.531C146.528 270.064 143.671 269.102 141.017 267.663Z" fill="#E8E8E8"/>
    </mask>
    <g mask="url(#boxmask)">
      <path d="M115.489 150.394L28.5935 168.974C22.2614 170.328 17.7242 175.906 17.6874 182.381L16.7708 343.663L211.261 294.205L212.147 138.408C212.172 134.018 208.143 130.723 203.846 131.619L198.967 132.635C197.212 133.001 195.404 132.312 194.337 130.872L190.118 125.181C187.493 121.638 183.071 119.91 178.739 120.734L135.762 128.907C130.508 129.907 126.306 133.853 124.979 139.034L124.218 142.007C123.136 146.233 119.755 149.481 115.489 150.394Z" fill="#FF7169" stroke="#383838" stroke-width="1.80415"/>
      <path d="M145.046 95.9879L58.151 114.569C51.8188 115.923 47.2817 121.5 47.2449 127.975L46.3282 289.257L240.819 239.799L241.704 84.0019C241.729 79.6124 237.7 76.3174 233.403 77.2127L228.525 78.2292C226.769 78.5949 224.962 77.9067 223.894 76.4662L219.676 70.7748C217.05 67.232 212.629 65.5043 208.297 66.3281L165.319 74.5017C160.066 75.5009 155.863 79.4475 154.537 84.6282L153.776 87.6008C152.694 91.8268 149.312 95.0757 145.046 95.9879Z" fill="#6FC2FF" stroke="#383838" stroke-width="1.80415"/>
      <path d="M177.229 171.532L90.3339 190.113C84.0017 191.467 79.4646 197.044 79.4278 203.52L78.5111 364.801L273.002 315.343L273.887 159.546C273.912 155.157 269.883 151.862 265.586 152.757L260.707 153.774C258.952 154.139 257.145 153.451 256.077 152.011L251.859 146.319C249.233 142.776 244.812 141.049 240.479 141.873L197.502 150.046C192.249 151.045 188.046 154.992 186.72 160.173L185.959 163.145C184.877 167.371 181.495 170.62 177.229 171.532Z" fill="#FFDE00" stroke="#383838" stroke-width="1.80415"/>
      <path d="M209.21 185.405L122.315 203.986C115.983 205.34 111.446 210.917 111.409 217.392L110.492 378.674L304.983 329.216L305.869 173.419C305.893 169.029 301.865 165.734 297.567 166.63L292.689 167.646C290.934 168.012 289.126 167.324 288.058 165.883L283.84 160.192C281.214 156.649 276.793 154.921 272.461 155.745L229.484 163.919C224.23 164.918 220.028 168.864 218.701 174.045L217.94 177.018C216.858 181.244 213.476 184.493 209.21 185.405Z" fill="#16AA98" stroke="#383838" stroke-width="1.80415"/>
      <path d="M243.247 199.214L156.351 217.795C150.019 219.149 145.482 224.726 145.445 231.201L144.529 392.483L339.019 343.025L339.905 187.228C339.93 182.838 335.901 179.543 331.604 180.439L326.725 181.455C324.97 181.821 323.162 181.133 322.095 179.692L317.876 174.001C315.251 170.458 310.829 168.73 306.497 169.554L263.52 177.728C258.266 178.727 254.064 182.674 252.737 187.854L251.976 190.827C250.894 195.053 247.513 198.302 243.247 199.214Z" fill="#FF7169" stroke="#383838" stroke-width="1.80415"/>
    </g>
  </g>
  <g class="duck-eyes-open">
    <path d="M56.2174 281.791C56.2446 290.306 52.8037 297.221 48.532 297.234C44.6306 297.247 41.3855 291.499 40.8314 284.015C40.8137 283.777 40.9453 283.551 41.1608 283.447L49.5495 279.392C49.9997 279.174 49.9919 278.53 49.5364 278.323L42.0479 274.926C41.787 274.808 41.648 274.519 41.7256 274.243C43.0396 269.567 45.5468 266.407 48.4334 266.397C52.7051 266.384 56.1901 273.276 56.2174 281.791Z" fill="#383838"/>
    <path d="M98.1252 299.279C98.1525 307.794 94.7116 314.708 90.4399 314.722C86.5385 314.735 83.2933 308.987 82.7392 301.503C82.7216 301.264 82.8532 301.039 83.0686 300.935L91.4573 296.88C91.9076 296.662 91.8997 296.018 91.4443 295.811L83.9558 292.414C83.6948 292.296 83.5559 292.006 83.6334 291.731C84.9475 287.055 87.4547 283.894 90.3413 283.885C94.613 283.871 98.098 290.763 98.1252 299.279Z" fill="#383838"/>
  </g>
  <g class="duck-eyes-closed" opacity="0">
    <path d="M40 284 Q48 290 56 284" stroke="#383838" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M82 301 Q90 307 98 301" stroke="#383838" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  </g>
</g>
</svg>`;

const ASTERISK_CHARACTER_SVG = String.raw`<svg width="339" height="340" viewBox="0 0 339 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g class="duck-rig">
  <g class="duck-feet">
    <path d="M153 192 L153 332 L138 332" stroke="#383838" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M192 192 L192 332 L207 332" stroke="#383838" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <g class="duck-body">
    <g transform="translate(3.5, 4)">
      <path d="M199.517 1.5L185.44 136.647L320.586 98.6366L330.441 163.394L200.925 173.953L284.688 285.167L224.153 318.25L164.323 195.069L109.725 317.5L47.4774 285.167L129.832 173.953L1.72467 163.394L11.5791 98.6366L145.318 136.647L130.536 1.5H199.517Z" fill="white" stroke="#383838" stroke-width="3" stroke-miterlimit="10"/>
    </g>
  </g>
  <g class="duck-eyes-open">
    <g transform="translate(122, 97)">
      <path d="M12 12C12 18.6274 9.30485 24 5.98022 24C3.00688 24 0.537032 19.7028 0.0482813 14.0539C0.0133179 13.6498 0.238899 13.2701 0.604633 13.0947L5.77544 10.6153C6.53987 10.2487 6.53003 9.15693 5.75911 8.80422L1.40251 6.81105C0.960806 6.60897 0.725109 6.117 0.870294 5.65347C1.9336 2.25863 3.82459 0 5.98022 0C9.30485 0 12 5.37258 12 12Z" fill="#383838"/>
    </g>
    <g transform="translate(203, 97)">
      <path d="M12 12C12 18.6274 9.30485 24 5.98022 24C3.00688 24 0.537032 19.7028 0.0482813 14.0539C0.0133179 13.6498 0.238899 13.2701 0.604633 13.0947L5.77544 10.6153C6.53987 10.2487 6.53003 9.15693 5.75911 8.80422L1.40251 6.81105C0.960806 6.60897 0.725109 6.117 0.870294 5.65347C1.9336 2.25863 3.82459 0 5.98022 0C9.30485 0 12 5.37258 12 12Z" fill="#383838"/>
    </g>
  </g>
  <g class="duck-eyes-closed" opacity="0">
    <path d="M122 110 Q128 116 134 110" stroke="#383838" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M203 110 Q209 116 215 110" stroke="#383838" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  </g>
</g>
</svg>`;

function DucksOnDatabaseAsset() {
  return <div dangerouslySetInnerHTML={{ __html: DUCKS_ON_DATABASE_SVG }} />;
}

function CinemaDuckAsset() {
  return <div dangerouslySetInnerHTML={{ __html: CINEMA_DUCK_SVG }} />;
}

function ChatBubbleDuckAsset() {
  return <div dangerouslySetInnerHTML={{ __html: CHAT_BUBBLE_DUCK_SVG }} />;
}

function PartyBannerDuckAsset() {
  return <div dangerouslySetInnerHTML={{ __html: PARTY_BANNER_DUCK_SVG }} />;
}

function BoxFoldersAsset() {
  return <div dangerouslySetInnerHTML={{ __html: BOX_FOLDERS_SVG }} />;
}

function AsteriskCharacterAsset() {
  return <div dangerouslySetInnerHTML={{ __html: ASTERISK_CHARACTER_SVG }} />;
}

function DuckIllustrationSlot({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`split-illustration-slot ${className}`}>
      {children ?? <DucksOnDatabaseAsset />}
    </div>
  );
}

/* Layout adapted from analytics-agent-duckdb-workshop / AgenticLoop.tsx.
   ViewBox is 960x580. All node positions are percentages; wire paths are
   absolute SVG coordinates so endpoints align with node edges exactly. */

type LoopPhase = {
  label: string;
  detail: string;
  activeNode: "chat" | "llm" | "mcp" | "db";
  activeWire: "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
  dot: { x: number; y: number };
  payload?: { text: string; x: number; y: number };
  status?: "err" | "ok";
  highlightRow?: boolean;
};

const LOOP_PHASES: LoopPhase[] = [
  {
    label: "User prompt",
    detail: "What's the average order value?",
    activeNode: "chat",
    activeWire: "w1",
    dot: { x: 294, y: 118 },
    payload: { text: '"average order value"', x: 230, y: 80 },
  },
  {
    label: "LLM plans",
    detail: "The model chooses a tool instead of guessing.",
    activeNode: "llm",
    activeWire: "w3",
    dot: { x: 441, y: 280 },
    payload: { text: "query_warehouse(sql)", x: 500, y: 250 },
  },
  {
    label: "MCP executes",
    detail: "Tools expose the warehouse and return exact errors.",
    activeNode: "mcp",
    activeWire: "w5",
    dot: { x: 633, y: 424 },
    payload: { text: "SELECT avg(order_total)", x: 555, y: 392 },
  },
  {
    label: "Database responds",
    detail: "Results, comments, and errors become new context.",
    activeNode: "db",
    activeWire: "w6",
    dot: { x: 633, y: 444 },
    payload: { text: "amounts are cents", x: 555, y: 460 },
    status: "err",
  },
  {
    label: "Loop corrects",
    detail: "The agent revises the query with the new evidence.",
    activeNode: "llm",
    activeWire: "w4",
    dot: { x: 501, y: 280 },
    payload: { text: "divide by 100", x: 510, y: 240 },
  },
  {
    label: "Answer ships",
    detail: "A trace is left behind for evals and future context.",
    activeNode: "chat",
    activeWire: "w2",
    dot: { x: 294, y: 144 },
    payload: { text: '"€169.90"', x: 230, y: 160 },
    status: "ok",
    highlightRow: true,
  },
];

const WIRE_PATHS: Record<LoopPhase["activeWire"], string> = {
  w1: "M 213 118 L 376 118",
  w2: "M 376 144 L 213 144",
  w3: "M 441 172 L 441 390",
  w4: "M 501 390 L 501 172",
  w5: "M 570 424 L 696 424",
  w6: "M 696 444 L 570 444",
};

function AgenticLoopVisual({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  const current = LOOP_PHASES[phase];

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    const id = window.setInterval(
      () => setPhase((prev) => (prev + 1) % LOOP_PHASES.length),
      1700,
    );
    return () => window.clearInterval(id);
  }, [active]);

  const isLit = (id: LoopPhase["activeNode"]) => current.activeNode === id;
  const dotColor =
    current.status === "err" ? "var(--watermelon)" :
    current.status === "ok"  ? "var(--garden)" :
    "var(--sun)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxWidth: "min(100%, 1080px)",
        maxHeight: "100%",
        margin: "0 auto",
        aspectRatio: "960 / 580",
        background: "transparent",
      }}
    >
      <svg
        viewBox="0 0 960 580"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <defs>
          <marker id="loop-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--rule)" />
          </marker>
        </defs>

        {/* dashed Agentic Loop border */}
        <rect
          x="310" y="42" rx="22" ry="22" width="640" height="470"
          fill="none" stroke="var(--muted)" strokeWidth="1.5"
          strokeDasharray="8 5" strokeLinecap="round"
        />
        <text x="780" y="34" fontFamily="var(--aeonik)" fontSize="14" fontStyle="italic" fill="var(--muted)">
          Agentic Loop
        </text>

        {/* Static wires */}
        {(Object.keys(WIRE_PATHS) as LoopPhase["activeWire"][]).map((id) => (
          <path
            key={id}
            d={WIRE_PATHS[id]}
            fill="none"
            stroke="var(--rule)"
            strokeWidth="2"
            strokeLinecap="round"
            markerEnd="url(#loop-arrow)"
          />
        ))}

        {/* Glow on active wire */}
        {(Object.keys(WIRE_PATHS) as LoopPhase["activeWire"][]).map((id) => (
          <path
            key={`g-${id}`}
            d={WIRE_PATHS[id]}
            fill="none"
            stroke={id === current.activeWire ? dotColor : "transparent"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={id === current.activeWire ? "14 10" : undefined}
            style={{
              animation: id === current.activeWire ? "a-loop-dash 0.75s linear infinite" : undefined,
              opacity: id === current.activeWire ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        ))}

        {/* Animated dot */}
        <circle
          cx={current.dot.x}
          cy={current.dot.y}
          r="7"
          fill={dotColor}
          stroke="var(--ink)"
          strokeWidth="1.5"
          style={{
            filter: `drop-shadow(0 0 8px ${dotColor})`,
            transition: "cx 0.55s ease, cy 0.55s ease, fill 0.2s ease",
          }}
        />
      </svg>

      {/* Chat window (top-left) */}
      <div
        style={{
          position: "absolute",
          left: "3.96%", top: "9.48%",
          width: "18.23%", height: "23.1%",
          background: "var(--white)",
          border: "2px solid var(--ink)",
          borderRadius: 10,
          overflow: "hidden",
          transition: "box-shadow 0.3s, transform 0.3s",
          transform: isLit("chat") ? "scale(1.03)" : "scale(1)",
          boxShadow: isLit("chat") ? "-6px 6px 0 var(--ink)" : "-3px 3px 0 rgba(56,56,56,0.5)",
        }}
      >
        <div
          style={{
            height: "26%",
            background: "var(--sun)",
            borderBottom: "2px solid var(--ink)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: 5,
          }}
        >
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", opacity: 0.25 }} />
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", opacity: 0.25 }} />
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", opacity: 0.25 }} />
        </div>
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            fontSize: "0.85em",
            padding: "4px 8px",
            borderRadius: "8px 8px 2px 8px",
            background: "var(--code-header)",
            alignSelf: "flex-end",
            fontFamily: "var(--aeonik)",
            maxWidth: "85%",
          }}>
            avg order value?
          </div>
          {current.status === "ok" && (
            <div style={{
              fontSize: "0.85em",
              padding: "4px 8px",
              borderRadius: "8px 8px 8px 2px",
              background: "var(--sun)",
              alignSelf: "flex-start",
              fontFamily: "var(--aeonik)",
              maxWidth: "85%",
            }}>
              €169.90
            </div>
          )}
        </div>
      </div>

      {/* LLM (yellow pill) */}
      <div
        style={{
          position: "absolute",
          left: "38.75%", top: "14.14%",
          width: "20.63%", height: "15.17%",
          background: "var(--sun)",
          border: "2px solid var(--ink)",
          borderRadius: 999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow 0.3s, transform 0.3s",
          transform: isLit("llm") ? "scale(1.03)" : "scale(1)",
          boxShadow: isLit("llm") ? "-6px 6px 0 var(--ink)" : "-3px 3px 0 rgba(56,56,56,0.4)",
        }}
      >
        <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(16px, 1.6vw, 28px)", letterSpacing: "-0.01em" }}>LLM</div>
        <div style={{ fontFamily: "var(--inter)", fontSize: "clamp(11px, 0.95vw, 16px)", color: "var(--muted)", marginTop: 2 }}>
          Reason + choose tools
        </div>
      </div>

      {/* MCP (green octagon) */}
      <div
        style={{
          position: "absolute",
          left: "38.75%", top: "67.24%",
          width: "20.63%", height: "15.17%",
          transition: "transform 0.3s",
          transform: isLit("mcp") ? "scale(1.03)" : "scale(1)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--garden)",
            border: "2px solid var(--ink)",
            clipPath: "polygon(12% 0%, 88% 0%, 100% 30%, 100% 70%, 88% 100%, 12% 100%, 0% 70%, 0% 30%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--white)",
          }}
        >
          <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(16px, 1.5vw, 26px)", letterSpacing: "-0.01em" }}>MCP Server</div>
          <div style={{ fontFamily: "var(--inter)", fontSize: "clamp(11px, 0.95vw, 16px)", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
            Tool call
          </div>
        </div>
      </div>

      {/* DB table (bottom-right) */}
      <div
        style={{
          position: "absolute",
          left: "72.71%", top: "60%",
          width: "23%",
          transition: "transform 0.3s",
          transform: isLit("db") ? "scale(1.03)" : "scale(1)",
        }}
      >
        <div style={{ fontSize: "0.9em", color: "var(--muted)", marginBottom: 4, fontFamily: "var(--mono)" }}>
          orders
        </div>
        <table
          style={{
            width: "100%",
            fontSize: "0.85em",
            borderCollapse: "separate",
            borderSpacing: 0,
            border: "1.5px solid var(--rule)",
            borderRadius: 8,
            overflow: "hidden",
            background: "var(--white)",
            fontFamily: "var(--inter)",
          }}
        >
          <thead>
            <tr>
              {["order_id", "total", "ts"].map((h) => (
                <th key={h} style={{
                  background: "var(--code-header)",
                  padding: "4px 8px",
                  textAlign: "left",
                  fontSize: "0.9em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "var(--muted)",
                  fontFamily: "var(--mono)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["A-001", "16990", "08:02"],
              ["A-002", "8400", "08:14"],
              ["A-003", "23110", "09:01"],
              ["A-004", "12500", "09:33"],
            ].map((row, i) => (
              <tr
                key={row[0]}
                style={
                  current.highlightRow && i === 0
                    ? { background: "rgba(255,222,0,0.4)", fontWeight: 700, transition: "background 0.3s" }
                    : { transition: "background 0.3s" }
                }
              >
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "3px 8px", borderTop: "1px solid var(--code-header)", fontFamily: j === 1 ? "var(--mono)" : "var(--inter)" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating payload */}
      {current.payload && (
        <div
          style={{
            position: "absolute",
            left: `${(current.payload.x / 960) * 100}%`,
            top: `${(current.payload.y / 580) * 100}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "0.85em",
            lineHeight: 1.35,
            color:
              current.status === "err" ? "#B33A2E" :
              current.status === "ok" ? "#0E7E6F" :
              "var(--ink)",
            background:
              current.status === "err" ? "#FFF6F5" :
              current.status === "ok" ? "#F0FDFB" :
              "var(--white)",
            border: `1.5px solid ${
              current.status === "err" ? "var(--watermelon)" :
              current.status === "ok" ? "var(--garden)" :
              "var(--rule)"
            }`,
            borderRadius: 5,
            padding: "3px 9px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            fontFamily: "var(--mono)",
            zIndex: 15,
          }}
        >
          {current.payload.text}
        </div>
      )}

      {/* Step indicator (bottom-left) */}
      <div
        style={{
          position: "absolute",
          left: "2%",
          bottom: "0%",
          maxWidth: "32%",
          background: "var(--ink)",
          color: "var(--sand)",
          border: "2px solid var(--ink)",
          padding: "clamp(10px, 0.9vw, 16px) clamp(12px, 1vw, 18px)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div className="eyebrow" style={{ color: dotColor }}>
          {String(phase + 1).padStart(2, "0")} / {current.label}
        </div>
        <div className="body-sm" style={{ color: "var(--sand)" }}>{current.detail}</div>
      </div>
    </div>
  );
}

function ChromeTitlebar({ title }: { title: string }) {
  return (
    <div className="chrome-titlebar">
      <div className="chrome-dots" aria-hidden="true">
        <span className="chrome-dot chrome-dot--close" />
        <span className="chrome-dot chrome-dot--min" />
        <span className="chrome-dot chrome-dot--max" />
      </div>
      <div className="chrome-title">{title}</div>
    </div>
  );
}

// ── Infrastructure For Answers slides ──

// S1 — Hero title (ink)
function TitleSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="ink" active={active} scatter={false} badge={false} flush>
      <img className="title-image" src={`${import.meta.env.BASE_URL}infrastructure-duck-title.png`} alt="" />
      <div className="title-scrim" />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "grid", gridTemplateColumns: "1.7fr 1fr", alignItems: "center", gap: "4vw", padding: "5vw 6vw" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vw" }}>
          <div className="eyebrow eyebrow--sky" data-anim="fade-left" style={{ animationDelay: "0.25s" }}>
            {DECK_META.author} · {DECK_META.event} · {DECK_META.date}
          </div>
          <div className="headline-xxl" data-anim="fade-up" style={{ animationDelay: "0.45s", color: "var(--sand)", textShadow: "0 3px 0 rgba(0,0,0,0.28)" }}>
            Infrastructure for<br />
            <span style={{ color: "var(--sky)" }}>answers.</span>
          </div>
          <div className="body-lg" data-anim="fade-up" style={{ animationDelay: "0.75s", color: "var(--sand)", maxWidth: "42ch" }}>
            {DECK_META.subtitle}
          </div>
        </div>
        <div data-anim="pop" style={{ animationDelay: "0.65s", justifySelf: "center" }}>
          <QrCard src={QR_FOLLOW.src} label={QR_FOLLOW.label} url={QR_FOLLOW.url} />
        </div>
      </div>
    </Slide>
  );
}

// S2 — Section transition: where we are (full-bleed image + sand gradient)
function TransitionWhereWeAre({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active} scatter={false} flush>
      <div className="image-stage">
        <img
          className="image-stage__img"
          src={`${import.meta.env.BASE_URL}${TRANSITION_WHERE.image}`}
          alt={TRANSITION_WHERE.imageAlt}
        />
        <div className="image-stage__scrim" />
        <div className="image-stage__content">
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{TRANSITION_WHERE.eyebrow}</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "22ch" }}>
            {TRANSITION_WHERE.headlineLines[0]}<br />
            <span style={{ color: "var(--sky)" }}>{TRANSITION_WHERE.headlineLines[1]}</span>
          </div>
          <AccentRule />
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.95s", color: "var(--muted-dark)", maxWidth: "44ch" }}>
            {TRANSITION_WHERE.body}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// S3 — Trap setup code
function TrapSetupSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vw" }}>
        <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s", whiteSpace: "pre-line" }}>
          {TRAP_SETUP.question}
        </div>
        <div className="chrome" data-anim="fade-up" style={{ animationDelay: "0.55s", maxWidth: "82%" }}>
          <ChromeTitlebar title={TRAP_SETUP.filename} />
          <CodeBlock language="log" code={TRAP_SETUP.code} />
        </div>
        <div className="eyebrow" data-anim="fade-up" style={{ animationDelay: "0.95s", color: "var(--watermelon)", maxWidth: "60ch" }}>
          {TRAP_SETUP.caption}
        </div>
      </div>
    </Slide>
  );
}

// S4 — Trap catch: where the 169 comes from
function TrapCatchSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "0.86fr 1.14fr", gap: "4vw", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vw" }}>
          <div className="eyebrow eyebrow--watermelon" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>
            {TRAP_CATCH.eyebrow}
          </div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "13ch", whiteSpace: "pre-line" }}>
            {TRAP_CATCH.headline}
          </div>
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--muted-dark)", maxWidth: "35ch" }}>
            {TRAP_CATCH.body}
          </div>
        </div>
        <div className="chrome" data-anim="fade-up" style={{ animationDelay: "0.55s" }}>
          <ChromeTitlebar title={TRAP_CATCH.filename} />
          <CodeBlock language="sql" code={TRAP_CATCH.code} />
          <div style={{ padding: "1.4vw 1.8vw", borderTop: "2px solid var(--ink)", background: "var(--sun)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1.5vw" }}>
            <div className="eyebrow" style={{ color: "var(--ink)" }}>{TRAP_CATCH.conversionLabel}</div>
            <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(20px, 2.1vw, 38px)", lineHeight: 1.05, color: "var(--ink)", whiteSpace: "nowrap" }}>
              {TRAP_CATCH.conversion}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// S5 — Trap reveal big stat (ink, watermelon rule)
function TrapRevealSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="ink" active={active}>
      <HeroCenter gap={28}>
        <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s", color: "var(--muted-dark)" }}>
          {TRAP_REVEAL.eyebrow}
        </div>
        <div className="bigstat" data-anim="pop" style={{ animationDelay: "0.4s", color: "var(--sky)" }}>
          {TRAP_REVEAL.bigstat}
        </div>
        <div className="body-lg" data-anim="fade-up" style={{ animationDelay: "0.85s", color: "var(--muted-dark)", textAlign: "center" }}>
          {TRAP_REVEAL.body}
        </div>
        <div data-anim="grow-x" style={{ animationDelay: "1.1s", height: 4, width: "clamp(120px, 14vw, 240px)", background: "var(--watermelon)", margin: "8px auto 0" }} />
        <div className="headline-md" data-anim="fade-up" style={{ animationDelay: "1.35s", color: "var(--sand)", textAlign: "center", maxWidth: "26ch", textTransform: "none", fontFamily: "var(--inter)", fontWeight: 500, whiteSpace: "pre-line" }}>
          {TRAP_REVEAL.tagline}
        </div>
      </HeroCenter>
    </Slide>
  );
}

function TransitionHeadline({ eyebrow, lines, highlightLast }: { eyebrow: string; lines: readonly string[]; highlightLast?: boolean }) {
  const last = lines.length - 1;
  return (
    <HeroLeft gap={28}>
      <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{eyebrow}</div>
      <div className="headline-xl" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "26ch" }}>
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {highlightLast && i === last ? (
              <span style={{ color: "var(--sky)" }}>{line}</span>
            ) : (
              line
            )}
            {i < last && <br />}
          </React.Fragment>
        ))}
      </div>
      <AccentRule />
    </HeroLeft>
  );
}

// S6 — Section transition: why?
function TransitionWhy({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <TransitionHeadline eyebrow={TRANSITION_WHY.eyebrow} lines={TRANSITION_WHY.headlineLines} highlightLast />
    </Slide>
  );
}

// S7 — Three levels card row with design-library duck SVGs
function LevelsCardRow({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3vw" }}>
        <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
          {LEVELS.headline}
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw", alignItems: "stretch" }}>
          {LEVELS.cards.map((card) => (
            <div
              key={card.num}
              style={{
                background: "var(--white)",
                border: "2px solid var(--ink)",
                boxShadow: "-8px 8px 0 var(--ink)",
                padding: "1.4vw 1.6vw",
                display: "flex",
                flexDirection: "column",
                gap: "0.8vw",
              }}
            >
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "1.4vw", color: "var(--sky)" }}>{card.num}</div>
              <img src={`${import.meta.env.BASE_URL}${card.img}`} alt={card.sub} style={{ width: "100%", height: "11vw", objectFit: "contain", objectPosition: "center", alignSelf: "center" }} />
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "1.8vw", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.05 }}>{card.name}</div>
              <div className="eyebrow" style={{ color: "var(--muted)" }}>{card.sub}</div>
              <div className="body-sm" style={{ color: "var(--ink)" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// S7 — Animated loop diagram (full-width: text above, loop below)
function AgenticLoopAnimationSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active} scatter={false}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.4vw", minHeight: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3vw", alignItems: "baseline" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6vw" }}>
            <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{LOOP_ANIM.eyebrow}</div>
            <div className="headline-md" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "16ch" }}>
              {LOOP_ANIM.headline}
            </div>
          </div>
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--muted-dark)", maxWidth: "56ch" }}>
            {LOOP_ANIM.body}
          </div>
        </div>
        <div data-anim="fade-up" style={{ animationDelay: "0.55s", width: "100%", flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AgenticLoopVisual active={active} />
        </div>
      </div>
    </Slide>
  );
}

// S7 — The loop code slide
function LoopCodeSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vw" }}>
        <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
          {LOOP_CODE.headline}
        </div>
        <div className="chrome" data-anim="fade-up" style={{ animationDelay: "0.55s", maxWidth: "84%" }}>
          <ChromeTitlebar title={LOOP_CODE.filename} />
          <CodeBlock language="python" code={LOOP_CODE.code} />
        </div>
        <div className="eyebrow" data-anim="fade-up" style={{ animationDelay: "0.95s", color: "var(--sky)" }}>
          → Tool calls, trace logs, and model swaps are infrastructure choices.
        </div>
      </div>
    </Slide>
  );
}

// S8 — Section transition: context was the problem
function TransitionContextWasIt({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <TransitionHeadline eyebrow={TRANSITION_CONTEXT.eyebrow} lines={TRANSITION_CONTEXT.headlineLines} highlightLast />
    </Slide>
  );
}

// S9 — Two-column comparison built inline (no TwoCol primitive in template)
function TwoLayersContextSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3vw" }}>
        <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
          {CONTEXT_STACK.headline}
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.8vw" }}>
          {CONTEXT_STACK.layers.map((layer) => (
            <div key={layer.label} style={{ background: "var(--white)", border: "2px solid var(--ink)", boxShadow: "-7px 7px 0 var(--ink)", padding: "1.35vw", minHeight: "15vw", display: "flex", flexDirection: "column", gap: "1vw" }}>
              <div style={{ width: 48, height: 14, background: layer.color, border: "2px solid var(--ink)" }} />
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(20px, 2vw, 36px)", textTransform: "uppercase", lineHeight: 1 }}>{layer.label}</div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: "auto" }}>{layer.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// S10 — COMMENT ON code
function CommentOnCodeSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vw" }}>
        <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
          {COMMENT_ON.headline}
        </div>
        <div className="chrome" data-anim="fade-up" style={{ animationDelay: "0.55s", maxWidth: "84%" }}>
          <ChromeTitlebar title={COMMENT_ON.filename} />
          <CodeBlock language="sql" code={COMMENT_ON.code} />
        </div>
      </div>
    </Slide>
  );
}

function BenchmarkRealitySlide({ active }: { active: boolean }) {
  return (
    <Slide variant="ink" active={active}>
      <HeroCenter gap={30}>
        <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s", color: "var(--muted-dark)" }}>
          {BENCHMARK.eyebrow}
        </div>
        <div className="bigstat" data-anim="pop" style={{ animationDelay: "0.35s", color: "var(--sky)" }}>
          {BENCHMARK.bigstat}
        </div>
        <div className="headline-md" data-anim="fade-up" style={{ animationDelay: "0.75s", color: "var(--sand)", textAlign: "center", textTransform: "none", fontFamily: "var(--inter)", fontWeight: 500, maxWidth: "34ch" }}>
          {BENCHMARK.headline}
        </div>
        <div className="body-md" data-anim="fade-up" style={{ animationDelay: "1.05s", color: "var(--muted-dark)", maxWidth: "46ch", textAlign: "center" }}>
          {BENCHMARK.body}
        </div>
      </HeroCenter>
    </Slide>
  );
}

function ContextBeatsModelSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3vw" }}>
        <div>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{CONTEXT_BEATS.eyebrow}</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "18ch" }}>
            {CONTEXT_BEATS.headline}
          </div>
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5vw" }}>
          {CONTEXT_BEATS.cards.map((card) => (
            <div key={card.label} style={{ background: "var(--white)", border: "2px solid var(--ink)", boxShadow: "-8px 8px 0 var(--ink)", padding: "1.6vw", minHeight: "17vw", display: "flex", flexDirection: "column", gap: "1vw" }}>
              <div className="eyebrow" style={{ color: "var(--muted)" }}>{card.label}</div>
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(34px, 4vw, 76px)", letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--sky)" }}>{card.stat}</div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
        <div className="body-md" data-anim="fade-up" style={{ animationDelay: "1.1s", color: "var(--muted-dark)", maxWidth: "60ch" }}>
          {CONTEXT_BEATS.body}
        </div>
      </div>
    </Slide>
  );
}

function ManualDriftSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active} flush scatter={false}>
      <HalfAndHalfTemplate
        leftBackground="var(--sand)"
        rightBackground="var(--sky)"
        left={
          <div style={{ display: "flex", flexDirection: "column", gap: "2vw" }}>
            <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{MANUAL_DRIFT.eyebrow}</div>
            <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s" }}>
              {MANUAL_DRIFT.headline}
            </div>
            <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--muted-dark)", maxWidth: "34ch" }}>
              {MANUAL_DRIFT.body}
            </div>
          </div>
        }
        right={
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.4vw" }}>
            {MANUAL_DRIFT.rows.map(([label, desc], i) => (
              <div key={label} data-anim="fade-up" style={{ animationDelay: `${0.5 + i * 0.18}s`, background: "var(--white)", border: "2px solid var(--ink)", boxShadow: "-6px 6px 0 var(--ink)", padding: "1.2vw", textAlign: "left" }}>
                <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(18px, 2vw, 34px)", textTransform: "uppercase", lineHeight: 1 }}>{label}</div>
                <div className="body-sm" style={{ color: "var(--ink)", marginTop: 8 }}>{desc}</div>
              </div>
            ))}
          </div>
        }
        band={
          <div className="split-cta">
            {MANUAL_DRIFT.cta}
          </div>
        }
      />
    </Slide>
  );
}

function EvalLoopSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "0.9fr 1.4fr", gap: "4vw", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vw" }}>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{EVAL_LOOP.eyebrow}</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "13ch" }}>
            {EVAL_LOOP.headline}
          </div>
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--muted-dark)", maxWidth: "34ch" }}>
            {EVAL_LOOP.body}
          </div>
        </div>
        <div className="stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4vw" }}>
          {EVAL_LOOP.steps.map(([label, desc], i) => (
            <div key={label} style={{ background: "var(--white)", border: "2px solid var(--ink)", boxShadow: "-6px 6px 0 var(--ink)", padding: "1.15vw", minHeight: "8vw" }}>
              <div className="eyebrow" style={{ color: i === 5 ? "var(--watermelon)" : "var(--sky)" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(16px, 1.65vw, 30px)", textTransform: "uppercase", lineHeight: 1.05 }}>{label}</div>
              <div className="body-sm" style={{ marginTop: 8, color: "var(--ink)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// S11 — Section transition: skills don't scale
function TransitionSkillsDrift({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <TransitionHeadline eyebrow={TRANSITION_SKILLS.eyebrow} lines={TRANSITION_SKILLS.headlineLines} highlightLast />
    </Slide>
  );
}

// S12 — Skill-as-infra card row
function SkillAsInfraCardRow({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr auto", gap: "3vw", alignItems: "end" }}>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
            {MCP_MEMORY.headline}
          </div>
          <div data-anim="pop" style={{ animationDelay: "0.4s" }}>
            <QrCard src={QR_MCP_MEMORY.src} label={QR_MCP_MEMORY.label} url={QR_MCP_MEMORY.url} compact />
          </div>
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw", alignItems: "stretch" }}>
          {MCP_MEMORY.cards.map((card) => (
            <div
              key={card.num}
              style={{
                background: "var(--white)",
                border: "2px solid var(--ink)",
                boxShadow: "-8px 8px 0 var(--ink)",
                padding: "1.6vw 1.8vw",
                display: "flex",
                flexDirection: "column",
                gap: "1vw",
                minHeight: "16vw",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--aeonik)", fontSize: "1.4vw", color: "var(--sky)" }}>{card.num}</div>
                <DuckIcon kind={card.duck} size={72} />
              </div>
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "2.4vw", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.05 }}>{card.name}</div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// S13 — Section transition: wait, you already have it
function TransitionWait({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <TransitionHeadline eyebrow={TRANSITION_WAIT.eyebrow} lines={TRANSITION_WAIT.headlineLines} highlightLast />
    </Slide>
  );
}

// S14 — dbt golden split: model in chrome (wide) + 4 attribute rows (sky narrow)
function DbtGoldenSplitSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active} flush scatter={false}>
      <GoldenSplitTemplate
        wideSide="left"
        wide={
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.6vw", padding: "3.5vw 3vw" }}>
            <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{DBT_SPLIT.eyebrow}</div>
            <div className="headline-md" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "22ch", textTransform: "none", fontFamily: "var(--inter)", fontWeight: 500 }}>
              {DBT_SPLIT.headline}
            </div>
            <div className="chrome" data-anim="fade-up" style={{ animationDelay: "0.65s", maxWidth: "100%" }}>
              <ChromeTitlebar title={DBT_SPLIT.filename} />
              <CodeBlock language="sql" code={DBT_SPLIT.code} />
            </div>
          </div>
        }
        narrow={
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.8vw", padding: "3.5vw 2.5vw", height: "100%" }}>
            {DBT_SPLIT.rows.map((row, i) => (
              <div key={row.label} data-anim="fade-up" style={{ animationDelay: `${0.6 + i * 0.15}s`, display: "flex", flexDirection: "column", gap: "0.3vw" }}>
                <div style={{ fontFamily: "var(--aeonik)", fontSize: "2vw", textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--ink)" }}>{row.label}</div>
                <div className="body-sm" style={{ color: "var(--ink)", opacity: 0.8 }}>{row.desc}</div>
              </div>
            ))}
          </div>
        }
      />
    </Slide>
  );
}

// S15 — Stagger bullets: what your dbt already has
function DbtStaggerSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3vw" }}>
        <div className="headline-xl" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
          {DBT_STAGGER.headline}
        </div>
        <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {DBT_STAGGER.lines.map((line) => (
            <div key={line} className="body-lg" style={{ fontWeight: 500 }}>{line}</div>
          ))}
          <div className="body-lg" style={{ color: "var(--sky)", fontWeight: 500 }}>{DBT_STAGGER.highlight}</div>
        </div>
      </div>
    </Slide>
  );
}

function ContextLayerSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4vw", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vw" }}>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{CONTEXT_LAYER.eyebrow}</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "14ch" }}>
            {CONTEXT_LAYER.headline}
          </div>
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--muted-dark)", maxWidth: "36ch" }}>
            {CONTEXT_LAYER.body}
          </div>
        </div>
        <div data-anim="fade-up" style={{ animationDelay: "0.55s", position: "relative", minHeight: "34vw" }}>
          {CONTEXT_LAYER.items.map((item, i) => (
            <div key={item.label} style={{ position: "absolute", top: item.top, left: item.left, width: "38%", background: "var(--white)", border: "2px solid var(--ink)", boxShadow: "-8px 8px 0 var(--ink)", padding: "1.3vw", zIndex: 3 - i }}>
              <div style={{ width: 46, height: 14, background: item.color, border: "2px solid var(--ink)", marginBottom: "1vw" }} />
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(22px, 2.6vw, 46px)", textTransform: "uppercase", lineHeight: 1 }}>{item.label}</div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: 8 }}>{item.desc}</div>
            </div>
          ))}
          <svg viewBox="0 0 600 380" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <path d="M 160 115 C 260 120, 285 180, 345 210" stroke="var(--ink)" strokeWidth="3" fill="none" strokeDasharray="8 8" />
            <path d="M 390 245 C 450 260, 470 305, 505 332" stroke="var(--ink)" strokeWidth="3" fill="none" strokeDasharray="8 8" />
          </svg>
        </div>
      </div>
    </Slide>
  );
}

function AnswerWorkflowSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.6vw" }}>
        <div>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{ANSWER_WORKFLOW.eyebrow}</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "20ch" }}>
            {ANSWER_WORKFLOW.headline}
          </div>
        </div>
        <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.2vw" }}>
          {ANSWER_WORKFLOW.steps.map((step, i) => (
            <div key={step.label} style={{ background: step.color, border: "2px solid var(--ink)", boxShadow: "-6px 6px 0 var(--ink)", padding: "1.1vw", minHeight: "17vw", display: "flex", flexDirection: "column", gap: "0.7vw" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <DuckIcon kind={step.duck} size={72} />
              </div>
              <div className="eyebrow" style={{ color: "var(--ink)", opacity: 0.7 }}>0{i + 1}</div>
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(18px, 2.1vw, 38px)", textTransform: "uppercase", lineHeight: 1, color: "var(--ink)" }}>{step.label}</div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: "auto" }}>{step.desc}</div>
            </div>
          ))}
        </div>
        <div className="body-md" data-anim="fade-up" style={{ animationDelay: "1.1s", color: "var(--muted-dark)", maxWidth: "56ch" }}>
          {ANSWER_WORKFLOW.body}
        </div>
      </div>
    </Slide>
  );
}

// S16 — Role-change hero reveal (ink)
function RoleChangeRevealSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="ink" active={active}>
      <HeroCenter gap={36}>
        <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s", color: "var(--muted-dark)" }}>
          {ROLE_CHANGE.eyebrow}
        </div>
        <div className="headline-xxl" data-anim="pop" style={{ animationDelay: "0.45s", color: "var(--sand)", textAlign: "center" }}>
          {ROLE_CHANGE.headlineLines[0]}<br />
          <span style={{ color: "var(--sky)" }}>{ROLE_CHANGE.headlineLines[1]}</span>
        </div>
        <AccentRule />
        <div className="headline-md" data-anim="fade-up" style={{ animationDelay: "1.1s", color: "var(--sand)", textAlign: "center", maxWidth: "26ch", textTransform: "none", fontFamily: "var(--inter)", fontWeight: 500, whiteSpace: "pre-line" }}>
          {ROLE_CHANGE.tagline}
        </div>
      </HeroCenter>
    </Slide>
  );
}

// S17 — Action card row: three things to do Monday
function ActionCardRow({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3vw" }}>
        <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.2s" }}>
          {ACTIONS.headline}
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw", alignItems: "stretch" }}>
          {ACTIONS.cards.map((card) => (
            <div
              key={card.num}
              style={{
                background: "var(--white)",
                border: "2px solid var(--ink)",
                boxShadow: "-8px 8px 0 var(--ink)",
                padding: "1.6vw 1.8vw",
                display: "flex",
                flexDirection: "column",
                gap: "1vw",
                minHeight: "16vw",
              }}
            >
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "1.4vw", color: "var(--sky)" }}>{card.num}</div>
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "2.4vw", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.05 }}>{card.name}</div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

const KIND_COLORS: Record<string, string> = {
  code: "var(--garden)",
  paper: "var(--watermelon)",
  post: "var(--sun)",
};

function ResourcesSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.5fr auto", gap: "2.5vw", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.8vw" }}>
          <div>
            <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>Resources</div>
            <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "18ch" }}>
              {RESOURCES.headline}
            </div>
          </div>
          <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.3vw" }}>
            {RESOURCES.items.map((item) => (
              <a
                key={item.url}
                href={`https://${item.url}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "var(--white)",
                  border: "2px solid var(--ink)",
                  boxShadow: "-7px 7px 0 var(--ink)",
                  padding: "1.1vw 1.3vw",
                  minHeight: "8vw",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5vw",
                  color: "var(--ink)",
                  textDecoration: "none",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = "-9px 9px 0 var(--ink)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "-7px 7px 0 var(--ink)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 32, height: 9, background: KIND_COLORS[item.kind] || "var(--sky)", border: "2px solid var(--ink)" }} />
                  <div className="eyebrow" style={{ color: "var(--muted)" }}>{item.label}</div>
                </div>
                <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(16px, 1.6vw, 28px)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.1 }}>{item.title}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(12px, 0.95vw, 16px)", color: "var(--muted-dark)", marginTop: "auto", overflowWrap: "anywhere" }}>{item.url}</div>
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5vw", alignItems: "center" }}>
          <div data-anim="pop" style={{ animationDelay: "0.55s" }}>
            <QrCard src={QR_MCP_MEMORY.src} label={QR_MCP_MEMORY.label} url={QR_MCP_MEMORY.url} compact />
          </div>
          <a
            href={`https://${RESOURCES.featured.url}`}
            target="_blank"
            rel="noreferrer"
            data-anim="pop"
            style={{
              animationDelay: "0.75s",
              display: "flex",
              flexDirection: "column",
              width: "min(18vw, 220px)",
              background: "var(--white)",
              border: "2px solid var(--ink)",
              boxShadow: "-8px 8px 0 var(--ink)",
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${RESOURCES.featured.image}`}
              alt={RESOURCES.featured.title}
              style={{ display: "block", width: "100%", aspectRatio: "816 / 1056", objectFit: "cover", borderBottom: "2px solid var(--ink)" }}
            />
            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="eyebrow" style={{ color: "var(--sky)", lineHeight: 1 }}>{RESOURCES.featured.label}</div>
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(13px, 1.1vw, 18px)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                {RESOURCES.featured.title}
              </div>
              <div className="body-sm" style={{ color: "var(--muted)", fontSize: "0.85em" }}>{RESOURCES.featured.sub}</div>
            </div>
          </a>
        </div>
      </div>
    </Slide>
  );
}

// About me + About MotherDuck
function AboutSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active} flush scatter={false}>
      <div className="split-frame" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr" }}>
        <section className="split-panel" style={{ background: "var(--sun)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1.4vw", padding: "4vw 3vw", textAlign: "center" }}>
          <div
            data-anim="pop"
            style={{
              animationDelay: "0.2s",
              width: "min(220px, 14vw)",
              aspectRatio: "1 / 1",
              border: "3px solid var(--ink)",
              boxShadow: "-8px 8px 0 var(--ink)",
              overflow: "hidden",
              background: "var(--white)",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${ABOUT.mePhoto}`}
              alt="Dumky de Wilde"
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.35s", color: "var(--ink)" }}>{ABOUT.eyebrow}</div>
          <div data-anim="fade-up" style={{ animationDelay: "0.5s", fontFamily: "var(--aeonik)", fontSize: "clamp(26px, 2.6vw, 48px)", letterSpacing: "-0.01em", lineHeight: 1.05 }}>
            {ABOUT.meHeadline}
          </div>
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--ink)", maxWidth: "30ch", fontWeight: 500 }}>
            {ABOUT.meSub}
          </div>
          <div className="body-sm" data-anim="fade-up" style={{ animationDelay: "0.8s", color: "var(--ink)", maxWidth: "34ch", lineHeight: 1.5 }}>
            {ABOUT.meBody}
          </div>
          <a
            data-anim="fade-up"
            href={`https://${ABOUT.meLink}`}
            target="_blank"
            rel="noreferrer"
            style={{
              animationDelay: "0.95s",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--mono)",
              fontSize: "clamp(13px, 1.05vw, 18px)",
              color: "var(--ink)",
              textDecoration: "none",
              padding: "6px 12px",
              border: "2px solid var(--ink)",
              background: "var(--white)",
              marginTop: "0.4vw",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V8h3v11zM6.5 6.7A1.7 1.7 0 118.2 5 1.7 1.7 0 016.5 6.7zM19 19h-3v-5.5c0-1.3 0-3-1.8-3s-2 1.4-2 2.9V19h-3V8h2.9v1.5h.1a3.2 3.2 0 012.9-1.6c3.1 0 3.7 2 3.7 4.7V19z" />
            </svg>
            {ABOUT.meLink}
          </a>
        </section>
        <section className="split-panel" style={{ background: "var(--sand)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5vw", padding: "4vw 4vw" }}>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.25s" }}>About MotherDuck</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.4s", maxWidth: "18ch" }}>
            {ABOUT.duckHeadline}
          </div>
          <AccentRule />
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.7s", color: "var(--muted-dark)", maxWidth: "52ch" }}>
            {ABOUT.duckBody}
          </div>
          <div data-anim="fade-up" style={{ animationDelay: "0.9s", display: "flex", gap: "1.6vw", flexWrap: "wrap" }}>
            {[
              { label: "DuckDB engine", color: "var(--sun)" },
              { label: "Hybrid execution", color: "var(--sky)" },
              { label: "dbt-native", color: "var(--garden)" },
              { label: "Terabyte-scale", color: "var(--watermelon)" },
            ].map((chip) => (
              <div key={chip.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 28, height: 12, background: chip.color, border: "2px solid var(--ink)" }} />
                <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(14px, 1.3vw, 22px)", textTransform: "uppercase", letterSpacing: "0.02em" }}>{chip.label}</div>
              </div>
            ))}
          </div>
          <div className="body-sm" data-anim="fade-up" style={{ animationDelay: "1.1s", fontFamily: "var(--mono)", color: "var(--muted-dark)", marginTop: "1vw" }}>
            {ABOUT.duckLink}
          </div>
        </section>
      </div>
    </Slide>
  );
}

// Propositions overview: four MotherDuck building blocks for agents.
function PropositionsSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.4vw" }}>
        <div>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{PROPOSITIONS.eyebrow}</div>
          <div className="headline-lg" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "22ch" }}>
            {PROPOSITIONS.headline}
          </div>
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.6vw" }}>
          {PROPOSITIONS.cards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "var(--white)",
                border: "2px solid var(--ink)",
                boxShadow: "-7px 7px 0 var(--ink)",
                padding: "1.4vw",
                display: "flex",
                flexDirection: "column",
                gap: "0.9vw",
                minHeight: "15vw",
              }}
            >
              <DuckIcon kind={card.duck} size={84} />
              <div style={{ fontFamily: "var(--aeonik)", fontSize: "clamp(18px, 1.9vw, 34px)", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.05 }}>
                {card.label}
              </div>
              <div className="body-sm" style={{ color: "var(--ink)", marginTop: "auto" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// Dives focus slide: two example screenshots side-by-side.
function DivesSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2vw", minHeight: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3vw", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6vw" }}>
            <div className="eyebrow eyebrow--sky" data-anim="fade-left" style={{ animationDelay: "0.15s" }}>{DIVES.eyebrow}</div>
            <div className="headline-md" data-anim="fade-up" style={{ animationDelay: "0.35s", maxWidth: "20ch" }}>
              {DIVES.headline}
            </div>
          </div>
          <div className="body-md" data-anim="fade-up" style={{ animationDelay: "0.65s", color: "var(--muted-dark)", maxWidth: "56ch" }}>
            {DIVES.body}
          </div>
        </div>
        <div className="stagger-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vw", flex: 1, minHeight: 0 }}>
          {DIVES.examples.map((ex) => (
            <div
              key={ex.src}
              style={{
                background: "var(--white)",
                border: "2px solid var(--ink)",
                boxShadow: "-8px 8px 0 var(--ink)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: 0 }}>
                <img
                  src={`${import.meta.env.BASE_URL}${ex.src}`}
                  alt={ex.caption}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div style={{ padding: "0.8vw 1.2vw", borderTop: "2px solid var(--ink)", background: "var(--sand)", fontFamily: "var(--aeonik)", fontSize: "clamp(13px, 1.1vw, 20px)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {ex.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// S18 — Closing CTA
function CtaSlide({ active }: { active: boolean }) {
  return (
    <Slide variant="sand" active={active}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "4vw", alignItems: "center", padding: "0 2vw" }}>
        <QrCard src={QR_FOLLOW.src} url={QR_FOLLOW.url} label="Slides + resources" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2vw" }}>
          <div className="eyebrow" data-anim="fade-left" style={{ animationDelay: "0.5s" }}>{CTA.eyebrow}</div>
          <div className="headline-xl" data-anim="fade-up" style={{ animationDelay: "0.7s" }}>
            {CTA.headline}
          </div>
          <AccentRule />
          <div data-anim="fade-up" style={{ animationDelay: "1.05s", fontFamily: "var(--aeonik)", fontSize: "clamp(28px, 3.2vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {CTA.url}<br />/infrastructure-for-answers
          </div>
          <div className="eyebrow" data-anim="fade-up" style={{ animationDelay: "1.25s", color: "var(--muted)" }}>
            {CTA.signoff}
          </div>
        </div>
      </div>
    </Slide>
  );
}

const slides = [
  TitleSlide,
  AboutSlide,
  PropositionsSlide,
  DivesSlide,
  TransitionWhereWeAre,
  TrapSetupSlide,
  TrapCatchSlide,
  TrapRevealSlide,
  TransitionWhy,
  LevelsCardRow,
  AgenticLoopAnimationSlide,
  LoopCodeSlide,
  TransitionContextWasIt,
  TwoLayersContextSlide,
  CommentOnCodeSlide,
  BenchmarkRealitySlide,
  ContextBeatsModelSlide,
  ManualDriftSlide,
  EvalLoopSlide,
  TransitionSkillsDrift,
  SkillAsInfraCardRow,
  TransitionWait,
  DbtGoldenSplitSlide,
  DbtStaggerSlide,
  ContextLayerSlide,
  AnswerWorkflowSlide,
  RoleChangeRevealSlide,
  ActionCardRow,
  ResourcesSlide,
  CtaSlide,
];

export default function InfrastructureForAnswersDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;
  useSQLQuery(`SELECT 1`); // activate the Dive runtime

  const go = useCallback((dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(total - 1, prev + dir)));
  }, [total]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      else if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
      else if (e.key === "Home") { e.preventDefault(); setCurrent(0); }
      else if (e.key === "End") { e.preventDefault(); setCurrent(total - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total, toggleFullscreen]);

  useEffect(() => {
    let lastWheel = 0;
    let accumulated = 0;
    const THRESHOLD = 50;
    const COOLDOWN = 800;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < COOLDOWN) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      accumulated += delta;
      if (Math.abs(accumulated) < THRESHOLD) return;
      lastWheel = now;
      go(accumulated > 0 ? 1 : -1);
      accumulated = 0;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go]);

  return (
    <Fragment>
      <style>{DECK_CSS}</style>
      <div className="deck">
        {slides.map((S, i) => <S key={i} active={i === current} />)}
        <button
          type="button"
          className="nav-zone nav-zone--left"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          disabled={current === 0}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className="nav-zone nav-zone--right"
          aria-label="Next slide"
          onClick={() => go(1)}
          disabled={current === total - 1}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div className="progress" style={{ width: `${(current + 1) / total * 100}%` }} />
        <div className="slide-counter">{current + 1} / {total}</div>
        <button
          type="button"
          className="fullscreen-toggle"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
        >
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v5H3M16 3v5h5M3 16h5v5M21 16h-5v5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
            </svg>
          )}
        </button>
      </div>
    </Fragment>
  );
}
