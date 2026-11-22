// footer-wordmark.js
// Requires GSAP + ScrollTrigger as globals (or adapt imports). Safe if they are missing.

export function initFooterWordmark({ footer = ".site-footer", word = ".wordmark", rules = ".rules i" } = {}) {
  const f = document.querySelector(footer);
  const w = f?.querySelector(word);
  if (!f || !w) return;

  const fit = () => {
    w.style.fontSize = "100px";
    const ratio = w.parentElement.clientWidth / w.scrollWidth;
    w.style.fontSize = 100 * ratio + "px";
  };
  document.fonts.ready.then(fit);
  addEventListener("resize", fit);
  fit();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(w, { yPercent: 100 });

  gsap.timeline({ scrollTrigger: { trigger: f, start: "top 70%", once: true } })
    .to(rules, { scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 })
    .to(w, { yPercent: 0, duration: 1.1, ease: "power4.out" }, "-=0.5");
}

// Consent panel: nothing optional runs until the visitor accepts.
export function initConsent({ panel = "#consent", key = "analytics-consent", onAccept = () => {} } = {}) {
  const el = document.querySelector(panel);
  if (!el) return;

  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (v) => { try { localStorage.setItem(key, v); } catch {} };

  const saved = read();
  if (saved === "accept") onAccept();
  else if (saved !== "decline") el.hidden = false;

  el.addEventListener("click", (e) => {
    const choice = e.target.closest("[data-consent]")?.dataset.consent;
    if (!choice) return;
    write(choice);
    el.hidden = true;
    if (choice === "accept") onAccept();
  });

  document.querySelectorAll("[data-open-consent]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); el.hidden = false; el.querySelector("button")?.focus(); })
  );
}
