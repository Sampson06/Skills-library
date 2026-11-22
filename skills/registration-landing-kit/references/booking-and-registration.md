# Registration form and booking slots

Files: `assets/registration-form.js`, `assets/booking-widget.js`, styles in `assets/landing-base.css`.

## Contents
- Form rules
- Markup
- Wiring
- Booking slot picker
- Server contract
- Confirmation and calendar file
- Accessibility checklist

## Form rules

- Ask only what is needed to confirm the registration: name, email, ticket or session. Add phone only when you will use it.
- Label every field with a visible `<label>`; do not rely on placeholders.
- Marketing opt-in is a separate checkbox, **unchecked by default**, worded plainly ("Send me occasional updates. Unsubscribe any time.").
- Validate on blur and on submit, show the message next to the field, move focus to the first invalid field.
- Disable the button while sending, say what is happening, and handle failure with a message that keeps the data.
- Include a hidden honeypot field (named `company`, visually hidden, `tabindex="-1"`, `autocomplete="off"`); a filled value means a bot.
- Never claim success before the server confirms (the demo mode in the module simulates a server and must be replaced).

## Markup

```html
<div data-registration>
  <form novalidate>
    <div class="grid-2">
      <div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
    </div>

    <fieldset class="field">
      <legend>I am registering as</legend>
      <div class="segmented">
        <input type="radio" id="t1" name="type" value="student" checked><label for="t1">Student</label>
        <input type="radio" id="t2" name="type" value="professional"><label for="t2">Professional</label>
        <input type="radio" id="t3" name="type" value="group"><label for="t3">Group</label>
      </div>
    </fieldset>

    <div class="field">
      <label for="session">Session</label>
      <select id="session" name="session" required data-msg="Choose a session.">
        <option value="">Select a session</option><option>Morning workshop</option><option>Afternoon talk</option>
      </select>
    </div>

    <div class="field hp" aria-hidden="true"><label for="company">Company</label><input id="company" name="company" tabindex="-1" autocomplete="off"></div>

    <label class="check"><input type="checkbox" name="updates"> <span>Send me occasional updates. Unsubscribe any time.</span></label>
    <button class="btn btn--primary" type="submit">Reserve my seat</button>
    <p data-status role="status"></p>
  </form>
  <div data-success hidden class="success"><span class="tick" aria-hidden="true">✓</span><h3>You are registered</h3><p>Check your inbox for the confirmation.</p></div>
</div>
```

## Wiring

```js
import { initRegistrationForm } from "./registration-form.js";
initRegistrationForm(document.querySelector("[data-registration] form"), {
  endpoint: "/api/register",           // omit for demo mode
  onSuccess: (data) => console.log("registered", data),
});
```

## Booking slot picker

Use when people must also choose a time (an interview, a tour, a consultation, a session).

```html
<div class="booking" id="booking">
  <div class="dates" data-dates></div>
  <div class="slots" data-slots></div>
  <p class="summary" data-summary aria-live="polite"></p>
  <p class="booking-meta">Times shown in <span data-tz></span></p>
  <input type="hidden" name="date" required><input type="hidden" name="time" required>
  <p class="error" data-slot-error></p>
</div>
```

Put the booking block **inside the form** so the hidden `date` and `time` fields are submitted and validated.

```js
import { initBooking } from "./booking-widget.js";
initBooking(document.getElementById("booking"), {
  days: 14, startHour: 9, endHour: 17, stepMin: 30,
  getSlots: async (date) => (await fetch(`/api/slots?date=${date.toISOString().slice(0, 10)}`)).json(),
});
```

`getSlots` may return an array or a promise; the widget shows "Loading times…" while waiting and ignores a late answer if the visitor has picked another day. It uses radio semantics: arrow keys move between options and the selected option is announced.

## Server contract (suggested)

- `GET /api/slots?date=YYYY-MM-DD` returns `[{ "time": "09:00", "available": true }]`.
- `POST /api/register` accepts JSON, returns `201` on success or `409` when the slot was taken in the meantime (show the slot picker again with a message).
- Validate everything again on the server, rate-limit, and send the confirmation email from the server.
- Store consent (text shown, time) with the registration.

## Confirmation and calendar file

After success show: what was booked (date, time, place), an "Add to calendar" link using `makeICS`, the address with a maps link, and how to cancel or change.

```js
import { makeICS } from "./booking-widget.js";
link.href = makeICS({ title: "Open day", start: new Date("2026-12-10T10:00"), durationMin: 60, location: "Unit 4, Sheffield" });
link.download = "open-day.ics";
```

## Accessibility checklist

- [ ] Every input has a visible label and the right `autocomplete` value
- [ ] Errors are text (not colour only), linked with `aria-describedby`, and focus moves to the first one
- [ ] Status messages are in a `role="status"` region
- [ ] Date and time controls work with the keyboard (arrow keys, Enter or Space)
- [ ] Touch targets are at least 44 px
- [ ] The success state receives focus
