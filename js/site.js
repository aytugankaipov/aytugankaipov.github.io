/* Сайт: язык, тема, акцент/шрифт (на время разработки), загрузка, имя из символов, бейдж */
(() => {
  const SITE = window.SITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- Тексты RU / EN ---------- */
  const I18N = {
    ru: { loading: "загрузка портфолио", "nav.works": "работы", "nav.cases": "кейсы", "nav.about": "обо мне", "nav.contact": "контакты",
      "theme.dark": "тёмная", "theme.light": "светлая", "kicker.role": "моушн-дизайнер", "kicker.city": "уфа", "kicker.since": "с " + SITE.since,
      "btn.works": "Смотреть работы ↓", "btn.reel": "▶ Шоурил", tip: "нажми или потяни", open: "открыт к проектам", scroll: "листай ↓",
      "works.title": "Работы", "f.all": "Все", "f.code": "Код + ИИ", "f.ai": "ИИ-видео", ai: "ИИ-генерация",
      "works.hint": "тяни ленту · нажми на карточку — откроется в консоли", "v.full": "экран", "v.sound": "звук", "v.close": "закрыть", "about.title": "Обо мне", "photo.soon": "фото скоро", "fact.since": "в моушне с", "fact.works": "работ на сайте", "fact.tools": "инструментов", "exp.title": "опыт", "exp.hint": "наведи или нажми на картридж", "tools.title": "инструменты", "tools.prompt": "нажми клавишу", "serv.title": "чем могу помочь", "contact.title": "Напишите мне", "contact.copy": "скопировать почту", "contact.copied": "скопировано ✓", "contact.note": "работаю удалённо · быстрее всего — в Telegram", "foot.made": "сайт собран кодом вместе с ИИ", "foot.up": "наверх ↑", "r.title": "КАССОВЫЙ ЧЕК", "r.order": "заказ", "r.city": "город", "r.remote": "Уфа · удалённо", "r.total": "ИТОГО", "r.totalv": "договоримся", "r.thanks": "СПАСИБО, ЧТО ДОСМОТРЕЛИ", "r.mail": "почта", "r.tg": "telegram", "snd.on": "звук вкл", "snd.off": "звук", "cases.title": "Кейсы", "c.sheet": "лист", "c.task": "задача", "c.idea": "идея", "c.did": "что делал", "c.board": "раскадровка", "c.voice": "голос", "c.frame": "кадр", "c.move": "приём", "c.process": "процесс", "c.watch": "▶ смотреть ролик", "c.credits": "источники и лицензии", "c.dur": "длительность", "c.format": "формат", "c.tools": "инструменты", "c.ok": "принято",
      "tag.Шоурил": "Шоурил", "tag.Код + ИИ": "Код + ИИ", "tag.ИИ-видео": "ИИ-видео", files: "файлов", file1: "файл", file2: "файла" },
    en: { loading: "loading portfolio", "nav.works": "works", "nav.cases": "cases", "nav.about": "about", "nav.contact": "contact",
      "theme.dark": "dark", "theme.light": "light", "kicker.role": "motion designer", "kicker.city": "ufa", "kicker.since": "since " + SITE.since,
      "btn.works": "See works ↓", "btn.reel": "▶ Showreel", tip: "tap or drag", open: "open for projects", scroll: "scroll ↓",
      "works.title": "Works", "f.all": "All", "f.code": "Code + AI", "f.ai": "AI video", ai: "AI-generated",
      "works.hint": "drag the strip · tap a card to open it in the console", "v.full": "full", "v.sound": "sound", "v.close": "close", "about.title": "About", "photo.soon": "photo soon", "fact.since": "in motion since", "fact.works": "works on the site", "fact.tools": "tools", "exp.title": "experience", "exp.hint": "hover or tap a cartridge", "tools.title": "tools", "tools.prompt": "press a key", "serv.title": "how I can help", "contact.title": "Get in touch", "contact.copy": "copy email", "contact.copied": "copied ✓", "contact.note": "remote · fastest on Telegram", "foot.made": "built with code alongside AI", "foot.up": "back to top ↑", "r.title": "RECEIPT", "r.order": "order", "r.city": "city", "r.remote": "Ufa · remote", "r.total": "TOTAL", "r.totalv": "let’s talk", "r.thanks": "THANKS FOR WATCHING TO THE END", "r.mail": "email", "r.tg": "telegram", "snd.on": "sound on", "snd.off": "sound", "cases.title": "Cases", "c.sheet": "sheet", "c.task": "brief", "c.idea": "idea", "c.did": "my part", "c.board": "storyboard", "c.voice": "voice", "c.frame": "frame", "c.move": "move", "c.process": "process", "c.watch": "▶ watch the video", "c.credits": "sources & licenses", "c.dur": "duration", "c.format": "format", "c.tools": "tools", "c.ok": "approved",
      "tag.Шоурил": "Showreel", "tag.Код + ИИ": "Code + AI", "tag.ИИ-видео": "AI video", files: "files", file1: "file", file2: "files" },
  };
  let lang = store.get("lang") || "ru";
  const tr = (k) => I18N[lang][k] || k;
  function applyLang() {
    root.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = tr(el.dataset.i18n); });
    $(".js-theme span").textContent = tr(root.dataset.theme === "dark" ? "theme.dark" : "theme.light");
    $(".js-lang").textContent = lang === "ru" ? "EN" : "RU";
    $(".js-lead").textContent = lang === "en" ? SITE.leadEn : SITE.lead;
    $(".js-name-text").textContent = lang === "en" ? SITE.nameEn : SITE.name;
    document.title = (lang === "en" ? SITE.nameEn + " — motion designer" : SITE.name + " — моушн-дизайнер");
    langHooks.forEach((f) => f(lang));
  }
  const langHooks = [];
  // общий интерфейс для других скриптов сайта (works.js и т. д.)
  window.App = { lang: () => lang, tr: (k) => tr(k), onLang: (f) => langHooks.push(f), reduce, sfx: (n) => window.Sound && Sound.play(n) };

  /* ---------- Звук: кнопка в шапке ---------- */
  const sndBtn = $(".js-sound");
  const sndUi = (v) => { sndBtn.classList.toggle("is-on", v); sndBtn.setAttribute("aria-pressed", v); $("span", sndBtn).textContent = tr(v ? "snd.on" : "snd.off"); };
  if (window.Sound) { sndBtn.addEventListener("click", () => Sound.toggle()); Sound.onChange(sndUi); sndUi(Sound.on); langHooks.push(() => sndUi(Sound.on)); }
  $(".js-lang").addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru"; store.set("lang", lang); applyLang(); window.Sound && Sound.play("toggle");
    glyphs && glyphs.rebuild(true); badge && badge.setLang(lang);
  });

  /* ---------- Тема ---------- */
  function setTheme(t) {
    if (root.dataset.theme && root.dataset.theme !== t) window.Sound && Sound.play("toggle");
    root.dataset.theme = t; store.set("theme", t);
    $(".js-theme span").textContent = tr(t === "dark" ? "theme.dark" : "theme.light");
    glyphs && glyphs.recolor(); badge && badge.redraw();
  }
  $(".js-theme").addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
  root.dataset.theme = store.get("theme") || "dark";

  /* ---------- Иконка вкладки — того же цвета, что акцент в css/site.css ---------- */
  function paintFavicon() {
    const c = css("--accent") || "#c8ff3d";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#19191b"/><path d="M24 18v28l22-14z" fill="${c}"/></svg>`;
    $$('link[rel="icon"]').forEach((l) => l.remove());
    const l = document.createElement("link"); l.rel = "icon"; l.type = "image/svg+xml";
    l.href = "data:image/svg+xml," + encodeURIComponent(svg); document.head.appendChild(l);
  }
  root.dataset.font = "16";

  /* ---------- Контакты ---------- */
  $$(".js-mail").forEach((a) => { a.textContent = SITE.contacts.email; a.href = "mailto:" + SITE.contacts.email; });
  $$(".js-phone").forEach((a) => { a.textContent = SITE.contacts.phone; a.href = "tel:" + SITE.contacts.phone.replace(/[^+\d]/g, ""); });
  $$(".js-tg").forEach((a) => { a.textContent = "telegram @" + SITE.contacts.telegram; a.href = "https://t.me/" + SITE.contacts.telegram; });

  /* ---------- Имя из символов (из варианта Б) ---------- */
  function initGlyphs(cv) {
    const ctx = cv.getContext("2d");
    const CHARS_RU = "АЙТУГАНКАИПОВ0123456789#*+<>/=▓▒░";
    const CHARS_EN = "AYTUGANKAIPOV0123456789#*+<>/=▓▒░";
    let W, H, parts = [], t0 = 0, started = false, mouse = { x: -1e4, y: -1e4 }, colors = {};
    const recolor = () => { colors = { ink: css("--ink"), accent: css("--accent") }; atlasKey = ""; };
    function rebuild(keep) {
      const dpr = Math.min(devicePixelRatio, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const STEP = W < 500 ? 6 : W < 900 ? 6 : 7;
      const off = document.createElement("canvas"); off.width = W; off.height = H;
      const o = off.getContext("2d");
      const fam = css("--display").split(",")[0].replace(/['"]/g, ""), wgt = css("--display-w");
      const lines = (lang === "en" ? SITE.nameEn : SITE.name).toUpperCase().split(" ");
      let fs = H * 0.5;
      o.font = `${wgt} ${fs}px "${fam}"`;
      const mw = Math.max(...lines.map((l) => o.measureText(l).width));
      if (mw > W * 0.98) fs *= (W * 0.98) / mw;
      o.font = `${wgt} ${fs}px "${fam}"`;
      o.fillStyle = "#fff"; o.textBaseline = "alphabetic";
      lines.forEach((l, i) => o.fillText(l, 0, fs * 0.86 + i * fs * 0.96));
      const d = o.getImageData(0, 0, W, H).data;
      const chars = lang === "en" ? CHARS_EN : CHARS_RU;
      // основная сетка + досэмплирование тонких деталей (кратка над Й, тонкие штрихи), чтобы они не превращались в одиночные символы
      const at = (x, y) => (x >= 0 && y >= 0 && x < W && y < H) ? d[(y * W + x) * 4 + 3] : 0;
      const pts = [];
      for (let y = 0; y < H; y += STEP) for (let x = 0; x < W; x += STEP) if (at(x, y) >= 128) pts.push([x, y, STEP]);
      const half = STEP / 2 | 0;
      for (let y = half; y < H; y += STEP) for (let x = half; x < W; x += STEP) {
        if (at(x, y) < 128) continue;
        const near = at(x - half, y - half) >= 128 || at(x + half, y - half) >= 128 || at(x - half, y + half) >= 128 || at(x + half, y + half) >= 128;
        if (!near) pts.push([x, y, STEP]);
      }
      // одиночные символы-«сироты» (кончики штрихов, верх краткой) убираем — там лучше пусто
      const key = (x, y) => (Math.round(x / half) << 16) | Math.round(y / half);
      const occ = new Set(pts.map(([x, y]) => key(x, y)));
      const R2 = STEP * 1.6;
      const keepPt = ([x, y]) => {
        let n = 0;
        for (let dy = -R2; dy <= R2; dy += half) for (let dx = -R2; dx <= R2; dx += half) {
          if ((dx || dy) && occ.has(key(x + dx, y + dy))) n++;
        }
        return n >= 2;
      };
      const clean = pts.filter(keepPt);
      const old = parts; parts = [];
      for (const [x, y] of clean) {
        const p = (keep && old[parts.length]) || {};
        Object.assign(p, {
          tx: x, ty: y, s: STEP,
          x: p.x ?? x + (Math.random() - 0.5) * 80, y: p.y ?? -60 - Math.random() * H * 1.6,
          vx: p.vx ?? 0, vy: p.vy ?? 0,
          ch: chars[(Math.random() * chars.length) | 0], acc: Math.random() < 0.06,
          delay: p.delay ?? (x / W) * 500 + Math.random() * 700,
        });
        if (reduce) { p.x = p.tx; p.y = p.ty; }
        parts.push(p);
      }
    }
    const setMouse = (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouseMoved = true;
      if (started && mouse.x > 0 && mouse.y > 0 && mouse.x < W && mouse.y < H && Math.random() < 0.25) window.Sound && Sound.play("shimmer"); };
    addEventListener("pointermove", setMouse, { passive: true });
    cv.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; });
    // на телефоне палец «отпускает» символы, когда убран
    addEventListener("touchend", () => { mouse.x = mouse.y = -1e4; }, { passive: true });
    // и когда палец начал листать страницу (браузер шлёт pointercancel): играть с символами можно, прокрутка их не разбрасывает.
    // Вбок по имени страница не листается (touch-action: pan-y в site.css) — там палец водит символы.
    addEventListener("pointercancel", () => { mouse.x = mouse.y = -1e4; }, { passive: true });
    addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") setMouse(e); }, { passive: true });
    let visible = true, running = false, onSettle = null;
    // Атлас символов: каждый знак рисуется один раз в отдельный холст, дальше — быстрый drawImage (вместо тысяч fillText за кадр)
    let atlas = null, cell = 0, atlasKey = "";
    const ALL = [...new Set((CHARS_RU + CHARS_EN).split(""))];
    function buildAtlas(step) {
      const dpr = Math.min(devicePixelRatio, 2), key = step + "|" + colors.ink + "|" + colors.accent + "|" + dpr;
      if (key === atlasKey) return; atlasKey = key;
      cell = Math.ceil((step + 4) * dpr);
      atlas = document.createElement("canvas"); atlas.width = cell * ALL.length; atlas.height = cell * 2;
      const a = atlas.getContext("2d");
      a.font = `600 ${(step + 1.5) * dpr}px "IBM Plex Mono"`; a.textBaseline = "top";
      ALL.forEach((c, i) => { a.fillStyle = colors.ink; a.fillText(c, i * cell, 0); a.fillStyle = colors.accent; a.fillText(c, i * cell, cell); });
    }
    const idx = (c) => Math.max(0, ALL.indexOf(c));
    let lastDraw = 0, mouseMoved = true;
    function frame(t) {
      if (!visible) { running = false; return; }
      const el = t - t0;
      const STEP = parts.length ? parts[0].s : 7;
      buildAtlas(STEP);
      const R = W < 600 ? 50 : 80, intro = !reduce;
      let moving = 0;
      for (const p of parts) {
        if (intro && el <= p.delay) { p.vy += 0.6; }
        else { p.vx += (p.tx - p.x) * 0.07; p.vy += (p.ty - p.y) * 0.07; p.vx *= 0.78; p.vy *= 0.78; }
        // реакция на курсор/палец работает всегда — и при «уменьшить движение» в системе (это действие самого человека)
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dd = dx * dx + dy * dy;
        if (dd < R * R) { const l = Math.sqrt(dd) || 1, f = (1 - l / R) * 5; p.vx += (dx / l) * f; p.vy += (dy / l) * f; }
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.15) moving++;
      }
      // в покое не перерисовываем 60 раз в секунду: только редкое «мерцание» символов
      const idle = moving === 0 && !mouseMoved;
      if (!idle || t - lastDraw > 160) {
        if (idle && !reduce) for (let k = 0; k < Math.max(1, parts.length * 0.01); k++) { const p = parts[(Math.random() * parts.length) | 0]; p.ch = (lang === "en" ? CHARS_EN : CHARS_RU)[(Math.random() * 30) | 0]; }
        ctx.clearRect(0, 0, W, H);
        const dpr = Math.min(devicePixelRatio, 2), cs = cell / dpr;
        for (const p of parts) ctx.drawImage(atlas, idx(p.ch) * cell, p.acc ? cell : 0, cell, cell, p.x, p.y, cs, cs);
        lastDraw = t; mouseMoved = false;
      }
      // бейдж падает, как только имя почти собралось
      if (onSettle && el > 700 && (moving < parts.length * 0.15 || el > 1500)) { const f = onSettle; onSettle = null; f(); }
      requestAnimationFrame(frame);
    }
    function run() { if (started && !running && visible) { running = true; requestAnimationFrame(frame); } }
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; run(); }).observe(cv);
    // адресная строка телефона шлёт resize при прокрутке — пересобираем имя, только если холст правда изменился
    let rT; addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { if (cv.clientWidth !== W || cv.clientHeight !== H) rebuild(true); }, 150); });
    recolor(); rebuild(false);
    return { go(cb) { started = true; t0 = performance.now(); onSettle = cb; run(); }, rebuild, recolor };
  }

  /* ---------- Портрет на первом экране: лицо — посередине между концом имени и бейджем ---------- */
  const me = $(".hero__me");
  function placeMe() {
    const hero = $(".hero"), W = hero.clientWidth, H = hero.clientHeight;
    if (W < 860) { me.style.left = ""; return; }
    const nameR = $(".hero__name").getBoundingClientRect().right;
    const cardW = Math.min(0.42 * H, 0.27 * W) * 0.7;   // как в badge.js
    const cardL = W * 0.7 - cardW / 2;
    const faceX = (nameR + cardL) / 2;                  // лицо на фото — примерно 45% ширины картинки
    me.style.left = Math.round(faceX - me.offsetWidth * 0.45) + "px";
  }
  placeMe(); addEventListener("resize", placeMe);
  $("img", me).addEventListener("load", placeMe); // размер берётся из самой картинки — фото можно просто заменить
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    const mx = gsap.quickTo(me, "x", { duration: 1.2, ease: "power3.out" }), my = gsap.quickTo(me, "y", { duration: 1.2, ease: "power3.out" });
    addEventListener("pointermove", (e) => { mx((e.clientX / innerWidth - 0.5) * -24); my((e.clientY / innerHeight - 0.5) * -12); }, { passive: true });
  }

  /* ---------- Старт ---------- */
  applyLang();
  let glyphs = null, badge = null;
  try { localStorage.removeItem("accent"); } catch (e) {}
  paintFavicon();

  const fontsReady = Promise.all([
    "800 80px Montserrat", "400 16px Inter", "500 16px Inter", "600 16px Inter", "700 16px Inter", "400 20px 'IBM Plex Mono'", "600 20px 'IBM Plex Mono'",
    "400 20px 'Pixelify Sans'", "400 12px 'JetBrains Mono'",
  ].map((f) => document.fonts.load(f, "АБВабвЁёЙйAa1 →·"))).catch(() => {});

  const num = $(".loader__num"), bar = $(".loader__bar");
  const counter = { v: 0 };
  const loaded = new Promise((res) => {
    if (reduce) return res();
    gsap.to(counter, { v: 100, duration: 1.0, ease: "power2.inOut",
      onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, "0"); bar.style.width = counter.v + "%"; }, onComplete: res });
  });

  Promise.all([fontsReady, loaded]).then(() => {
    placeMe();
    glyphs = initGlyphs($(".hero__glyphs"));
    badge = window.Badge && window.Badge.init($(".hero"), $(".hero__badge"), $(".hero__ring"), { lang, tip: $(".badge-tip") });
    badge && badge.redraw();
    document.body.classList.remove("is-loading");
    const L = $(".loader");
    if (reduce) { L.remove(); glyphs.go(); badge && badge.drop(); return; }
    gsap.to(L, { yPercent: -100, duration: 0.8, ease: "expo.inOut", onComplete: () => L.remove() });
    gsap.from(".nav, .hero__kicker, .hero__lead, .hero__actions, .hero__foot", { y: 16, opacity: 0, stagger: 0.06, duration: 0.7, delay: 0.45, ease: "power3.out" });
    // по очереди: сначала символы собираются в имя, потом сверху падает бейдж
    // имя и бейдж почти одновременно: бейдж стартует, пока символы ещё долетают
    setTimeout(() => glyphs.go(), 150);
    gsap.from(".hero__me", { opacity: 0, y: 80, duration: 1.4, delay: 0.3, ease: "power3.out" });
    setTimeout(() => badge && badge.drop(), 700);
  });

  
})();
