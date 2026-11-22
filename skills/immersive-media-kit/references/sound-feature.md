# Sound feature

Note: reframehk.com could not be opened, so its exact sound behaviour was not observed. This is a standard, accessible implementation of "a website with sound": an opt-in ambient loop, short interface sounds and a clear toggle. Send a screen recording if the reference does something specific (for example sound that changes by scroll position).

## Contents
- Rules
- Setup
- Toggle button
- Interface sounds
- Scroll-linked mood
- Audio files
- Troubleshooting

## Rules

1. **Never autoplay.** Browsers block it, and visitors dislike it. Sound starts only after a click on the toggle.
2. **Default off**, with a visible control that shows its state ("Sound on" or "Sound off") and uses `aria-pressed`.
3. **Pause when the tab is hidden** and resume when it returns (handled in `assets/sound-manager.js`).
4. **Fade** in and out rather than cutting.
5. **Never carry information only in sound.** Every cue has a visual equivalent.
6. Keep volumes modest (ambient about 0.3-0.5, interface sounds about 0.2-0.4).
7. Offer the toggle on every page, in the same place (header or a fixed corner).

## Setup

Copy `assets/sound-manager.js` into the project.

```js
import { SoundManager } from "./sound-manager.js";

const sound = new SoundManager({ ambientSrc: "/audio/ambient.mp3", ambientVolume: 0.4 });
sound.register("tick", "/audio/tick.mp3", 0.3);
sound.register("open", "/audio/open.mp3", 0.35);
```

## Toggle button

```html
<button id="soundBtn" class="sound-btn" aria-pressed="false">
  <span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>
  <span class="sound-btn__label">Sound off</span>
</button>
```

```js
const btn = document.getElementById("soundBtn");
const label = btn.querySelector(".sound-btn__label");

btn.addEventListener("click", async () => {
  const on = await sound.toggle();           // must run inside the click handler
  btn.setAttribute("aria-pressed", String(on));
  label.textContent = on ? "Sound on" : "Sound off";
});
```

```css
.sound-btn { display: inline-flex; align-items: center; gap: .5rem; padding: .4rem .8rem;
  border: 1px solid currentColor; border-radius: 999px; background: none; color: inherit; font: inherit; cursor: pointer; }
.bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
.bars i { width: 3px; height: 4px; background: currentColor; }
.sound-btn[aria-pressed="true"] .bars i { animation: eq 900ms ease-in-out infinite alternate; }
.sound-btn[aria-pressed="true"] .bars i:nth-child(2) { animation-delay: 150ms; }
.sound-btn[aria-pressed="true"] .bars i:nth-child(3) { animation-delay: 300ms; }
@keyframes eq { to { height: 14px; } }
@media (prefers-reduced-motion: reduce) { .bars i { animation: none !important; height: 8px; } }
```

If the browser blocks playback or the file fails to load, `enable()` returns `false`; keep the label on "Sound off".

## Interface sounds

```html
<a href="/events" data-sound="tick">Events</a>
<button data-sound="open">Open</button>
```

```js
document.querySelectorAll("[data-sound]").forEach((el) => {
  el.addEventListener("pointerenter", () => sound.play(el.dataset.sound)); // hover
  el.addEventListener("click", () => sound.play("open"));                  // press
});
```

Hover sounds do nothing on touch screens, so do not rely on them. Throttle very frequent triggers.

## Scroll-linked mood

```js
ScrollTrigger.create({
  trigger: "#dark-section", start: "top 60%", end: "bottom 40%",
  onEnter: () => sound.setAmbientVolume(0.2),
  onLeave: () => sound.setAmbientVolume(0.5),
  onEnterBack: () => sound.setAmbientVolume(0.2),
  onLeaveBack: () => sound.setAmbientVolume(0.5),
});
```

## Audio files

- Use royalty-free or properly licensed audio and keep the licence record in the repository.
- Ambient loop: 20-60 seconds, seamless loop point, mp3 or aac under about 1 MB (lower bitrate is fine for ambience). Short sounds: under 50 KB each.
- Provide an `ogg` source as well if you need broad compatibility; use `<audio>` sources or check `canPlayType`.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Nothing plays on first click | `enable()` was not called directly from a user gesture handler |
| Works on desktop, silent on iPhone | Ensure the first play happens inside the tap handler; do not await other work before it |
| Loop has an audible gap | Re-export with a seamless loop point, or use Web Audio `AudioBufferSourceNode` with `loop = true` |
| Sound continues in background tab | Confirm the `visibilitychange` handler is present (it is in the module) |
