// fullscreen-menu.js
// Accessible full-screen menu: opens from a MENU button, traps focus, closes with Esc, a link click or the close button.
// Markup: <button data-menu-open aria-controls="menu" aria-expanded="false">Menu</button>
//         <div id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden> ... <button data-menu-close>Close</button> ... </div>

export function initMenu({ button = "[data-menu-open]", menu = "#menu", closeBtn = "[data-menu-close]" } = {}) {
  const openBtn = document.querySelector(button);
  const panel = document.querySelector(menu);
  if (!openBtn || !panel) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const focusables = () => [...panel.querySelectorAll("a[href], button:not([disabled])")];
  let last = null, timer = null;

  function open() {
    clearTimeout(timer);
    last = document.activeElement;
    panel.hidden = false;
    document.documentElement.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => panel.classList.add("is-open"));
    focusables()[0]?.focus();
  }

  function close() {
    panel.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    timer = setTimeout(() => { panel.hidden = true; }, reduce.matches ? 0 : 450);
    (last || openBtn).focus();
  }

  openBtn.addEventListener("click", open);
  panel.querySelector(closeBtn)?.addEventListener("click", close);
  panel.addEventListener("click", (e) => { if (e.target.closest("a[href]")) close(); });
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    const f = focusables();
    if (!f.length) return;
    const first = f[0], lastEl = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
  });
}
