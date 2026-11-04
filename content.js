/*
  ФАЙЛ-СПИСОК: тексты о себе и работы.
  Чтобы добавить работу — положите видео в assets/works/ и скопируйте один блок { ... } в works.
  Порядок блоков = порядок на сайте. Код сайта править не нужно.

  Поля работы:
    id      — короткое имя файла без расширения (w11-novaya)
    title   — название на сайте
    titleEn, aboutEn — то же по-английски (для переключателя EN)
    tag     — раздел: "Код + ИИ" или "ИИ-видео" (у «ИИ-видео» на сайте подпись «ИИ-генерация»)
    year    — год
    about   — 1–2 предложения: задача и что делал
    tools   — инструменты через запятую
  Видео ищется по id: assets/works/<id>.mp4, <id>-preview.mp4 (4 с, без звука), <id>-poster.jpg
*/
window.SITE = {
  name: "Айтуган Каипов",
  nameEn: "Aytugan Kaipov",
  role: "Моушн-дизайнер",
  roleEn: "Motion designer",
  city: "Уфа",
  since: 2021,
  lead: "Моушн-дизайнер и креативный технолог из Уфы. Делаю ролики, которые досматривают: от идеи и сценария до финального кадра. Работаю на стыке моушна, кода и нейросетей.\nА ещё собираю сайты кодом — как этот.",
  leadEn: "Motion designer and creative technologist from Ufa. I make videos people watch to the end — from idea and script to the final frame. I work where motion, code and neural networks meet.\nI also build websites with code — like this one.",
  contacts: {
    email: "aytugankaipov@gmail.com",
    telegram: "Vopiak_ya",
    phone: "+7 925 685-47-64"
  },
  services: [
    ["Ролики для соцсетей", "Reels, Shorts, TikTok — от идеи до монтажа."],
    ["ИИ-видео и персонажи", "Маскоты, герои и сцены, которые не снять на камеру: Kling, Higgsfield, Midjourney, Runway."],
    ["Анимация кодом", "Ролики в VS Code вместе с Claude: сложная графика, серии в одном стиле, правки за минуты."],
    ["Сценарий и концепция", "Придумаю, о чём и как рассказать, распишу по кадрам и соберу контент-план."],
    ["Моушн и монтаж", "Классика без нейросетей: анимация логотипов, инфографика, монтаж и звук — After Effects, Premiere Pro, Audition, CapCut."],
    ["Сайты", "Лендинги, портфолио, промо и многостраничные сайты — строгие или с анимацией и 3D. Делаю вместе с ИИ: от идеи и дизайна до публикации. Пример — этот сайт."]
  ],
  // Обо мне: короткий текст и опыт (картриджи). Названия компаний не пишем.
  about: "С 2021 года занимаюсь моушн-дизайном и монтажом. Создаю проект от и до: придумываю концепцию, пишу сценарий и раскадровку, собираю графику — руками, кодом или в нейросетях, смотря что лучше сработает. Монтирую и свожу звук. Код для меня — такой же инструмент, как After Effects: так получаются серии роликов в одном стиле и правки за минуты, а не за дни. Тем же способом делаю сайты.",
  aboutEn: "I’ve been doing motion design and video editing since 2021. I build a project from start to finish: I come up with the concept, write the script and storyboard, and make the graphics — by hand, with code or with neural networks, whichever works best. I edit and mix the sound. Code is as much a tool for me as After Effects: that’s how I get series of videos in one style and edits in minutes, not days. I build websites the same way.",
  experience: [
    { years: "2026 — сейчас", yearsEn: "2026 — now", role: "Моушн-дизайнер, креативный технолог и ИИ-\u2060специалист", roleEn: "Motion designer, creative technologist & AI specialist",
      where: "проектная работа", whereEn: "project-based",
      text: "Ролики под любой формат и задачу: сценарий, коллаж, изометрия, кинетическая типографика, монтаж. Анимация кодом в VS Code + Claude, генерации в любых нейросетях — Kling, Higgsfield, Midjourney, Runway и других.",
      textEn: "Videos in any format, for any task: script, collage, isometry, kinetic type, editing. Code-driven animation in VS Code + Claude, generation in any neural network — Kling, Higgsfield, Midjourney, Runway and more." },
    { years: "2025 — 2026", yearsEn: "2025 — 2026", role: "Моушн-дизайнер, монтажёр и ИИ-\u2060специалист", roleEn: "Motion designer, editor & AI specialist",
      where: "SocialFi-платформа коротких видео", whereEn: "SocialFi short-video platform",
      text: "Ролики от идеи до монтажа, концепции и контент-план. ИИ-персонажи и маскоты, промо, предметка, UGC. Монтаж в Premiere Pro и CapCut; Kling, Higgsfield, Midjourney, Runway, Sora, HeyGen; сценарии и идеи — ChatGPT и Claude.",
      textEn: "Videos from idea to edit, concepts and content plans. AI characters and mascots, promo, product shots, UGC. Editing in Premiere Pro and CapCut; Kling, Higgsfield, Midjourney, Runway, Sora, HeyGen; scripts and ideas with ChatGPT and Claude." },
    { years: "2021 — 2025", yearsEn: "2021 — 2025", role: "Моушн-дизайнер, монтажёр и графический дизайнер", roleEn: "Motion designer, editor & graphic designer",
      where: "проектная работа", whereEn: "project-based",
      text: "Промо и анимационные ролики, анимация логотипов, инфографика, сценарии и раскадровки, съёмка.",
      textEn: "Promo and animated videos, logo animation, infographics, scripts and storyboards, shooting." }
  ],
  tools: ["After Effects", "Premiere Pro", "Photoshop", "Illustrator", "Figma", "CapCut",
          "Kling", "Higgsfield", "Midjourney", "Runway", "ChatGPT", "HeyGen", "Claude", "VS Code"],

  works: [
    { id: "w11-reel", title: "Не в этот раз", tag: "Код + ИИ", year: 2026,
      about: "Десять стилей в одном ролике: комикс, неон, LED, ASCII, тушь, карта Уфы, пиксель-арт, 3D и живопись. 5% — генерация, 95% — код.",
      titleEn: "Not this time",
      aboutEn: "Ten styles in one video: comic, neon, LED, ASCII, ink, a map of Ufa, pixel art, 3D and painting. 5% generated, 95% code.",
      tools: "VS Code, Claude, Three.js, Higgsfield, Epidemic Sound" },
    { id: "w00-showreel", title: "Всё за 40 секунд", tag: "Шоурил", year: 2026,
      about: "Лучшие моменты из всех работ: анимация кодом, коллаж, ИИ-персонажи, предметка и кинематограф.",
      titleEn: "All in 40 seconds",
      aboutEn: "The best moments from all my work: code-driven animation, collage, AI characters, product and cinematic shots.",
      tools: "VS Code, Claude, Kling, Higgsfield, Midjourney, Premiere Pro" },
    { id: "w01-chernyi-yashik", title: "Он что, ещё не ушёл?", tag: "Код + ИИ", year: 2026,
      about: "Авиация, небо и решения в бизнесе: фото-коллаж, бумага и крупная типографика.",
      titleEn: "“Hasn’t he left yet?”",
      aboutEn: "Aviation, sky and business decisions: photo collage, paper and bold typography.",
      tools: "VS Code, Claude, Higgsfield" },
    { id: "w02-yaponiya", title: "Бизнес на 300 лет", tag: "Код + ИИ", year: 2026,
      about: "Японская эстетика: свитки, тушь, бумага и красное солнце.",
      titleEn: "A 300-year-old business",
      aboutEn: "Japanese aesthetics: scrolls, ink, paper and a red sun.",
      tools: "VS Code, Claude, Higgsfield" },
    { id: "w04-12mln", title: "Опыт уходит на пенсию", tag: "Код + ИИ", year: 2026,
      about: "Тёплый архивный коллаж: картотека, документы, старые фото и таблица на бумаге.",
      titleEn: "Experience is retiring",
      aboutEn: "A warm archive collage: card files, documents, old photos and a table on paper.",
      tools: "VS Code, Claude, Higgsfield" },
    { id: "w06-primerka", title: "Почему вы вернули покупку", tag: "Код + ИИ", year: 2026,
      about: "Как устроены покупки онлайн: предметы, ценники и коробки на чёрном фоне.",
      titleEn: "Why you returned it",
      aboutEn: "How online shopping works: objects, price tags and boxes on black.",
      tools: "VS Code, Claude, Higgsfield" },
    { id: "w07-kollazh", title: "Бумага, скотч и код", tag: "Код + ИИ", year: 2026,
      about: "Нарезка из серии роликов: изометрия, бумажный коллаж и кинетическая типографика.",
      titleEn: "Paper, tape and code",
      aboutEn: "A cut from a video series: isometry, paper collage and kinetic typography.",
      tools: "VS Code, Claude" },
    { id: "w09-personazhi", title: "Никого из них не существует", tag: "ИИ-видео", year: 2025,
      about: "Циклоп на скейте, свинка за рулём, пингвин на закате, пришельцы и ИИ-героини — персонажи для коротких видео.",
      titleEn: "None of them exist",
      aboutEn: "A cyclops on a skateboard, a pig at the wheel, a penguin at sunset, aliens and AI heroines — characters for short videos.",
      tools: "Kling, Higgsfield, Midjourney" },
    { id: "w08-predmetka", title: "Это не снимали на камеру", tag: "ИИ-видео", year: 2025,
      about: "Ржавеющий под водой телефон, НЛО, лапша, Эйнштейн с селфи-палкой — предметные ИИ-сцены.",
      titleEn: "Never filmed on camera",
      aboutEn: "A phone rusting underwater, a UFO, noodles, Einstein with a selfie stick — AI product scenes.",
      tools: "Kling, Higgsfield, Runway" },
    { id: "w10-kino", title: "Кино без съёмочной группы", tag: "ИИ-видео", year: 2025,
      about: "Полёт над облаками, лошадь в пустыне, дорога у моря, ночной город — кинематографичные ИИ-сцены.",
      titleEn: "Cinema without a film crew",
      aboutEn: "A flight above the clouds, a horse in the desert, a seaside road, a night city — cinematic AI scenes.",
      tools: "Kling, Higgsfield, Sora" }
  ]
};

/*
  КЕЙСЫ — подробные разборы. work — id работы из списка выше (кнопка «смотреть ролик»).
  Картинки процесса лежат в assets/cases/. Поля *En — английская версия.
*/
window.SITE.cases = [
  {
    work: "w11-reel", sheet: "00", duration: "40 с", durationEn: "40 s",
    title: "Не в этот раз", titleEn: "Not this time",
    task: "Ролик-визитка для портфолио: за 40 секунд показать все стили, но связать их одной историей, а не нарезкой.",
    taskEn: "A calling-card video for the portfolio: show every style in 40 seconds, tied together by one story instead of a montage.",
    idea: "«Три секунды — и ты листаешь дальше». Таймер в углу считает время, а каждый новый мир не даёт отвлечься. В конце — «Не в этот раз».",
    ideaEn: "“Three seconds, and you scroll past.” A timer in the corner counts the seconds while each new world keeps you watching. At the end: “Not this time.”",
    did: ["сценарий и раскадровка", "5 ключевых картинок и 3D-модель (Higgsfield)", "всё движение, переходы и 3D — кодом (Python + Three.js)", "звуковой дизайн и сведение"],
    didEn: ["script and storyboard", "5 key images and a 3D model (Higgsfield)", "all motion, transitions and 3D in code (Python + Three.js)", "sound design and mix"],
    board: [
      ["Three seconds, and you scroll past.", "делориан ночью, таймер 0:03 → 0:00", "вспышка фар ровно на дропе"],
      ["(музыка)", "зелёные диоды светофора", "«разрешение растёт» в бит — из диодов собирается LED-существо"],
      ["(музыка)", "глобус тушью поворачивается к Уфе", "наезд на красную точку → открытка Уфы по данным OpenStreetMap"],
      ["(музыка)", "смэш пиксельным мячом в камеру", "мяч сжимается в красную клавишу 3D-гаджета"],
      ["Not this time.", "автор за работой, живопись", "дыхание света, пыль в луче, огоньки на технике"]
    ],
    boardEn: [
      ["Three seconds, and you scroll past.", "a DeLorean at night, timer 0:03 → 0:00", "headlight flash right on the drop"],
      ["(music)", "the green LEDs of a traffic light", "“resolution rising” on the beat — the LEDs build an LED creature"],
      ["(music)", "an ink globe turns to Ufa", "push-in on a red dot → a postcard of Ufa from OpenStreetMap data"],
      ["(music)", "a pixel ball smashed into the camera", "the ball shrinks into the red key of a 3D gadget"],
      ["Not this time.", "the author at work, painting", "breathing light, dust in the beam, blinking LEDs"]
    ],
    figs: [
      ["c0-transitions.jpg", "Переходы вытекают из кадра: диоды → существо, глобус → Уфа, мяч → клавиша", "Transitions grow out of the frame: LEDs → creature, globe → Ufa, ball → key"],
      ["c0-ascii.jpg", "3D-модель акулы → свет и противотень → символы на сетке", "A 3D shark model → light and countershading → characters on a grid"],
      ["c0-board.jpg", "Все десять миров: комикс, неон, LED, ASCII, тушь, карта, пиксель-арт, 3D, живопись, голограмма", "All ten worlds: comic, neon, LED, ASCII, ink, map, pixel art, 3D, painting, hologram"]
    ],
    credits: "Музыка: Dylan Sitts — «Daytona Dystopia», голос и звуки — Epidemic Sound. Карта: © участники OpenStreetMap (ODbL). Материки: Natural Earth.",
    creditsEn: "Music: Dylan Sitts — “Daytona Dystopia”, voice and sound effects — Epidemic Sound. Map: © OpenStreetMap contributors (ODbL). Continents: Natural Earth."
  },
  {
    work: "w01-chernyi-yashik", sheet: "01", duration: "49 с", durationEn: "49 s",
    title: "Он что, ещё не ушёл?", titleEn: "“Hasn’t he left yet?”",
    task: "Короткий вертикальный ролик для соцсетей: объяснить, как бизнес находит слабые места. Без стоков — только архивные подлинники и генерации.",
    taskEn: "A short vertical video for social media about how a business finds its weak spots. No stock footage — only archival originals and generated layers.",
    idea: "Катастрофа на Тенерифе, 1977. Сломались не самолёты и не навыки, а то, как люди в кабине говорят друг с другом. Авиация разобрала это как бизнес — и поменяла правила.",
    ideaEn: "Tenerife, 1977. It wasn’t the planes or the skills that failed — it was how people in the cockpit talked to each other. Aviation treated it like a business problem and changed the rules.",
    did: ["раскадровка и визуальный стиль", "генерации слоями (Higgsfield)", "анимация кодом (VS Code + Claude)", "монтаж и звук"],
    didEn: ["storyboard and visual style", "layered generations (Higgsfield)", "code-driven animation (VS Code + Claude)", "edit and sound"],
    board: [
      ["Тенерифе, 1977 год.", "аэропорт сверху, архивный подлинник, «1977» крупно", "параллакс, наезд"],
      ["Туман. На одной полосе два «Боинга».", "туман над полосой, два силуэта без ливрей — генерация слоями", "камера летит сквозь туман"],
      ["«Он что, ещё не ушёл?»", "страница отчёта расследования, строка переговоров", "наезд ×2,5 на строку + перевод"],
      ["…одна из самых страшных катастроф", "без обломков и людей: туман, вспышка, чёрный кадр", "перелом по свету"],
      ["Сломалось то, как люди говорят", "карточки «самолёты» ✕, «навыки» ✕ — остаётся одна", "лишнее улетает"]
    ],
    boardEn: [
      ["Tenerife, 1977.", "the airport from above, archival original, big “1977”", "parallax, push-in"],
      ["Fog. Two Boeings on one runway.", "fog over the runway, two livery-free silhouettes — layered generation", "camera flies through fog"],
      ["“Hasn’t he left yet?”", "a page of the investigation report, the radio line", "×2.5 push-in on the line + translation"],
      ["…one of the worst disasters", "no wreckage, no people: fog, a flash, a black frame", "the light break"],
      ["What broke was how people talk", "cards “planes” ✕, “skills” ✕ — one remains", "the extra flies away"]
    ],
    figs: [
      ["c1-fonts.jpg", "Три варианта шрифтовой пары на одном фоне — выбрали тяжёлый геометрический + лёгкий", "Three font pairings on the same background — the heavy geometric + light won"],
      ["c1-layers.jpg", "Слои генераций: цепь, облака, самолёт, туман, иллюминатор, небо — каждый отдельно, на однотонном фоне", "Generated layers: chain, clouds, jet, mist, porthole, skies — each separate, on a plain background"],
      ["c1-board.jpg", "Покадровый лист версии v4: каждые 1,5–2 с — новый план, слово голоса = кадр", "Frame sheet of v4: a new shot every 1.5–2 s, every spoken word is on screen"]
    ],
    credits: "Фото: David Broad (CC BY 3.0), Roel Hemkes (CC BY 2.0), Sir James (CC BY-SA 3.0) — Wikimedia Commons. Отчёт CIAIAC, 1978. Музыка: John Utah — «There Is Still Time».",
    creditsEn: "Photos: David Broad (CC BY 3.0), Roel Hemkes (CC BY 2.0), Sir James (CC BY-SA 3.0) — Wikimedia Commons. CIAIAC report, 1978. Music: John Utah — “There Is Still Time”."
  },
  {
    work: "w02-yaponiya", sheet: "02", duration: "41 с", durationEn: "41 s",
    title: "Бизнес на 300 лет", titleEn: "A 300-year-old business",
    task: "Ролик о передаче бизнеса: почему компания редко переживает основателя и что с этим сделать уже на этой неделе.",
    taskEn: "A video about succession: why a company rarely outlives its founder and what to do about it this week.",
    idea: "Японская семейная компания, которой сорок лет подряд управляли приёмные зятья. Поговорка «сына не выбираешь, а зятя — выбираешь» задаёт всю эстетику: тушь, свиток, красное солнце, архив 1930-х.",
    ideaEn: "A Japanese family company run by adopted sons-in-law for forty years. The saying “you don’t choose your son, but you choose your son-in-law” sets the whole look: ink, scrolls, a red sun, a 1930s archive.",
    did: ["поиск архивных подлинников", "стиль и шрифты", "генерации предметов", "анимация кодом и монтаж"],
    didEn: ["archival research", "style and typography", "generated props", "code-driven animation and edit"],
    board: [
      ["После основателя — 40 лет приёмные зятья", "архивная улица 1930-х, три пустых кресла главы", "загораются по одному"],
      ["Сына не выбираешь, а зятя — выбираешь", "свиток, поговорка проступает тушью, печать ханко", "текст пишется по строке"],
      ["Семья удерживает компанию в 16 %", "100 фигурок на красном — остаются 16", "перелом по свету"],
      ["Кто примет решение, если ты месяц без связи?", "телефон «нет сети» → карточки «партнёр / директор / родственник / некому»", "последняя гаснет"]
    ],
    boardEn: [
      ["After the founder — 40 years of sons-in-law", "a 1930s street, three empty chairs", "light up one by one"],
      ["You don’t choose a son, you choose a son-in-law", "a scroll, the saying appears in ink, a hanko seal", "text writes along the line"],
      ["Families keep the company in 16% of cases", "100 figures on red — 16 remain", "the light break"],
      ["Who decides if you’re offline for a month?", "phone “no signal” → cards partner / director / relative / no one", "the last one fades"]
    ],
    figs: [
      ["c2-archive.jpg", "Архив: подлинники 1890–1950-х (улицы, вокзал, станки, свадьба) — фундамент визуала", "Archive: originals from the 1890s–1950s (streets, station, looms, a wedding) — the base of the look"],
      ["c2-fonts.jpg", "Шрифтовые пары под одну фразу — выбрали антикву с тонким курсивом", "Font pairings for one line — the serif with a thin italic won"],
      ["c2-board.jpg", "Покадровый лист версии v7: бумага, тушь и красное солнце держат серию в одном стиле", "Frame sheet of v7: paper, ink and the red sun keep the series consistent"]
    ],
    credits: "Архивные фото — Wikimedia Commons (в т. ч. Ismoon, CC BY-SA 4.0). Источник цифр — «Ведомости», 24.08.2026. Музыка: Alec Slayne — «Survival of the Fittest».",
    creditsEn: "Archival photos — Wikimedia Commons (incl. Ismoon, CC BY-SA 4.0). Figures — Vedomosti, 24.08.2026. Music: Alec Slayne — “Survival of the Fittest”."
  },
  {
    work: "w04-12mln", sheet: "03", duration: "31 с", durationEn: "31 s",
    title: "Опыт уходит на пенсию", titleEn: "Experience is retiring",
    task: "Объяснить одну цифру — 12 миллионов работников — так, чтобы владелец бизнеса сразу сделал простое упражнение.",
    taskEn: "Explain one number — 12 million workers — so that a business owner immediately does one simple exercise.",
    idea: "Опыт — это то, что нигде не записано. Поэтому ролик собран из предметов без текста: счётчик, коробка с вещами, исписанная тетрадь, лист с колонками «оцифрованы» и «в голове».",
    ideaEn: "Experience is what’s written down nowhere. So the video is built from text-free objects: a counter, a box of belongings, a worn notebook, a sheet with “digitised” and “in someone’s head” columns.",
    did: ["правила стиля серии", "генерации предметов без текста", "анимация кодом: цифры, линовка, галочки", "монтаж"],
    didEn: ["style rules for the series", "text-free generated props", "code animation: numbers, ruling, ticks", "edit"],
    board: [
      ["Двенадцать миллионов человек.", "латунный счётчик прокручивается до 12 000 000", "цифры — кодом"],
      ["…нужно экономике до 32-го года", "табло с перекидными флажками 2026 → 2032", "флажки щёлкают"],
      ["Возьми лист и выпиши 5–10 человек", "лист, строки пишутся по линовке, имён нет", "строки встают колоннами"],
      ["Две колонки: «оцифрованы» и «в голове»", "свет гаснет, колонка «в голове» светится золотом", "перелом по свету"]
    ],
    boardEn: [
      ["Twelve million people.", "a brass counter spins to 12,000,000", "digits — in code"],
      ["…the economy needs by 2032", "a split-flap board 2026 → 2032", "flaps click"],
      ["Take a sheet and list 5–10 people", "a sheet, lines written along the ruling, no names", "lines rise as columns"],
      ["Two columns: “digitised” and “in their head”", "light dims, the “in their head” column glows gold", "the light break"]
    ],
    figs: [
      ["c3-props.jpg", "Предметы серии — генерации без текста и логотипов; всё, что пишется, дописывает код", "Props for the series — generated without text or logos; everything written is added by code"],
      ["c3-fonts.jpg", "Варианты пары для ключевой фразы «в голове»", "Pairing options for the key phrase “in their head”"],
      ["c3-board.jpg", "Покадровый лист первой версии: табло, бумаги, лист с колонками", "Frame sheet of the first version: flap board, papers, the column sheet"]
    ],
    credits: "Источник — «Эксперт», 03.12.2025 (на скрине фото министра и реклама размыты). Музыка: Philip Ayers — «Life in Color».",
    creditsEn: "Source — Expert, 03.12.2025 (minister’s photo and ads blurred on the screenshot). Music: Philip Ayers — “Life in Color”."
  }
];
