---
name: headline-motion-kit
description: Motion recipes for giant hero headlines and page transitions, built from the Studio UNLMTD home page headline "The limits are now opportunities" (its long word split over two lines as OPPOR-TUNITIES). Use this skill whenever a landing page needs an oversized headline that reveals line by line, a long word broken across lines with letter-by-letter motion, a word that gets crossed out and replaced to tell a before-and-after story, hero text that drifts away on scroll, a full-screen wipe between pages, or a "tell us your limit" style interaction. Dependency-free (Web Animations API), accessible, reduced-motion safe. Pairs with frontend-motion-kit, immersive-media-kit and registration-landing-kit.
---

# Headline Motion Kit

Movement for the first screen of a landing page: a very large headline that arrives with intent, a word that changes meaning, and a transition that carries the visitor to the next page.

Origin: the home page of studio-unlmtd.com. What was **verified** and what was **reconstructed** is in `references/sources.md`. Short version: the headline text, its hyphen-split long word and the page structure were read; the animation itself could not be watched, so the motion here is a faithful reconstruction in the same spirit, not a copy.

## Workflow

1. **Write the headline as a before-and-after.** One short phrase where an obstacle becomes a benefit ("Every queue is now an invitation"). Mark the obstacle word. Pick the long word that will be split and hyphenated.
2. **Choose the lines.** 3 to 6 lines, uppercase, the longest line sets the font size. Split the long word with a hyphen at the end of the first line.
3. **Copy** `assets/headline-motion.js` and `assets/headline-motion.css` into the project, set a heavy sans-serif on `.mega`.
4. **Wire** the sequence from `references/headline-recipes.md`: build, fit, reveal, strike, scroll-out, wipe.
5. **Run the checklist.**

## The sequence (default)

| Step | Function | What the visitor sees |
|---|---|---|
| 1 | `buildHeadline`, `fitHeadline` | Headline fills the width edge to edge |
| 2 | `revealHeadline` | Lines rise out of masks in turn; the split word rises letter by letter |
| 3 | `strikeWord` | A line is drawn through the obstacle word and it dims |
| 4 | `scrollOut` | On scroll each line drifts away at its own speed |
| 5 | `wipe` | A full-screen panel carries the visitor to the next page |
| 6 | `limitToOpportunity` (optional) | A typed limit is crossed out and answered |

## Rules

- **One headline moment per page.** Keep the rest of the page quiet.
- **Real text, one clean label.** The headline has an `aria-label` with the full phrase (a split word reads as one word); the visual lines are `aria-hidden`.
- **Hyphens are manual.** Never rely on automatic hyphenation for a hero; choose where the word breaks and keep `hyphens: none`.
- **Timing:** reveal 800-1000 ms with 90-130 ms between lines; letter stagger 20-30 ms; strike 600-800 ms; wipe 450-550 ms per half.
- **Reduced motion:** all functions skip movement; the final state is shown at once. The wipe is removed.
- **Never block content:** the headline text exists in the page from the first paint. Do not hold the page behind an intro.
- **Performance:** only `transform` and `opacity` are animated.
- **Mobile:** the fit function scales the type; check the longest line at 360 px and that five or six lines still fit above the fold.

## Where to look

- `references/headline-recipes.md`: markup, CSS, code for each step, tuning, and the optional "give us a limit" form.
- `references/sources.md`: what was verified on studio-unlmtd.com and what was not.
- `assets/headline-motion.js`, `assets/headline-motion.css`.

## Checklist

- [ ] Headline reads correctly to a screen reader (one word, not two halves)
- [ ] Longest line fits at 360 px and at 1920 px without clipping letters or descenders
- [ ] Reveal, strike and wipe are skipped under reduced motion
- [ ] Only one headline moment on the page
- [ ] Wipe never traps the visitor (works with back and forward, keyboard focus moves to the new page heading)
- [ ] Hero text still readable if JavaScript fails (static fallback in the HTML)
