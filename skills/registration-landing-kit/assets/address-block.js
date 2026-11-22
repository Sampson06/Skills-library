// address-block.js
// Address helpers: "Open in Maps" links and a "Copy address" button.
// <a data-maps="Unit 4 Broadfield Court, Sheffield S8 0XF">Open in Maps</a>
// <button data-copy="Unit 4 Broadfield Court, Sheffield S8 0XF"><span data-copy-label>Copy address</span></button>

export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  ta.remove();
  return ok;
}

export function initAddress(root = document) {
  root.querySelectorAll("[data-maps]").forEach((a) => {
    a.href = mapsUrl(a.dataset.maps); a.target = "_blank"; a.rel = "noopener";
  });
  root.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.querySelector("[data-copy-label]") || btn;
    const original = label.textContent;
    btn.addEventListener("click", async () => {
      label.textContent = (await copyText(btn.dataset.copy)) ? "Copied" : "Copy failed";
      setTimeout(() => { label.textContent = original; }, 1800);
    });
  });
}
