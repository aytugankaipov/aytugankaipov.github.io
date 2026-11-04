/* Обо мне и контакты: фото с 1-bit dither, счётчики, картриджи, клавиатура, услуги, чек */
(() => {
  const SITE = window.SITE, App = window.App;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const L = (o, k) => (App.lang() === "en" && o[k + "En"]) || o[k];
  const tr = App.tr, reduce = App.reduce;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const onView = (el, fn, th = 0.3) => new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); fn(); } }, { threshold: th }).observe(el);

  /* ---------- Фото (assets/me.jpg): ч/б, «проявляется» из 1-bit dither (реф. 25); под курсором снова точки ---------- */
  (function photo() {
    const cv = $(".photo__cv"), ctx = cv.getContext("2d");
    const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
      3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map((v) => (v + 0.5) / 64);
    const img = new Image();
    let src = null, W = 0, H = 0, gray = null, lum = null, reveal = reduce ? 1 : 0, mx = -1e4, my = -1e4;
    const DS = 3; // размер «пикселя» точек
    function prepare() {
      W = cv.width = Math.round(cv.clientWidth * Math.min(devicePixelRatio, 2));
      H = cv.height = Math.round(cv.clientHeight * Math.min(devicePixelRatio, 2));
      if (!src || !W) return;
      const o = document.createElement("canvas"); o.width = W; o.height = H;
      const c = o.getContext("2d"), r = Math.max(W / src.width, H / src.height);
      c.filter = "grayscale(1) contrast(1.15) brightness(1.05)";
      c.drawImage(src, (W - src.width * r) / 2, (H - src.height * r) / 2, src.width * r, src.height * r);
      gray = o;
      // яркость в сетке точек
      const k = Math.min(devicePixelRatio, 2) * DS, w = Math.ceil(W / k), h = Math.ceil(H / k);
      const t = document.createElement("canvas"); t.width = w; t.height = h;
      const tc = t.getContext("2d"); tc.drawImage(o, 0, 0, w, h);
      lum = { w, h, k, v: new Float32Array(w * h) };
      try {
        const d = tc.getImageData(0, 0, w, h).data;
        for (let i = 0; i < w * h; i++) lum.v[i] = d[i * 4] / 255;
      } catch (e) {
        // при открытии файла двойным кликом браузер не даёт читать пиксели — тогда фото без эффекта точек
        lum = null; reveal = 1;
      }
    }
    function draw() {
      if (!gray) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = reveal; ctx.drawImage(gray, 0, 0); ctx.globalAlpha = 1;
      if (!lum) return;
      const { w, h, k, v } = lum, R = 26 * k / DS, ink = css("--ink"), acc = css("--accent");
      const bg = css("--bg-2");
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const px = x * k, py = y * k, dm = Math.hypot(px - mx, py - my);
        const hover = dm < R * 4;
        const a = Math.max(1 - reveal, hover ? Math.max(0, 1 - dm / (R * 4)) : 0);
        if (a < 0.02) continue;
        const on = v[y * w + x] > BAYER[(y % 8) * 8 + (x % 8)];
        ctx.globalAlpha = a;
        ctx.fillStyle = on ? (hover && dm < R * 2 ? acc : ink) : bg;
        ctx.fillRect(px, py, k, k);
      }
      ctx.globalAlpha = 1;
    }
    img.onload = () => {
      src = img; const ph = $(".photo__ph"); ph && ph.remove(); prepare(); draw();
      onView(cv, () => {
        if (reduce || !lum) { reveal = 1; draw(); return; }
        const o = { r: 0 };
        gsap.to(o, { r: 1, duration: 1.8, delay: 0.3, ease: "steps(14)", onUpdate: () => { reveal = o.r; draw(); } });
      }, 0.4);
    };
    img.src = window.ME_PHOTO || "assets/me.jpg"; // фото: заменить assets/me.jpg и дважды кликнуть update-photo.bat
    const dpr = () => Math.min(devicePixelRatio, 2);
    cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) * dpr(); my = (e.clientY - r.top) * dpr(); draw(); });
    cv.addEventListener("pointerleave", () => { mx = my = -1e4; draw(); });
    // на телефоне адресная строка при прокрутке шлёт resize, а размер фото тот же — не пересчитываем зря
    addEventListener("resize", () => { if (Math.round(cv.clientWidth * dpr()) === W && Math.round(cv.clientHeight * dpr()) === H) return; prepare(); draw(); });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
  })();

  /* ---------- Тексты и счётчики ---------- */
  function texts() {
    $(".js-about").textContent = L(SITE, "about");
    $$(".js-name-plain").forEach((el) => { el.textContent = L(SITE, "name"); });
    $$(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
  }
  const fWorks = $("[data-works]"), fTools = $("[data-tools]");
  fWorks.dataset.to = SITE.works.length; fTools.dataset.to = SITE.tools.length;
  onView($(".facts"), () => {
    $$(".facts .js-count").forEach((el) => {
      const to = +el.dataset.to, from = +el.dataset.from, o = { v: from };
      if (reduce) { el.textContent = to; return; }
      gsap.to(o, { v: to, duration: 1.4, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v); } });
    });
  });

  /* ---------- Картриджи-опыт ---------- */
  function carts() {
    const st = $(".carts__stack");
    st.innerHTML = SITE.experience.map((x, i) => `
      <button class="cart" type="button" aria-expanded="false">
        <span class="cart__year"><span>${esc(L(x, "years"))}</span></span>
        <span class="cart__label">
          <b>${esc(L(x, "role"))}</b>
          ${x.where ? `<span class="mono">${esc(L(x, "where"))}</span>` : ""}
          <span class="cart__more"><p>${esc(L(x, "text"))}</p></span>
        </span>
      </button>`).join("");
    $$(".cart", st).forEach((c, i) => c.addEventListener("click", () => {
      App.sfx("slide");
      const open = !c.classList.contains("is-open");
      $$(".cart", st).forEach((o) => { o.classList.remove("is-open"); o.setAttribute("aria-expanded", "false"); });
      if (open) { c.classList.add("is-open"); c.setAttribute("aria-expanded", "true"); }
    }));
    $(".cart", st).classList.add("is-open");
  }

  /* ---------- Клавиатура инструментов ---------- */
  const KEYS = {
    "After Effects": ["Ae", "моушн и композитинг", "motion & compositing"], "Premiere Pro": ["Pr", "монтаж", "editing"],
    "Photoshop": ["Ps", "коллаж, ретушь", "collage, retouch"], "Illustrator": ["Ai", "вектор, логотипы", "vector, logos"],
    "Figma": ["Fi", "макеты, раскадровки", "layouts, boards"], "CapCut": ["Cc", "быстрый монтаж", "quick edits"],
    "Kling": ["Kl", "ИИ-видео", "AI video"], "Higgsfield": ["Hf", "ИИ-видео и персонажи", "AI video & characters"],
    "Midjourney": ["Mj", "ИИ-картинки", "AI images"], "Runway": ["Rw", "ИИ-видео", "AI video"],
    "ChatGPT": ["Gpt", "сценарии и идеи", "scripts & ideas"], "HeyGen": ["Hg", "ИИ-аватары", "AI avatars"],
    "Claude": ["Cl", "код, сценарии, идеи", "code, scripts, ideas"], "VS Code": ["VS", "анимация кодом", "code animation"],
  };
  const AI = new Set(["Kling", "Higgsfield", "Midjourney", "Runway", "ChatGPT", "HeyGen", "Claude"]);
  let typing = 0;
  function typeLine(txt) {
    const el = $(".js-type"); clearInterval(typing);
    if (reduce) { el.textContent = txt; return; }
    let i = 0; el.textContent = "";
    typing = setInterval(() => { el.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(typing); }, 22);
  }
  function keys() {
    const b = $(".keys__board");
    b.innerHTML = SITE.tools.map((t) => { const k = KEYS[t] || [t.slice(0, 2), "", ""];
      return `<button class="key" type="button" data-t="${esc(t)}" data-ai="${AI.has(t) ? 1 : 0}" aria-label="${esc(t)}"><b>${k[0]}</b><span>${esc(t)}</span></button>`; }).join("");
    const press = (k) => {
      const t = k.dataset.t, d = KEYS[t] || ["", "", ""];
      k.classList.add("is-down"); setTimeout(() => k.classList.remove("is-down"), 140);
      typeLine(`> ${t} — ${App.lang() === "en" ? d[2] : d[1]}`);
      window.App.sfx && window.App.sfx("key");
    };
    $$(".key", b).forEach((k) => { k.addEventListener("click", () => press(k)); k.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") press(k); }); });
    $(".js-type").textContent = "> " + tr("tools.prompt");
    // «сама печатает», когда долистали
    onView(b, () => { if (reduce) return; const ks = $$(".key", b); [0, 6, 7, 12, 13].forEach((n, i) => setTimeout(() => ks[n] && press(ks[n]), 400 + i * 650)); });
  }

  /* ---------- Услуги ---------- */
  function services() {
    const en = App.lang() === "en";
    const EN = [["Social media videos", "Reels, Shorts, TikTok — from idea to edit."], ["AI video & characters", "Mascots, heroes and scenes you can’t film: Kling, Higgsfield, Midjourney, Runway."],
      ["Code-driven animation", "Videos built in VS Code with Claude: complex graphics, consistent series, changes in minutes."], ["Script & concept", "I’ll figure out what to say and how, break it down frame by frame and build a content plan."],
      ["Motion & editing", "The classics, no neural networks: logo animation, infographics, editing and sound — After Effects, Premiere Pro, Audition, CapCut."],
      ["Websites", "Landing pages, portfolios, promo and multi-page sites — clean and simple or with animation and 3D. Built together with AI, from idea and design to launch. Example: this site."]];
    $(".services__list").innerHTML = SITE.services.map((s, i) => { const [t, d] = en && EN[i] ? EN[i] : s;
      return `<li><span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`; }).join("");
  }

  /* ---------- Контакты: чек ---------- */
  function barcode(seed) {
    let s = seed, x = 0, r = "";
    while (x < 260) { s = (s * 9301 + 49297) % 233280; const w = 1 + (s % 4); if (s % 3) r += `<rect x="${x}" y="0" width="${w}" height="50"/>`; x += w + 1 + (s % 3); }
    return `<svg viewBox="0 0 260 50" preserveAspectRatio="none" aria-hidden="true">${r}</svg>`;
  }
  function receipt() {
    const c = SITE.contacts, d = new Date(), pad = (n) => String(n).padStart(2, "0");
    const no = `${d.getFullYear()}-${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    $(".receipt").innerHTML = `
      <h4>${tr("r.title")}</h4>
      <p class="c">${esc(L(SITE, "name"))}<br>${esc(L(SITE, "role"))}</p>
      <hr>
      <div class="row"><span>${tr("r.order")}</span><span>№ ${no}</span></div>
      <div class="row"><span>${tr("r.city")}</span><span>${tr("r.remote")}</span></div>
      <hr>
      <div class="row"><span>${tr("r.mail")}</span><span><a href="mailto:${c.email}">${c.email}</a></span></div>
      <div class="row"><span>${tr("r.tg")}</span><span><a href="https://t.me/${c.telegram}" target="_blank" rel="noopener">@${c.telegram}</a></span></div>
      <hr>
      <div class="row tot"><span>${tr("r.total")}</span><span>${tr("r.totalv")}</span></div>
      <hr>
      <p class="c">${tr("r.thanks")}</p>
      ${barcode(2021)}`;
  }
  const tgBtn = $(".js-tg-btn"); tgBtn.href = "https://t.me/" + SITE.contacts.telegram;
  $(".js-copy").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    App.sfx("success");
    try { await navigator.clipboard.writeText(SITE.contacts.email); } catch (err) {
      const t = document.createElement("textarea"); t.value = SITE.contacts.email; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    b.textContent = tr("contact.copied"); setTimeout(() => { b.textContent = tr("contact.copy"); }, 1800);
  });
  onView($(".receipt-wrap"), () => {
    const r = $(".receipt");
    if (reduce) { r.style.clipPath = "none"; return; }
    // чек «печатается»: выезжает из щели кассы рывками
    const o = { p: 100 };
    gsap.to(o, { p: 0, duration: 2.2, ease: "steps(18)", onUpdate: () => { r.style.clipPath = `inset(0 0 ${o.p}% 0)`; App.sfx("print"); } });
  }, 0.25);

  /* ---------- Появление блоков ---------- */
  if (!reduce) {
    $$(".about__head, .photo, .about__text, .carts, .keys, .services, .contact__left").forEach((el) => {
      gsap.set(el, { y: 30, opacity: 0 });
      onView(el, () => gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }), 0.15);
    });
  }

  function all() { texts(); carts(); keys(); services(); receipt(); }
  all();
  App.onLang(all);
})();
