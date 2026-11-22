---
name: frontend-motion-kit
description: Personal design, typography and motion playbook for every front-end project. Use this skill whenever the user builds, scaffolds or restyles any website or UI (landing pages, club or community sites, portfolios, event pages, dashboards, React, Next.js, Vue, Svelte or plain HTML/CSS), and whenever they mention animation, transitions, page transitions, scroll effects, hover effects, custom cursors, loaders, Google Fonts, typography, hero sections, or "make it look better", even if they do not ask for animation explicitly. Provides a dark-first design baseline, a Google Fonts pairing and loading guide, a section blueprint for organisation sites, and tested animation recipes (GSAP, Lenis, CSS, View Transitions) distilled from ten leading animated websites.
---

# Frontend Motion Kit

A reusable baseline for front-end work: how the page is structured, how type is chosen and loaded, and how motion is used. It is distilled from the user's reference sites (AIML Club OCT, Google Fonts) and ten well-known animated websites.

If the `frontend-design` skill is also available, use both: that one for aesthetic judgment and avoiding templated looks, this one for the toolkit (structure, type loading, motion recipes, quality floor).

## Workflow

1. **Intake (ask only what is missing).** Subject and audience, brand colours or logo if any, framework (plain HTML, React, Next.js, Vue, Svelte), and whether the page is content-heavy or showpiece.
2. **Write a short design plan before any code.**
   - Colour: 4-6 named hex values (see "Baseline tokens").
   - Type: one or two Google Fonts families and their roles (read `references/typography-google-fonts.md`).
   - Structure: pick sections from `references/page-structure.md`.
   - Motion: choose **one signature moment** and a small set of supporting interactions from `references/animation-recipes.md`.
3. **Build.** Copy `assets/motion-base.css` into the project for easing tokens, duration tokens and the reduced-motion guard, then add recipes as needed.
4. **Run the quality checklist** at the bottom before saying the work is done.

## Baseline tokens (starting point, override per project)

The AIML Club OCT site uses a near-black theme colour (`#050505`) and a dark-first layout. Use that as the default surface, then pick the rest deliberately for the project's subject.

```css
:root {
  --bg: #050505;          /* page surface (from aimlcluboct.in theme-color) */
  --surface: #0e0e10;     /* cards, panels */
  --text: #f4f4f5;
  --text-muted: #a1a1aa;
  --accent: /* choose per project, never reuse one accent everywhere */;
}
```

Accent colour and secondary colours were not extractable from the reference site, so always choose them per project. Offer a light theme variant when the audience is general rather than technical.

## Motion rules

- **Animate to explain, not to decorate.** If you cannot say what an animation tells the visitor, cut it.
- **One signature moment per page** (a hero sequence, a scroll-pinned feature, a nav takeover). Keep everything around it quiet. Do not add fade-and-slide-up to every section by default.
- **Animate only `transform` and `opacity`** (plus `clip-path` for wipes). Never animate width, height, top or left.
- **Timing:** micro-interactions 150-250 ms, UI state changes 250-400 ms, reveals 600-900 ms, page transitions about 600-1000 ms and never above 2 s.
- **Respect `prefers-reduced-motion`.** Smooth scrolling off, parallax off, hero loops replaced by a still. Offer a visible pause control for any long-running motion.
- **Content first.** Headline and copy are real HTML, available immediately. Never put text only inside a canvas and never lock content behind a loader or "Enter" button.
- **Pick the lightest tool that works:**

| Need | Use |
|---|---|
| Hover, focus, fades, simple transitions | CSS |
| Component enter/exit in React | Framer Motion (`motion` package) |
| Timelines, scroll-linked or pinned sequences, split text | GSAP + ScrollTrigger |
| Smooth scrolling | Lenis (only when the design needs it) |
| Page changes without full reload feel | View Transitions API, or Barba.js / Highway.js / Taxi.js on multi-page sites |
| Flat vector illustration, icons | Lottie |
| Interactive, state-driven vector characters | Rive |
| Filmed or rendered footage | Compressed, lazy-loaded video |
| 3D | three.js, only when the 3D is the product or pitch, with a non-WebGL fallback |

- **Performance:** the libraries are rarely the problem, media is. Compress video, lazy-load anything below the fold, test on a phone connection.

## Typography rules (summary)

Use one family or two clearly different ones, loaded from Google Fonts with `display=swap` (or `next/font/google` in Next.js). Limit weights. Keep body lines under about 80 characters. Use a fluid `clamp()` scale. Let large display type carry personality, because several reference sites (Epic, Eszter Bial) let type be the main animated element. Details and pairings are in `references/typography-google-fonts.md`.

## Where to look

- `references/inspiration-sites.md`: the ten animation sites and the transition libraries, with what to borrow from each.
- `references/animation-recipes.md`: copy-ready code for scroll, split text, stagger, cursor, page transitions, loader, marquee, pause control.
- `references/typography-google-fonts.md`: choosing, pairing, loading and scaling type.
- `references/page-structure.md`: section blueprint, navigation, empty states and metadata patterns taken from aimlcluboct.in.
- `assets/motion-base.css`: tokens and reduced-motion guard to drop into any project.

## Quality checklist

- [ ] Responsive from 360 px wide up, bottom or compact navigation on mobile
- [ ] Visible keyboard focus on every interactive element
- [ ] `prefers-reduced-motion` handled in CSS and in any JS animation
- [ ] Headline and key copy in HTML, not only in canvas or images
- [ ] Only one signature motion moment; no motion without a reason
- [ ] Fonts limited to what is used, `display=swap`, no layout shift on load
- [ ] Images sized and lazy-loaded, video compressed
- [ ] Meta tags set: title, description, Open Graph image (1200x630), Twitter card, theme-color
- [ ] Contrast checked for text on the dark surface
- [ ] Tested once on a throttled mobile connection
