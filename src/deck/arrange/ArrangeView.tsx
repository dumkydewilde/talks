// Dev-only slide arranger: live thumbnails of every slide, drag to reorder, save back
// to order.yaml via the dev-server endpoint. Rendered instead of <Deck> when the talk
// entry detects `?arrange` in DEV.

import * as React from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DECK_CSS } from "../engine/deck-css";
import { SlideRenderer } from "../engine/SlideRenderer";
import type { LoadedSlide } from "../engine/loadSlides";

const ARRANGE_CSS = `
.arr { height:100%; background:#23211f; color:#F4EFEA; font-family:var(--inter); padding:24px 28px; overflow-y:auto; }
.arr__bar { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
.arr__title { font-family:var(--aeonik); text-transform:uppercase; letter-spacing:0.06em; font-size:20px; }
.arr__hint { color:#A8A8A8; font-size:13px; }
.arr__save { margin-left:auto; font-family:var(--aeonik); text-transform:uppercase; letter-spacing:0.06em; font-size:13px; background:var(--sky); color:var(--ink); border:2px solid var(--ink); box-shadow:-4px 4px 0 #000; padding:10px 18px; cursor:pointer; }
.arr__save:disabled { opacity:0.5; cursor:default; }
.arr__status { font-size:13px; color:var(--sun); }
.arr__grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:22px; }
.arr__card { background:#1a1917; border:2px solid #000; box-shadow:-5px 5px 0 #000; }
.arr__thumb { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; border-bottom:2px solid #000; }
.arr__stage { position:absolute; top:0; left:0; width:1280px; height:720px; transform-origin:top left; }
.arr__meta { display:flex; align-items:center; gap:10px; padding:8px 12px; }
.arr__num { font-family:var(--aeonik); color:#A8A8A8; font-size:12px; }
.arr__id { font-family:var(--mono); font-size:13px; }
.arr__drag { margin-left:auto; cursor:grab; color:#A8A8A8; user-select:none; touch-action:none; }
`;

function Thumb({ slide, index }: { slide: LoadedSlide; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.25);
  React.useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1280);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="arr__stage" style={{ transform: `scale(${scale})` }}>
      <SlideRenderer slide={slide} index={index} active />
    </div>
  );
}

function SortableCard({ slide, index }: { slide: LoadedSlide; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  return (
    <div
      ref={setNodeRef}
      className="arr__card"
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
    >
      <div className="arr__thumb"><Thumb slide={slide} index={index} /></div>
      <div className="arr__meta">
        <span className="arr__num">{String(index + 1).padStart(2, "0")}</span>
        <span className="arr__id">{slide.id}</span>
        <span className="arr__drag" {...attributes} {...listeners} title="Drag to reorder">⠿</span>
      </div>
    </div>
  );
}

export function ArrangeView({ talkId, slides }: { talkId: string; slides: LoadedSlide[] }) {
  const [items, setItems] = React.useState(slides);
  const [status, setStatus] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const from = prev.findIndex((s) => s.id === active.id);
      const to = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, from, to);
    });
    setDirty(true);
    setStatus("");
  };

  const save = async () => {
    setStatus("Saving…");
    try {
      const res = await fetch("/__arrange/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ talk: talkId, order: items.map((s) => s.id) }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "save failed");
      setStatus("Saved to order.yaml ✓");
      setDirty(false);
    } catch (e) {
      setStatus(`Error: ${String(e)}`);
    }
  };

  return (
    <>
      <style>{DECK_CSS}</style>
      <style>{ARRANGE_CSS}</style>
      <div className="arr">
        <div className="arr__bar">
          <div className="arr__title">Arrange · {talkId}</div>
          <div className="arr__hint">Drag the ⠿ handle to reorder · remove ?arrange to present</div>
          <span className="arr__status">{status}</span>
          <button className="arr__save" onClick={save} disabled={!dirty}>Save order</button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="arr__grid">
              {items.map((slide, i) => <SortableCard key={slide.id} slide={slide} index={i} />)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}
