// Auto-advancing image carousel. Cycles through its children (typically <Image> or
// <Block image>) on a timer, with a crossfade and clickable position dots.
//   <Carousel interval={3500}>
//   <Block image="a.png" caption="…" />
//   <Block image="b.png" caption="…" />
//   </Carousel>
import * as React from "react";

export function Carousel({ interval = 4000, children }: { interval?: number; children?: React.ReactNode }) {
  const slides = React.Children.toArray(children).filter(Boolean);
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="carousel" data-anim="fade-up">
      {slides.map((slide, idx) => (
        <div key={idx} className={`carousel__slide ${idx === i ? "is-active" : ""}`} aria-hidden={idx !== i}>
          {slide}
        </div>
      ))}
      {slides.length > 1 && (
        <div className="carousel__dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`carousel__dot ${idx === i ? "is-active" : ""}`}
              onClick={() => setI(idx)}
              aria-label={`Show image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
