# Navigation menu, info bar and address block

Files: `assets/fullscreen-menu.js`, `assets/address-block.js`, styles in `assets/landing-base.css`.

About the "bookings and address bar" request: ebuka.marketing could not be opened, so its exact design was not seen. "Address bar" is implemented here in two readings: an **info bar** (a slim strip with date, place and a maps link) and an **address block** (full address with Open in Maps and Copy address). Send a screenshot of the original if it is something else, such as a location search field.

## Contents
- Top bar and full-screen menu
- Info bar
- Address block
- Contact method cards
- Footer

## Top bar and full-screen menu

```html
<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar"><div class="wrap">
  <a class="logo" href="#top">Brand</a>
  <a class="btn btn--primary" href="#register">Register</a>
  <button class="menu-btn" data-menu-open aria-controls="menu" aria-expanded="false">Menu</button>
</div></header>

<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="menu__head"><a class="logo" href="#top">Brand</a><button class="menu-close" data-menu-close>Close</button></div>
  <ol>
    <li><a href="#how"><span class="num">01</span><strong>How it works</strong><small>Six steps, two minutes.</small></a></li>
    <li><a href="#register"><span class="num">02</span><strong>Register</strong><small>Reserve your seat.</small></a></li>
    <li><a href="#visit"><span class="num">03</span><strong>Visit</strong><small>Where to find us.</small></a></li>
    <li><a href="#contact"><span class="num">04</span><strong>Contact</strong><small>Ask us anything.</small></a></li>
  </ol>
</div>
```

```js
import { initMenu } from "./fullscreen-menu.js";
initMenu();
```

The module sets focus inside the menu, traps Tab, closes on Escape or after choosing a link, restores focus to the MENU button and locks page scroll while open. The panel animates with a clip-path wipe and is instant under reduced motion.

## Info bar

```html
<div class="infobar"><div class="wrap">
  <span>Sat 12 Dec, 10:00</span><span>Unit 4 Broadfield Court, Sheffield</span>
  <span>14 seats left</span><a data-maps="Unit 4 Broadfield Court, Sheffield S8 0XF">Open in Maps</a>
</div></div>
```

Only show "seats left" if the number comes from the server.

## Address block

```html
<address class="address" id="visit">
  <span>Unit 4 Broadfield Court<br>Sheffield S8 0XF</span>
  <div class="row">
    <a class="link-btn" data-maps="Unit 4 Broadfield Court, Sheffield S8 0XF">Open in Maps</a>
    <button class="link-btn" data-copy="Unit 4 Broadfield Court, Sheffield S8 0XF"><span data-copy-label>Copy address</span></button>
  </div>
  <span class="coords">53.3500° N, 1.4800° W</span>
</address>
```

```js
import { initAddress } from "./address-block.js";
initAddress();
```

Always keep the address as real text, and include entrance or parking notes when they matter.

## Contact method cards

```html
<div class="methods">
  <a class="method" href="mailto:hello@example.com"><span>Email us</span>hello@example.com</a>
  <a class="method" href="tel:+440000000000"><span>Call us</span>+44 0000 000000</a>
  <a class="method" href="https://wa.me/440000000000?text=Hi%2C%20I%20have%20a%20question"><span>WhatsApp</span>Message us</a>
  <a class="method" data-maps="Unit 4 Broadfield Court, Sheffield S8 0XF"><span>Location</span>Unit 4, Sheffield</a>
</div>
```

## Footer

Columns: brand and one-line promise, link groups (Product, Company, Legal), address, language switch, "Consent settings" control that reopens the consent panel, copyright. Keep the legal and consent links in every page footer.
