---
name: immersive-media-kit
description: Playbook for image-led, sound-enabled front-end pages. Use this skill whenever a front-end task involves images that react to the user (click an image then scroll or drag to turn it around, 360 or turntable viewers, 3D ring galleries, lightboxes), text placed on top of images (hero overlays, captions, scrims, blend modes), an opt-in sound feature (ambient loop, sound on/off toggle, hover sounds), a footer with a giant full-width wordmark and stacked lines, an animated contact or address page with a map, horizontal drag sections, preloader counters, or a cookie/analytics consent panel. Pairs with frontend-motion-kit; use both for full pages.
---

# Immersive Media Kit

Second kit, focused on **images, text-on-image, sound, and the footer/contact finale**. Use `frontend-motion-kit` for tokens, typography, scroll setup (GSAP, Lenis) and general motion rules; this kit adds the media-specific recipes.

## What each part is based on

| Feature requested | Source | Confidence |
|---|---|---|
| Footer: giant wordmark, stacked lines, bottom row, consent panel | Screenshot of kopetzki.law footer supplied by the user, plus the site's page text | Final look is from the screenshot. The motion was **not observed**; the recipe is a reconstruction |
| Contact ("address") page: rolling heading, SVG map, "Show on Map" | kopetzki.law/contact-us page text (hidden heading variants, `map3.svg`, anchor `#animated-about-hero`) | Structure verified, animation inferred |
| Preloader "0%", horizontal "Drag" panels, process steps with images | kopetzki.law home page text | Structure verified, animation inferred |
| Turn an image by scrolling or dragging | The user's description plus standard techniques (frame-sequence scrubbing, 3D CSS) | Technique-based, not copied from a specific site |
| Text sitting on images (Loop Industries) | The user's description plus standard techniques | The site could not be opened; patterns are generic |
| Sound feature (Reframe HK) | The user's description plus standard Web Audio/HTMLAudio practice | The site could not be opened; implementation is generic |
| sigma.ai, partner.cleancode.com, cosmicenterprises.co | Only text or listings were reachable | No visual details extracted |

If a feature must match a reference site exactly, ask the user for a screenshot or short screen recording of that part, then adapt the recipe.

## Workflow

1. Identify which of these the page needs: image interaction, text on image, sound, finale (footer and contact).
2. Read only the matching reference file(s).
3. Copy the needed file from `assets/` into the project (`turn-viewer.js`, `sound-manager.js`, `footer-wordmark.js`, `footer-wordmark.css`).
4. Wire it up, then run the checklist below.

## Rules that apply to every recipe

- **Images:** always meaningful `alt` (empty `alt=""` only for decoration), explicit `width`/`height` or `aspect-ratio`, `loading="lazy"` below the fold, WebP or AVIF. Use the framework image component (`next/image`) when available.
- **Interactions are never mouse-only.** Anything driven by wheel or drag also works with arrow keys and has a visible close or exit control.
- **Reduced motion:** turntables become a static first frame plus a plain grid, inertia and pinning are off, loops stop.
- **Sound is opt-in.** Never autoplay. Default off, a visible toggle with a state label, pause when the tab is hidden, never carry information only in audio.
- **Text on images** must stay readable: scrim or blend mode, contrast checked (4.5:1 body, 3:1 large text), never bake text into the image file.
- **Budget:** frame sequences 48-90 frames at modest resolution, total under a few MB, first frame loads immediately and the rest lazily.
- **Consent:** do not load analytics until the visitor accepts. "Privacy settings" in the footer must reopen the panel.

## Where to look

- `references/image-turn-interactions.md`: scroll-scrubbed turntable, click-to-open viewer that turns with wheel or drag, 3D ring gallery.
- `references/text-on-image.md`: scrim, anchored captions, blend-mode headlines, masked reveals, caption style.
- `references/sound-feature.md`: opt-in sound system and toggle UI.
- `references/footer-and-address-page.md`: giant wordmark footer, stacked lines, consent panel, rolling heading, SVG map, horizontal drag panels, preloader.
- `references/sources.md`: what was and was not verified for each reference site.
- `assets/`: `turn-viewer.js`, `sound-manager.js`, `footer-wordmark.js`, `footer-wordmark.css`.

## Checklist

- [ ] Every interaction works by keyboard and touch
- [ ] Reduced-motion path tested
- [ ] Sound is off by default and the toggle announces its state
- [ ] Text over images passes contrast on the lightest part of the image
- [ ] Wordmark fits edge to edge at 360 px and at 1920 px without clipping descenders
- [ ] Map has a text address and a link as fallback
- [ ] Analytics blocked until consent
- [ ] Image weight checked on a throttled connection
