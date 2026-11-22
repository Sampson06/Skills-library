# Page structure blueprint (from aimlcluboct.in)

Extracted from the live page content and metadata of https://aimlcluboct.in/ (a Next.js site). Only structure, copy patterns and metadata were readable; the stylesheet values (accent colours, fonts, spacing) were not exposed, so choose those per project.

## Contents
- Site map and navigation
- Home page section order
- Pattern notes per section
- States: empty, loading
- Footer
- Metadata checklist

## Site map and navigation

Top navigation: Home, About, Team, Events, Gallery, a Resources dropdown, Contact.

Resources group: Updates, Recruitment, Suggestions, Constitution, Notion, GitHub, Media Drive, WhatsApp channel.

Also present: Blog, Projects, Research, Copyright.

On mobile, a compact bottom bar with four destinations plus an overflow: Home, Events, Learn, Team, More. Use this pattern for any project with a handful of primary destinations.

## Home page section order

1. **Header**: logo with the organisation name and parent institution, nav links.
2. **Hero**: large headline, a three-word tagline separated by dots (Innovate, Implement, Inspire), one short descriptive paragraph, primary call to action ("Join the Revolution"), secondary link ("See Our Work").
3. **Quick actions**: a row of shortcut links (Events, Resources, Team, Updates).
4. **About strip**: an "EST. year" marker, a one-sentence positioning headline, a short paragraph, and a row of focus keywords (Workshops, Hackathons, Research, Networking).
5. **Photo moments**: a gallery block titled around club moments, with a one-line subtitle.
6. **Impact numbers**: a heading plus counters (animate counting up once when scrolled into view).
7. **Why join**: benefit cards.
8. **Activities**: what the organisation does, one card each.
9. **Featured events**: live and upcoming events, with a link to browse all.
10. **Leadership**: team members with a "View profile" action and a short quote about guidance.
11. **Closing call to action**: "Ready to Build The Future?" with a join button.
12. **Footer**.

## Pattern notes per section

- **Hero:** open with the most characteristic thing in the subject's world. For a technical club that could be a live demo or generated visual instead of only text. The reference site pairs a bold headline with a short mission paragraph.
- **Tagline:** three short verbs or nouns read faster than a sentence. Reuse the same three words in the closing call to action area for cohesion.
- **Counters:** animate once with `ScrollTrigger` (`once: true`), and render the final number in HTML for no-JS and reduced motion.
- **Cards:** vary the hierarchy; do not make every block the same rounded card with the same shadow.
- **Calls to action:** name the real action ("Join the club", "Browse all events"), and keep the same name through the flow.

## States

- **Empty state (events):** do not leave a blank section. The reference site shows a heading explaining that sessions are being planned, with links to past event archives and to sign up for announcements. Every empty state should explain what is happening and offer one next step.
- **Loading state (team):** show a placeholder row (avatar initial, "Loading...") rather than layout jumping. Prefer skeleton shapes sized like the final content.

## Footer

- Brand block with logo and one-line description.
- Link columns: Quick Links (main pages) and Resources.
- "Stay Updated" subscribe block with a short sentence.
- Social and community links in one "ecosystem" group.
- Copyright line and a credit to the builder.

## Metadata checklist

The reference site sets all of these; replicate them on every project:

- `<title>` and meta description written for the organisation and its location
- Canonical URL
- Open Graph: title, description, type, url, site name, locale, image (1200x630) with alt text
- Twitter card `summary_large_image` with title, description, image
- `theme-color` matching the page background (the reference uses `#050505`)
- Robots directives allowing large image previews
- Keywords relevant to the audience and region (low SEO value, but harmless)
- Images served through the framework's image component (`next/image`) with responsive sizes
