# Typography with Google Fonts

Note on sources: fonts.google.com is a JavaScript-rendered app, so only its page metadata could be read (its stated purpose is "making the web more beautiful, fast, and open through great typography"). The guidance below uses the site as the font catalogue and applies general, well-established typography practice.

## Contents
- Choosing fonts
- Pairings to start from
- Loading fonts
- Scale and spacing
- Kinetic and display type

## Choosing fonts

Use the Google Fonts catalogue filters and the type tester (editable preview text) to judge a font with the project's real headline and body copy, not the default sample.

1. Decide the roles first: one display face and one text face, or a single family used at different weights.
2. If using two families, make them clearly different (for example geometric sans for display, humanist sans or serif for body).
3. Prefer **variable fonts** where available: one file, many weights, smaller total download.
4. Check language support (subsets) for the project's audience, including Devanagari or other scripts if needed.
5. Avoid reaching for the same family on every project. Choose for the subject.

## Pairings to start from

These are real Google Fonts families; confirm availability and axes in the catalogue.

| Mood | Display | Text | Code |
|---|---|---|---|
| Technical, AI, community | Space Grotesk or Sora | Inter or DM Sans | JetBrains Mono |
| Bold, poster-like | Unbounded or Anton | DM Sans | IBM Plex Mono |
| Editorial, calm | Fraunces | Source Sans 3 | Source Code Pro |
| Kinetic condensed headlines | Anton, Bebas Neue or Big Shoulders Display | Inter | none |

Use monospace only where content is actually code or data.

## Loading fonts

### Plain HTML

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

Request only the weights used. `display=swap` shows fallback text immediately.

### Next.js

`next/font/google` downloads and self-hosts the font at build time and reduces layout shift.

```tsx
import { Space_Grotesk, Inter } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const text = Inter({ subsets: ["latin"], variable: "--font-text" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```css
:root { --font-heading: var(--font-display), system-ui, sans-serif; --font-body: var(--font-text), system-ui, sans-serif; }
```

### Self-hosting (when privacy or offline use matters)

Download the font files from the catalogue, serve them as `woff2`, and declare `@font-face` with `font-display: swap`.

## Scale and spacing

Fluid scale with `clamp()` so type adapts without breakpoints:

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.92rem);
  --step-0:  clamp(1rem,    0.95rem + 0.25vw, 1.125rem);
  --step-1:  clamp(1.25rem, 1.15rem + 0.5vw,  1.5rem);
  --step-3:  clamp(1.95rem, 1.5rem  + 2vw,    3rem);
  --step-5:  clamp(2.75rem, 1.5rem  + 6vw,    6.5rem);
}
body { font: 400 var(--step-0)/1.6 var(--font-body); }
h1   { font: 700 var(--step-5)/0.95 var(--font-heading); letter-spacing: -0.02em; }
p    { max-inline-size: 65ch; }
```

- Body line length under about 80 characters (`ch` units).
- Line-height about 1.5-1.7 for body, 0.9-1.1 for large display type.
- Tighten letter-spacing slightly on large display type, loosen slightly on small uppercase labels, and avoid all-caps labels as a default habit.
- Use a visible type scale: pick sizes from the tokens, not ad hoc values.

## Kinetic and display type

Several of the reference sites (Epic, Eszter Bial) make large type the main animated element. If doing this:

- Use a condensed or heavy display face at very large sizes, set in real HTML text.
- Animate by line or word first, by character only for the single signature headline (see `animation-recipes.md`, recipe 2).
- Keep an `aria-label` on split headings and revert the split on cleanup.
- Check the headline at 360 px width: very large type must not overflow or break mid-word.
