/*
 * 템플릿 페이지 엔진
 * - Bujo.mount(opts)로 페이지(헤더·안내·툴바·디자인 갤러리)를 그린다.
 * - 비율 전환, 가로 디자인, 날짜 지정(연 · 월 · 주), 주 시작 요일을 처리한다.
 * - PDF(브라우저 인쇄), JPG(html-to-image) 내보내기를 처리한다.
 * - Bujo.h 에 시트 마크업 헬퍼가 있다.
 * file:// 에서도 열리도록 모듈이 아닌 일반 스크립트로 작성한다.
 *
 * mount(opts)
 *   section, id, name, en, summary, parts[], usage[], tips[]
 *   date: "month" | "year" | "week"   (생략하면 날짜 컨트롤 없음)
 *   weekStart: true                   (주 시작 요일 토글 표시)
 *   variants: [{ key, name, desc, html, no?, land? }]
 *     html  — 문자열 또는 ctx => 문자열
 *     land  — true면 가로 방향(비율의 가로 · 세로를 바꿔 씀)
 *   ctx = { dated, year, month(1~12), date(Date), weekStart(0 일 | 1 월) }
 */
(function () {
  "use strict";

  const RATIOS = [
    { id: "iso",    name: "ISO A",   sub: "A4·A5",      w: 1,   h: 1.4142, mm: [210, 297],     px: [1654, 2339] },
    { id: "3x4",    name: "3 : 4",   sub: "iPad 기본형", w: 3,   h: 4,      mm: [180, 240],     px: [1536, 2048] },
    { id: "10x16",  name: "10 : 16", sub: "Galaxy Tab", w: 10,  h: 16,     mm: [160, 256],     px: [1600, 2560] },
    { id: "letter", name: "Letter",  sub: "US Letter",  w: 8.5, h: 11,     mm: [215.9, 279.4], px: [1700, 2200] }
  ];

  const SECTIONS = {
    daily: {
      label: "A · DAILY",
      pages: [
        { id: "daily-timebox",    href: "timebox.html",    name: "타임박스 플래너" },
        { id: "daily-rapid-log",  href: "rapid-log.html",  name: "래피드 로그" },
        { id: "daily-reflection", href: "reflection.html", name: "데일리 회고" },
        { id: "daily-all-in-one", href: "all-in-one.html", name: "올인원 데일리" },
        { id: "daily-half",       href: "half.html",       name: "하프 데일리" }
      ]
    },
    period: {
      label: "B · PERIODIC LOGS",
      pages: [
        { id: "monthly-calendar", href: "monthly-calendar.html", name: "먼슬리 캘린더" },
        { id: "monthly-log",      href: "monthly-log.html",      name: "먼슬리 로그" },
        { id: "weekly-spread",    href: "weekly.html",           name: "위클리" },
        { id: "future-log",       href: "future-log.html",       name: "퓨처 로그" },
        { id: "year-at-a-glance", href: "year.html",             name: "연간 개요" }
      ]
    },
    tracker: {
      label: "C · TRACKERS",
      pages: [
        { id: "habit-tracker", href: "habit.html", name: "습관 트래커" },
        { id: "mood-tracker",  href: "mood.html",  name: "기분 트래커" },
        { id: "sleep-tracker", href: "sleep.html", name: "수면 트래커" },
        { id: "health-tracker", href: "health.html", name: "건강 트래커" },
        { id: "expense-tracker", href: "expense.html", name: "지출 트래커" }
      ]
    },
    collection: {
      label: "D · COLLECTIONS",
      pages: [
        { id: "goals", href: "goals.html", name: "목표 설정" }
      ]
    }
  };

  // JPG에 임베드할 폰트 (시트에서 쓰는 굵기만)
  const FONT_BASE = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/";
  const FONT_FILES = [[400, "Regular"], [600, "SemiBold"], [700, "Bold"]];

  /* ───────────── 저장 ───────────── */
  const store = {
    get(k, d) { try { return localStorage.getItem("bujo." + k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("bujo." + k, v); } catch (e) { /* 무시 */ } }
  };

  /* ───────────── 마크업 헬퍼 ───────────── */
  const WEEK = ["S", "M", "T", "W", "T", "F", "S"];
  const WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];
  const MONTH_EN = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");
  const pad = n => String(n).padStart(2, "0");
  // 요일 번호(0 일 ~ 6 토)에 맞는 클래스. 토요일 파란색은 시트에 .sat-blue 가 있을 때만 보인다
  const dowCls = d => (d === 0 ? "sun" : d === 6 ? "sat" : "");
  const week = () => WEEK.map((d, i) => `<span${dowCls(i) ? ` class="${dowCls(i)}"` : ""}>${d}</span>`).join("");

  /** ws(주 시작) 기준으로 n번째 칸의 요일 번호 */
  const dowAt = (i, ws = 0) => (i + ws) % 7;

  /** 한 달을 7칸 단위 배열로: [{ d: 날짜 | null, dow }]. 날짜 없음이면 빈 칸 6주 */
  function monthCells(ctx, year, month) {
    const ws = ctx.weekStart;
    if (!ctx.dated) return Array.from({ length: 42 }, (_, i) => ({ d: null, dow: dowAt(i % 7, ws) }));
    const offset = (new Date(year, month - 1, 1).getDay() - ws + 7) % 7;
    const days = new Date(year, month, 0).getDate();
    const weeks = Math.ceil((offset + days) / 7);
    return Array.from({ length: weeks * 7 }, (_, i) => {
      const n = i - offset + 1;
      return { d: n >= 1 && n <= days ? n : null, dow: dowAt(i % 7, ws) };
    });
  }

  /** 주 시작 기준 요일 머리글 */
  const weekHead = (ws = 0, ko = false) =>
    rep(7, i => { const d = dowAt(i, ws); return `<span class="${dowCls(d)}">${(ko ? WEEK_KO : WEEK)[d]}</span>`; });

  /** ctx.date 가 속한 주의 7일 (Date 배열) */
  function weekDates(ctx) {
    const base = new Date(ctx.date.getFullYear(), ctx.date.getMonth(), ctx.date.getDate());
    base.setDate(base.getDate() - ((base.getDay() - ctx.weekStart + 7) % 7));
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
  }

  /** 시작 연 · 월에서 k개월 뒤 */
  const addMonths = (year, month, k) => { const t = year * 12 + (month - 1) + k; return { year: Math.floor(t / 12), month: (t % 12) + 1 }; };

  const h = {
    rep, pad, week, weekHead, monthCells, weekDates, addMonths, dowAt, dowCls,
    WEEK, WEEK_KO, MONTH_EN, MONTH_SHORT,
    /** 빈 줄 n개 */
    lines: (n, cls = "") => `<div class="lines ${cls}">${rep(n, () => "<i></i>")}</div>`,
    /** 번호 붙은 줄 */
    numLines: (n, cls = "") => `<div class="lines ${cls}">${rep(n, i => `<i><span class="num">${i + 1}</span></i>`)}</div>`,
    /** 앞에 기호(•, ○, – 등)가 붙은 줄 */
    markLines: (n, mark, cls = "") => `<div class="lines ${cls}">${rep(n, () => `<i><span class="mk">${mark}</span></i>`)}</div>`,
    /** 체크박스 줄 */
    checks: (n, cls = "") => `<div class="lines ${cls}">${rep(n, () => '<i><u class="cb"></u></i>')}</div>`,
    /** 시각 라벨이 붙은 줄. half=true면 30분 줄을 점선으로 추가 */
    hourLines: (from, to, half = false) =>
      `<div class="lines hours">${rep(to - from + 1, k =>
        `<i><span class="hr">${from + k}</span></i>` + (half ? '<i class="half"><span class="hr"></span></i>' : "")
      )}</div>`,
    /** 레퍼런스형 날짜 상자: DATE | Y | M | D + 요일 */
    dateBox: () =>
      `<div class="datebox"><div class="db-ymd"><b>DATE</b><div><span>Y</span><span>M</span><span>D</span></div></div>` +
      `<div class="db-wk">${week()}</div></div>`,
    /** 한 줄 날짜: DATE ____ . __ . __  S M T W T F S */
    dateLine: () => `<div class="dateline"><b>DATE</b><i></i><em>.</em><i></i><em>.</em><i></i><span class="wk-mini">${week()}</span></div>`,
    /**
     * 시간 그리드. sub = 한 시간을 나눌 칸 수 (6 → 10분, 2 → 30분)
     * rows 를 주면 from/to 대신 그 목록으로 행을 만든다: [{ label, cls }]
     */
    timeGrid: ({ from = 4, to = 24, sub = 6, head = true, rows: list } = {}) => {
      const step = 60 / sub;
      const labels = rep(sub, k => `<span>${pad(((k + 1) * step) % 60)}</span>`);
      list = list || Array.from({ length: to - from + 1 }, (_, k) => ({ label: from + k }));
      const rows = list.map(r =>
        `<div class="tg-row${r.cls ? " " + r.cls : ""}"><b>${r.label}</b>${rep(sub, j => `<i${j === sub / 2 - 1 ? ' class="mid"' : ""}></i>`)}</div>`).join("");
      return `<div class="tg" style="--sub:${sub}">${head ? `<div class="tg-head"><span></span>${labels}</div>` : ""}` +
        `<div class="tg-body">${rows}</div></div>`;
    },
    /** 동그라미 척도 1..n */
    scale: (n, cls = "") => `<div class="scale ${cls}">${rep(n, i => `<span>${i + 1}</span>`)}</div>`,
    /** 물컵 n개 */
    cups: n => `<div class="scale cups">${rep(n, () => "<span></span>")}</div>`,
    /** 기분 얼굴 하나 (k: 0 아주 좋음 ~ 4 나쁨) */
    face: k =>
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">` +
      `<circle cx="12" cy="12" r="10.4"/><circle cx="8.6" cy="10" r=".9" fill="currentColor" stroke="none"/>` +
      `<circle cx="15.4" cy="10" r=".9" fill="currentColor" stroke="none"/>` +
      `<path d="M7.6 15.2 Q12 ${[19, 17, 15, 13, 12][k]} 16.4 15.2"/></svg>`,
    /** 기분 얼굴 5단계 (좋음 → 나쁨) */
    faces: (cls = "") => `<div class="scale faces ${cls}">${rep(5, k => `<span>${h.face(k)}</span>`)}</div>`,
    /** 불릿 기호 범례 한 줄 */
    keyLine: () => `<div class="keyline">${[
      ["•", "할 일"], ["×", "완료"], ["&gt;", "이월"], ["&lt;", "일정 이동"], ["○", "이벤트"], ["–", "메모"], ["*", "중요"], ["!", "영감"]
    ].map(([s, t]) => `<span><b>${s}</b>${t}</span>`).join("")}</div>`,

    /**
     * 월 제목. 날짜 지정이면 "10 OCTOBER 2026", 아니면 손으로 적을 빈칸
     * size: "lg" | "sm"
     */
    monthTitle: (ctx, year, month, size = "lg") => ctx.dated
      ? `<div class="mtitle ${size}"><b>${pad(month)}</b><span>${MONTH_EN[month - 1]}</span><em>${year}</em></div>`
      : `<div class="mtitle ${size} blank-t"><b><i></i></b><span>MONTH</span><em><i></i></em></div>`,

    /** 미니 달력 (작은 7칸 그리드) */
    miniCal: (ctx, year, month) => {
      const cells = monthCells(ctx, year, month);
      return `<div class="mc"><div class="mc-h">${weekHead(ctx.weekStart)}</div>` +
        `<div class="mc-b${ctx.dated ? "" : " undated"}">${cells.map(c =>
          `<span class="${dowCls(c.dow)}">${c.d || ""}</span>`).join("")}</div></div>`;
    },

    /**
     * 그달의 날짜 목록: [{ d, dow, letter, cls, we }]
     * 날짜 없음이면 1~31일, 요일은 비워 둔다
     */
    monthDays: ctx => {
      const days = ctx.dated ? new Date(ctx.year, ctx.month, 0).getDate() : 31;
      return Array.from({ length: days }, (_, k) => {
        const d = k + 1;
        if (!ctx.dated) return { d, dow: null, letter: "", cls: "", we: false };
        const dow = new Date(ctx.year, ctx.month - 1, d).getDay();
        return { d, dow, letter: WEEK[dow], cls: dowCls(dow), we: dow === 0 || dow === 6 };
      });
    },

    /**
     * 표. 칸 사이 선은 grid gap 으로 그린다.
     * cols: [{ t: 머리글, w: 너비(기본 1fr), l: 왼쪽 정렬 }]
     * rows: 행 수, cell(r, c) → 문자열 | { html, cls }, rowCls(r) → 행 전체 칸에 붙일 클래스
     */
    table: ({ cols, rows, head = true, cell, rowCls, cls = "" }) => {
      const tmpl = cols.map(c => c.w || "1fr").join(" ");
      const th = head ? cols.map(c => `<span class="th${c.l ? " l" : ""}">${c.t ?? ""}</span>`).join("") : "";
      const body = rep(rows, r => {
        const rc = rowCls ? rowCls(r) || "" : "";
        return cols.map((c, ci) => {
          const v = cell ? cell(r, ci) : "";
          const o = v && typeof v === "object" ? v : { html: v || "" };
          return `<span class="${[c.l ? "l" : "", rc, o.cls || ""].join(" ").trim()}">${o.html ?? ""}</span>`;
        }).join("");
      });
      return `<div class="tbl ${cls}" style="grid-template-columns:${tmpl};grid-template-rows:${head ? "auto " : ""}repeat(${rows},1fr)">${th}${body}</div>`;
    },

    /** 큰 달력 그리드. ko=true면 요일을 한글로 */
    calGrid: (ctx, year, month, ko = false) => {
      const cells = monthCells(ctx, year, month);
      return `<div class="cal"><div class="cal-h">${weekHead(ctx.weekStart, ko)}</div>` +
        `<div class="cal-b${ctx.dated ? "" : " undated"}">${cells.map(c =>
          `<span class="${dowCls(c.dow)}${ctx.dated && !c.d ? " out" : ""}">${c.d || ""}</span>`).join("")}</div></div>`;
    }
  };

  /* ───────────── 상태 ───────────── */
  // 주소의 ?ratio=10x16&size=l 이 저장된 설정보다 우선한다
  const params = new URLSearchParams(location.search);
  if (params.get("ratio")) store.set("ratio", params.get("ratio"));
  if (params.get("size")) store.set("size", params.get("size"));
  let ratio = RATIOS.find(r => r.id === (params.get("ratio") || store.get("ratio"))) || RATIOS[0];
  let page = null;

  const today = new Date();
  const ctx = {
    dated: (params.get("dated") || store.get("dated", "0")) === "1",
    year: +(params.get("year") || today.getFullYear()),
    month: +(params.get("month") || today.getMonth() + 1),
    date: params.get("date") ? new Date(params.get("date") + "T00:00") : today,
    weekStart: +(params.get("ws") || store.get("ws", "0"))
  };

  const el = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const render = v => (typeof v.html === "function" ? v.html(ctx) : v.html);
  const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  /** 디자인 방향을 반영한 크기 */
  function dims(v) {
    const r = ratio;
    return v.land
      ? { ar: `${r.h} / ${r.w}`, mm: [r.mm[1], r.mm[0]], px: [r.px[1], r.px[0]] }
      : { ar: `${r.w} / ${r.h}`, mm: r.mm, px: r.px };
  }

  function dateSuffix() {
    if (!page.date || !ctx.dated) return "";
    if (page.date === "year") return `_${ctx.year}`;
    if (page.date === "month") return `_${ctx.year}-${pad(ctx.month)}`;
    return `_${isoDate(weekDates(ctx)[0])}`;
  }
  const fileName = v => `${page.id}_${v.no}-${v.key}_${ratio.id}${v.land ? "-land" : ""}${dateSuffix()}`;

  // 번호: v.no 가 있으면 그대로(예: "01-A" 파생 디자인), 없으면 01, 02… 순서대로 매긴다
  function numberVariants(variants) {
    let n = 0;
    variants.forEach(v => { if (!v.no) v.no = String(++n).padStart(2, "0"); });
  }

  /* ───────────── 페이지 그리기 ───────────── */
  function mount(opts) {
    page = opts;
    numberVariants(opts.variants);
    const sec = SECTIONS[opts.section];
    const app = document.getElementById("app");

    const siblings = sec.pages.map(p =>
      `<li><a href="${p.href}"${p.id === opts.id ? ' aria-current="page"' : ""}>${p.name}</a></li>`).join("");
    const list = (tag, items) => `<${tag}>${items.map(x => `<li>${x}</li>`).join("")}</${tag}>`;

    app.innerHTML = `
      <header class="hero"><div class="wrap">
        <a class="crumb" href="../index.html#catalog">← 템플릿 분류</a><br>
        <span class="label-bar">${sec.label}</span>
        <h1>${opts.name} <small style="font-size:16px;font-weight:400;color:var(--ink-faint)">${opts.en}</small></h1>
        <p>${opts.summary}</p>
      </div></header>
      <nav class="toc sub" aria-label="같은 분류"><div class="wrap"><ul>${siblings}</ul></div></nav>
      <main class="wrap">
        <section>
          <div class="info-grid">
            <div class="panel"><h3>구성 요소</h3>${list("ul", opts.parts)}</div>
            <div class="panel"><h3>이렇게 쓰세요</h3>${list("ol", opts.usage)}</div>
            <div class="panel"><h3>팁</h3>${list("ul", opts.tips)}</div>
          </div>
        </section>
        <section>
          <h2>디자인 <small>${opts.variants.length}종</small></h2>
          <p class="lead">비율을 고른 뒤 디자인마다 있는 PDF·JPG 버튼으로 내보냅니다. PDF는 인쇄 창에서 "PDF로 저장"을 고르세요.${
            opts.date ? " 날짜를 지정하면 달력 숫자가 채워진 상태로 만들어집니다." : ""}</p>
          <div class="toolbar" id="toolbar"></div>
          <div class="gallery" id="gallery"></div>
        </section>
      </main>
      <footer>하루 불릿저널 템플릿 · ${opts.name}</footer>`;

    renderToolbar();
    renderGallery();
    applyRatio();

    // 페이지를 JS로 그리므로 #v-디자인 링크는 그린 뒤에 직접 이동한다
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  function dateControls() {
    if (!page.date) return "";
    const y0 = today.getFullYear();
    const years = rep(9, k => { const y = y0 - 2 + k; return `<option value="${y}"${y === ctx.year ? " selected" : ""}>${y}년</option>`; });
    const months = rep(12, k => `<option value="${k + 1}"${k + 1 === ctx.month ? " selected" : ""}>${k + 1}월</option>`);
    const pick = page.date === "week"
      ? `<input type="date" class="ctl" data-ctl="date" value="${isoDate(ctx.date)}" aria-label="주에 포함된 날짜">`
      : `<select class="ctl" data-ctl="year" aria-label="연도">${years}</select>` +
        (page.date === "month" ? `<select class="ctl" data-ctl="month" aria-label="월">${months}</select>` : "");
    return `<div class="tb-group"><span class="tb-label">날짜</span>
        <div class="seg" data-seg="dated"><button type="button" data-v="0">없음</button><button type="button" data-v="1">지정</button></div>
        ${pick}</div>`;
  }

  function renderToolbar() {
    const tb = document.getElementById("toolbar");
    const size = params.get("size") || store.get("size", "m");
    tb.innerHTML = `
      <div class="tb-group"><span class="tb-label">비율</span>
        <div class="seg" data-seg="ratio">${RATIOS.map(r =>
          `<button type="button" data-v="${r.id}" title="${r.sub}">${r.name}</button>`).join("")}</div></div>
      ${dateControls()}
      ${page.weekStart ? `<div class="tb-group"><span class="tb-label">주 시작</span>
        <div class="seg" data-seg="ws"><button type="button" data-v="0">일</button><button type="button" data-v="1">월</button></div></div>` : ""}
      <div class="tb-group"><span class="tb-label">미리보기</span>
        <div class="seg" data-seg="size"><button type="button" data-v="m">보통</button><button type="button" data-v="l">크게</button></div></div>
      <span class="tb-spacer"></span>
      <button type="button" class="btn primary" data-act="pdf-all">전체 디자인 PDF</button>
      <div class="tb-info" id="tb-info"></div>`;

    const onSeg = (seg, fn) => {
      const g = tb.querySelector(`[data-seg="${seg}"]`);
      if (g) g.addEventListener("click", e => { const b = e.target.closest("button"); if (b) fn(b.dataset.v); });
    };
    onSeg("ratio", v => { ratio = RATIOS.find(r => r.id === v); store.set("ratio", v); applyRatio(); });
    onSeg("size", v => { store.set("size", v); applySize(v); });
    onSeg("dated", v => { ctx.dated = v === "1"; store.set("dated", v); refresh(); });
    onSeg("ws", v => { ctx.weekStart = +v; store.set("ws", v); refresh(); });
    tb.querySelectorAll("[data-ctl]").forEach(c => c.addEventListener("change", () => {
      const k = c.dataset.ctl;
      if (k === "date") { if (c.value) ctx.date = new Date(c.value + "T00:00"); }
      else ctx[k] = +c.value;
      refresh();
    }));
    tb.querySelector('[data-act="pdf-all"]').addEventListener("click", () =>
      printSheets(page.variants, `${page.id}_all_${ratio.id}${dateSuffix()}`));
    applySize(size);
    syncControls();
  }

  function syncControls() {
    pressed("dated", ctx.dated ? "1" : "0");
    pressed("ws", String(ctx.weekStart));
    document.querySelectorAll("#toolbar [data-ctl]").forEach(c => (c.disabled = !ctx.dated));
  }

  function renderGallery() {
    const g = document.getElementById("gallery");
    page.variants.forEach(v => {
      const card = el(`
        <article class="variant${v.land ? " land" : ""}" id="v-${v.key}">
          <div class="v-head"><span class="v-no">${v.no}</span>
            <div><h3>${v.name}${v.land ? ' <span class="v-tag">가로</span>' : ""}</h3><p>${v.desc}</p></div></div>
          <div class="sheet-frame"><div class="sheet">${render(v)}</div></div>
          <div class="v-actions">
            <button type="button" class="btn" data-act="pdf">PDF</button>
            <button type="button" class="btn" data-act="jpg">JPG</button>
          </div>
        </article>`);
      card.querySelector('[data-act="pdf"]').addEventListener("click", () => printSheets([v], fileName(v)));
      card.querySelector('[data-act="jpg"]').addEventListener("click", e => exportJpg(v, e.currentTarget));
      v.card = card;
      g.append(card);
    });
  }

  /** 날짜 · 주 시작이 바뀌면 시트 내용을 다시 그린다 */
  function refresh() {
    syncControls();
    page.variants.forEach(v => { v.card.querySelector(".sheet").innerHTML = render(v); });
    applyRatio();
  }

  function applyRatio() {
    page.variants.forEach(v => {
      const s = v.card.querySelector(".sheet");
      s.style.setProperty("--ar", dims(v).ar);
      s.dataset.ratio = ratio.id;
    });
    pressed("ratio", ratio.id);
    let info = `${ratio.name} (${ratio.sub}) · PDF ${ratio.mm[0]} × ${ratio.mm[1]} mm · JPG ${ratio.px[0]} × ${ratio.px[1]} px`;
    if (page.variants.some(v => v.land)) info += " · 가로 디자인은 가로 · 세로를 바꿔 씁니다";
    document.getElementById("tb-info").textContent = info;
  }

  function applySize(v) {
    document.getElementById("gallery").classList.toggle("large", v === "l");
    pressed("size", v);
  }

  function pressed(seg, v) {
    document.querySelectorAll(`[data-seg="${seg}"] button`).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
  }

  /* ───────────── PDF (인쇄) ───────────── */
  // 세로는 기본 @page, 가로 디자인은 이름 붙은 @page land 를 써서 한 PDF 안에 방향을 섞을 수 있다
  function printSheets(variants, name) {
    const root = document.createElement("div");
    root.id = "print-root";
    root.innerHTML = variants.map(v => {
      const { mm } = dims(v);
      return `<div class="print-page${v.land ? " land" : ""}" style="width:${mm[0]}mm;height:${mm[1]}mm">` +
        `<div class="sheet-frame"><div class="sheet" data-ratio="${ratio.id}">${render(v)}</div></div></div>`;
    }).join("");

    const [w, hgt] = ratio.mm;
    const style = document.createElement("style");
    style.textContent = `@page { size: ${w}mm ${hgt}mm; margin: 0; } @page land { size: ${hgt}mm ${w}mm; margin: 0; }`;

    const title = document.title;
    document.head.append(style);
    document.body.append(root);
    document.body.classList.add("is-printing");
    document.title = name; // 크롬은 문서 제목을 PDF 파일 이름으로 제안한다

    const cleanup = () => {
      root.remove(); style.remove();
      document.body.classList.remove("is-printing");
      document.title = title;
    };
    window.addEventListener("afterprint", cleanup, { once: true });
    document.fonts.ready.then(() => window.print());
  }

  /* ───────────── JPG ───────────── */
  async function exportJpg(v, btn) {
    if (!window.htmlToImage) { alert("이미지 변환 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요."); return; }
    const [W, H] = dims(v).px;
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = "저장 중…";

    // 목표 픽셀 크기 그대로 화면 밖에 그린 뒤 캡처한다 (cqw 단위가 그대로 확대된다)
    const host = document.createElement("div");
    host.style.cssText = `position:fixed;left:${-W - 200}px;top:0;width:${W}px;pointer-events:none;`;
    host.innerHTML = `<div class="sheet-frame"><div class="sheet" data-ratio="${ratio.id}" style="aspect-ratio:auto;height:${H}px;box-shadow:none">${render(v)}</div></div>`;
    document.body.append(host);

    try {
      await document.fonts.ready;
      await nextFrame();
      const opts = { width: W, height: H, canvasWidth: W, canvasHeight: H, pixelRatio: 1, quality: 0.95, backgroundColor: "#fff" };
      const css = await embedFontCSS();
      if (css) opts.fontEmbedCSS = css; else opts.skipFonts = true;
      const url = await window.htmlToImage.toJpeg(host.querySelector(".sheet"), opts);
      const a = document.createElement("a");
      a.href = url; a.download = fileName(v) + ".jpg";
      document.body.append(a); a.click(); a.remove();
    } catch (e) {
      console.error(e);
      alert("JPG 저장에 실패했습니다: " + (e && e.message ? e.message : e));
    } finally {
      host.remove();
      btn.disabled = false; btn.textContent = label;
    }
  }

  let fontPromise = null;
  function embedFontCSS() {
    if (!fontPromise) {
      fontPromise = Promise.all(FONT_FILES.map(async ([w, n]) => {
        const res = await fetch(`${FONT_BASE}Pretendard-${n}.woff2`);
        if (!res.ok) throw new Error(`font ${res.status}`);
        const blob = await res.blob();
        const data = await new Promise((ok, fail) => {
          const fr = new FileReader();
          fr.onload = () => ok(fr.result);
          fr.onerror = () => fail(fr.error);
          fr.readAsDataURL(blob);
        });
        return `@font-face{font-family:"Pretendard";font-weight:${w};font-style:normal;src:url(${data}) format("woff2");}`;
      })).then(a => a.join("\n")).catch(e => {
        console.warn("폰트 임베드 실패, 시스템 폰트로 저장합니다.", e);
        fontPromise = null;
        return "";
      });
    }
    return fontPromise;
  }

  window.Bujo = { mount, h, RATIOS };
})();
