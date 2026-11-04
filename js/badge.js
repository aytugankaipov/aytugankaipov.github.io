/*
  3D-бейдж на ленте (как в референсе 14).
  Физика — своя, в плоскости экрана: лента — цепочка точек (верле), карточка — жёсткий стержень
  «прорезь → низ карточки». Переворот — отдельная пружина вокруг вертикальной оси карточки.
  Снаружи: Badge.init(heroEl, badgeCanvas, ringCanvas) → { drop(), redraw(), setLang() }.
*/
(() => {
  const T = window.THREE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(hero, canvas, ringCanvas, opts) {
    if (!T) return null;
    const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    let lang = opts.lang || "ru";

    /* ---------- Рендер и свет ---------- */
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(24, 1, 0.1, 200);
    camera.position.set(0, 0, 20);

    // Окружение для бликов на пластике и металле: несколько светлых «софтбоксов»
    const pmrem = new T.PMREMGenerator(renderer);
    const env = new T.Scene();
    env.background = new T.Color(0x0c0c0e);
    const box = (w, h, x, y, z, ry, c) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }));
      m.position.set(x, y, z); m.rotation.y = ry; env.add(m);
    };
    box(6, 2, 0, 5, 3, 0, 0xffffff); box(2, 6, -6, 0, 2, Math.PI / 3, 0xcfd6ff); box(2, 5, 6, 1, 1, -Math.PI / 3, 0xfff1dd);
    box(10, 1, 0, -5, 4, 0, 0x555555);
    scene.environment = pmrem.fromScene(env, 0.035).texture;

    scene.add(new T.AmbientLight(0xffffff, 0.25));
    const key = new T.DirectionalLight(0xffffff, 1.15); key.position.set(-3, 6, 8); scene.add(key);
    const rim = new T.DirectionalLight(0xbfd0ff, 0.45); rim.position.set(6, 2, -4); scene.add(rim);

    /* ---------- Карточка (строится в единицах: высота = 1) ---------- */
    const CW = 0.7, CH = 1, CR = 0.05, DEPTH = 0.026, TOP = 0.135, SIDE = 0.045;
    const PW = CW - SIDE * 2, PH = CH - TOP - SIDE;
    const SLOT_Y = CH / 2 - 0.068;

    const rr = (w, h, r) => {
      const s = new T.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      return s;
    };
    const card = new T.Group();      // позиция и наклон в плоскости
    const spin = new T.Group();      // переворот вокруг вертикали карточки
    card.add(spin); scene.add(card);

    // Держатель: тёмный пластик с прорезью
    const holderShape = rr(CW, CH, CR);
    const slot = new T.Path(); { const w = 0.2, h = 0.026, x = -w / 2, y = SLOT_Y - h / 2, r = h / 2;
      slot.moveTo(x + r, y); slot.lineTo(x + w - r, y); slot.absarc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2, false);
      slot.lineTo(x + r, y + h); slot.absarc(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5, false); }
    holderShape.holes.push(slot);
    const holderGeo = new T.ExtrudeGeometry(holderShape, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 16 });
    holderGeo.translate(0, 0, -DEPTH / 2);
    const holderMat = new T.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.5, metalness: 0.0, clearcoat: 0.3, clearcoatRoughness: 0.45, envMapIntensity: 0.3 });
    spin.add(new T.Mesh(holderGeo, holderMat));

    // Бумажные вкладыши спереди и сзади + прозрачная плёнка с бликом
    const paperH = 1400, paperW = Math.round(paperH * PW / PH);
    const mkCanvas = () => { const c = document.createElement("canvas"); c.width = paperW; c.height = paperH; return c; };
    const frontCv = mkCanvas(), backCv = mkCanvas();
    const mkTex = (c) => { const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };
    const frontTex = mkTex(frontCv), backTex = mkTex(backCv);
    const paperY = CH / 2 - TOP - PH / 2;
    const paperGeo = new T.PlaneGeometry(PW, PH);
    const front = new T.Mesh(paperGeo, new T.MeshStandardMaterial({ map: frontTex, roughness: 0.85 }));
    front.position.set(0, paperY, DEPTH / 2 + 0.0075); spin.add(front);
    const back = new T.Mesh(paperGeo, new T.MeshStandardMaterial({ map: backTex, roughness: 0.85 }));
    back.position.set(0, paperY, -DEPTH / 2 - 0.0075); back.rotation.y = Math.PI; spin.add(back);
    const film = new T.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false });
    const filmGeo = new T.ShapeGeometry(rr(PW + 0.01, PH + 0.01, 0.012), 6);
    const f1 = new T.Mesh(filmGeo, film); f1.position.set(0, paperY, DEPTH / 2 + 0.009); spin.add(f1);
    const f2 = new T.Mesh(filmGeo, film); f2.position.set(0, paperY, -DEPTH / 2 - 0.009); f2.rotation.y = Math.PI; spin.add(f2);

    // Карабин: кольцо через прорезь + корпус застёжки + металлическая скоба ленты
    const metal = new T.MeshStandardMaterial({ color: 0xa4a4ac, metalness: 1, roughness: 0.25 });
    // Карабин из двух частей, как настоящий:
    //  ring — кольцо, продетое в прорезь; жёстко идёт вместе с карточкой (поворот и переворот);
    //  clasp — застёжка на шарнире: от верха кольца всегда тянется к концу ленты.
    const RING_R = 0.047;
    const ringG = new T.Group(); ringG.rotation.order = "ZYX"; scene.add(ringG);
    const ring = new T.Mesh(new T.TorusGeometry(RING_R, 0.0072, 14, 48), metal);
    ring.rotation.y = Math.PI / 2 - 0.55; ring.position.y = RING_R; ringG.add(ring);
    const claspG = new T.Group(); claspG.rotation.order = "ZYX"; scene.add(claspG);
    const clasp = new T.Mesh(new T.CylinderGeometry(0.011, 0.011, 1, 16), metal); claspG.add(clasp);
    const claspEye = new T.Mesh(new T.SphereGeometry(0.014, 16, 12), metal); claspG.add(claspEye);
    const crimp = new T.Mesh(new T.BoxGeometry(0.1, 0.03, 0.017), new T.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.6, roughness: 0.45 }));
    claspG.add(crimp);
    const CLIP_LEN = RING_R * 2 + 0.085; // от прорези до места, где начинается лента

    /* ---------- Лента ---------- */
    const strapCv = document.createElement("canvas"); strapCv.width = 128; strapCv.height = 2048;
    const strapTex = mkTex(strapCv); strapTex.wrapT = T.RepeatWrapping;
    const N = 16;                    // точек физики
    const SUB = 5;                   // сглаживание: сэмплов между точками
    const M = (N - 1) * SUB + 1;
    const sPos = new Float32Array(M * 2 * 3), sNor = new Float32Array(M * 2 * 3), sUv = new Float32Array(M * 2 * 2);
    const sIdx = [];
    for (let i = 0; i < M - 1; i++) { const a = i * 2; sIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const strapGeo = new T.BufferGeometry();
    strapGeo.setAttribute("position", new T.BufferAttribute(sPos, 3));
    strapGeo.setAttribute("normal", new T.BufferAttribute(sNor, 3));
    strapGeo.setAttribute("uv", new T.BufferAttribute(sUv, 2));
    strapGeo.setIndex(sIdx);
    const strapMat = new T.MeshStandardMaterial({ map: strapTex, roughness: 0.9, side: T.DoubleSide });
    const strap = new T.Mesh(strapGeo, strapMat); strap.frustumCulled = false; scene.add(strap);

    /* ---------- Размеры сцены ---------- */
    let VW, VH, S, L, SEG, anchor = new T.Vector2(), anchorFinal = new T.Vector2(), mobile;
    function layout() {
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio, w < 860 ? 1.5 : 1.75));
      renderer.setSize(w, h, false);
      ringCanvas.width = Math.round(w * Math.min(devicePixelRatio, 1.5)); ringCanvas.height = Math.round(h * Math.min(devicePixelRatio, 1.5));
      camera.aspect = w / h; camera.updateProjectionMatrix();
      VH = 2 * Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      VW = VH * camera.aspect;
      mobile = w < 860;
      S = mobile ? Math.min(VH * 0.31, VW * 0.55) : Math.min(VH * 0.42, VW * 0.27); // высота карточки в мире
      const ax = mobile ? -VW * 0.13 : VW * 0.2; // на телефоне чуть левее — справа фото
      anchorFinal.set(ax, VH / 2 + 0.3);
      L = mobile ? VH * 0.14 : VH * 0.33;
      SEG = L / (N - 1);
      card.scale.setScalar(S); ringG.scale.setScalar(S); claspG.scale.setScalar(S);
      strapW = S * 0.085;
    }
    let strapW = 0.1;

    /* ---------- Физика ---------- */
    const P = [], O = [], W = [];     // позиция, прошлая позиция, «лёгкость» (1/масса)
    for (let i = 0; i < N + 2; i++) { P.push(new T.Vector2()); O.push(new T.Vector2()); W.push(1); }
    // P[0..N-1] — лента (P[0] закреплена), P[N] — прорезь, P[N+1] — низ карточки
    const A = N, B = N + 1;
    W[0] = 0; W[A] = 0; W[N - 1] = 0.6; W[B] = 0.35;
    let rodLen, clipLen;
    function placeRest(offsetY) {
      rodLen = (SLOT_Y + CH / 2) * S; clipLen = CLIP_LEN * S;
      anchor.copy(anchorFinal); anchor.y += offsetY;
      for (let i = 0; i < N; i++) P[i].set(anchor.x, anchor.y - i * SEG);
      P[A].set(anchor.x, anchor.y - L - clipLen);
      P[B].set(anchor.x + 0.001, P[A].y - rodLen);
      for (let i = 0; i < N + 2; i++) O[i].copy(P[i]);
    }
    const tmp = new T.Vector2(), tmp2 = new T.Vector2();
    function dist(i, j, len, mode, stiff = 1) { // mode: 0 — ровно, 1 — не длиннее, -1 — не короче
      const a = P[i], b = P[j]; tmp.subVectors(b, a);
      const d = tmp.length() || 1e-6;
      if (mode === 1 && d <= len) return; if (mode === -1 && d >= len) return;
      const wa = W[i], wb = W[j], ws = wa + wb; if (!ws) return;
      const k = (d - len) / d / ws * stiff;
      a.addScaledVector(tmp, k * wa); b.addScaledVector(tmp, -k * wb);
    }
    const G = () => -VH * 2.4;
    const _d1 = new T.Vector2(), _d2 = new T.Vector2();
    // поворачивает b вокруг a так, чтобы угол между (a - prev) [или «вниз»] и (b - a) был не больше max
    function limitAngle(prev, a, b, max, ob) {
      if (prev) _d1.subVectors(a, prev); else _d1.set(0, -1);
      if (_d1.lengthSq() < 1e-8) return;
      _d2.subVectors(b, a);
      const a1 = Math.atan2(_d1.y, _d1.x), a2 = Math.atan2(_d2.y, _d2.x);
      let diff = a2 - a1; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      if (Math.abs(diff) <= max) return;
      const t = a1 + Math.sign(diff) * max, len = _d2.length();
      const nx = a.x + Math.cos(t) * len, ny = a.y + Math.sin(t) * len;
      // упор гасит скорость, а не добавляет её: прошлую позицию сдвигаем вместе с текущей
      ob.x += nx - b.x; ob.y += ny - b.y;
      b.set(nx, ny);
    }
    let drag = null, yaw = 0, yawV = 0, yawTarget = 0, ringPulse = 0;
    let ropeScale = 1;
    function step(dt) {
      const g = G();
      // лента плавно «вытягивается», если бейдж тянут вниз, и так же плавно возвращается
      let want = 1;
      if (drag) {
        want = T.MathUtils.clamp((drag.target.distanceTo(anchor) - (clipLen + rodLen) * drag.t) / L, 1, 1.45);
      }
      ropeScale += (want - ropeScale) * Math.min(1, dt * (drag ? 6 : 2.2));
      P[0].copy(anchor); O[0].copy(anchor);
      for (let i = 1; i < N + 2; i++) {
        tmp.subVectors(P[i], O[i]).multiplyScalar(0.992);
        O[i].copy(P[i]);
        P[i].add(tmp); P[i].y += g * dt * dt;
      }
      for (let it = 0; it < 14; it++) {
        const seg = SEG * ropeScale;
        for (let i = 0; i < N - 1; i++) dist(i, i + 1, seg, 0);
        // карточка вместе с карабином — одно жёсткое тело: от конца ленты (скоба) до низа карточки.
        // Лента может подходить к скобе под любым углом и просто изгибается — как в референсе
        dist(N - 1, B, clipLen + rodLen, 0);
        // карточка не перелетает «вверх ногами» при сильном раскачивании
        limitAngle(null, P[N - 1], P[B], 1.3, O[B]);
        if (drag) {
          // мягко ведём «схваченную» точку карточки к курсору
          const t = drag.t;
          tmp.set(P[N - 1].x + (P[B].x - P[N - 1].x) * t, P[N - 1].y + (P[B].y - P[N - 1].y) * t);
          tmp2.subVectors(drag.target, tmp).multiplyScalar(0.18);
          P[N - 1].addScaledVector(tmp2, 1 - t); P[B].addScaledVector(tmp2, t);
        }
      }
      // прорезь — на карточке, на фиксированном расстоянии от скобы
      tmp.subVectors(P[B], P[N - 1]).setLength(clipLen);
      P[A].copy(P[N - 1]).add(tmp); O[A].copy(P[A]);
      // Переворот: пружина к целевому углу + лёгкий доворот от бокового движения
      const vx = (P[B].x - O[B].x) / dt;
      yawV += ((yawTarget - yaw) * 38 - yawV * 7.5) * dt - vx / VW * 0.9 * dt * 60 * 0.05;
      yaw += yawV * dt;
      ringPulse = Math.max(0, ringPulse - dt * 0.27);
    }

    /* ---------- Обновление мешей ---------- */
    const cr = (p0, p1, p2, p3, t, out) => {
      const t2 = t * t, t3 = t2 * t;
      out.x = 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      out.y = 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      return out;
    };
    const samples = Array.from({ length: M }, () => new T.Vector2()), vEnd = new T.Vector2();
    const tan = new T.Vector3(), side = new T.Vector3(), nrm = new T.Vector3(), z = new T.Vector3(0, 0, 1);
    function update() {
      const dir = tmp.subVectors(P[B], P[A]);
      const angle = Math.atan2(dir.x, -dir.y);
      const f = (SLOT_Y) / (SLOT_Y + CH / 2); // центр карточки от прорези
      card.position.set(P[A].x + dir.x * f, P[A].y + dir.y * f, 0);
      card.rotation.z = angle;
      spin.rotation.y = yaw;
      spin.rotation.x = T.MathUtils.clamp((P[B].y - O[B].y) * -8 / S, -0.25, 0.25);
      // Кольцо — в прорези, по карточке
      ringG.position.set(P[A].x, P[A].y, 0);
      ringG.rotation.set(0, yaw, angle);
      // Верх кольца в мире (вверх по карточке), от него застёжка тянется к ленте
      const ux = -Math.sin(angle), uy = Math.cos(angle), rt = RING_R * 2 * S;
      const tx = P[A].x + ux * rt, ty = P[A].y + uy * rt;
      const len = CLIP_LEN - RING_R * 2;
      claspG.position.set(tx, ty, 0);
      claspG.rotation.set(0, yaw, angle); // застёжка — часть бейджа, смотрит вверх по карточке
      const cl = Math.max(0.01, len - 0.02);
      clasp.scale.y = cl; clasp.position.y = cl / 2;
      crimp.position.y = len - 0.005;
      // Лента: сглаженная кривая, полоса с поворотом к карточке внизу
      const pts = P.slice(0, N);
      vEnd.set(P[N - 1].x + ux * SEG, P[N - 1].y + uy * SEG);
      for (let i = 0; i < N - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = i + 2 <= N - 1 ? pts[i + 2] : vEnd;
        for (let s = 0; s < SUB; s++) cr(p0, p1, p2, p3, s / SUB, samples[i * SUB + s]);
      }
      samples[M - 1].copy(pts[N - 1]);
      let vAcc = 0;
      for (let i = 0; i < M; i++) {
        const a = samples[Math.max(i - 1, 0)], b = samples[Math.min(i + 1, M - 1)];
        tan.set(b.x - a.x, b.y - a.y, 0).normalize();
        side.crossVectors(tan, z).normalize();
        const u = i / (M - 1);
        const tw = yaw * Math.pow(u, 1.3); // лента перекручивается вместе с бейджем: у верха — почти нет, у карабина — полностью
        side.multiplyScalar(Math.cos(tw)).addScaledVector(z, Math.sin(tw));
        nrm.crossVectors(side, tan).normalize();
        const p = samples[i];
        if (i > 0) vAcc += samples[i].distanceTo(samples[i - 1]);
        const k = i * 6, hw = strapW / 2;
        const zb = -S * 0.06 * (1 - T.MathUtils.smoothstep(u, 0.92, 1)); // выше — за карточкой, у карабина выходит точно к застёжке
        sPos[k] = p.x - side.x * hw; sPos[k + 1] = p.y - side.y * hw; sPos[k + 2] = -side.z * hw + zb;
        sPos[k + 3] = p.x + side.x * hw; sPos[k + 4] = p.y + side.y * hw; sPos[k + 5] = side.z * hw + zb;
        sNor.set([nrm.x, nrm.y, nrm.z, nrm.x, nrm.y, nrm.z], k);
        const v = vAcc / (strapW * 16);
        sUv.set([0, v, 1, v], i * 4);
      }
      strapGeo.attributes.position.needsUpdate = true;
      strapGeo.attributes.normal.needsUpdate = true;
      strapGeo.attributes.uv.needsUpdate = true;
    }

    /* ---------- Текстуры ---------- */
    function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
    function barcode(c, x, y, w, h, color, seed) {
      c.fillStyle = color; let s = seed, cx = x;
      while (cx < x + w) { s = (s * 9301 + 49297) % 233280; const bw = 2 + (s % 5); if (s % 3) c.fillRect(cx, y, bw, h); cx += bw + 2 + (s % 3); }
    }
    function fitText(c, text, font, maxW, size) {
      c.font = font.replace("{s}", size);
      const w = c.measureText(text).width;
      if (w > maxW) { size = Math.floor(size * maxW / w); c.font = font.replace("{s}", size); }
      return size;
    }
    function drawPaper(cv, side) {
      const c = cv.getContext("2d"), sc = cv.height / 1100, w = cv.width / sc, h = 1100, m = 52, a = css("--accent");
      c.setTransform(sc, 0, 0, sc, 0, 0);
      const D = css("--display").split(",")[0].replace(/['"]/g, "").trim(), DW = css("--display-w") || "800";
      const S_ = window.SITE, en = lang === "en";
      // бумага с лёгким зерном
      c.fillStyle = "#f2f0ea"; c.fillRect(0, 0, w, h);
      const img = c.getImageData(0, 0, cv.width, cv.height), d = img.data;
      for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      c.putImageData(img, 0, 0);
      c.textBaseline = "alphabetic";
      c.fillStyle = "#57544e"; c.font = "600 28px 'IBM Plex Mono'";
      c.fillText(en ? "PORTFOLIO PASS" : "ПРОПУСК", m, m + 22);
      c.textAlign = "right"; c.fillText(String(new Date().getFullYear()), w - m, m + 22); c.textAlign = "left";
      if (side === "front") {
        // «иконка приложения» с треугольником Play
        const ix = m, iy = 150, is = 168;
        c.fillStyle = "#151517"; roundRect(c, ix, iy, is, is, 38); c.fill();
        c.fillStyle = a; c.beginPath(); c.moveTo(ix + is * 0.38, iy + is * 0.28); c.lineTo(ix + is * 0.38, iy + is * 0.72); c.lineTo(ix + is * 0.74, iy + is * 0.5); c.closePath(); c.fill();
        // имя
        const name = (en ? S_.nameEn : S_.name).split(" ");
        c.fillStyle = "#141414";
        if ("letterSpacing" in c) c.letterSpacing = D === "Oswald" ? "0px" : "-4px";
        const font = `${DW} {s}px '${D}'`;
        const size = Math.min(fitText(c, name[0].toUpperCase(), font, w - m * 2, 128), fitText(c, name[1].toUpperCase(), font, w - m * 2, 128));
        c.font = font.replace("{s}", size);
        const y0 = h * 0.62;
        c.fillText(name[0].toUpperCase(), m - 4, y0 - size * 0.98); c.fillText(name[1].toUpperCase(), m - 4, y0);
        if ("letterSpacing" in c) c.letterSpacing = "0px";
        c.fillStyle = "#3d3b37"; c.font = "500 44px Inter";
        c.fillText(en ? S_.roleEn : S_.role, m, y0 + 66);
        c.fillStyle = "#cfccc3"; c.fillRect(m, h - 172, w - m * 2, 2);
        c.fillStyle = "#3f3d38"; c.font = "600 30px 'IBM Plex Mono'";
        c.fillText(en ? "MOTION · AI · CODE" : "МОУШН · ИИ · КОД", m, h - 128);
        c.textAlign = "right"; c.fillText(en ? "UFA, RU" : "УФА, РФ", w - m, h - 128); c.textAlign = "left";
        barcode(c, m, h - 110, 330, 64, "#111", 7);
        c.font = "600 28px 'IBM Plex Mono'"; c.fillText("ID-" + S_.since, m, h - 18);
        c.textAlign = "right"; c.fillStyle = a === "#ffd23d" || a === "#c8ff3d" ? "#141414" : a;
        c.fillText(en ? "TAP ↻" : "НАЖМИ ↻", w - m, h - 18); c.textAlign = "left";
      } else {
        c.fillStyle = "#141414";
        if ("letterSpacing" in c) c.letterSpacing = "-2px";
        const lines = en ? ["I make videos", "people watch", "to the end."] : ["Делаю ролики,", "которые", "досматривают."];
        let size = 84; c.font = `700 ${size}px Inter`;
        const mw = Math.max(...lines.map((l) => c.measureText(l).width));
        if (mw > w - m * 2) { size = Math.floor(size * (w - m * 2) / mw); c.font = `700 ${size}px Inter`; }
        lines.forEach((l, i) => { c.fillStyle = i === 2 ? a : "#141414"; if (i === 2) { c.fillStyle = "#141414"; } c.fillText(l, m, 260 + i * size * 1.08); });
        // подчёркивание последней строки акцентом
        c.fillStyle = a; c.fillRect(m, 260 + 2 * size * 1.08 + 14, c.measureText(lines[2]).width, 8);
        if ("letterSpacing" in c) c.letterSpacing = "0px";
        c.fillStyle = "#3f3d38"; c.font = "600 34px 'IBM Plex Mono'";
        c.fillText(en ? "idea → script → frame" : "идея → сценарий → кадр", m, h * 0.62);
        c.fillText("t.me/" + S_.contacts.telegram, m, h * 0.62 + 50);
        barcode(c, m, h - 175, w - m * 2, 90, "#111", 21);
        c.font = "600 31px 'IBM Plex Mono'"; c.fillText(S_.contacts.email, m, h - 40);
      }
    }
    function drawStrap() {
      const c = strapCv.getContext("2d"), w = strapCv.width, h = strapCv.height, a = css("--accent");
      c.fillStyle = "#151517"; c.fillRect(0, 0, w, h);
      // переплетение ткани
      for (let y = 0; y < h; y += 3) { c.fillStyle = y % 6 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.25)"; c.fillRect(0, y, w, 1); }
      for (let x = 0; x < w; x += 4) { c.fillStyle = "rgba(255,255,255,.025)"; c.fillRect(x, 0, 1, h); }
      // строчка по краям
      c.strokeStyle = "rgba(255,255,255,.18)"; c.setLineDash([10, 8]); c.lineWidth = 2;
      c.beginPath(); c.moveTo(9, 0); c.lineTo(9, h); c.moveTo(w - 9, 0); c.lineTo(w - 9, h); c.stroke(); c.setLineDash([]);
      // повторяющийся текст вдоль ленты
      c.save(); c.translate(w / 2, h); c.rotate(-Math.PI / 2);
      c.fillStyle = a; c.font = "600 50px 'IBM Plex Mono'"; c.textBaseline = "middle";
      const t = (window.SITE.nameEn.toUpperCase() + "  ✦  MOTION DESIGN  ✦  ");
      let x = 0; const tw = c.measureText(t).width;
      while (x < h) { c.fillText(t, x, 2); x += tw; }
      c.restore();
      strapTex.needsUpdate = true;
    }
    let dotColor = "#ece9e2";
    function redraw() { dotColor = css("--dot"); drawPaper(frontCv, "front"); drawPaper(backCv, "back"); drawStrap(); frontTex.needsUpdate = backTex.needsUpdate = true; }

    /* ---------- Halftone-кольцо за бейджем ---------- */
    const rc = ringCanvas.getContext("2d");
    const proj = new T.Vector3();
    // Кольцо из «напылённых» точек: случайный порог для каждой точки сетки даёт стохастическое зерно
    const HASH = new Float32Array(4096); for (let i = 0; i < HASH.length; i++) HASH[i] = Math.random();
    // Волна из «напылённых» точек: появляется при перевороте и уходит за края экрана
    let ringDrawn = false;
    function drawRing(t) {
      const w = ringCanvas.width, h = ringCanvas.height, k = w / hero.clientWidth;
      if (ringPulse <= 0) { if (ringDrawn) { rc.clearRect(0, 0, w, h); ringDrawn = false; } return; }
      ringDrawn = true;
      rc.clearRect(0, 0, w, h);
      proj.set(card.position.x, card.position.y, 0).project(camera);
      const cx = (proj.x * 0.5 + 0.5) * w, cy = (-proj.y * 0.5 + 0.5) * h;
      const cardPx = (S / VH) * h;
      const far = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + cardPx;
      const pr = 1 - ringPulse, e = 1 - Math.pow(1 - pr, 1.6);           // easeOut
      const R = cardPx * 0.45 + (far - cardPx * 0.45) * e;
      const band = cardPx * (0.12 + 0.25 * e);
      const alpha = Math.min(1, ringPulse * 3);
      const step = 3.2 * k, reach = R + band * 3, inner = Math.max(0, R - band * 3);
      rc.fillStyle = dotColor;
      const x0 = Math.max(0, cx - reach), x1 = Math.min(w, cx + reach), y0 = Math.max(0, cy - reach), y1 = Math.min(h, cy + reach);
      const ts = t * 0.001;
      let n = 0;
      for (let y = y0 - (y0 % step); y < y1; y += step) {
        for (let x = x0 - (x0 % step); x < x1; x += step) {
          n++;
          const dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
          if (d > reach || d < inner) continue;
          const an = Math.atan2(dy, dx);
          const wob = Math.sin(an * 5 + ts * 0.7) * 0.04 + Math.sin(an * 9 - ts * 1.1) * 0.02;
          const q = (d - R * (1 + wob)) / band;
          const v = Math.exp(-q * q) * 0.95;
          const hsh = HASH[((x / step) * 73 + (y / step) * 151) & 4095];
          if (v < 0.04 || hsh > v) continue;
          rc.globalAlpha = (0.25 + 0.5 * v) * alpha;
          rc.fillRect(x + (HASH[(n * 7) & 4095] - 0.5) * step, y + (HASH[(n * 13) & 4095] - 0.5) * step, 1.3 * k, 1.3 * k);
        }
      }
      rc.globalAlpha = 1;
    }

    /* ---------- Мышь / палец ---------- */
    const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 0, 1), 0), hit3 = new T.Vector3();
    const hitMeshes = spin.children.concat([ring, clasp, crimp]);
    function toNdc(e) { const r = hero.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
    function worldPoint() { ray.ray.intersectPlane(plane, hit3); return new T.Vector2(hit3.x, hit3.y); }
    function hitTest(e) { toNdc(e); return ray.intersectObjects(hitMeshes, false).length > 0; }
    let hovering = false;
    function start(e) {
      if (!ready || !hitTest(e)) return false;
      const wp = worldPoint();
      // где на карточке схватили: 0 — прорезь, 1 — низ
      tmp.subVectors(P[B], P[N - 1]); const len = tmp.length();
      const t = T.MathUtils.clamp(tmp2.subVectors(wp, P[N - 1]).dot(tmp) / (len * len), 0.12, 1);
      touched(); window.App && App.sfx("grab");
      drag = { t, target: wp, x: e.clientX, y: e.clientY, time: performance.now(), moved: 0, id: e.pointerId };
      canvas.classList.add("is-drag"); hero.style.cursor = "grabbing";
      return true;
    }
    function move(e) {
      if (!drag) {
        if (e.pointerType === "mouse" && ready) { const h = hitTest(e); if (h !== hovering) { hovering = h; hero.style.cursor = h ? "grab" : ""; } }
        return;
      }
      drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y));
      toNdc(e); const wp = worldPoint();
      // не даём утянуть дальше, чем позволяет лента
      tmp.subVectors(wp, anchor); const max = L * 1.45 + (clipLen + rodLen) * drag.t;
      if (tmp.length() > max) tmp.setLength(max);
      const minDown = L * 0.6 + (clipLen + rodLen) * drag.t * 0.8;
      if (-tmp.y < minDown) tmp.y = -minDown;
      drag.target.copy(anchor).add(tmp);
    }
    function end() {
      if (!drag) return;
      if (drag.moved < 6 && performance.now() - drag.time < 400) flip();
      drag = null; canvas.classList.remove("is-drag"); hero.style.cursor = hovering ? "grab" : "";
    }
    function touched() { interacted = true; tipEl && tipEl.classList.remove("is-on"); }
    function flip() { yawTarget = yawTarget === 0 ? Math.PI : 0; ringPulse = 1; window.App && App.sfx("flip"); } // обратно — в другую сторону, лента раскручивается
    hero.addEventListener("pointerdown", (e) => { if (e.pointerType !== "touch" && start(e)) e.preventDefault(); });
    hero.addEventListener("touchstart", (e) => {
      const t = e.touches[0]; if (t && start({ clientX: t.clientX, clientY: t.clientY, pointerId: "touch" })) e.preventDefault();
    }, { passive: false });
    hero.addEventListener("touchmove", (e) => { if (drag) { e.preventDefault(); const t = e.touches[0]; move({ clientX: t.clientX, clientY: t.clientY }); } }, { passive: false });
    hero.addEventListener("touchend", end);
    addEventListener("pointermove", move);
    addEventListener("pointerup", end);
    addEventListener("pointercancel", end);

    /* ---------- Цикл ---------- */
    // подсказка «нажми или потяни» едет рядом с бейджем; пока никто не трогал — бейдж иногда слегка качается
    const tipEl = opts.tip; let interacted = false, nextNudge = 0;
    const tp = new T.Vector3();
    function placeTip(t) {
      if (!tipEl || interacted || !ready) return;
      if (!nextNudge) nextNudge = t + 3500;
      if (t > nextNudge && !drag && !reduce) { O[B].x -= S * 0.006; nextNudge = t + 5000; }
      // под бейджем, по центру; не выходит за края экрана
      const r = hero.getBoundingClientRect();
      tp.set(card.position.x, card.position.y, 0).project(camera);
      const cx = (tp.x * 0.5 + 0.5) * r.width;
      tp.set(P[B].x, Math.min(P[B].y, P[N - 1].y - (rodLen + clipLen) * 0.95), 0).project(camera);
      const by = (-tp.y * 0.5 + 0.5) * r.height;
      const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
      const x = Math.max(16, Math.min(r.width - tw - 16, cx - tw / 2));
      const kick = hero.querySelector(".hero__kicker"), kTop = kick ? kick.getBoundingClientRect().top - r.top - th - 10 : r.height;
      const y = Math.max(70, Math.min(r.height - th - 16, kTop, by + 22)); // не наезжает на текст под бейджем
      tipEl.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    }
    let wasStill = false;
    let ready = false, visible = true, running = false, last = 0, acc = 0, hidden = true;
    const DT = 1 / 120;
    function frame(t) {
      if (!visible) { running = false; return; }
      acc += Math.min(0.05, (t - last) / 1000); last = t;
      while (acc >= DT) { step(DT); acc -= DT; }
      update();
      // бейдж замер — не перерисовываем 3D впустую (экономит батарею и убирает лаги на телефоне)
      let motion = Math.abs(yawV) + Math.abs(yawTarget - yaw);
      for (let i = N - 4; i < N + 2; i++) motion += Math.abs(P[i].x - O[i].x) + Math.abs(P[i].y - O[i].y);
      const still = !drag && ringPulse <= 0 && motion < S * 0.00015;
      if (!hidden && (!still || !wasStill)) { renderer.render(scene, camera); drawRing(t); }
      if (!hidden) placeTip(t);
      wasStill = still;
      requestAnimationFrame(frame);
    }
    function run() { if (!running && visible) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; run(); }).observe(hero);
    let rT;
    // адресная строка телефона шлёт resize при прокрутке, а первый экран (svh) не меняется — бейдж не перестраиваем
    let lw = hero.clientWidth, lh = hero.clientHeight;
    addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => {
      if (hero.clientWidth === lw && hero.clientHeight === lh) return;
      lw = hero.clientWidth; lh = hero.clientHeight; layout(); placeRest(0);
    }, 120); });

    layout(); placeRest(VH * 1.4);
    update();

    return {
      // Падение сверху: точка крепления едет вниз из-за экрана, бейдж догоняет и раскачивается
      drop() {
        hidden = false; ready = true;
        if (reduce) { placeRest(0); tipEl && tipEl.classList.add("is-on"); return; }
        // свободное падение: точка крепления падает с ускорением g, бейдж падает вместе с ней,
        // в конце крепление останавливается — лента натягивается и «ловит» бейдж
        const D = L + clipLen + rodLen + VH * 0.15;
        placeRest(D);
        // вся конструкция отклонена от вертикали — бейдж приходит с размаха и раскачивается
        const th = 0.55, c = Math.cos(th), sn = Math.sin(th);
        for (let i = 1; i < N + 2; i++) {
          const dx = P[i].x - anchor.x, dy = P[i].y - anchor.y;
          P[i].set(anchor.x + dx * c - dy * sn, anchor.y + dx * sn + dy * c); O[i].copy(P[i]);
        }
        const dur = Math.sqrt((2 * D) / -G());
        const s = { y: D };
        gsap.to(s, { y: 0, duration: dur, ease: "power2.in", onUpdate: () => { anchor.set(anchorFinal.x, anchorFinal.y + s.y); },
          onComplete: () => {
            anchor.copy(anchorFinal); window.App && App.sfx("thud");
            setTimeout(() => { if (!interacted && tipEl) tipEl.classList.add("is-on"); }, 900);
            for (let i = 1; i < N + 2; i++) { tmp.subVectors(P[i], O[i]).multiplyScalar(0.45); O[i].subVectors(P[i], tmp); }
          } });
        run();
      },
      redraw, setLang(l) { lang = l; redraw(); }, flip,
    };
  }

  window.Badge = { init };
})();
