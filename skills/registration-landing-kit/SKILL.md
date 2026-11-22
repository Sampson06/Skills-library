---
name: registration-landing-kit
description: Playbook and ready-to-copy code for landing pages of registration, booking and enquiry systems. Use this skill whenever the user is building or restyling a landing page, sign-up page, event or course registration page, appointment or booking page, enquiry or contact page, or any page with a registration form, date and time slot picker, address or location block, "book a call" flow, info bar, full-screen menu, or contact cards. Provides a page blueprint, an accessible registration form module, a booking slot picker with calendar-file export, an address block with maps and copy buttons, a full-screen menu, and a stylesheet. Pairs with frontend-motion-kit (type, motion) and immersive-media-kit (images, footer, sound).
---

# Registration Landing Kit

For landing pages whose job is to get someone to **register, book or enquire**. Patterns come from studio-unlmtd.com and awmedia.marketing (both read in full); ebuka.marketing could not be read, see `references/sources.md`.

## Workflow

1. **Intake (ask only what is missing):** what is being registered for, who the audience is, whether time slots matter, brand colour, framework, and whether a backend exists yet.
2. **Plan the page** from `references/landing-structure.md`: choose sections, name the single primary action (one verb, used everywhere), write the reassurance line (cost, time, cancellation).
3. **Copy files** from `assets/` into the project: `landing-base.css` plus only the modules needed.
4. **Wire up** using the snippets in the matching reference, then replace demo behaviour (simulated submit, generated slots) with the real API.
5. **Run the checklist.**

## Which file for which need

| Need | Read | Copy |
|---|---|---|
| Page order, copy and trust patterns | `landing-structure.md` | `landing-base.css` |
| Registration form, booking slots, confirmation, calendar file | `booking-and-registration.md` | `registration-form.js`, `booking-widget.js` |
| Top bar, full-screen menu, info bar, address block, contact cards, footer | `navigation-menu-and-address.md` | `fullscreen-menu.js`, `address-block.js` |
| What was verified on each reference site | `sources.md` | none |

## Rules

- **One primary action per screen**, named by its outcome ("Reserve my seat"), same label in the top bar, hero and form.
- **Reassurance beside the button:** cost, time needed, can be cancelled. No pressure, plain words.
- **Short form:** only what is needed to confirm. Marketing opt-in separate and unchecked.
- **Always a second route:** a booking or call option, and visible contact methods (email, phone, WhatsApp, location) for people who will not fill in a form.
- **Real address as text** with Open in Maps and Copy; never only an image of a map.
- **Honest numbers:** no invented statistics, seat counts or testimonials. Use marked placeholders until the real value exists.
- **Server owns the truth:** validate again, prevent double booking (return 409), send confirmation email, store consent.
- **Consent and legal links** (privacy, cookies, consent settings) in the footer of every page; load analytics only after consent.
- **Accessibility:** skip link, visible labels, errors as text linked to fields, keyboard-operable slot picker, focus management in the menu and success state, 44 px touch targets.
- **Reduced motion:** menu wipe and any reveal become instant.

## Checklist

- [ ] One primary action, same wording everywhere
- [ ] Reassurance line next to the button
- [ ] Form works with keyboard only; first error receives focus
- [ ] Booking slots update when the day changes; taken slots are not selectable
- [ ] Server-side validation, double-booking protection, confirmation email
- [ ] Success state says what was booked and how to change or cancel
- [ ] Address, Open in Maps, Copy address, and phone and email links work
- [ ] Menu traps focus, closes on Escape, restores focus
- [ ] No invented numbers or testimonials left in the page
- [ ] Privacy, cookie and consent links in the footer; analytics gated by consent
- [ ] Tested at 360 px and on a throttled connection
