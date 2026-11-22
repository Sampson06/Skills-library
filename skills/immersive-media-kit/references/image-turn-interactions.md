# Image turn interactions

Three ways to let visitors turn an image around. The request was: press an image, then scroll to turn it. Recipe B is the direct match. A and C are scroll-driven alternatives.

## Contents
- Choosing a technique
- A. Scroll-scrubbed turntable (frame sequence)
- B. Click to open, then scroll or drag to turn
- C. 3D ring gallery driven by scroll
- Preparing the images
- Accessibility and fallbacks

## Choosing a technique

| Goal | Use |
|---|---|
| A product or object that rotates as the page scrolls | A |
| Thumbnails; pressing one opens a viewer where wheel or drag turns it | B |
| A set of different photos arranged around a circle | C |

True "turning" of one object needs a set of photos or renders taken at different angles (frames). A single flat photo can only be tilted or flipped, not truly rotated.

## A. Scroll-scrubbed turntable

```html
<section class="turn" aria-label="Product turntable">
  <div class="turn__sticky">
    <canvas id="turnCanvas" role="img" aria-label="Product rotating through 360 degrees"></canvas>
  </div>
</section>
```

```css
.turn { height: 400vh; position: relative; }
.turn__sticky { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; }
#turnCanvas { max-width: 100%; max-height: 100vh; }
```

```js
const FRAMES = 72;
const src = (i) => `/turn/${String(i + 1).padStart(4, "0")}.webp`;
const canvas = document.getElementById("turnCanvas");
const ctx = canvas.getContext("2d");
const imgs = Array.from({ length: FRAMES }, (_, i) => Object.assign(new Image(), { src: src(i) }));
const state = { frame: 0 };

const draw = () => {
  const im = imgs[Math.round(state.frame)];
  if (im && im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
};
imgs[0].onload = () => { canvas.width = imgs[0].naturalWidth; canvas.height = imgs[0].naturalHeight; draw(); };

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(state, {
    frame: FRAMES - 1, ease: "none", onUpdate: draw,
    scrollTrigger: { trigger: ".turn", start: "top top", end: "bottom bottom", scrub: 0.5 },
  });
}
```

Notes: the sticky container does the pinning, so `pin: true` is not needed. `scrub: 0.5` adds light smoothing. Under reduced motion the first frame stays visible.

## B. Click to open, then scroll or drag to turn

Files: `assets/turn-viewer.js`. Markup:

```html
<button class="thumb" data-turn="/turn/chair-{n}.webp" data-count="48" aria-label="Open chair, turnable view">
  <img src="/turn/chair-0001.webp" alt="Oak chair, front view" width="640" height="640" loading="lazy">
</button>

<div class="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Turnable image viewer" tabindex="-1" hidden>
  <button class="viewer__close" aria-label="Close viewer">×</button>
  <img alt="">
  <p class="viewer__hint">Scroll, drag or use the arrow keys to turn</p>
</div>
```

```js
import { TurnViewer, bindTurnTriggers } from "./turn-viewer.js";
const viewer = new TurnViewer(document.getElementById("viewer"));
bindTurnTriggers(viewer);          // buttons with data-turn and data-count
```

```css
.viewer { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: rgb(0 0 0 / .92); touch-action: none; }
.viewer[hidden] { display: none; }
.viewer img { max-width: min(90vw, 900px); max-height: 80vh; user-select: none; -webkit-user-drag: none; }
.viewer__close { position: absolute; top: 1rem; right: 1rem; font-size: 2rem; color: #fff; background: none; border: 0; cursor: pointer; }
.viewer__hint { position: absolute; bottom: 1.5rem; color: #fff; opacity: .7; font-size: .9rem; }
```

How it behaves: wheel movement, pointer drag (mouse and touch) and left/right arrow keys change the frame index; releasing a drag adds a little inertia unless reduced motion is on; Escape or the close button closes it and returns focus to the thumbnail. The page behind does not scroll while the viewer is open.

If there is only one photo per item, use the flip variant: on click, add a class that applies `transform: rotateY(180deg)` with `transform-style: preserve-3d` and `backface-visibility: hidden` on two stacked faces (front photo, back photo or details).

## C. 3D ring gallery driven by scroll

```html
<section class="ring-wrap">
  <div class="ring">
    <div class="ring__stage">
      <figure class="ring__item" style="--i:0"><img src="/g/1.webp" alt="..."></figure>
      <figure class="ring__item" style="--i:1"><img src="/g/2.webp" alt="..."></figure>
      <!-- repeat; set --n on .ring to the item count -->
    </div>
  </div>
</section>
```

```css
.ring { --n: 8; --r: 420px; height: 100vh; display: grid; place-items: center; perspective: 1200px; }
.ring__stage { position: relative; width: 260px; height: 340px; transform-style: preserve-3d; }
.ring__item { position: absolute; inset: 0; margin: 0;
  transform: rotateY(calc(var(--i) * 360deg / var(--n))) translateZ(var(--r)); }
.ring__item img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
@media (max-width: 720px) { .ring { --r: 260px; } .ring__stage { width: 180px; height: 240px; } }
```

```js
gsap.registerPlugin(ScrollTrigger);
gsap.to(".ring__stage", {
  rotationY: -360, ease: "none",
  scrollTrigger: { trigger: ".ring-wrap", start: "top top", end: "+=300%", pin: true, scrub: true },
});
```

Radius guide: for item width `w` and `n` items, `--r` of about `w / (2 * tan(180deg / n))` makes the cards just touch. A larger value leaves gaps. Combine with B by making each ring item a trigger that opens the viewer.

## Preparing the images

- Frames: even spacing around the object, same camera distance, same lighting, transparent or plain background.
- Export 48-90 frames as WebP at around 1000 px on the long edge, numbered `0001`, `0002`, and so on.
- Load frame 1 immediately; let the browser fetch the rest after first paint.
- Keep a poster image for no-JS and for reduced motion.

## Accessibility and fallbacks

- Give the trigger button an accessible name that says it opens a turnable view.
- Provide keyboard turning (arrow keys) and a visible close button.
- Under `prefers-reduced-motion: reduce`, show a static image (A), skip inertia (B) and render the images as a plain grid (C).
- Do not trap wheel events outside the open viewer.
