/* Кейсы: вкладки-листы, лист с задачей / идеей / раскадровкой / процессом, лайтбокс для картинок */
(() => {
  const SITE = window.SITE, App = window.App;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const L = (o, k) => (App.lang() === "en" && o[k + "En"]) || o[k];
  const tr = App.tr;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cases = SITE.cases || [];
  const tabs = $(".cases__tabs"), sheet = $(".sheet");
  let cur = 0;

  function renderTabs() {
    tabs.innerHTML = cases.map((c, i) =>
      `<button class="btn ctab${i === cur ? " is-active" : ""}" role="tab" aria-selected="${i === cur}" data-i="${i}">
        <span class="mono">${tr("c.sheet")} ${c.sheet}</span><b>${esc(L(c, "title"))}</b></button>`).join("");
    $$(".ctab", tabs).forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));
  }
  function render() {
    const c = cases[cur], w = SITE.works.find((x) => x.id === c.work) || {};
    const board = L(c, "board"), did = L(c, "did");
    sheet.innerHTML = `
      <div class="sheet__top">
        <div class="sheet__block">
          <p class="mono">${tr("c.sheet")} ${c.sheet} / ${String(cases.length).padStart(2, "0")}</p>
          <div class="sheet__no">${c.sheet}</div>
          <h3 class="sheet__name">${esc(L(c, "title"))}</h3>
        </div>
        <div class="sheet__spec">
          <span>${tr("c.format")}</span><span>9:16 · 1080×1920</span>
          <span>${tr("c.dur")}</span><span>${esc(L(c, "duration"))}</span>
          <span>${tr("c.tools")}</span><span>${esc(w.tools || "")}</span>
          <span>${App.lang() === "en" ? "year" : "год"}</span><span>${w.year || ""}</span>
        </div>
      </div>
      <span class="stamp">${tr("c.ok")}</span>
      <div class="sheet__cols">
        <div><h4><i>01</i>${tr("c.task")}</h4><p>${esc(L(c, "task"))}</p></div>
        <div><h4><i>02</i>${tr("c.idea")}</h4><p>${esc(L(c, "idea"))}</p></div>
        <div><h4><i>03</i>${tr("c.did")}</h4><ul>${did.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
      </div>
      <div class="board">
        <h4><i>04</i>${tr("c.board")}</h4>
        <table>
          <thead><tr><th>#</th><th>${tr("c.voice")}</th><th>${tr("c.frame")}</th><th>${tr("c.move")}</th></tr></thead>
          <tbody>${board.map((r, i) => `<tr><td>${String(i + 1).padStart(2, "0")}</td><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <h4 style="margin-top:30px"><i>05</i>${tr("c.process")}</h4>
      <div class="figs">${c.figs.map((f, i) => `
        <button class="fig" type="button" data-src="assets/cases/${f[0]}" data-cap="${esc(App.lang() === "en" ? f[2] : f[1])}">
          <div class="fig__img"><img src="assets/cases/${f[0]}" alt="${esc(App.lang() === "en" ? f[2] : f[1])}" loading="lazy"></div>
          <figcaption><b>fig.${i + 1}</b>${esc(App.lang() === "en" ? f[2] : f[1])}</figcaption>
        </button>`).join("")}
      </div>
      <div class="sheet__foot">
        <p class="sheet__credits"><b>${tr("c.credits")}</b>${esc(L(c, "credits"))}</p>
        <button class="btn btn--solid js-watch" type="button">${tr("c.watch")}</button>
      </div>`;
    $(".js-watch", sheet).addEventListener("click", () => App.openWork && App.openWork(c.work));
    $$(".fig", sheet).forEach((f) => f.addEventListener("click", () => openLight(f.dataset.src, f.dataset.cap)));
  }
  function show(i) {
    if (i === cur && sheet.innerHTML) return;
    App.sfx("paper");
    cur = i; renderTabs();
    if (App.reduce || !window.gsap) { render(); return; }
    // смена листа: старый уезжает, новый «кладётся» на стол
    gsap.to(sheet, { y: 20, opacity: 0, rotate: -0.6, duration: 0.22, ease: "power2.in", onComplete: () => {
      render();
      gsap.fromTo(sheet, { y: -24, opacity: 0, rotate: 0.8 }, { y: 0, opacity: 1, rotate: 0, duration: 0.55, ease: "power3.out" });
      gsap.from(".stamp", { scale: 2.2, opacity: 0, duration: 0.45, delay: 0.35, ease: "back.out(2)" });
    } });
  }

  /* Лайтбокс */
  const lb = $(".lightbox");
  function openLight(src, cap) {
    $("img", lb).src = src; $("p", lb).textContent = cap;
    lb.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeLight() { lb.hidden = true; document.body.style.overflow = ""; }
  lb.addEventListener("click", closeLight);
  addEventListener("keydown", (e) => { if (!lb.hidden && e.key === "Escape") closeLight(); });

  if (!cases.length) { $(".cases").remove(); return; }
  renderTabs(); render();
  App.onLang(() => { renderTabs(); render(); });
})();
