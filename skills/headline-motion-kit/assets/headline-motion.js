// headline-motion.js
// Giant headline motion: line-mask reveal, letter rise for a split long word, strike-through of the
// "limit" word, scroll-out parallax, a full-screen wipe between pages, and a "limit becomes opportunity" form effect.
// No dependencies: uses the Web Animations API. Every function does nothing visible under prefers-reduced-motion.

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "cubic-bezier(.22,1,.36,1)";
const done = (a) => a.finished.catch(() => {});

/* Build the headline from lines.
   lines: strings or { text, chars: true, className }.
   In a string, mark the word to strike with [[double brackets]], e.g. "EVERY [[QUEUE]]".
   A long word split over two lines keeps its hyphen on the first line: "INVITA-", "TION".
   label: what screen readers read (default: lines joined, with a hyphen-plus-space removed so "INVITA- TION" reads "INVITATION"). */
export function buildHeadline(el, lines, { label } = {}) {
  const clean = (t) => t.replace(/\[\[|\]\]/g, "");
  const plain = lines.map((l) => clean(typeof l === "string" ? l : l.text)).join(" ").replace(/-\s/g, "");
  el.textContent = "";
  el.classList.add("mega");
  el.setAttribute("aria-label", label ?? plain);
  const parts = { lines: [], inner: [], chars: [], strike: [] };

  lines.forEach((l) => {
    const cfg = typeof l === "string" ? { text: l } : l;
    const line = document.createElement("span");
    line.className = "mega__line"; line.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.className = "mega__in" + (cfg.className ? " " + cfg.className : "");

    if (cfg.chars) {
      [...clean(cfg.text)].forEach((c) => {
        const s = document.createElement("span");
        s.className = "mega__ch"; s.textContent = c;
        inner.appendChild(s); parts.chars.push(s);
      });
    } else {
      cfg.text.split(/(\[\[[^\]]+\]\])/).filter(Boolean).forEach((tok) => {
        const m = tok.match(/^\[\[(.+)\]\]$/);
        if (m) {
          const s = document.createElement("span");
          s.className = "mega__strike"; s.textContent = m[1];
          inner.appendChild(s); parts.strike.push(s);
        } else inner.appendChild(document.createTextNode(tok));
      });
    }
    line.appendChild(inner); el.appendChild(line);
    parts.lines.push(line); parts.inner.push(inner);
  });
  return parts;
}

/* Size the headline so its widest line spans the container. Re-runs on resize and after fonts load. */
export function fitHeadline(el, { minFont = 28, maxFont = 420 } = {}) {
  const inner = () => [...el.querySelectorAll(".mega__in")];
  const fit = () => {
    const box = el.clientWidth;
    if (!box) return;
    el.style.fontSize = "100px";
    const widest = Math.max(...inner().map((n) => n.getBoundingClientRect().width));
    if (!widest) return;
    el.style.fontSize = Math.min(maxFont, Math.max(minFont, (100 * box) / widest)) + "px";
  };
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  addEventListener("resize", fit);
  return () => removeEventListener("resize", fit);
}

/* Lines rise out of their masks one after another. Chars lines rise letter by letter. */
export function revealHeadline(parts, { duration = 900, lineStagger = 110, charStagger = 24, delay = 0, easing = EASE } = {}) {
  if (reduce()) return Promise.resolve();
  const jobs = [];
  parts.inner.forEach((inner, i) => {
    const chars = inner.querySelectorAll(".mega__ch");
    if (chars.length) {
      chars.forEach((ch, j) => jobs.push(done(ch.animate(
        [{ transform: "translateY(115%) rotate(7deg)", opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration, delay: delay + i * lineStagger + j * charStagger, easing, fill: "backwards" }))));
    } else {
      jobs.push(done(inner.animate(
        [{ transform: "translateY(110%)" }, { transform: "none" }],
        { duration, delay: delay + i * lineStagger, easing, fill: "backwards" })));
    }
  });
  return Promise.all(jobs);
}

/* Draw a line through a word and dim it: the limit is crossed out. */
export function strikeWord(el, { duration = 700, delay = 0, dim = 0.28 } = {}) {
  if (!el.querySelector(".strike")) {
    const s = document.createElement("i");
    s.className = "strike"; s.setAttribute("aria-hidden", "true");
    el.appendChild(s);
  }
  const s = el.querySelector(".strike");
  if (reduce()) { s.style.transform = "scaleX(1)"; el.style.opacity = String(dim); return Promise.resolve(); }
  return Promise.all([
    done(s.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration, delay, easing: EASE, fill: "forwards" })),
    done(el.animate([{ opacity: 1 }, { opacity: dim }], { duration, delay: delay + duration * 0.4, easing: "ease-out", fill: "forwards" })),
  ]);
}

/* As the hero scrolls away, each line drifts up at its own speed and fades. Returns a cleanup function. */
export function scrollOut(parts, hero, { distance = 140 } = {}) {
  if (reduce()) return () => {};
  const speeds = parts.lines.map((_, i) => 0.25 + i * 0.12);
  let queued = false;
  const update = () => {
    queued = false;
    const r = hero.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height || 1)));
    parts.lines.forEach((l, i) => {
      l.style.transform = `translateY(${(-p * distance * speeds[i]).toFixed(1)}px)`;
      l.style.opacity = String(1 - p * 0.9);
    });
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true });
  return () => removeEventListener("scroll", onScroll);
}

/* Full-screen panel covers the page, the page is swapped underneath, the panel leaves upward.
   overlay: <div class="wipe" hidden><span class="wipe__label" data-wipe-label></span></div> */
export async function wipe(overlay, swap, { duration = 520, label = "" } = {}) {
  if (reduce()) { await swap(); return; }
  const labelEl = overlay.querySelector("[data-wipe-label]");
  if (labelEl) labelEl.textContent = label;
  overlay.hidden = false;
  const ease = "cubic-bezier(.76,0,.24,1)";
  await done(overlay.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration, easing: ease, fill: "forwards" }));
  await swap();
  await done(overlay.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration, easing: ease, fill: "forwards" }));
  overlay.hidden = true;
  overlay.getAnimations().forEach((a) => a.cancel());
}

/* "Give us a limit": the visitor's limit appears, gets crossed out, and a reply rises beneath it. */
export function limitToOpportunity(text, outEl, { message = "Noted. Let us turn that into an opportunity." } = {}) {
  const chip = document.createElement("div");
  chip.className = "limit-chip";
  const word = document.createElement("span");
  word.textContent = text;
  chip.appendChild(word);
  const msg = document.createElement("p");
  msg.className = "limit-msg"; msg.textContent = message;
  outEl.prepend(msg); outEl.prepend(chip);
  if (reduce()) { word.style.opacity = "0.4"; word.style.textDecoration = "line-through"; return; }
  const rise = [{ transform: "translateY(14px)", opacity: 0 }, { transform: "none", opacity: 1 }];
  chip.animate(rise, { duration: 500, easing: EASE, fill: "backwards" });
  strikeWord(word, { delay: 450 });
  msg.animate(rise, { duration: 600, delay: 1000, easing: EASE, fill: "backwards" });
}
