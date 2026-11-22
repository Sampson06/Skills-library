// sound-manager.js
// Opt-in website sound: an ambient loop with fades, plus short interface sounds.
// Browsers block audio until the visitor interacts, so enable() must be called from a click.

export class SoundManager {
  constructor({ ambientSrc = null, ambientVolume = 0.5, fadeMs = 600 } = {}) {
    this.enabled = false;
    this.ambientVolume = ambientVolume;
    this.fadeMs = fadeMs;
    this.sfx = new Map();
    this.ambient = ambientSrc
      ? Object.assign(new Audio(ambientSrc), { loop: true, volume: 0, preload: "none" })
      : null;

    document.addEventListener("visibilitychange", () => {
      if (!this.ambient) return;
      if (document.hidden) this.ambient.pause();
      else if (this.enabled) this.ambient.play().catch(() => {});
    });
  }

  register(name, src, volume = 0.4) {
    const a = new Audio(src);
    a.preload = "auto";
    a.volume = volume;
    this.sfx.set(name, a);
  }

  async enable() {
    this.enabled = true;
    if (this.ambient) {
      try {
        await this.ambient.play();
        this.fadeTo(this.ambientVolume);
      } catch {
        this.enabled = false; // blocked or failed to load
      }
    }
    return this.enabled;
  }

  disable() {
    this.enabled = false;
    this.fadeTo(0, () => this.ambient?.pause());
  }

  async toggle() {
    if (this.enabled) { this.disable(); return false; }
    return this.enable();
  }

  play(name) {
    if (!this.enabled) return;
    const base = this.sfx.get(name);
    if (!base) return;
    const a = base.cloneNode();
    a.volume = base.volume;
    a.play().catch(() => {});
  }

  setAmbientVolume(v) {            // call from scroll sections to change mood
    this.ambientVolume = v;
    if (this.enabled) this.fadeTo(v);
  }

  fadeTo(target, done) {
    if (!this.ambient) { done?.(); return; }
    const a = this.ambient, from = a.volume, t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / this.fadeMs);
      a.volume = from + (target - from) * k;
      if (k < 1) requestAnimationFrame(step); else done?.();
    };
    requestAnimationFrame(step);
  }
}
