// booking-widget.js
// Accessible date + time slot picker with a calendar-file helper. No dependencies.
// Markup inside the root element:
//   <div data-dates></div> <div data-slots></div> <p data-summary aria-live="polite"></p> <span data-tz></span>
//   <input type="hidden" name="date"> <input type="hidden" name="time">
// Replace getSlots with a call to your own API: it may return an array or a promise of
// [{ time: "09:00", available: true }, ...].

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function demoSlots(date, { startHour, endHour, stepMin }) {
  const out = [];
  const seed = date.getDate() * 7 + date.getMonth() * 3;
  for (let m = startHour * 60, i = 0; m < endHour * 60; m += stepMin, i++) {
    out.push({ time: `${pad(Math.floor(m / 60))}:${pad(m % 60)}`, available: (seed + i * 5) % 4 !== 0 });
  }
  return out;
}

export function initBooking(root, opts = {}) {
  const {
    days = 14, startHour = 9, endHour = 17, stepMin = 30, skipWeekends = true, locale,
    getSlots = (d) => demoSlots(d, { startHour, endHour, stepMin }),
    onSelect = () => {},
  } = opts;

  const datesEl = root.querySelector("[data-dates]");
  const slotsEl = root.querySelector("[data-slots]");
  const sumEl = root.querySelector("[data-summary]");
  const tzEl = root.querySelector("[data-tz]");
  const dateField = root.querySelector('input[name="date"]');
  const timeField = root.querySelector('input[name="time"]');
  if (tzEl) tzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const fmtNum = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const fmtLong = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" });

  const list = [];
  const cursor = new Date(); cursor.setHours(0, 0, 0, 0);
  while (list.length < days) {
    cursor.setDate(cursor.getDate() + 1);
    if (skipWeekends && [0, 6].includes(cursor.getDay())) continue;
    list.push(new Date(cursor));
  }

  let selDate = null, selTime = null;

  const radio = (cls, html, checked, disabled = false) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(checked)); b.tabIndex = checked ? 0 : -1; b.disabled = disabled; b.innerHTML = html;
    return b;
  };
  const setChecked = (group, el) => {
    group.querySelectorAll('[role="radio"]').forEach((b) => { const on = b === el; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  };
  const roving = (group) => group.addEventListener("keydown", (e) => {
    const items = [...group.querySelectorAll('[role="radio"]:not(:disabled)')];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = items[(i + 1) % items.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = items[(i - 1 + items.length) % items.length];
    if (next) { e.preventDefault(); next.focus(); next.click(); }
  });

  datesEl.setAttribute("role", "radiogroup"); datesEl.setAttribute("aria-label", "Choose a date");
  slotsEl.setAttribute("role", "radiogroup"); slotsEl.setAttribute("aria-label", "Choose a time");
  roving(datesEl); roving(slotsEl);

  list.forEach((d) => {
    const b = radio("date", `<span>${fmtDay.format(d)}</span><strong>${fmtNum.format(d)}</strong>`, false);
    b.addEventListener("click", () => selectDate(d, b));
    datesEl.appendChild(b);
  });

  async function renderSlots(d) {
    slotsEl.textContent = "Loading times…";
    let slots;
    try { slots = await getSlots(d); } catch { slotsEl.textContent = "Could not load times. Please try again."; return; }
    if (selDate !== d) return;           // the visitor picked another day meanwhile
    slotsEl.innerHTML = "";
    slots.forEach((s) => {
      const b = radio("slot", s.time, false, !s.available);
      if (!s.available) b.title = "Taken";
      b.addEventListener("click", () => selectTime(s.time, b));
      slotsEl.appendChild(b);
    });
    const firstFree = slotsEl.querySelector('[role="radio"]:not(:disabled)');
    if (firstFree) firstFree.tabIndex = 0;
    if (!slots.some((s) => s.available)) slotsEl.textContent = "No times left on this day. Try another date.";
  }

  function selectDate(d, el) {
    selDate = d; selTime = null;
    setChecked(datesEl, el);
    if (dateField) dateField.value = iso(d);
    if (timeField) timeField.value = "";
    if (sumEl) sumEl.textContent = fmtLong.format(d) + ": choose a time";
    renderSlots(d);
  }

  function selectTime(t, el) {
    selTime = t;
    setChecked(slotsEl, el);
    if (timeField) timeField.value = t;
    if (sumEl) sumEl.textContent = `${fmtLong.format(selDate)} at ${t}`;
    onSelect({ date: iso(selDate), time: t });
  }

  selectDate(list[0], datesEl.firstElementChild);
  return { get value() { return selDate && selTime ? { date: iso(selDate), time: selTime } : null; } };
}

// Calendar file so people can add the booking to their own calendar.
export function makeICS({ title, start, durationMin = 30, location = "", description = "" }) {
  const f = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const end = new Date(start.getTime() + durationMin * 60000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//registration-landing-kit//EN", "BEGIN:VEVENT",
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@booking`,
    `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(location)}`, `DESCRIPTION:${esc(description)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
}
