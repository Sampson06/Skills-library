# Text on images

Note: the Loop Industries site could not be opened, so these are general patterns for text sitting on photographs, not a copy of that site. Send a screenshot of the exact treatment and adapt the closest pattern below.

## Contents
- Base structure
- Pattern 1: scrim plus anchored caption
- Pattern 2: oversized headline with blend mode
- Pattern 3: parenthetical caption and numbered steps
- Pattern 4: masked line reveal on the image
- Pattern 5: sticky text over a parallax image
- Contrast rules

## Base structure

Use real text in HTML over an image element, not text inside the image file.

```html
<figure class="shot">
  <img src="/img/plant.webp" alt="Recycling plant at dawn" width="1600" height="900" loading="lazy">
  <figcaption>
    <h3>Plastic, made new again</h3>
    <p>Short supporting line.</p>
  </figcaption>
</figure>
```

```css
.shot { position: relative; aspect-ratio: 16 / 9; overflow: hidden; margin: 0; border-radius: 16px; }
.shot > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
```

## Pattern 1: scrim plus anchored caption

A gradient darkens only where the text sits, so the photo stays vivid elsewhere.

```css
.shot::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / .7), rgb(0 0 0 / 0) 60%); }
.shot figcaption { position: absolute; z-index: 1; left: clamp(1rem, 3vw, 2rem); bottom: clamp(1rem, 3vw, 2rem);
  max-width: 32ch; color: #fff; }
.shot h3 { margin: 0 0 .25rem; font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem); line-height: 1.05; }
```

Anchor to a corner or an edge consistently across the page (for example always bottom-left) so the layout feels intentional.

## Pattern 2: oversized headline with blend mode

```css
.hero { position: relative; min-height: 100svh; }
.hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero h1 { position: relative; z-index: 1; margin: 0; padding: 1rem; color: #fff; mix-blend-mode: difference;
  font-size: clamp(3rem, 1.5rem + 9vw, 10rem); line-height: .9; letter-spacing: -.03em; }
```

`difference` keeps the headline legible on both light and dark parts of a photo. Check the result on a few images; very mid-grey areas reduce contrast. Provide a normal-colour fallback for browsers or contexts where blending misbehaves.

## Pattern 3: parenthetical caption and numbered steps

The Kopetzki home page uses small parenthetical captions such as "(Connect)" and "(Ulrich Kopetzki, Vienna, 2025)" beside images, and numbered steps 01 to 04 that each pair a heading with an image. Numbering is only appropriate because those steps really are a sequence.

```html
<article class="step">
  <h2><span>01</span> Connect</h2>
  <img src="/img/step1.webp" alt="" loading="lazy" width="1200" height="800">
  <p class="caption">(Connect)</p>
  <p>Tell us your challenge or goal.</p>
</article>
```

```css
.caption { font-size: .85rem; opacity: .7; }
```

## Pattern 4: masked line reveal on the image

```css
.reveal-line { display: block; overflow: hidden; }
.reveal-line > span { display: block; }
```

```js
gsap.from(".reveal-line > span", {
  yPercent: 110, duration: .9, ease: "power4.out", stagger: .08,
  scrollTrigger: { trigger: ".shot", start: "top 75%", once: true },
});
```

Wrap each line of the headline in `.reveal-line > span`. Skip under reduced motion.

## Pattern 5: sticky text over a parallax image

```css
.scene { position: relative; height: 200vh; }
.scene__pin { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.scene__pin img { position: absolute; inset: -10% 0; width: 100%; height: 120%; object-fit: cover; }
.scene__text { position: relative; z-index: 1; height: 100%; display: grid; place-items: center; color: #fff; text-align: center; }
```

```js
gsap.to(".scene__pin img", { yPercent: 10, ease: "none",
  scrollTrigger: { trigger: ".scene", start: "top top", end: "bottom bottom", scrub: true } });
```

## Contrast rules

- Body text over images: 4.5:1. Large headlines: 3:1.
- Test against the lightest region of the photo under the text, at every breakpoint (the crop changes with `object-fit`).
- Use a scrim, a solid panel or `mix-blend-mode` instead of heavy `text-shadow`.
- Keep line length short on images (about 30-40 characters) so text does not cross busy areas.
- Next.js: use `next/image` with `fill`, `sizes` and `priority` for the hero image only.
