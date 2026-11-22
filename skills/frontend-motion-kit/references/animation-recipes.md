# Animation recipes

All recipes assume `assets/motion-base.css` is loaded (easing and duration tokens, reduced-motion guard). Every JS recipe that moves things on its own must be wrapped so it does nothing under `prefers-reduced-motion: reduce`.

## Contents
1. Setup: GSAP + ScrollTrigger + Lenis with reduced-motion guard
2. Split-text headline reveal
3. Staggered grid entrance
4. Scroll-pinned feature (Apple-style)
5. Custom cursor with section label
6. Page transitions (View Transitions API, overlay wipe, React/Next.js)
7. Fullscreen navigation takeover
8. Loader counter (non-blocking)
9. Marquee
10. Hover image scale
11. Pause-animations control
12. 3D and WebGL rules

## 1. Setup: GSAP + ScrollTrigger + Lenis

Install: `npm i gsap lenis` (for React also `@gsap/react`). In plain HTML load pinned versions of GSAP and ScrollTrigger from a CDN.

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // put all scroll animations for the page inside this callback too
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
});
```

Use Lenis only if the design benefits from it. Plain browser scrolling is fine for content-heavy pages.

## 2. Split-text headline reveal

Install `npm i split-type`. Splitting breaks screen-reader reading, so keep an `aria-label` on the heading.

```html
<h1 class="hero-title" aria-label="Innovate. Implement. Inspire.">Innovate. Implement. Inspire.</h1>
```

```css
.hero-title .word { display: inline-block; overflow: hidden; }
.hero-title .char { display: inline-block; will-change: transform; }
```

```js
import SplitType from "split-type";

mm.add("(prefers-reduced-motion: no-preference)", () => {
  const split = new SplitType(".hero-title", { types: "words,chars" });
  gsap.from(split.chars, {
    yPercent: 110,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.02,
  });
  return () => split.revert();
});
```

## 3. Staggered grid entrance

```js
gsap.from(".grid .card", {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power3.out",
  stagger: { each: 0.08, from: "start" },
  scrollTrigger: { trigger: ".grid", start: "top 80%", once: true },
});
```

Stagger of 60-100 ms per item reads as rhythm. Above about 150 ms it feels slow.

## 4. Scroll-pinned feature (Apple-style)

```js
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".feature",
      start: "top top",
      end: "+=150%",
      scrub: true,
      pin: true,
    },
  })
  .from(".feature__media", { scale: 0.8 })
  .from(".feature__copy", { opacity: 0, y: 40 }, "<0.2");
```

One message per viewport. Keep each scroll step short so skimmers still get it. Under reduced motion, render the final state with no pinning.

## 5. Custom cursor with section label

Enable only for fine pointers, keep the normal pointer on clickable elements, and keep it small.

```css
@media (hover: hover) and (pointer: fine) {
  .cursor {
    position: fixed; top: 0; left: 0; z-index: 9999;
    pointer-events: none;
    translate: -50% -50%;
    font-size: 0.75rem;
  }
}
@media not all and (hover: hover) and (pointer: fine) { .cursor { display: none; } }
```

```js
const cursor = document.querySelector(".cursor");
if (cursor && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });
  addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => (cursor.textContent = el.dataset.cursor));
    el.addEventListener("pointerleave", () => (cursor.textContent = ""));
  });
}
```

Usage: `<a data-cursor="View work">`.

## 6. Page transitions

### 6a. View Transitions API (multi-page sites, progressive enhancement)

```css
@view-transition { navigation: auto; }

::view-transition-old(root) { animation: 300ms var(--ease-in-out) both fade-out; }
::view-transition-new(root) { animation: 500ms var(--ease-in-out) both fade-in; }

@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in  { from { opacity: 0; } }
```

Browsers without support simply navigate normally. Check current browser support before relying on it, and give shared elements a `view-transition-name` if you want them to morph between pages.

### 6b. Same-document (SPA) transition

```js
function go(update) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return update();
  }
  document.startViewTransition(update);
}
```

### 6c. Overlay wipe (Waaark / Unseen style)

```css
.wipe {
  position: fixed; inset: 0; z-index: 1000;
  background: var(--surface);
  pointer-events: none;
}
```

```js
gsap.set(".wipe", { yPercent: 100 });            // parked below the screen

async function wipeNavigate(navigate) {
  await gsap.to(".wipe", { yPercent: 0, duration: 0.5, ease: "power3.inOut" });    // cover
  navigate();                                                                       // swap page or route
  await gsap.to(".wipe", { yPercent: -100, duration: 0.5, ease: "power3.inOut", delay: 0.1 }); // reveal
  gsap.set(".wipe", { yPercent: 100 });          // reset for next time
}
```

Total time stays near one second. For multi-page sites without a framework router, Barba.js, Highway.js or Taxi.js handle the page swap.

### 6d. React / Next.js

- Framer Motion (`motion` package) for component enter and exit.
- In the Next.js App Router, a `template.tsx` that wraps children in a motion element reliably gives enter animations on each navigation. Exit animations need extra work, so check current Next.js and Framer Motion docs before promising them.

## 7. Fullscreen navigation takeover

```css
.nav-overlay {
  position: fixed; inset: 0;
  clip-path: inset(0 0 100% 0);
  transition: clip-path 700ms var(--ease-in-out);
}
.nav-overlay.is-open { clip-path: inset(0); }
```

Toggle `.is-open`, move focus into the overlay, trap focus, close on Escape, and set `aria-expanded` on the trigger. Preview media shown next to a link on hover is an enhancement, not the only way to reach a page.

## 8. Loader counter (non-blocking)

Content is already in the HTML. The counter is a short overlay, never a gate.

```js
const el = document.querySelector(".loader__count");
const obj = { v: 0 };
gsap.to(obj, {
  v: 100,
  duration: 1.2,
  ease: "power2.inOut",
  onUpdate: () => (el.textContent = Math.round(obj.v) + "%"),
  onComplete: () => gsap.to(".loader", { autoAlpha: 0, duration: 0.4 }),
});
```

Skip it entirely on repeat visits and under reduced motion.

## 9. Marquee

Duplicate the content inside the track so that translating by -50% loops seamlessly.

```css
.marquee { overflow: hidden; }
.marquee__track {
  display: flex; width: max-content;
  animation: marquee 30s linear infinite;
}
@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
```

## 10. Hover image scale

```css
@media (hover: hover) {
  .card img { transition: transform 600ms var(--ease-out); }
  .card:hover img { transform: scale(1.05); }
}
```

Wrap the image in a container with `overflow: hidden`.

## 11. Pause-animations control

Place a button early in the tab order and repeat it in the footer.

```js
const btn = document.querySelector("[data-pause-motion]");
btn?.addEventListener("click", () => {
  const paused = document.documentElement.toggleAttribute("data-motion-paused");
  paused ? gsap.globalTimeline.pause() : gsap.globalTimeline.resume();
  btn.setAttribute("aria-pressed", String(paused));
});
```

```css
[data-motion-paused] *, [data-motion-paused] *::before, [data-motion-paused] *::after {
  animation-play-state: paused !important;
}
```

## 12. 3D and WebGL rules

- Use only when the 3D is the product, the pitch or the navigation.
- Load three.js lazily (dynamic import) after the HTML content is visible.
- Keep headings and copy in HTML.
- Provide a fallback: still image or a "not supported" message when WebGL is unavailable.
- Budget the media. Heavy textures and video are what make these pages slow.
