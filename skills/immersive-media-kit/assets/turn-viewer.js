// turn-viewer.js
// Click an image to open a viewer, then scroll (wheel), drag or use arrow keys to turn it
// through a sequence of frames. No dependencies.

export function frameList(pattern, count, pad = 4) {
  return Array.from({ length: count }, (_, i) =>
    pattern.replace("{n}", String(i + 1).padStart(pad, "0"))
  );
}

export class TurnViewer {
  constructor(root, { wheelSpeed = 0.05, dragSpeed = 0.12 } = {}) {
    this.root = root;
    this.img = root.querySelector("img");
    this.closeBtn = root.querySelector(".viewer__close");
    this.wheelSpeed = wheelSpeed;
    this.dragSpeed = dragSpeed;
    this.frames = [];
    this.pos = 0;
    this.vel = 0;
    this.raf = null;
    this.opener = null;
    this.reduce = matchMedia("(prefers-reduced-motion: reduce)");
    this.bind();
  }

  open(frames, start = 0, opener = null) {
    this.frames = frames;
    this.pos = start;
    this.opener = opener;
    frames.forEach((src) => { const im = new Image(); im.src = src; }); // warm the cache
    this.root.hidden = false;
    document.documentElement.style.overflow = "hidden";
    this.render(true);
    this.root.focus();
  }

  close() {
    cancelAnimationFrame(this.raf);
    this.vel = 0;
    this.root.hidden = true;
    document.documentElement.style.overflow = "";
    this.opener?.focus();
  }

  render(force = false) {
    const n = this.frames.length;
    if (!n) return;
    const i = ((Math.round(this.pos) % n) + n) % n;
    if (force || this.img.dataset.i !== String(i)) {
      this.img.src = this.frames[i];
      this.img.dataset.i = String(i);
    }
  }

  nudge(delta) {
    this.pos += delta;
    this.render();
  }

  glide() {
    if (this.reduce.matches) return;
    const step = () => {
      this.pos += this.vel;
      this.vel *= 0.92;
      this.render();
      if (Math.abs(this.vel) > 0.01) this.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(step);
  }

  bind() {
    this.closeBtn?.addEventListener("click", () => this.close());

    this.root.addEventListener(
      "wheel",
      (e) => { e.preventDefault(); this.nudge(e.deltaY * this.wheelSpeed); },
      { passive: false }
    );

    let down = false, lastX = 0;
    this.root.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      down = true; lastX = e.clientX; this.vel = 0;
      cancelAnimationFrame(this.raf);
      this.root.setPointerCapture(e.pointerId);
    });
    this.root.addEventListener("pointermove", (e) => {
      if (!down) return;
      const d = (e.clientX - lastX) * -this.dragSpeed;
      this.vel = d;
      this.nudge(d);
      lastX = e.clientX;
    });
    const up = () => { if (down) { down = false; this.glide(); } };
    this.root.addEventListener("pointerup", up);
    this.root.addEventListener("pointercancel", up);

    this.root.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
      else if (e.key === "ArrowRight") this.nudge(1);
      else if (e.key === "ArrowLeft") this.nudge(-1);
    });
  }
}

// Buttons like <button data-turn="/turn/chair-{n}.webp" data-count="48" data-pad="4">
export function bindTurnTriggers(viewer, selector = "[data-turn]") {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", () => {
      const frames = frameList(el.dataset.turn, Number(el.dataset.count), Number(el.dataset.pad || 4));
      viewer.open(frames, 0, el);
    });
  });
}
