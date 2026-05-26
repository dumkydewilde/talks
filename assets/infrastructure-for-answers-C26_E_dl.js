import{j as e,r as d,c as S}from"./index-BmO-qL8p.js";const p="#383838";function y({size:a=220,fill:i="none",stroke:t=p,strokeWidth:n=4,ariaLabel:s,style:o}){return e.jsx("svg",{width:a,height:a*(110/220),viewBox:"0 0 220 110","aria-hidden":s?void 0:!0,"aria-label":s,role:s?"img":void 0,style:o,xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M28 75 Q12 70 12 55 Q12 35 35 32 Q40 18 60 18 Q72 18 80 26 Q95 8 120 12 Q145 16 152 36 Q165 32 180 38 Q205 46 205 65 Q205 85 180 87 Q160 88 152 80 Q140 95 118 92 Q98 90 88 80 Q75 90 60 88 Q40 86 28 75 Z",fill:i,stroke:t,strokeWidth:n,strokeLinejoin:"round"})})}function T({size:a=200,fill:i="var(--garden)",stroke:t=p,strokeWidth:n=4,ariaLabel:s,style:o}){return e.jsx("svg",{width:a,height:a*(100/200),viewBox:"0 0 200 100","aria-hidden":s?void 0:!0,"aria-label":s,role:s?"img":void 0,style:o,xmlns:"http://www.w3.org/2000/svg",children:e.jsx("ellipse",{cx:"100",cy:"50",rx:"92",ry:"42",fill:i,stroke:t,strokeWidth:n})})}function F({size:a=140,fill:i="var(--sky)",stroke:t=p,strokeWidth:n=4,ariaLabel:s,style:o}){return e.jsx("svg",{width:a,height:a,viewBox:"0 0 140 140","aria-hidden":s?void 0:!0,"aria-label":s,role:s?"img":void 0,style:o,xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:`M70 8
           Q92 8 95 30
           Q118 28 124 50
           Q138 60 128 80
           Q138 100 118 108
           Q112 130 88 128
           Q78 138 60 130
           Q40 138 30 122
           Q10 120 10 100
           Q-2 80 12 64
           Q4 42 26 36
           Q34 14 56 14
           Q60 8 70 8 Z`,fill:i,stroke:t,strokeWidth:n,strokeLinejoin:"round"})})}function b({size:a=320,fill:i="none",stroke:t=p,strokeWidth:n=2,ariaLabel:s,style:o}){return e.jsx("svg",{width:a,height:a*(140/320),viewBox:"0 0 320 140","aria-hidden":s?void 0:!0,"aria-label":s,role:s?"img":void 0,style:o,xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M30 78 Q12 38 70 28 Q140 18 210 26 Q290 36 300 80 Q290 122 220 122 Q150 124 90 116 Q40 110 30 78 Z",fill:i,stroke:t,strokeWidth:n,strokeLinejoin:"round"})})}function g({size:a=140,fill:i="none",stroke:t=p,strokeWidth:n=2,ariaLabel:s,style:o}){return e.jsx("svg",{width:a,height:a*(100/140),viewBox:"0 0 140 100","aria-hidden":s?void 0:!0,"aria-label":s,role:s?"img":void 0,style:o,xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M18 50 Q14 18 60 14 Q108 14 126 38 Q138 64 118 84 Q90 96 56 90 Q24 84 18 50 Z",fill:i,stroke:t,strokeWidth:n,strokeLinejoin:"round"})})}function M({size:a=170,fill:i="none",stroke:t=p,strokeWidth:n=2,ariaLabel:s,style:o}){return e.jsx("svg",{width:a,height:a*(130/170),viewBox:"0 0 170 130","aria-hidden":s?void 0:!0,"aria-label":s,role:s?"img":void 0,style:o,xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M22 78 Q10 38 58 22 Q108 12 142 36 Q166 62 150 96 Q124 122 78 116 Q34 112 22 78 Z",fill:i,stroke:t,strokeWidth:n,strokeLinejoin:"round"})})}const c={color:{sand:"#F4EFEA",ink:"#383838",white:"#FFFFFF",codeHeader:"#ECE5DD",duck:"#FF9538",sun:"#FFDE00",garden:"#16AA98",watermelon:"#FF7169",sky:"#6FC2FF",muted:"#888888",mutedDark:"#A8A8A8",rule:"#D6CDBE"},font:{aeonik:"'Aeonik Mono', 'Cousine', ui-monospace, Menlo, monospace",inter:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",mono:"'JetBrains Mono', 'Cousine', ui-monospace, Menlo, monospace"}},W=`
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
  src: url('/talks/AeonikMono-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Aeonik Fono';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('/talks/AeonikFono-Regular.woff2') format('woff2');
}
@import url('https://fonts.googleapis.com/css2?family=Cousine:wght@400;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --sand: ${c.color.sand};
  --ink: ${c.color.ink};
  --white: ${c.color.white};
  --code-header: ${c.color.codeHeader};
  --duck: ${c.color.duck};
  --sun: ${c.color.sun};
  --garden: ${c.color.garden};
  --watermelon: ${c.color.watermelon};
  --sky: ${c.color.sky};
  --muted: ${c.color.muted};
  --muted-dark: ${c.color.mutedDark};
  --rule: ${c.color.rule};
  --aeonik: ${c.font.aeonik};
  --inter: ${c.font.inter};
  --mono: ${c.font.mono};
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root {
  height: 100%; width: 100%; overflow: hidden;
  background: #000;
  font-family: var(--inter);
  -webkit-font-smoothing: antialiased;
}

.deck { position: relative; width: 100%; height: 100%; overflow: hidden; cursor: pointer; }
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
`;function N({children:a,gap:i=32}){return e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:i,textAlign:"center"},children:a})}function x({children:a,gap:i=32}){return e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"flex-start",gap:i},children:a})}function h(){return e.jsx("div",{className:"accent-rule","data-anim":"grow-x",style:{animationDelay:"0.5s"}})}function D({size:a=120,fill:i="var(--duck)"}){return e.jsxs("svg",{width:a,height:a*(124/170),viewBox:"0 0 170 124",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",children:[e.jsx("path",{d:"M4.29998 86.3001C4.29998 86.3001 52 120.4 54.9 122.1C57.7 123.8 61.8 124.2 65.4 122.8C69 121.4 71.7 118.2 72.5 115C73.4 111.8 84.3 54.2001 84.3 54.2001C84.4 53.4001 84.7 51.1001 83.5 48.9001C81.8 45.9001 78 44.3001 74.6 45.3001C71.9 46.1001 70.5 48.1001 70.1 48.8001C69.5 49.9001 68.4 51.7001 66.4 53.3001C64.9 54.5001 63.4 55.2001 62.7 55.5001C56.6 58.0001 49.8 55.9001 45.9 50.9001C43.5 47.8001 39.2 46.6001 35.4 48.1001C31.6 49.6001 29.4 53.5001 29.7 57.4001C30.4 63.6001 26.9 69.8001 20.7 72.3001C17.4 73.6001 13.9 73.6001 10.8 72.6001C10.1 72.4001 7.59998 71.8001 5.09998 73.2001C1.99998 74.8001 0.399981 78.6001 1.19998 82.0001C1.79998 84.3001 3.59998 85.8001 4.29998 86.3001Z",fill:i}),e.jsx("path",{d:"M83.7999 11.6002C83.7999 11.6002 100.8 67.8002 102 70.8002C103.2 73.9002 106.2 76.7002 109.9 77.8002C113.6 78.9002 117.7 78.0002 120.3 76.0002C122.9 74.0002 166.8 35.1002 166.8 35.1002C167.4 34.6002 169 32.9002 169.4 30.4002C169.9 27.0002 167.8 23.4002 164.6 22.1002C162 21.1002 159.6 21.8002 158.9 22.1002C157.8 22.6002 155.8 23.3002 153.3 23.4002C151.3 23.5002 149.8 23.1002 149 22.9002C142.7 21.1002 138.5 15.3002 138.5 9.00024C138.4 5.10024 135.8 1.50024 131.9 0.400236C127.9 -0.699764 123.8 1.00024 121.7 4.30024C118.4 9.70024 111.9 12.4002 105.5 10.6002C102.1 9.60024 99.2999 7.50024 97.4999 4.80024C96.9999 4.20024 95.3999 2.20024 92.5999 1.70024C89.1999 1.10024 85.4999 3.10024 84.0999 6.20024C82.9999 8.60024 83.5999 10.8002 83.7999 11.6002Z",fill:i})]})}function E({variant:a}){return e.jsx("div",{className:"deck-badge",children:e.jsx(D,{size:28,fill:a==="ink"?"var(--muted-dark)":"var(--ink)"})})}function m(a,i,t,n,s){return e.jsx(s,{size:i,fill:"none",stroke:n,strokeWidth:2,style:{position:"absolute",pointerEvents:"none",opacity:t,...a}})}function Q({seed:a=0,dark:i=!1}){const t=i?"var(--muted-dark)":"var(--ink)",n=i?.22:.3,s=[[e.jsx(d.Fragment,{children:m({top:-55,left:-90},340,n,t,b)},"a"),e.jsx(d.Fragment,{children:m({top:"38%",right:-40},160,n-.06,t,g)},"b"),e.jsx(d.Fragment,{children:m({bottom:-30,right:"22%"},220,n-.1,t,y)},"c")],[e.jsx(d.Fragment,{children:m({top:-40,right:-60},260,n,t,y)},"a"),e.jsx(d.Fragment,{children:m({bottom:40,left:-50},200,n-.07,t,M)},"b"),e.jsx(d.Fragment,{children:m({top:"55%",left:"60%"},140,n-.1,t,g)},"c")],[e.jsx(d.Fragment,{children:m({top:-30,left:"55%"},220,n,t,T)},"a"),e.jsx(d.Fragment,{children:m({bottom:-40,left:-40},280,n-.08,t,b)},"b")],[e.jsx(d.Fragment,{children:m({top:40,left:-30},160,n,t,g)},"a"),e.jsx(d.Fragment,{children:m({bottom:-20,right:-30},220,n-.05,t,F)},"b"),e.jsx(d.Fragment,{children:m({top:"60%",right:"30%"},130,n-.12,t,y)},"c")]];return e.jsx(e.Fragment,{children:s[Math.abs(a)%s.length]})}function l({variant:a,active:i,children:t,scatter:n,flush:s=!1,badge:o=!0}){return e.jsxs("div",{className:`slide slide--${a} ${i?"active":""}`,style:s?{padding:0}:void 0,children:[n!==!1&&e.jsx(Q,{seed:typeof n=="number"?n:0,dark:a==="ink"}),t,o&&e.jsx(E,{variant:a})]})}function A({wide:a,narrow:i,wideSide:t="left",wideBackground:n="var(--sand)",narrowBackground:s="var(--sky)"}){const o=e.jsx("section",{className:`split-panel ${t==="left"?"split-divider-right":"split-divider-left"}`,style:{background:n},children:a}),r=e.jsx("section",{className:"split-panel split-panel--center split-panel--visual",style:{background:s},children:i});return e.jsx("div",{className:"split-frame",style:{display:"grid",gridTemplateColumns:t==="left"?"1.618fr 1fr":"1fr 1.618fr"},children:t==="left"?e.jsxs(e.Fragment,{children:[o,r]}):e.jsxs(e.Fragment,{children:[r,o]})})}function _({active:a}){return e.jsx(l,{variant:"ink",active:a,scatter:!1,badge:!1,children:e.jsxs(x,{gap:40,children:[e.jsx("div",{"data-anim":"pop",style:{animationDelay:"0.1s"},children:e.jsx(D,{size:150})}),e.jsx("div",{className:"eyebrow eyebrow--sky","data-anim":"fade-left",style:{animationDelay:"0.25s"},children:"A talk by Dumky de Wilde · Amsterdam Analytics Engineering Meetup · 27 May 2026"}),e.jsxs("div",{className:"headline-xxl","data-anim":"fade-up",style:{animationDelay:"0.45s",color:"var(--sand)"},children:["Infrastructure for",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"answers."})]}),e.jsx("div",{className:"body-lg","data-anim":"fade-up",style:{animationDelay:"0.75s",color:"var(--muted-dark)"},children:"Engineering an analytics team for the agent era."})]})})}function z({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs(x,{gap:28,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s"},children:"Where we are"}),e.jsxs("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.35s",maxWidth:"22ch"},children:["Every analyst, every PM, every CEO",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"is asking an LLM for SQL."})]}),e.jsx(h,{}),e.jsx("div",{className:"body-md","data-anim":"fade-up",style:{animationDelay:"0.95s",color:"var(--muted-dark)",maxWidth:"52ch"},children:"The interface to data is no longer the dashboard."})]})})}function O({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"2.5vw"},children:[e.jsxs("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:[`"What's the average`,e.jsx("br",{}),'order value?"']}),e.jsxs("div",{className:"chrome","data-anim":"fade-up",style:{animationDelay:"0.55s",maxWidth:"82%"},children:[e.jsxs("div",{className:"chrome-titlebar",children:[e.jsxs("div",{className:"chrome-dots","aria-hidden":"true",children:[e.jsx("span",{className:"chrome-dot chrome-dot--close"}),e.jsx("span",{className:"chrome-dot chrome-dot--min"}),e.jsx("span",{className:"chrome-dot chrome-dot--max"})]}),e.jsx("div",{className:"chrome-title",children:"agent.log"})]}),e.jsx("div",{className:"chrome-body chrome-body--code",children:`> User:   What's the average order value?

> Agent:  SELECT avg(order_total) FROM raw_orders;

> Result: 16,990.42`})]}),e.jsx("div",{className:"eyebrow","data-anim":"fade-up",style:{animationDelay:"0.95s",color:"var(--watermelon)",maxWidth:"60ch"},children:"→ raw_orders stores amounts in cents, not euros."})]})})}function R({active:a}){return e.jsx(l,{variant:"ink",active:a,children:e.jsxs(N,{gap:28,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s",color:"var(--muted-dark)"},children:"Actual answer"}),e.jsx("div",{className:"bigstat","data-anim":"pop",style:{animationDelay:"0.4s",color:"var(--sky)"},children:"€169.90"}),e.jsx("div",{className:"body-lg","data-anim":"fade-up",style:{animationDelay:"0.85s",color:"var(--muted-dark)",textAlign:"center"},children:"vs €16,990.42 the agent told you."}),e.jsx("div",{"data-anim":"grow-x",style:{animationDelay:"1.1s",height:4,width:"clamp(120px, 14vw, 240px)",background:"var(--watermelon)",margin:"8px auto 0"}}),e.jsxs("div",{className:"headline-md","data-anim":"fade-up",style:{animationDelay:"1.35s",color:"var(--sand)",textAlign:"center",maxWidth:"26ch",textTransform:"none",fontFamily:"var(--inter)",fontWeight:500},children:["100× off.",e.jsx("br",{}),"One column away from the truth."]})]})})}function $({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs(x,{gap:28,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s"},children:"Why?"}),e.jsxs("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.35s",maxWidth:"22ch"},children:["The loop isn't broken.",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"The data is."})]}),e.jsx(h,{})]})})}function B({active:a}){const i=[{num:"01",img:"/talks/instance_size_yellow_duck_pulse_stethoscope.png",name:"Copy-paste",sub:"Pulse",desc:"You are the loop. Paste schema, ask, copy SQL back, fix the errors yourself."},{num:"02",img:"/talks/instance_size_yellow_duck_standard.png",name:"Agentic clients",sub:"Standard",desc:"Claude Code, opencode, Cursor. The loop is built in. Tool calls go directly to your shell."},{num:"03",img:"/talks/instance_size_yellow_duck_jumbo.png",name:"Build the loop",sub:"Jumbo",desc:"~14 lines of Python. Yours, auditable. Swap any model, log every tool call."}];return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"3vw"},children:[e.jsx("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"Three levels of agentic SQL."}),e.jsx("div",{className:"stagger-cards",style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"2.5vw",alignItems:"stretch"},children:i.map(t=>e.jsxs("div",{style:{background:"var(--white)",border:"2px solid var(--ink)",boxShadow:"-8px 8px 0 var(--ink)",padding:"1.4vw 1.6vw",display:"flex",flexDirection:"column",gap:"0.8vw"},children:[e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"1.4vw",color:"var(--sky)"},children:t.num}),e.jsx("img",{src:t.img,alt:t.sub,style:{width:"100%",height:"11vw",objectFit:"contain",alignSelf:"center"}}),e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"1.8vw",textTransform:"uppercase",letterSpacing:"-0.02em",lineHeight:1.05},children:t.name}),e.jsx("div",{className:"eyebrow",style:{color:"var(--muted)"},children:t.sub}),e.jsx("div",{className:"body-sm",style:{color:"var(--ink)"},children:t.desc})]},t.num))})]})})}function I({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"2.5vw"},children:[e.jsx("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"The loop is a while loop."}),e.jsxs("div",{className:"chrome","data-anim":"fade-up",style:{animationDelay:"0.55s",maxWidth:"84%"},children:[e.jsxs("div",{className:"chrome-titlebar",children:[e.jsxs("div",{className:"chrome-dots","aria-hidden":"true",children:[e.jsx("span",{className:"chrome-dot chrome-dot--close"}),e.jsx("span",{className:"chrome-dot chrome-dot--min"}),e.jsx("span",{className:"chrome-dot chrome-dot--max"})]}),e.jsx("div",{className:"chrome-title",children:"agent_loop.py"})]}),e.jsx("div",{className:"chrome-body chrome-body--code",children:`def ask(question):
    messages = [{"role": "user", "content": question}]
    while True:
        resp = client.chat.completions.create(
            model=MODEL, tools=tools, messages=messages,
        )
        choice = resp.choices[0]
        messages.append(choice.message)
        if choice.finish_reason != "tool_calls":
            return choice.message.content
        for call in choice.message.tool_calls:
            args = json.loads(call.function.arguments)
            result = run_tool(call.function.name, args)
            messages.append({"role": "tool",
                             "tool_call_id": call.id,
                             "content": result})`})]}),e.jsx("div",{className:"eyebrow","data-anim":"fade-up",style:{animationDelay:"0.95s",color:"var(--sky)"},children:"→ 14 lines. Nothing magic."})]})})}function L({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs(x,{gap:28,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s"},children:"But"}),e.jsxs("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.35s",maxWidth:"22ch"},children:["The loop wasn't the problem.",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"The context was."})]}),e.jsx(h,{})]})})}function Y({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"3vw"},children:[e.jsx("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"Two layers of context."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4vw",alignItems:"start"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.2vw"},children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.45s",color:"var(--sky)"},children:"Skill file"}),e.jsx("div",{className:"headline-md","data-anim":"fade-up",style:{animationDelay:"0.65s",maxWidth:"18ch",textTransform:"none",fontFamily:"var(--inter)",fontWeight:500},children:"Markdown → system prompt."}),e.jsx("div",{className:"body-md","data-anim":"fade-up",style:{animationDelay:"0.85s",color:"var(--muted-dark)",maxWidth:"32ch"},children:'Conventions, business rules, "use orders not raw_orders". One file, version-controlled.'})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.2vw"},children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.55s",color:"var(--garden)"},children:"COMMENT ON"}),e.jsx("div",{className:"headline-md","data-anim":"fade-up",style:{animationDelay:"0.75s",maxWidth:"18ch",textTransform:"none",fontFamily:"var(--inter)",fontWeight:500},children:"Stored in the database."}),e.jsxs("div",{className:"body-md","data-anim":"fade-up",style:{animationDelay:"0.95s",color:"var(--muted-dark)",maxWidth:"32ch"},children:["Every tool that reads ",e.jsx("code",{style:{fontFamily:"var(--mono)",fontSize:"0.95em"},children:"duckdb_columns()"})," gets them. Ships with the data, not the agent."]})]})]})]})})}function H({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"2.5vw"},children:[e.jsx("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"Context that ships with the data."}),e.jsxs("div",{className:"chrome","data-anim":"fade-up",style:{animationDelay:"0.55s",maxWidth:"84%"},children:[e.jsxs("div",{className:"chrome-titlebar",children:[e.jsxs("div",{className:"chrome-dots","aria-hidden":"true",children:[e.jsx("span",{className:"chrome-dot chrome-dot--close"}),e.jsx("span",{className:"chrome-dot chrome-dot--min"}),e.jsx("span",{className:"chrome-dot chrome-dot--max"})]}),e.jsx("div",{className:"chrome-title",children:"comments.sql"})]}),e.jsx("div",{className:"chrome-body chrome-body--code",children:`COMMENT ON TABLE orders IS
  'Clean orders mart. Amounts in EUROS. Use this, not raw_orders.';

COMMENT ON TABLE daily_revenue IS
  'STALE. Only 5 of 20 locations. Use orders instead.';

COMMENT ON COLUMN orders.order_total IS
  'Total in EUROS (subtotal + tax). Use for revenue.';`})]})]})})}function U({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs(x,{gap:28,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s"},children:"But skills don't scale"}),e.jsxs("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.35s",maxWidth:"26ch"},children:["Every analyst writes their own.",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"Then they drift."})]}),e.jsx(h,{})]})})}function P({active:a}){const i=[{num:"01",name:"Write",desc:"One markdown file. Versioned in git. Owned by the data team."},{num:"02",name:"Share",desc:"Mount into Claude, opencode, Cursor, your own loop. One source, many tools."},{num:"03",name:"Govern",desc:"Reviewed like dbt models. Drift caught in PR, not in production."}];return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"3vw"},children:[e.jsx("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"Standardize context as a skill."}),e.jsx("div",{className:"stagger-cards",style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"2.5vw",alignItems:"stretch"},children:i.map(t=>e.jsxs("div",{style:{background:"var(--white)",border:"2px solid var(--ink)",boxShadow:"-8px 8px 0 var(--ink)",padding:"1.6vw 1.8vw",display:"flex",flexDirection:"column",gap:"1vw",minHeight:"16vw"},children:[e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"1.4vw",color:"var(--sky)"},children:t.num}),e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"2.4vw",textTransform:"uppercase",letterSpacing:"-0.02em",lineHeight:1.05},children:t.name}),e.jsx("div",{className:"body-sm",style:{color:"var(--ink)",marginTop:"auto"},children:t.desc})]},t.num))})]})})}function q({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs(x,{gap:28,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s"},children:"Wait"}),e.jsxs("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.35s",maxWidth:"26ch"},children:["You might already have",e.jsx("br",{}),"the best semantic context",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"on the planet."})]}),e.jsx(h,{})]})})}function X({active:a}){return e.jsx(l,{variant:"sand",active:a,flush:!0,scatter:!1,children:e.jsx(A,{wideSide:"left",wide:e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",gap:"1.6vw",padding:"3.5vw 3vw"},children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s"},children:"Your dbt project"}),e.jsx("div",{className:"headline-md","data-anim":"fade-up",style:{animationDelay:"0.35s",maxWidth:"22ch",textTransform:"none",fontFamily:"var(--inter)",fontWeight:500},children:"You've been writing semantic context for years."}),e.jsxs("div",{className:"chrome","data-anim":"fade-up",style:{animationDelay:"0.65s",maxWidth:"100%"},children:[e.jsxs("div",{className:"chrome-titlebar",children:[e.jsxs("div",{className:"chrome-dots","aria-hidden":"true",children:[e.jsx("span",{className:"chrome-dot chrome-dot--close"}),e.jsx("span",{className:"chrome-dot chrome-dot--min"}),e.jsx("span",{className:"chrome-dot chrome-dot--max"})]}),e.jsx("div",{className:"chrome-title",children:"models/marts/orders.sql"})]}),e.jsx("div",{className:"chrome-body chrome-body--code",children:`{{ config(materialized='table') }}

-- Clean orders mart. Amounts in EUROS.
-- One row per customer order.
SELECT
  o.order_id,
  o.customer_id,
  o.ordered_at,
  o.location_id,
  o.subtotal + o.tax_paid AS order_total
FROM {{ ref('stg_orders') }} o`})]})]}),narrow:e.jsx("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",gap:"1.8vw",padding:"3.5vw 2.5vw",height:"100%"},children:[{label:"Tests",desc:"not_null, unique, relationships"},{label:"Docs",desc:"description per column"},{label:"Lineage",desc:"ref() graph, source to mart"},{label:"Metrics",desc:"definitions, owners, layer"}].map((i,t)=>e.jsxs("div",{"data-anim":"fade-up",style:{animationDelay:`${.6+t*.15}s`,display:"flex",flexDirection:"column",gap:"0.3vw"},children:[e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"2vw",textTransform:"uppercase",letterSpacing:"-0.02em",color:"var(--ink)"},children:i.label}),e.jsx("div",{className:"body-sm",style:{color:"var(--ink)",opacity:.8},children:i.desc})]},i.label))})})})}function Z({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"3vw"},children:[e.jsx("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"What your dbt already has."}),e.jsxs("div",{className:"stagger",style:{display:"flex",flexDirection:"column",gap:24},children:[e.jsx("div",{className:"body-lg",style:{fontWeight:500},children:"Schemas, definitions, owners."}),e.jsx("div",{className:"body-lg",style:{fontWeight:500},children:"Tests catching the bad joins."}),e.jsx("div",{className:"body-lg",style:{fontWeight:500},children:"Docs that explain the columns."}),e.jsx("div",{className:"body-lg",style:{fontWeight:500},children:"Lineage that traces the metric."}),e.jsx("div",{className:"body-lg",style:{color:"var(--sky)",fontWeight:500},children:"You've been writing context for years."})]})]})})}function G({active:a}){return e.jsx(l,{variant:"ink",active:a,children:e.jsxs(N,{gap:36,children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.15s",color:"var(--muted-dark)"},children:"The new job"}),e.jsxs("div",{className:"headline-xxl","data-anim":"pop",style:{animationDelay:"0.45s",color:"var(--sand)",textAlign:"center"},children:["You've been doing this",e.jsx("br",{}),e.jsx("span",{style:{color:"var(--sky)"},children:"all along."})]}),e.jsx(h,{}),e.jsxs("div",{className:"headline-md","data-anim":"fade-up",style:{animationDelay:"1.1s",color:"var(--sand)",textAlign:"center",maxWidth:"26ch",textTransform:"none",fontFamily:"var(--inter)",fontWeight:500},children:["The bar moved up.",e.jsx("br",{}),"You cleared it."]})]})})}function K({active:a}){const i=[{num:"01",name:"Comment",desc:"Add COMMENT ON to your three most-queried tables."},{num:"02",name:"Skill",desc:"Write a 50-line skill.md. Drop it in Claude Code. Share with the team."},{num:"03",name:"Expose",desc:"Wire it via MCP — yours, or MotherDuck's MCP server."}];return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"3vw"},children:[e.jsx("div",{className:"headline-lg","data-anim":"fade-up",style:{animationDelay:"0.2s"},children:"Three things to do Monday."}),e.jsx("div",{className:"stagger-cards",style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"2.5vw",alignItems:"stretch"},children:i.map(t=>e.jsxs("div",{style:{background:"var(--white)",border:"2px solid var(--ink)",boxShadow:"-8px 8px 0 var(--ink)",padding:"1.6vw 1.8vw",display:"flex",flexDirection:"column",gap:"1vw",minHeight:"16vw"},children:[e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"1.4vw",color:"var(--sky)"},children:t.num}),e.jsx("div",{style:{fontFamily:"var(--aeonik)",fontSize:"2.4vw",textTransform:"uppercase",letterSpacing:"-0.02em",lineHeight:1.05},children:t.name}),e.jsx("div",{className:"body-sm",style:{color:"var(--ink)",marginTop:"auto"},children:t.desc})]},t.num))})]})})}function J({active:a}){return e.jsx(l,{variant:"sand",active:a,children:e.jsxs("div",{style:{flex:1,display:"grid",gridTemplateColumns:"1fr 2.2fr",gap:"4vw",alignItems:"center",padding:"0 2vw"},children:[e.jsx("div",{"data-anim":"pop",style:{animationDelay:"0.3s",background:"var(--white)",border:"2px solid var(--ink)",boxShadow:"-8px 8px 0 var(--ink)",padding:"2vw",aspectRatio:"1 / 1",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("div",{className:"eyebrow",style:{color:"var(--muted)",textAlign:"center"},children:["QR code",e.jsx("br",{}),"placeholder"]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.2vw"},children:[e.jsx("div",{className:"eyebrow","data-anim":"fade-left",style:{animationDelay:"0.5s"},children:"Thanks for listening"}),e.jsx("div",{className:"headline-xl","data-anim":"fade-up",style:{animationDelay:"0.7s"},children:"Slides + repo:"}),e.jsx(h,{}),e.jsxs("div",{"data-anim":"fade-up",style:{animationDelay:"1.05s",fontFamily:"var(--aeonik)",fontSize:"clamp(28px, 3.2vw, 56px)",letterSpacing:"-0.02em",lineHeight:1.1},children:["motherduck.com/talks/",e.jsx("br",{}),"infrastructure-for-answers"]}),e.jsx("div",{className:"eyebrow","data-anim":"fade-up",style:{animationDelay:"1.25s",color:"var(--muted)"},children:"@dumkydewilde · Dumky de Wilde · Amsterdam AE Meetup · 27 May 2026"})]})]})})}const k=[_,z,O,R,$,B,I,L,Y,H,U,P,q,X,Z,G,K,J];function V(){const[a,i]=d.useState(0),t=k.length,n=d.useCallback(o=>{i(r=>Math.max(0,Math.min(t-1,r+o)))},[t]);d.useEffect(()=>{const o=r=>{var u,v;r.key==="ArrowRight"||r.key==="ArrowDown"||r.key===" "||r.key==="PageDown"?(r.preventDefault(),n(1)):r.key==="ArrowLeft"||r.key==="ArrowUp"||r.key==="PageUp"?(r.preventDefault(),n(-1)):r.key==="f"||r.key==="F"?(v=(u=document.documentElement).requestFullscreen)==null||v.call(u):r.key==="Home"?(r.preventDefault(),i(0)):r.key==="End"&&(r.preventDefault(),i(t-1))};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[n,t]);const s=d.useCallback(o=>{o.target.closest("a, button")||n(o.clientX>window.innerWidth/2?1:-1)},[n]);return d.useEffect(()=>{let o=0,r=0;const u=50,v=800,w=f=>{f.preventDefault();const j=Date.now();if(j-o<v)return;const C=Math.abs(f.deltaY)>Math.abs(f.deltaX)?f.deltaY:f.deltaX;r+=C,!(Math.abs(r)<u)&&(o=j,n(r>0?1:-1),r=0)};return window.addEventListener("wheel",w,{passive:!1}),()=>window.removeEventListener("wheel",w)},[n]),e.jsxs(d.Fragment,{children:[e.jsx("style",{children:W}),e.jsxs("div",{className:"deck",onClick:s,children:[k.map((o,r)=>e.jsx(o,{active:r===a},r)),e.jsx("div",{className:"progress",style:{width:`${(a+1)/t*100}%`}}),e.jsxs("div",{className:"slide-counter",children:[a+1," / ",t]})]})]})}S.createRoot(document.getElementById("root")).render(e.jsx(V,{}));
