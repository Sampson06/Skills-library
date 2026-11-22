# Headline recipes

Files: `assets/headline-motion.js`, `assets/headline-motion.css`. Everything uses the Web Animations API, so no GSAP is needed (GSAP works too if the project already has it).

## Contents
1. Markup
2. Build and fit
3. Reveal
4. Strike the limit word
5. Scroll-out
6. Page wipe
7. "Give us a limit" form
8. Tuning
9. Fallback and accessibility

## 1. Markup

```html
<section class="hero" id="hero">
  <h1 id="title" class="mega"><!-- filled by buildHeadline; keep static text here as a no-JS fallback --></h1>
</section>
<div class="wipe" id="wipe" hidden aria-hidden="true"><span class="wipe__label" data-wipe-label></span></div>
```

Put the real phrase inside the `<h1>` as plain text so the page still reads without JavaScript; `buildHeadline` replaces it.

```css
.mega { font-family: "Archivo", "Space Grotesk", system-ui, sans-serif; }  /* a heavy sans; weight 800 */
```

## 2. Build and fit

```js
import { buildHeadline, fitHeadline, revealHeadline, strikeWord, scrollOut } from "./headline-motion.js";

const parts = buildHeadline(document.getElementById("title"), [
  "EVERY [[QUEUE]]",                 // [[...]] marks the word that gets crossed out
  "IS NOW AN",
  { text: "INVITA-", chars: true },  // long word split over two lines, letters rise one by one
  { text: "TION",    chars: true },
]);
fitHeadline(document.getElementById("title"));
```

- The label read by screen readers becomes "EVERY QUEUE IS NOW AN INVITATION" (hyphen-plus-space is removed when joining).
- The widest line decides the font size, so choose the split to balance line lengths.

## 3. Reveal

```js
await revealHeadline(parts, { duration: 900, lineStagger: 110, charStagger: 24 });
```

Each line sits in a clipping mask (`.mega__line`) and rises from 110% below. Lines made with `chars: true` rise letter by letter with a slight rotation. Because it uses `fill: "backwards"`, the text is hidden during the stagger delay and rests in its normal place afterwards, so nothing stays hidden if the script stops.

## 4. Strike the limit word

```js
await revealHeadline(parts);
await strikeWord(parts.strike[0], { duration: 700, delay: 250, dim: 0.28 });
```

A line draws across the word from left to right and the word dims. This is the before-and-after beat: the obstacle is visibly crossed out while the opportunity word stays at full strength.

## 5. Scroll-out

```js
const stop = scrollOut(parts, document.getElementById("hero"), { distance: 140 });
// call stop() when leaving the page or view
```

Lines drift up at different speeds (`0.25 + 0.12 × line index`) and fade to about 10% as the hero leaves the viewport.

## 6. Page wipe

```js
import { wipe } from "./headline-motion.js";

addEventListener("hashchange", () => {
  const view = location.hash.slice(1) || "home";
  wipe(document.getElementById("wipe"), () => showView(view), { label: view });
});
```

The panel slides up to cover the page (about 520 ms), the swap function runs while it is covered, then the panel leaves upward. The label (the destination name) shows large on the panel while it covers. For multi-page sites use the browser's View Transitions API for a quicker, native version (see `frontend-motion-kit`), or keep this wipe for a branded look.

After the swap, move focus to the new view's heading (`heading.focus()` with `tabindex="-1"`) and scroll to the top.

## 7. "Give us a limit" form

Inspired by the site's call to action wording. The site's contact page was not read, so this interaction is an invention in that spirit.

```html
<form id="limitForm"><label for="limit">What is in the way?</label>
  <input id="limit" required placeholder="A busy week. A long commute. A small budget.">
  <button>Give us a limit</button></form>
<div id="limitOut" aria-live="polite"></div>
```

```js
import { limitToOpportunity } from "./headline-motion.js";
limitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  limitToOpportunity(limit.value.trim(), limitOut, { message: "Noted. We will find an evening slot or an online option." });
  limit.value = "";
});
```

The limit appears as a chip, is crossed out, and a reply rises beneath it. Use it to collect objections ("what stops you from registering?") and send the answer to your server if you want to learn from it.

## 8. Tuning

| Want | Change |
|---|---|
| Calmer | `duration: 1100`, `lineStagger: 140`, no `chars` lines |
| Punchier | `duration: 700`, `charStagger: 14` |
| Bigger overshoot | Replace the easing with `cubic-bezier(.34,1.56,.64,1)` for letters only |
| More dramatic strike | `dim: 0.12`, strike `duration: 900` |
| Slower scroll-out | Lower `distance` to 80 |

## 9. Fallback and accessibility

- No JavaScript: the static `<h1>` text shows normally.
- Reduced motion: `buildHeadline` and `fitHeadline` still run (the headline looks the same), the animations are skipped, the struck word appears already crossed out and dimmed, and the wipe is removed.
- Screen readers: the heading has one `aria-label`; the visual lines are `aria-hidden`.
- Keyboard: the wipe must not steal focus; focus the new view's heading after the swap.
- Contrast: the dimmed struck word is decoration; the full phrase is in the label.
