# Footer wordmark, contact (address) page and related patterns

Based on the user's screenshot of the kopetzki.law footer and the text of kopetzki.law (home and contact pages, designed by Obys). The screenshot shows the end state: a black footer with four white horizontal lines that get thinner going down, a giant white wordmark spanning the full width, then a bottom row with a large heading on the left ("Ready to elevate your legal strategy?"), a short line beside it, and a "Web analytics" consent card at the bottom right with underlined Accept and Decline links. The motion itself was not observed, so the animation below is a reconstruction that reaches the same end state.

## Contents
1. Footer composition
2. Wordmark fit and reveal
3. Consent panel
4. Contact page: rolling heading
5. Contact page: SVG map and "Show on Map"
6. Preloader counter
7. Horizontal drag panels
8. Process steps with images

## 1. Footer composition

```html
<footer class="site-footer">
  <div class="rules" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  <div class="wordmark-mask"><p class="wordmark" aria-label="Brand name">brandname</p></div>

  <div class="site-footer__row">
    <h2>Ready to elevate your legal strategy?</h2>
    <p>Choose strategic innovation over protracted legal battles.</p>
  </div>
</footer>
```

Files: `assets/footer-wordmark.css` and `assets/footer-wordmark.js`.

Footer content on the reference site, useful as a checklist: closing call to action and a "Let's Talk" button, contact block (address with a "Show on Map" link, email, phone and WhatsApp), link columns (Main pages, Tools, Knowledge, About), copyright, legal links (Privacy Policy, Terms of Use, Imprint, "Privacy settings"), and a designer credit.

## 2. Wordmark fit and reveal

```js
import { initFooterWordmark } from "./footer-wordmark.js";
initFooterWordmark();   // defaults: .site-footer, .wordmark, .rules i
```

What it does:
1. Measures the wordmark and sets its font size so the word spans the container edge to edge (re-run on resize and after fonts load).
2. When the footer enters the viewport: the stacked lines draw in from the left one after another, then the wordmark rises out of its mask.
3. Under reduced motion the footer is simply shown in its final state.

Tuning: line thicknesses are CSS variables (about 6, 4, 3 and 2 px in the reference), so adjust them in `footer-wordmark.css`. Use a heavy, tightly spaced sans-serif and a negative `letter-spacing` so the word fills the width. Keep `padding-bottom` on the wordmark so descenders (for example "p") are not clipped by the mask.

## 3. Consent panel

A fixed card at the bottom right with a heading ("Web analytics"), a plain explanation, and two text actions, Accept and Decline. The reference text says analytics use no cookies and the choice can be changed later under "Privacy settings".

```html
<aside class="consent" id="consent" role="dialog" aria-labelledby="consent-title" hidden>
  <h2 id="consent-title">Web analytics</h2>
  <p>May we count your visit? We use our own analytics tool and it sets no cookies. You can change your choice any time under Privacy settings.</p>
  <div class="consent__actions">
    <button data-consent="accept">Accept</button>
    <button data-consent="decline">Decline</button>
  </div>
</aside>
<a href="#" data-open-consent>Privacy settings</a>
```

```js
import { initConsent } from "./footer-wordmark.js";
initConsent({ onAccept: () => { /* load analytics here, only now */ } });
```

Write your own wording; do not copy another site's privacy text. Analytics code must not run before Accept.

## 4. Contact page: rolling heading

The contact page heading on the reference site is "Here We Are". Its page text also contains the pieces "Here We", "We", "You" and "We Are", which suggests a word that rolls between "We" and "You". That is an inference, not an observation. Recipe:

```html
<h1 aria-label="Here We Are">
  <span aria-hidden="true">Here </span><span class="roll" aria-hidden="true"><span class="roll__inner"><span>We</span><span>You</span><span>We</span></span></span><span aria-hidden="true"> Are</span>
</h1>
```

```css
.roll { display: inline-block; height: 1em; line-height: 1; overflow: hidden; vertical-align: bottom; }
.roll__inner { display: block; }
.roll__inner > span { display: block; height: 1em; }
```

```js
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const inner = document.querySelector(".roll__inner");
  gsap.timeline({ repeat: -1 })
    .to(inner, { yPercent: -33.333, duration: .7, ease: "power3.inOut" }, "+=1.4")
    .to(inner, { yPercent: -66.666, duration: .7, ease: "power3.inOut" }, "+=1.4")
    .set(inner, { yPercent: 0 });
}
```

The third item repeats the first so the loop is seamless. The `aria-label` on the heading gives screen readers one clean phrase.

## 5. Contact page: SVG map and "Show on Map"

The reference page shows a map graphic (an SVG file) and its "Show on Map" link scrolls to the animated section (`#animated-about-hero`). Always keep the address as text.

```html
<a href="#map">(Show on Map)</a>
<address>Street 10/67, 1030 City</address>

<section id="map" aria-label="Map of our location">
  <svg viewBox="0 0 800 500" role="img" aria-label="Map showing our office">
    <path id="route" d="M40 420 C220 380 260 200 420 220 S640 120 700 140" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle class="pin" cx="700" cy="140" r="8" fill="currentColor"/>
  </svg>
  <a href="https://www.openstreetmap.org/search?query=YOUR+ADDRESS">Open in maps</a>
</section>
```

```js
document.querySelector('a[href="#map"]').addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("map").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});

const path = document.getElementById("route");
const len = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut",
  scrollTrigger: { trigger: "#map", start: "top 70%", once: true } });
```

```css
.pin { transform-origin: center; animation: pulse 2s ease-out infinite; }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(3); } }
@media (prefers-reduced-motion: reduce) { .pin { animation: none; } }
```

Replace the sample `path` with your own route or street outlines. Use the real address in the maps link.

## 6. Preloader counter

The reference site shows a brand phrase with a percentage counter ("0%") while loading. Use the non-blocking loader recipe from `frontend-motion-kit` (`animation-recipes.md`, recipe 8): content is already in the HTML, the overlay lasts about 1 to 1.5 seconds, and it is skipped on repeat visits and under reduced motion.

## 7. Horizontal drag panels

The home page has a "Drag" cue on a horizontal panel section (the approach framework). Scroll-driven version:

```html
<section class="hs"><div class="hs__track" data-cursor="Drag">
  <article class="hs__panel">...</article><article class="hs__panel">...</article>
</div></section>
```

```css
.hs { overflow: hidden; }
.hs__track { display: flex; width: max-content; }
.hs__panel { width: 80vw; max-width: 900px; flex: none; padding: 2rem; }
```

```js
gsap.to(".hs__track", {
  x: () => -(document.querySelector(".hs__track").scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: { trigger: ".hs", pin: true, scrub: 1, invalidateOnRefresh: true,
    end: () => "+=" + (document.querySelector(".hs__track").scrollWidth - innerWidth) },
});
```

Under reduced motion or on small screens, let the track scroll natively with `overflow-x: auto` and scroll snapping instead of pinning.

## 8. Process steps with images

Four numbered steps (Connect, Strategize, Resolve, Thrive), each with a heading, a short line, an image and a parenthetical caption. See `text-on-image.md`, pattern 3. Stagger each step's image in on scroll; keep one entrance style for all four.
