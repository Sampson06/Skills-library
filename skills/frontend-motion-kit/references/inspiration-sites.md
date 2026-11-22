# Inspiration sites: what to borrow

Sources: School of Motion's "10 Websites with Great Animation in 2026" and Colorlib's "24 Best Animated Website Examples 2026" (which lists the libraries found in each site's code). Stack details are only given where a source reported them.

## Contents
- The ten sites
- Transition-specific references
- Patterns that recur across sites

## The ten sites

| # | Site | What to borrow | Stack (where reported) |
|---|---|---|---|
| 1 | Epic (epic.net) | Let typography be the star. Headlines shift as you scroll, case studies enter from varied directions, pacing stays controlled. | Not reported |
| 2 | BDSN Club (bdsn.club) | Willingness to experiment: cursor-driven pieces and full-screen immersive scenes. Good source of ideas, not a template. | Not reported |
| 3 | Dropbox brand site (brand.dropbox.com) | Animation as teaching: examples show how brand elements behave in motion. Playful character motion that still feels professional. | Not reported |
| 4 | Eszter Bial (eszterbial.com) | Restraint. Huge condensed kinetic type, cursor label that changes by section, a 0 to 100% counter between pages, a contact marquee near the end. | Plain HTML, GSAP, ScrollTrigger, Lenis from CDNs |
| 5 | Apple (e.g. AirPods Pro page) | Scroll-linked product storytelling, one message per viewport, mostly video rather than heavy 3D, a still image under reduced motion. | Custom code, video, three.js for one effect |
| 6 | Unseen Studio (unseen.co) | Navigation as an experience: a full-screen menu with animated project previews. Thumbnails scale subtly on hover, case studies open with page transitions. | Not reported |
| 7 | Rive (rive.app) | Use your own product on your own site. Icons and buttons are live animation files responding to scroll and cursor. | Framer, Rive, Framer Motion |
| 8 | Lusion (lusion.co) | First screen is the pitch: a live 3D scene that reacts to the cursor, with a short progress bar while it loads. Letters split for per-letter animation. | Astro, three.js, SplitType |
| 9 | Uncommon Studio (uncommonstudio.com.au) | Rhythm: project grid enters with staggered timing, bold full-screen moments balanced by subtle hovers, scroll-triggered case-study reveals. | Not reported |
| 10 | Active Theory (activetheory.net) | Choreographed project transitions and an explicit "not supported" fallback page for browsers that cannot run the WebGL scene. | Custom WebGL, Theatre.js |

## Transition-specific references

Colorlib reports these page-change techniques in production:

- **Waaark**: liquid shapes sweep across the screen, a giant letter builds behind the heading, text reveals line by line. The motion is saved for page changes and the home page itself is very light. (GSAP, SplitText, Lottie)
- **Dogstudio**: swaps pages without a full reload while a 3D scene restyles per project. (Highway.js, three.js, GSAP)
- **Lando Norris**: changes pages without a full reload alongside scroll-driven wipes and pixel dissolves. (Taxi.js, GSAP, ScrollTrigger, Lenis)
- **OLIPOP**: animated page changes on a Shopify theme. (Barba.js, GSAP)
- **Eszter Bial**: short percentage counter between pages.

Other approaches worth knowing: the browser's View Transitions API (cross-document and same-document), clip-path wipes, and overlay panels driven by GSAP. Recipes for these are in `animation-recipes.md`.

## Patterns that recur across sites

- GSAP is the most common library (15 of 24 sites in Colorlib's test), usually with ScrollTrigger. three.js appears on about ten, Lottie on six, Rive on three, Lenis on five.
- Sites that respect reduced motion swap hero video for a still, hold gradients still, and turn smooth scrolling off.
- The heaviest pages are heavy because of video and images, not animation code.
- Cursors and buttons are the cheapest place to add personality.
- Several 3D showpiece sites have no HTML text for search engines or screen readers. Avoid that.
