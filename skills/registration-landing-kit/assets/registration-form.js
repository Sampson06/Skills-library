// registration-form.js
// Accessible registration form: inline errors, honeypot, double-submit guard, success state.
// Wrap in <div data-registration> containing <form> and a hidden <div data-success hidden>.
// Inside the form: [data-status] (role="status"), optional [data-slot-error] for a required date+time pair.
// A required hidden field named "date"/"time" is satisfied by booking-widget.js.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initRegistrationForm(form, { endpoint = null, onSuccess = () => {}, delayMs = 700 } = {}) {
  const status = form.querySelector("[data-status]");
  const button = form.querySelector('[type="submit"]');
  const slotError = form.querySelector("[data-slot-error]");
  const setStatus = (msg, kind = "info") => { if (status) { status.textContent = msg; status.dataset.kind = kind; } };

  function showError(el, msg) {
    const wrap = el.closest(".field") || el.parentElement;
    let err = wrap.querySelector(".error");
    if (!msg) { err?.remove(); el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby"); return; }
    if (!err) { err = document.createElement("p"); err.className = "error"; err.id = `${el.name || el.id}-error`; wrap.appendChild(err); }
    err.textContent = msg;
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", err.id);
  }

  function check(el) {
    const v = el.type === "checkbox" ? el.checked : el.value.trim();
    if (el.required && !v) return el.dataset.msg || "This field is required.";
    if (el.type === "email" && v && !EMAIL.test(v)) return "Enter a valid email address.";
    if (el.type === "tel" && v && v.replace(/\D/g, "").length < 7) return "Enter a valid phone number.";
    return "";
  }

  const controls = () => [...form.querySelectorAll("input, select, textarea")]
    .filter((el) => !["hidden", "radio", "submit"].includes(el.type) && el.name !== "company");

  form.addEventListener("focusout", (e) => { if (controls().includes(e.target)) showError(e.target, check(e.target)); });
  form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid")) showError(e.target, check(e.target)); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.company && form.elements.company.value) return finish({}); // honeypot: pretend success

    let firstBad = null;
    controls().forEach((el) => { const m = check(el); showError(el, m); if (m && !firstBad) firstBad = el; });

    const date = form.querySelector('input[name="date"][required]');
    const time = form.querySelector('input[name="time"][required]');
    const slotMissing = date && time && (!date.value || !time.value);
    if (slotError) slotError.textContent = slotMissing ? "Please choose a date and a time." : "";
    if (slotMissing && !firstBad) firstBad = form.querySelector("[data-slots] button, [data-dates] button");

    if (firstBad) { setStatus("Please fix the highlighted fields.", "error"); firstBad.focus(); return; }

    const payload = Object.fromEntries(new FormData(form));
    delete payload.company;
    button.disabled = true; button.setAttribute("aria-busy", "true"); setStatus("Sending…");
    try {
      if (endpoint) {
        const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Request failed");
      } else {
        await new Promise((r) => setTimeout(r, delayMs)); // demo only: no server
      }
      finish(payload);
    } catch {
      setStatus("Something went wrong. Please try again.", "error");
      button.disabled = false; button.removeAttribute("aria-busy");
    }
  });

  function finish(payload) {
    const host = form.closest("[data-registration]") || form.parentElement;
    const ok = host.querySelector("[data-success]");
    form.hidden = true;
    if (ok) { ok.hidden = false; ok.setAttribute("tabindex", "-1"); ok.focus(); }
    onSuccess(payload);
  }
}
