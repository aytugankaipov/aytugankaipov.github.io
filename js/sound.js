/*
  Звуки интерфейса — синтез кодом (Web Audio), без файлов и лицензий.
  По умолчанию выключены; кнопка «звук» в шапке, выбор запоминается.
  Снаружи: Sound.play("tick" | "click" | "key" | "flip" | "open" | "print"), Sound.toggle(), Sound.on
*/
(() => {
  const KEY = "sound";
  let on = false, ctx = null, master = null, noiseBuf = null;
  try { on = localStorage.getItem(KEY) === "1"; } catch (e) {}

  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
  function tone(type, f0, f1, dur, vol, t = ctx.currentTime) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, 0.004, vol, dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, vol, fType, f0, f1, q = 1, t = ctx.currentTime) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = fType; f.Q.value = q; f.frequency.setValueAtTime(f0, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, 0.003, vol, dur); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.05);
  }
  const SOUNDS = {
    tick: () => noise(0.025, 0.12, "highpass", 4000),                                   // наведение
    click: () => { tone("sine", 900, 420, 0.07, 0.25); noise(0.02, 0.1, "bandpass", 3000, 0, 2); }, // нажатие кнопки
    key: () => { noise(0.03, 0.35, "bandpass", 2400, 0, 1.5); tone("triangle", 180, 90, 0.06, 0.2); }, // механическая клавиша
    flip: () => noise(0.35, 0.22, "bandpass", 400, 3200, 2),                           // переворот бейджа — «вжух»
    open: () => { const t = ctx.currentTime; tone("sine", 440, 0, 0.12, 0.18, t); tone("sine", 660, 0, 0.16, 0.18, t + 0.08); noise(0.25, 0.05, "highpass", 6000, 0, 1, t); }, // включение ТВ
    print: () => noise(0.04, 0.18, "bandpass", 1800, 0, 4),                            // принтер чека
    detent: () => { noise(0.018, 0.16, "bandpass", 3200, 0, 3); tone("sine", 1400, 0, 0.03, 0.05); }, // карточка ленты встала на место
    channel: () => { noise(0.12, 0.12, "bandpass", 2500, 900, 0.7); tone("square", 120, 60, 0.05, 0.04); }, // смена работы в консоли
    off: () => { const t = ctx.currentTime; tone("sine", 660, 0, 0.1, 0.16, t); tone("sine", 330, 0, 0.18, 0.16, t + 0.07); }, // выключение консоли
    grab: () => noise(0.05, 0.16, "lowpass", 900, 0, 1),                               // взял бейдж
    thud: () => { tone("sine", 120, 55, 0.18, 0.35); noise(0.06, 0.12, "lowpass", 600); }, // бейдж упал и повис
    slide: () => noise(0.18, 0.14, "bandpass", 700, 1600, 1.2),                        // картридж выдвигается
    paper: () => noise(0.22, 0.12, "highpass", 1500, 4000, 0.6),                       // смена листа кейса
    success: () => { const t = ctx.currentTime; tone("sine", 880, 0, 0.09, 0.15, t); tone("sine", 1320, 0, 0.14, 0.15, t + 0.08); }, // почта скопирована
    toggle: () => { tone("square", 520, 0, 0.03, 0.06); noise(0.02, 0.12, "bandpass", 2600, 0, 3); }, // тема / язык
    shimmer: () => { const f = 1800 + Math.random() * 1600; tone("sine", f, f * 1.5, 0.08, 0.025); }, // символы имени разлетаются
  };
  let last = {};
  function play(name) {
    if (!on || !SOUNDS[name]) return;
    if (!init()) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = performance.now();
    if (now - (last[name] || 0) < (name === "shimmer" ? 90 : 35)) return; // не дребезжать
    last[name] = now;
    SOUNDS[name]();
  }
  const hooks = [];
  function set(v) {
    on = v;
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {}
    if (v && init() && ctx.state === "suspended") ctx.resume();
    hooks.forEach((f) => f(v));
    if (v) play("click");
  }

  // Общие звуки: наведение и нажатие на кнопки сайта
  const SEL = ".btn, .pill, .folder, .ctab, .wcard, .cart, .nav__links a, .viewer [data-k], .fig, .contact__mail, .key, .nav__logo, .contact__foot a, .receipt a";
  document.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const el = e.target.closest(SEL);
    if (el && !el.matches(".key") && !el.contains(e.relatedTarget)) play("tick");
  });
  document.addEventListener("click", (e) => { const el = e.target.closest(SEL); if (el && !el.matches(".key, .cart, .js-sound, .js-theme, .js-lang, .js-copy")) play("click"); });

  window.Sound = { play, toggle: () => set(!on), set, onChange: (f) => hooks.push(f), get on() { return on; } };
})();
