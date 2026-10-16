/*
 * 나만의 불릿저널 만들기 (builder.html)
 * 1 목적 → 2 구성(기본 설정 · 시작 페이지 · 매달 · 매주 · 매일 · 컬렉션) → 3 미리보기 → 4 내보내기
 * 템플릿은 각 템플릿 스크립트가 Bujo.define 으로 등록한 것을 그대로 쓴다.
 * 설정은 이 브라우저의 localStorage 에만 저장한다.
 */
(function () {
  "use strict";

  const { h, registry: R, RATIOS } = Bujo;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const CAT = Object.fromEntries((window.CATALOG || []).flatMap(c => c.items).map(i => [i.id, i]));

  /* ───────────── 목적과 구성 ───────────── */
  const PURPOSES = [
    { id: "tasks",  name: "할 일 정리",  desc: "해야 할 일을 놓치지 않고 끝까지 처리합니다.", picks: ["future-log", "monthly-log", "daily-rapid-log", "brain-dump"] },
    { id: "time",   name: "시간 관리",   desc: "하루를 시간 단위로 설계하고 지킵니다.",       picks: ["monthly-calendar", "weekly-spread", "daily-timebox"] },
    { id: "habit",  name: "습관 만들기", desc: "작은 반복을 꾸준히 이어 갑니다.",            picks: ["habit-tracker", "monthly-review"] },
    { id: "mind",   name: "마음 돌보기", desc: "감정을 기록하고 하루를 돌아봅니다.",          picks: ["mood-tracker", "daily-reflection", "weekly-review"] },
    { id: "goal",   name: "목표 달성",   desc: "큰 목표를 단계로 나눠 실행합니다.",           picks: ["year-at-a-glance", "goals", "project-planner", "weekly-review", "monthly-review"] },
    { id: "health", name: "건강 관리",   desc: "잠, 운동, 물, 식단을 챙깁니다.",             picks: ["sleep-tracker", "health-tracker", "meal-planner"] },
    { id: "money",  name: "돈 관리",     desc: "예산을 세우고 지출을 기록합니다.",            picks: ["expense-tracker"] },
    { id: "record", name: "기록 · 취미", desc: "책, 생각, 일상을 모아 둡니다.",              picks: ["reading-log", "paper-lined", "paper-dot"] }
  ];

  const GROUPS = [
    { key: "base", title: "기본 설정", desc: "비율, 시작 월, 기간, 주 시작 요일을 정합니다." },
    { key: "setup", title: "시작 페이지", freq: "once", desc: "저널 맨 앞에 한 번 들어가는 페이지입니다.",
      items: ["cover", "key", "index", "year-at-a-glance", "future-log"] },
    { key: "month", title: "매달 반복", freq: "month", desc: "달마다 맨 앞에 들어가는 페이지입니다. 달력 · 트래커는 그달 날짜로 채워집니다.",
      items: ["monthly-calendar", "monthly-log", "habit-tracker", "mood-tracker", "sleep-tracker", "health-tracker", "expense-tracker", "monthly-review"] },
    { key: "week", title: "매주 반복", freq: "week", desc: "주가 시작될 때마다 들어가는 페이지입니다. 주간 회고는 주의 마지막 날 뒤에 들어갑니다.",
      items: ["weekly-spread", "meal-planner", "weekly-review"] },
    { key: "day", title: "매일", freq: "day", desc: "하루에 한 장씩 들어가는 페이지입니다. 여러 개를 고르면 하루에 여러 장이 됩니다.",
      items: ["daily-timebox", "daily-rapid-log", "daily-reflection", "daily-all-in-one", "daily-half"] },
    { key: "extra", title: "컬렉션 · 속지", freq: "count", desc: "저널 뒤쪽에 원하는 장수만큼 넣는 페이지입니다.",
      items: ["goals", "project-planner", "brain-dump", "reading-log", "checklist", "paper-dot", "paper-grid", "paper-lined", "paper-blank"] }
  ];
  const GROUP_OF = Object.fromEntries(GROUPS.flatMap(g => (g.items || []).map(id => [id, g.key])));
  const ALL = GROUPS.flatMap(g => g.items || []);
  const FREQ = { once: "한 번", month: "매달", week: "매주", day: "매일", count: "장수 지정" };
  const STEPS = ["목적", "구성", "미리보기", "내보내기"];

  /* ───────────── 설정 ───────────── */
  const today = new Date();
  const fresh = () => ({
    step: 0, sub: 0,
    purposes: [],
    ratio: "iso", year: today.getFullYear(), month: today.getMonth() + 1, months: 1, weekStart: 0, dated: true,
    dailyMode: "every", dailyCount: 7,
    sel: Object.fromEntries(ALL.map(id => [id, { on: false, v: R[id].variants[0].key, n: 1 }])),
    removed: []
  });

  function load() {
    const d = fresh();
    try {
      const s = JSON.parse(localStorage.getItem("bujo.builder"));
      if (!s || !s.sel) return d;
      const c = { ...d, ...s, sel: { ...d.sel } };
      ALL.forEach(id => {
        const o = s.sel[id];
        if (!o) return;
        const valid = R[id].variants.some(v => v.key === o.v);
        c.sel[id] = { on: !!o.on, v: valid ? o.v : d.sel[id].v, n: Math.max(1, +o.n || 1) };
      });
      return c;
    } catch (e) { return d; }
  }
  let cfg = load();
  const save = () => { try { localStorage.setItem("bujo.builder", JSON.stringify(cfg)); } catch (e) { /* 무시 */ } };
  const ratio = () => RATIOS.find(r => r.id === cfg.ratio) || RATIOS[0];
  const variantOf = id => R[id].variants.find(v => v.key === cfg.sel[id].v) || R[id].variants[0];

  /** 목적을 바탕으로 추천 구성을 켠다 (디자인 선택은 그대로 둔다) */
  function applyPurposes() {
    const picks = new Set(["cover", "key", "index"]);
    cfg.purposes.forEach(p => PURPOSES.find(x => x.id === p).picks.forEach(id => picks.add(id)));
    if (![...picks].some(id => GROUP_OF[id] === "month")) picks.add("monthly-calendar");
    if (![...picks].some(id => GROUP_OF[id] === "day")) picks.add("daily-rapid-log");
    ALL.forEach(id => {
      cfg.sel[id].on = picks.has(id);
      if (GROUP_OF[id] === "extra") cfg.sel[id].n = id.startsWith("paper-") ? 5 : 1;
    });
    cfg.removed = [];
  }

  /* ───────────── 페이지 순서 만들기 ───────────── */
  function ctxOf(o = {}) {
    return {
      dated: cfg.dated, weekStart: cfg.weekStart,
      year: o.year ?? cfg.year, month: o.month ?? cfg.month,
      date: o.date ?? new Date(cfg.year, cfg.month - 1, 1)
    };
  }

  function buildPages() {
    const pages = [];
    const on = id => cfg.sel[id].on;
    const seen = {};
    const add = (id, group, label, o = {}) => {
      const base = `${id}|${label}`;
      seen[base] = (seen[base] || 0) + 1;
      pages.push({ id, group, label, o, key: `${base}|${seen[base]}` });
    };

    const G0 = "시작 페이지";
    if (on("cover")) add("cover", G0, "표지", { year: cfg.year });
    if (on("key")) add("key", G0, "키");
    if (on("index")) add("index", G0, "인덱스");
    if (on("year-at-a-glance")) add("year-at-a-glance", G0, `${cfg.year}년`, { year: cfg.year });
    if (on("future-log")) add("future-log", G0, "퓨처 로그", { year: cfg.year, month: cfg.month });

    const monthly = GROUPS[2].items.filter(id => id !== "monthly-review" && on(id));
    const dailies = GROUPS[4].items.filter(on);
    const ws = cfg.weekStart, weekEnd = (ws + 6) % 7;
    const last = h.addMonths(cfg.year, cfg.month, cfg.months - 1);
    const lastDay = new Date(last.year, last.month, 0).getDate();

    for (let k = 0; k < cfg.months; k++) {
      const { year, month } = h.addMonths(cfg.year, cfg.month, k);
      const G = `${year}년 ${month}월`;
      monthly.forEach(id => add(id, G, `${month}월`, { year, month }));

      const N = new Date(year, month, 0).getDate();
      for (let d = 1; d <= N; d++) {
        const date = new Date(year, month - 1, d);
        const dow = date.getDay();
        // 주간 페이지: 주가 시작하는 날마다, 그리고 기간 첫날이 주 중간이면 그날에도
        if (dow === ws || (k === 0 && d === 1)) {
          ["weekly-spread", "meal-planner"].filter(on).forEach(id => add(id, G, `${month}/${d} 주`, { date }));
        }
        if (cfg.dailyMode === "every") {
          dailies.forEach(id => {
            if (id !== "daily-half") return add(id, G, `${month}/${d}`, { date });
            if ((d - 1) % 2 === 0) add(id, G, d < N ? `${month}/${d}–${d + 1}` : `${month}/${d}`, { date });
          });
        }
        const periodEnd = k === cfg.months - 1 && d === lastDay;
        if (on("weekly-review") && (dow === weekEnd || periodEnd)) add("weekly-review", G, `${month}/${d} 주 회고`, { date });
      }
      if (on("monthly-review")) add("monthly-review", G, `${month}월 회고`, { year, month });
    }

    if (cfg.dailyMode === "count") {
      dailies.forEach(id => { for (let i = 0; i < cfg.dailyCount; i++) add(id, "데일리", `${i + 1}`); });
    }
    GROUPS[5].items.filter(on).forEach(id => {
      for (let i = 0; i < cfg.sel[id].n; i++) add(id, "컬렉션 · 속지", `${i + 1}`);
    });
    return pages;
  }

  const sheetItem = p => Bujo.sheetOf(R[p.id], variantOf(p.id), ctxOf(p.o));
  const activePages = () => { const rm = new Set(cfg.removed); return buildPages().filter(p => !rm.has(p.key)); };

  /**
   * 시트 미리보기. w(px)를 주면 600px 로 그린 뒤 축소한다.
   * (작게 그리면 브라우저 최소 글꼴 크기 때문에 글자가 비율대로 줄지 않는다)
   */
  const BASE = 600;
  function miniSheet(id, v, c, w = null) {
    const it = Bujo.sheetOf(R[id], v, c);
    const ar = Bujo.dims(it.land, ratio()).ar;
    const sheet = `<div class="sheet-frame"><div class="sheet ${it.cls}" style="--ar:${ar}">${it.html}</div></div>`;
    if (!w) return sheet;
    const W = it.land ? Math.round(w * 2 + 12) : w;
    return `<div class="mini" style="--ar:${ar};width:${W}px;--k:${W / BASE}">${sheet}</div>`;
  }

  /* ───────────── 화면 ───────────── */
  const app = $("#builder");

  function render() {
    save();
    renderStepper();
    const views = [viewPurpose, viewCompose, viewPreview, viewExport];
    app.innerHTML = views[cfg.step]();
    bind[cfg.step]();
    window.scrollTo({ top: 0 });
  }

  function renderStepper() {
    $("#stepper").innerHTML = STEPS.map((s, i) =>
      `<li class="${i === cfg.step ? "now" : i < cfg.step ? "done" : ""}"><button type="button" data-go="${i}"><b>${i + 1}</b>${s}</button></li>`).join("");
    $$("#stepper [data-go]").forEach(b => b.addEventListener("click", () => { cfg.step = +b.dataset.go; render(); }));
  }

  const nav = (prev, next, nextLabel = "다음") => `
    <div class="b-nav">
      ${prev !== null ? `<button type="button" class="btn" data-nav="${prev}">← 이전</button>` : "<span></span>"}
      <span class="b-count" id="b-count"></span>
      ${next !== null ? `<button type="button" class="btn primary" data-nav="${next}">${nextLabel} →</button>` : "<span></span>"}
    </div>`;

  function bindNav() {
    $$("[data-nav]").forEach(b => b.addEventListener("click", () => {
      const [s, sub] = b.dataset.nav.split(".").map(Number);
      cfg.step = s;
      if (!Number.isNaN(sub) && sub !== undefined) cfg.sub = sub;
      render();
    }));
    updateCount();
  }

  function updateCount() {
    const n = activePages().length;
    const el = $("#b-count");
    if (el) el.innerHTML = `현재 구성 <b>${n}</b>쪽${n > 150 ? ' · <span class="warn">페이지가 많아 내보내기가 오래 걸릴 수 있습니다</span>' : ""}`;
  }

  /* 1. 목적 */
  function viewPurpose() {
    return `
      <section class="b-sec">
        <h2>불릿저널은 무엇을 위한 도구일까요?</h2>
        <p class="lead">불릿저널은 <b>과거를 기록하고, 현재를 정리하고, 미래를 설계하는</b> 아날로그 방식의 기록법입니다. 빈 노트에 필요한 페이지만 골라 나만의 시스템을 만듭니다.</p>
        <div class="why">
          <div class="panel"><small>TRACK THE PAST</small><h3>과거를 기록하기</h3><p>한 일, 있었던 일, 느낀 것을 짧게 남겨 나중에 돌아봅니다. 트래커와 회고가 이 역할을 합니다.</p></div>
          <div class="panel"><small>ORDER THE PRESENT</small><h3>현재를 정리하기</h3><p>머릿속의 할 일을 꺼내 기호로 정리하고, 오늘 할 일에 집중합니다. 데일리와 래피드 로그가 중심입니다.</p></div>
          <div class="panel"><small>DESIGN THE FUTURE</small><h3>미래를 설계하기</h3><p>다가올 일정과 목표를 미리 적고, 달과 주 단위로 나눠 실행합니다. 퓨처 로그와 먼슬리가 맡습니다.</p></div>
        </div>
      </section>
      <section class="b-sec">
        <h2>이 저널로 무엇을 하고 싶나요?</h2>
        <p class="lead">해당하는 것을 모두 고르세요. 고른 목적에 맞는 페이지가 추천 구성으로 켜집니다. 다음 단계에서 얼마든지 바꿀 수 있습니다.</p>
        <div class="purposes">${PURPOSES.map(p => `
          <label class="purpose${cfg.purposes.includes(p.id) ? " on" : ""}">
            <input type="checkbox" value="${p.id}"${cfg.purposes.includes(p.id) ? " checked" : ""}>
            <b>${p.name}</b><span>${p.desc}</span>
            <em>${p.picks.map(id => R[id].name).join(" · ")}</em>
          </label>`).join("")}</div>
      </section>
      ${nav(null, "1.0", "추천 구성으로 시작")}`;
  }

  /* 2. 구성 */
  function viewCompose() {
    const g = GROUPS[cfg.sub];
    const subnav = `<ol class="subnav">${GROUPS.map((x, i) =>
      `<li class="${i === cfg.sub ? "now" : ""}"><button type="button" data-sub="${i}">2-${i + 1} ${x.title}</button></li>`).join("")}</ol>`;
    const prev = cfg.sub === 0 ? "0" : `1.${cfg.sub - 1}`;
    const next = cfg.sub === GROUPS.length - 1 ? "2" : `1.${cfg.sub + 1}`;
    return `
      ${subnav}
      <section class="b-sec">
        <h2>${g.title}${g.freq ? ` <small>${FREQ[g.freq]}</small>` : ""}</h2>
        <p class="lead">${g.desc}</p>
        ${g.key === "base" ? viewBase() : (g.key === "day" ? viewDailyMode() : "") + `<div class="items">${g.items.map(itemRow).join("")}</div>`}
      </section>
      ${nav(prev, next, cfg.sub === GROUPS.length - 1 ? "미리보기" : "다음")}`;
  }

  const seg = (name, opts, cur) => `<div class="seg" data-cfg="${name}">${opts.map(([v, t, title]) =>
    `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(cur)}"${title ? ` title="${title}"` : ""}>${t}</button>`).join("")}</div>`;

  function viewBase() {
    const y0 = today.getFullYear();
    return `
      <div class="base-grid">
        <div class="panel"><h3>비율</h3><p>쓰는 태블릿이나 용지에 맞춰 고릅니다.</p>
          ${seg("ratio", RATIOS.map(r => [r.id, r.name, r.sub]), cfg.ratio)}
          <p class="hint">${ratio().sub} · PDF ${ratio().mm.join(" × ")} mm · JPG ${ratio().px.join(" × ")} px</p></div>
        <div class="panel"><h3>시작 월</h3><p>저널을 시작할 달입니다.</p>
          <div class="row">
            <select class="ctl" data-num="year">${h.rep(6, k => { const y = y0 - 1 + k; return `<option value="${y}"${y === cfg.year ? " selected" : ""}>${y}년</option>`; })}</select>
            <select class="ctl" data-num="month">${h.rep(12, k => `<option value="${k + 1}"${k + 1 === cfg.month ? " selected" : ""}>${k + 1}월</option>`)}</select>
          </div></div>
        <div class="panel"><h3>기간</h3><p>몇 달치를 만들지 고릅니다.</p>
          ${seg("months", [[1, "1개월"], [3, "3개월"], [6, "6개월"], [12, "12개월"]], cfg.months)}</div>
        <div class="panel"><h3>주 시작 요일</h3><p>달력과 위클리의 첫 요일입니다.</p>
          ${seg("weekStart", [[0, "일요일"], [1, "월요일"]], cfg.weekStart)}</div>
        <div class="panel"><h3>날짜 인쇄</h3><p>달력 · 트래커 · 위클리에 날짜 숫자를 미리 채울지 정합니다.</p>
          ${seg("dated", [["true", "채우기"], ["false", "비워 두기"]], cfg.dated)}</div>
      </div>`;
  }

  function viewDailyMode() {
    return `
      <div class="panel daily-mode">
        <div><h3>데일리 장수</h3><p>기간의 날마다 한 장씩 넣거나, 날짜와 상관없이 빈 양식을 원하는 장수만큼 넣습니다. 데일리 양식의 날짜는 직접 적습니다.</p></div>
        <div class="row">
          ${seg("dailyMode", [["every", "날마다 1장"], ["count", "장수 지정"]], cfg.dailyMode)}
          <label class="num${cfg.dailyMode === "count" ? "" : " off"}"><input type="number" min="1" max="200" value="${cfg.dailyCount}" data-num="dailyCount">장</label>
        </div>
      </div>`;
  }

  function itemRow(id) {
    const t = R[id], s = cfg.sel[id], c = CAT[id] || {};
    const sample = ctxOf({ date: new Date(cfg.year, cfg.month - 1, 1) });
    return `
      <div class="item${s.on ? " on" : ""}" data-item="${id}">
        <label class="item-head">
          <input type="checkbox" data-on="${id}"${s.on ? " checked" : ""}>
          <span><b>${t.name}</b> <small>${t.en}</small><br><em>${esc(c.desc || t.summary)}</em></span>
        </label>
        ${GROUP_OF[id] === "extra" ? `<label class="num"><input type="number" min="1" max="50" value="${s.n}" data-n="${id}">장</label>` : ""}
        <div class="designs" role="radiogroup" aria-label="${t.name} 디자인">${t.variants.map(v => `
          <button type="button" class="dz${v.key === s.v ? " sel" : ""}${v.land ? " land" : ""}" data-id="${id}" data-v="${v.key}" aria-pressed="${v.key === s.v}">
            ${miniSheet(id, v, sample, 84)}<span>${v.no} ${v.name}${v.land ? " · 가로" : ""}</span>
          </button>`).join("")}</div>
        <a class="item-link" href="${c.href || "#"}" target="_blank" rel="noopener">자세히 보기 ↗</a>
      </div>`;
  }

  /* 3. 미리보기 */
  function viewPreview() {
    const pages = buildPages();
    const rm = new Set(cfg.removed);
    const used = [...new Set(pages.map(p => p.id))];
    const groups = [];
    pages.forEach((p, i) => {
      let g = groups[groups.length - 1];
      if (!g || g.name !== p.group) groups.push(g = { name: p.group, list: [] });
      g.list.push({ p, i });
    });
    let no = 0;
    const numOf = {};
    pages.forEach(p => { if (!rm.has(p.key)) numOf[p.key] = ++no; });
    return `
      <section class="b-sec">
        <h2>미리보기</h2>
        <p class="lead">만들어질 저널을 페이지 순서대로 보여 줍니다. 페이지를 누르면 크게 보고, ×로 빼거나 다시 넣을 수 있습니다.</p>
        <div class="panel quick">
          <div><span class="tb-label">비율</span>${seg("ratio", RATIOS.map(r => [r.id, r.name, r.sub]), cfg.ratio)}</div>
          <div><span class="tb-label">주 시작</span>${seg("weekStart", [[0, "일"], [1, "월"]], cfg.weekStart)}</div>
          <div><span class="tb-label">날짜</span>${seg("dated", [["true", "채우기"], ["false", "비우기"]], cfg.dated)}</div>
          <details><summary>디자인 바꾸기 (${used.length}종)</summary>
            <div class="swap">${used.map(id => `<label><span>${R[id].name}</span><select class="ctl" data-swap="${id}">${R[id].variants.map(v =>
              `<option value="${v.key}"${v.key === cfg.sel[id].v ? " selected" : ""}>${v.no} ${v.name}${v.land ? " (가로)" : ""}</option>`).join("")}</select></label>`).join("")}</div>
          </details>
        </div>
        ${groups.map(g => `
          <h3 class="pv-group">${g.name} <small>${g.list.length}쪽</small></h3>
          <div class="pv-grid">${g.list.map(({ p, i }) => {
            const off = rm.has(p.key);
            return `<figure class="pv${off ? " off" : ""}${variantOf(p.id).land ? " land" : ""}" data-i="${i}">
              <div class="pv-sheet" data-lazy="${i}"></div>
              <figcaption><b>${off ? "–" : numOf[p.key]}</b> ${R[p.id].name}<small>${p.label}</small></figcaption>
              <button type="button" class="pv-x" data-toggle="${esc(p.key)}" title="${off ? "다시 넣기" : "빼기"}">${off ? "+" : "×"}</button>
            </figure>`;
          }).join("")}</div>`).join("")}
      </section>
      ${nav("1.5", "3", "내보내기")}`;
  }

  /* 4. 내보내기 */
  function viewExport() {
    const pages = activePages();
    const r = ratio();
    const land = pages.filter(p => variantOf(p.id).land).length;
    return `
      <section class="b-sec">
        <h2>내보내기</h2>
        <p class="lead">총 <b>${pages.length}쪽</b> · ${r.name} (${r.sub})${land ? ` · 가로 페이지 ${land}쪽 포함` : ""}</p>
        <div class="ex-grid">
          <div class="panel">
            <small>PDF</small><h3>PDF로 저장 · 인쇄</h3>
            <p>모든 페이지를 한 파일로 만듭니다. 인쇄 창이 열리면 대상을 "PDF로 저장"으로 고르세요. 여백은 "없음", 배경 그래픽은 "켜기"로 둡니다.</p>
            <button type="button" class="btn primary" id="ex-pdf">PDF 만들기</button>
          </div>
          <div class="panel">
            <small>JPG</small><h3>이미지로 내려받기</h3>
            <p>페이지마다 ${r.px.join(" × ")} px JPG를 만들어 ZIP 하나로 묶습니다. 한 장에 1초 안팎이 걸립니다.</p>
            <button type="button" class="btn primary" id="ex-zip">JPG ZIP 만들기</button>
            <div class="progress" id="ex-prog" hidden><div><i id="ex-bar"></i></div><span id="ex-msg"></span><button type="button" class="btn" id="ex-cancel">취소</button></div>
          </div>
        </div>
        <div class="panel tips">
          <h3>노트 앱에 넣기</h3>
          <ul>
            <li><b>GoodNotes · Notability</b>: PDF를 가져오기(Import)로 열면 한 권의 노트가 됩니다.</li>
            <li><b>Samsung Notes</b>: PDF를 열어 "노트로 저장"하거나, JPG를 페이지 배경으로 씁니다.</li>
            <li>매일 같은 데일리를 이어 쓰고 싶다면 템플릿 페이지에서 해당 디자인만 따로 내보내 "사용자 템플릿"으로 등록하세요.</li>
          </ul>
        </div>
      </section>
      ${nav("2", null)}`;
  }

  /* ───────────── 이벤트 ───────────── */
  function bindSegs() {
    $$("[data-cfg]").forEach(g => g.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const k = g.dataset.cfg, v = b.dataset.v;
      cfg[k] = k === "dated" ? v === "true" : (k === "months" || k === "weekStart") ? +v : v;
      if (k === "months" || k === "dailyMode") cfg.removed = [];
      render();
    }));
    $$("[data-num]").forEach(i => i.addEventListener("change", () => {
      const k = i.dataset.num;
      cfg[k] = Math.max(1, Math.min(+i.max || 9999, +i.value || 1));
      cfg.removed = [];
      render();
    }));
  }

  const bind = [
    () => {
      $$(".purpose input").forEach(i => i.addEventListener("change", () => {
        cfg.purposes = $$(".purpose input:checked").map(x => x.value);
        i.closest(".purpose").classList.toggle("on", i.checked);
      }));
      $$("[data-nav]").forEach(b => b.addEventListener("click", () => {
        // 목적이 바뀌었을 때만 추천 구성을 다시 적용한다 (구성 단계에서 고친 내용을 지키기 위해)
        const sig = [...cfg.purposes].sort().join(",");
        if (sig !== cfg.appliedSig || !ALL.some(id => cfg.sel[id].on)) {
          applyPurposes();
          cfg.appliedSig = sig;
        }
        cfg.step = 1; cfg.sub = 0;
        render();
      }));
    },
    () => {
      $$("[data-sub]").forEach(b => b.addEventListener("click", () => { cfg.sub = +b.dataset.sub; render(); }));
      bindSegs();
      $$("[data-on]").forEach(i => i.addEventListener("change", () => {
        cfg.sel[i.dataset.on].on = i.checked;
        i.closest(".item").classList.toggle("on", i.checked);
        save(); updateCount();
      }));
      $$("[data-n]").forEach(i => i.addEventListener("change", () => {
        cfg.sel[i.dataset.n].n = Math.max(1, Math.min(50, +i.value || 1));
        save(); updateCount();
      }));
      $$(".dz").forEach(b => b.addEventListener("click", () => {
        const id = b.dataset.id;
        cfg.sel[id].v = b.dataset.v;
        cfg.sel[id].on = true;
        const item = b.closest(".item");
        item.classList.add("on");
        $("input[data-on]", item).checked = true;
        $$(".dz", item).forEach(x => { x.classList.toggle("sel", x === b); x.setAttribute("aria-pressed", String(x === b)); });
        save(); updateCount();
      }));
      bindNav();
    },
    () => {
      bindSegs();
      $$("[data-swap]").forEach(s => s.addEventListener("change", () => { cfg.sel[s.dataset.swap].v = s.value; render(); }));
      $$("[data-toggle]").forEach(b => b.addEventListener("click", e => {
        e.stopPropagation();
        const k = b.dataset.toggle;
        cfg.removed = cfg.removed.includes(k) ? cfg.removed.filter(x => x !== k) : [...cfg.removed, k];
        render();
      }));
      const pages = buildPages();
      lazyRender(pages);
      $$(".pv").forEach(f => f.addEventListener("click", () => openModal(pages[+f.dataset.i])));
      bindNav();
    },
    () => {
      $("#ex-pdf").addEventListener("click", exportPdf);
      $("#ex-zip").addEventListener("click", exportZip);
      bindNav();
    }
  ];

  /** 미리보기 시트는 화면에 보일 때 그린다 */
  function lazyRender(pages) {
    const draw = el => {
      const p = pages[+el.dataset.lazy];
      el.innerHTML = miniSheet(p.id, variantOf(p.id), ctxOf(p.o), 132);
      el.removeAttribute("data-lazy");
    };
    if (!("IntersectionObserver" in window)) return $$("[data-lazy]").forEach(draw);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { io.unobserve(e.target); draw(e.target); }
    }), { rootMargin: "400px 0px" });
    $$("[data-lazy]").forEach(el => io.observe(el));
  }

  /* 크게 보기 */
  function openModal(p) {
    const m = $("#modal");
    const v = variantOf(p.id);
    m.innerHTML = `
      <div class="m-box${v.land ? " land" : ""}" role="dialog" aria-modal="true" aria-label="${R[p.id].name} 크게 보기">
        <div class="m-head"><b>${R[p.id].name}</b><span>${p.group} · ${p.label} · ${v.no} ${v.name}</span>
          <button type="button" class="btn" id="m-jpg">이 페이지 JPG</button><button type="button" class="btn" id="m-close">닫기</button></div>
        ${miniSheet(p.id, v, ctxOf(p.o))}
      </div>`;
    m.hidden = false;
    const close = () => { m.hidden = true; m.innerHTML = ""; };
    $("#m-close").addEventListener("click", close);
    m.addEventListener("click", e => { if (e.target === m) close(); }, { once: true });
    $("#m-jpg").addEventListener("click", async e => {
      const b = e.currentTarget; b.disabled = true; b.textContent = "저장 중…";
      try { Bujo.download(await Bujo.jpgDataURL(sheetItem(p), ratio()), `${p.id}_${p.label.replace(/[\/\s–]+/g, "-")}.jpg`); }
      catch (err) { alert("JPG 저장에 실패했습니다: " + err.message); }
      b.disabled = false; b.textContent = "이 페이지 JPG";
    });
  }

  /* 내보내기 */
  const fileBase = () => `bullet-journal_${cfg.year}-${h.pad(cfg.month)}_${cfg.months}m_${cfg.ratio}`;

  function exportPdf() {
    const pages = activePages();
    if (!pages.length) return alert("내보낼 페이지가 없습니다.");
    Bujo.printItems(pages.map(sheetItem), fileBase(), ratio());
  }

  let cancelZip = false;
  async function exportZip() {
    const pages = activePages();
    if (!pages.length) return alert("내보낼 페이지가 없습니다.");
    if (!window.JSZip) return alert("ZIP 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요.");
    const btn = $("#ex-zip"), prog = $("#ex-prog"), bar = $("#ex-bar"), msg = $("#ex-msg");
    btn.disabled = true; prog.hidden = false; cancelZip = false;
    $("#ex-cancel").onclick = () => { cancelZip = true; };
    const zip = new JSZip();
    try {
      for (let i = 0; i < pages.length; i++) {
        if (cancelZip) throw new Error("취소했습니다.");
        const p = pages[i];
        msg.textContent = `${i + 1} / ${pages.length} · ${R[p.id].name} ${p.label}`;
        bar.style.width = `${(i / pages.length) * 100}%`;
        const url = await Bujo.jpgDataURL(sheetItem(p), ratio());
        zip.file(`${String(i + 1).padStart(3, "0")}_${p.id}_${p.label.replace(/[\/\s–]+/g, "-")}.jpg`, url.split(",")[1], { base64: true });
      }
      msg.textContent = "ZIP으로 묶는 중…";
      bar.style.width = "100%";
      const blob = await zip.generateAsync({ type: "blob" });
      const href = URL.createObjectURL(blob);
      Bujo.download(href, fileBase() + ".zip");
      setTimeout(() => URL.revokeObjectURL(href), 60000);
      msg.textContent = `완료 · ${pages.length}장`;
    } catch (e) {
      msg.textContent = e.message || String(e);
    } finally {
      btn.disabled = false;
    }
  }

  $("#reset").addEventListener("click", () => {
    if (!confirm("고른 목적과 구성을 모두 지우고 처음부터 시작할까요?")) return;
    cfg = fresh();
    render();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) $("#m-close").click(); });

  render();
})();
