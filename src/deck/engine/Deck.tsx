// Navigation engine: keyboard / click-zone / wheel navigation, fullscreen toggle,
// progress bar and counter. Renders an ordered list of loaded slides.

import { useState, useEffect, useCallback, Fragment } from "react";
import { DECK_CSS } from "./deck-css";
import { SlideRenderer } from "./SlideRenderer";
import type { LoadedSlide } from "./loadSlides";

export type TalkConfig = { title?: string; [key: string]: unknown };

export function Deck({ slides, config }: { slides: LoadedSlide[]; config?: TalkConfig }) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  useEffect(() => { if (config?.title) document.title = config.title; }, [config?.title]);

  const go = useCallback((dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(total - 1, prev + dir)));
  }, [total]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
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
        {slides.map((slide, i) => (
          <SlideRenderer key={slide.id} slide={slide} index={i} active={i === current} />
        ))}
        <button type="button" className="nav-zone nav-zone--left" aria-label="Previous slide" onClick={() => go(-1)} disabled={current === 0}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button type="button" className="nav-zone nav-zone--right" aria-label="Next slide" onClick={() => go(1)} disabled={current === total - 1}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        <div className="progress" style={{ width: `${total ? ((current + 1) / total) * 100 : 0}%` }} />
        <div className="slide-counter">{current + 1} / {total}</div>
        <button type="button" className="fullscreen-toggle" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"} onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}>
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v5H3M16 3v5h5M3 16h5v5M21 16h-5v5" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" /></svg>
          )}
        </button>
      </div>
    </Fragment>
  );
}
