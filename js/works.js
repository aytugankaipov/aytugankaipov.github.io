/* Работы: halftone-фон, папки-разделы, бесконечное кольцо карточек, консоль-просмотрщик */
(() => {
  const SITE = window.SITE, App = window.App;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = App.reduce;
  const DIR = "assets/works/";
  const pad2 = (n) => String(n).padStart(2, "0");
  const T = (w, k) => (App.lang() === "en" && w[k + "En"]) || w[k];
  const isAI = (w) => w.tag === "ИИ-видео";
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- Движущийся halftone-фон ---------- */
  (function halftone() {
    const cv = $(".works__bg"), sec = $(".works"), ctx = cv.getContext("2d");
    let W, H, k, visible = false, raf = 0;
    const size = () => { k = Math.min(devicePixelRatio, 1.5); W = cv.width = sec.clientWidth * k; H = cv.height = sec.clientHeight * k; };
    // resize от адресной строки телефона не меняет размер раздела — холст не сбрасываем
    size(); addEventListener("resize", () => { if (sec.clientWidth * k !== W || sec.clientHeight * k !== H) size(); });
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = css("--dot");
      const step = 13 * k, ts = t * 0.00012;
      // два мягких «облака», медленно плывущих по кругу
      const blobs = [
        [W * (0.5 + 0.28 * Math.cos(ts)), H * (0.55 + 0.18 * Math.sin(ts * 1.3)), Math.max(W, H) * 0.42],
        [W * (0.5 + 0.3 * Math.cos(ts * 0.8 + 2.4)), H * (0.5 + 0.22 * Math.sin(ts + 1.1)), Math.max(W, H) * 0.3],
      ];
      ctx.globalAlpha = 0.16;
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          let v = 0;
          for (const [bx, by, br] of blobs) { const dx = x - bx, dy = y - by; v += Math.max(0, 1 - (dx * dx + dy * dy) / (br * br)); }   // = 1 − d², без медленного Math.hypot
          v = Math.min(1, v) * (0.75 + 0.25 * Math.sin(x * 0.012 + y * 0.009 + t * 0.0008));
          if (v < 0.05) continue;
          const r = v * step * 0.36;
          ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    }
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    }).observe(sec);
  })();

  /* ---------- Кольцо карточек ---------- */
  const ring = $(".ring"), stage = $(".ring__stage");
  let list = SITE.works.slice(), cards = [], pos = 0, active = -1;
  const S = { pos: 0 };
  const wrap = (v, n) => ((v % n) + n) % n;
  const rel = (i) => { const n = list.length; let r = wrap(i - S.pos, n); if (r > n / 2) r -= n; return r; };
  let CW = 270, R = 900, STEP = 0.32;
  function measure() {
    // ширина карточки задаётся в CSS через calc — берём фактическую
    const probe = stage.firstElementChild;
    CW = probe ? probe.offsetWidth : 270;
    R = CW * 3.1; STEP = (CW * 1.06) / R;
  }
  function build() {
    stage.innerHTML = "";
    cards = list.map((w, i) => {
      const el = document.createElement("article");
      el.className = "wcard";
      el.innerHTML = `<img src="${DIR}${w.id}-poster.jpg" alt="" draggable="false" loading="lazy">
        <video muted loop playsinline preload="none"></video>
        <span class="wcard__num">${pad2(i + 1)}</span>
        ${isAI(w) ? `<span class="ai-badge wcard__ai">${App.tr("ai")}</span>` : ""}
        <span class="wcard__play" aria-hidden="true">▶</span>
        <span class="wcard__dim" aria-hidden="true"></span>`;
      el.addEventListener("click", () => {
        if (moved > 6) return;
        if (Math.round(rel(i)) === 0) openViewer(list, i); else go(Math.round(S.pos + rel(i)));
      });
      stage.appendChild(el);
      return el;
    });
    $(".js-total").textContent = pad2(list.length);
    $(".js-count").textContent = `(${SITE.works.length})`;
    active = -1;
  }
  function render() {
    const n = list.length;
    cards.forEach((el, i) => {
      const r = rel(i), a = r * STEP, ar = Math.abs(r);
      if (ar > 3.2) { el.style.visibility = "hidden"; return; }
      el.style.visibility = "";
      // дуга наружу: центральная — ближе всех, боковые уходят вглубь и разворачиваются
      const x = Math.sin(a) * R, z = (Math.cos(a) - 1) * R;
      el.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${a}rad)`;
      // затемнение боковых — чёрным слоем с прозрачностью (как brightness, но без перерисовки видео в каждом кадре — плавнее на телефоне)
      el.lastElementChild.style.opacity = Math.min(ar, 3) * 0.2;
      el.style.zIndex = String(100 - Math.round(ar * 10));
    });
    const a = wrap(Math.round(S.pos), n);
    if (a !== active) setActive(a);
  }
  function setActive(a) {
    if (active !== -1) App.sfx("detent");
    active = a;
    const n = list.length;
    cards.forEach((el, i) => {
      const on = i === a, v = $("video", el), d = Math.min(wrap(i - a, n), wrap(a - i, n));
      el.classList.toggle("is-on", on);
      // превью активной и соседних карточек грузим заранее — при перелистывании ролик уже готов
      if (!reduce && d <= 1 && !v.src) {
        v.preload = "auto"; v.src = `${DIR}${list[i].id}-preview.mp4`;
        v.addEventListener("canplay", () => v.classList.add("is-ready"), { once: true });
        // Safari иногда останавливает зацикленное превью в конце круга — у активной карточки запускаем снова
        v.addEventListener("pause", () => { if (el.classList.contains("is-on") && !document.hidden && viewer.hidden) v.play().catch(() => {}); });   // за открытой консолью превью стоит
      }
      if (on && !reduce) v.play().catch(() => {});
      else if (v.src) v.pause();
    });
    const w = list[a];
    $(".js-pos").textContent = pad2(a + 1);
    $(".js-tag").textContent = App.tr("tag." + w.tag);
    $(".js-ai").hidden = !isAI(w);
    $(".js-name").textContent = T(w, "title");
  }
  function go(target) {
    gsap.to(S, { pos: target, duration: reduce ? 0 : 0.85, ease: "expo.out", onUpdate: render, overwrite: true });
  }
  build(); measure(); render();
  addEventListener("resize", () => { measure(); render(); });

  // Перетаскивание (мышь и палец) с инерцией
  let dragX = null, startPos = 0, lastX = 0, vel = 0, moved = 0;
  ring.addEventListener("pointerdown", (e) => {
    dragX = e.clientX; startPos = S.pos; lastX = e.clientX; vel = 0; moved = 0;
    gsap.killTweensOf(S);
  });
  addEventListener("pointermove", (e) => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 6) ring.classList.add("is-drag");
    vel = vel * 0.6 + (e.clientX - lastX) * 0.4; lastX = e.clientX;
    S.pos = startPos - dx / (CW * 1.06);
    render();
  });
  addEventListener("pointerup", () => {
    if (dragX === null) return;
    dragX = null; ring.classList.remove("is-drag");
    go(Math.round(S.pos - vel / 18));
  });
  ring.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); gsap.killTweensOf(S);
    S.pos += e.deltaX / 420; render();
    clearTimeout(ring._t); ring._t = setTimeout(() => go(Math.round(S.pos)), 110);
  }, { passive: false });
  ring.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(Math.round(S.pos) + 1);
    if (e.key === "ArrowLeft") go(Math.round(S.pos) - 1);
    if (e.key === "Enter") openViewer(list, active);
  });
  $(".js-prev").addEventListener("click", () => go(Math.round(S.pos) - 1));
  $(".js-next").addEventListener("click", () => go(Math.round(S.pos) + 1));

  // Папки-разделы
  function counts() {
    const word = (n) => App.lang() === "en" ? (n === 1 ? App.tr("file1") : App.tr("files"))
      : (n % 10 === 1 && n % 100 !== 11 ? App.tr("file1") : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? App.tr("file2") : App.tr("files"));
    $$(".js-fc").forEach((el) => {
      const f = el.dataset.f, n = f === "all" ? SITE.works.length : SITE.works.filter((w) => w.tag === f).length;
      el.textContent = `${n} ${word(n)}`;
    });
  }
  counts();
  $$(".folder").forEach((b) => b.addEventListener("click", () => {
    if (b.classList.contains("is-active")) return;
    $$(".folder").forEach((x) => x.classList.toggle("is-active", x === b));
    const f = b.dataset.filter;
    list = f === "all" ? SITE.works.slice() : SITE.works.filter((w) => w.tag === f);
    S.pos = 0; build(); measure();
    if (reduce) render(); else { S.pos = -2.5; go(0); }
  }));

  // Кольцо «въезжает», когда до него долистали
  new IntersectionObserver(([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    if (!reduce) { S.pos = -3; render(); go(0); }
  }, { threshold: 0.35 }).observe(ring);

  App.onLang(() => { counts(); build(); render(); if (!viewer.hidden) fill(); });

  /* ---------- Консоль-просмотрщик ---------- */
  const viewer = $(".viewer"), video = $(".device__video"), screen = $(".device__screen");
  let vList = [], vIdx = 0, sound = true, lastFocus = null;
  function fill() {
    const w = vList[vIdx];
    $(".js-v-num").textContent = `${pad2(vIdx + 1)}/${pad2(vList.length)}`;
    $(".js-v-tag").textContent = App.tr("tag." + w.tag);
    $(".js-v-year").textContent = w.year;
    $(".js-v-ai").hidden = !isAI(w);
    $(".js-v-title").textContent = T(w, "title");
    $(".js-v-about").textContent = T(w, "about");
    $(".js-v-tools").textContent = w.tools;
    $(".js-v-snd").textContent = sound ? "♪ ON" : "♪ OFF";
  }
  function load() {
    if (!viewer.hidden) App.sfx("channel");
    const w = vList[vIdx];
    video.src = `${DIR}${w.id}.mp4`;
    video.poster = `${DIR}${w.id}-poster.jpg`;
    video.muted = !sound;
    video.play().catch(() => { video.muted = true; sound = false; fill(); video.play().catch(() => {}); });
    fill();
    if (!reduce) gsap.fromTo(screen, { scaleY: 0.008, scaleX: 0.7, filter: "brightness(4)" },
      { keyframes: [{ scaleX: 1, duration: 0.16, ease: "power2.out" }, { scaleY: 1, filter: "brightness(1)", duration: 0.45, ease: "expo.out" }] });
  }
  function openViewer(l, i) {
    App.sfx("open");
    vList = l; vIdx = i; lastFocus = document.activeElement;
    cards.forEach((el) => { const v = $("video", el); if (v.src) v.pause(); });
    viewer.hidden = false; document.body.style.overflow = "hidden"; document.body.classList.add("viewer-open");
    load();
    if (!reduce) gsap.from(".device, .viewer__info > *", { y: 30, opacity: 0, stagger: 0.05, duration: 0.55, ease: "power3.out" });
    $(".viewer__close").focus({ preventScroll: true });
  }
  function closeViewer() {
    App.sfx("off");
    video.pause(); video.removeAttribute("src"); video.load();
    viewer.hidden = true; document.body.style.overflow = ""; document.body.classList.remove("viewer-open");
    active = -1; render();
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  function press(k) {
    if (k === "left" || k === "up") { vIdx = wrap(vIdx - 1, vList.length); load(); }
    if (k === "right" || k === "down") { vIdx = wrap(vIdx + 1, vList.length); load(); }
    if (k === "b") { sound = !sound; video.muted = !sound; fill(); }
    if (k === "a") {
      const el = video;
      (el.requestFullscreen || el.webkitRequestFullscreen || el.webkitEnterFullscreen || (() => {})).call(el);
    }
  }
  $$(".viewer [data-k]").forEach((b) => b.addEventListener("click", () => press(b.dataset.k)));
  $(".viewer__close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });
  video.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
  video.addEventListener("timeupdate", () => { $(".device__bar i").style.width = (video.currentTime / (video.duration || 1)) * 100 + "%"; });
  video.addEventListener("ended", () => press("right"));
  let sx = null;
  screen.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  screen.addEventListener("touchend", (e) => {
    if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) press(dx < 0 ? "right" : "left");
  });
  addEventListener("keydown", (e) => {
    if (viewer.hidden) return;
    const map = { Escape: "esc", ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "a", ф: "a", b: "b", и: "b", f: "a", а: "a" };
    const k = map[e.key]; if (!k) return;
    e.preventDefault();
    if (k === "esc") closeViewer(); else press(k);
  });

  // открыть работу по id (для кейсов)
  window.App.openWork = (id) => { const i = SITE.works.findIndex((w) => w.id === id); if (i >= 0) openViewer(SITE.works, i); };

  // Шоурил с первого экрана
  $(".js-reel").addEventListener("click", () => {
    const i = SITE.works.findIndex((w) => w.id === "w00-showreel");
    openViewer(SITE.works, Math.max(0, i));
  });
})();
