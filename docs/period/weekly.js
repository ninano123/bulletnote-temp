/* 템플릿: period/weekly — period/weekly.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  /* 주 범위 제목 */
  .wrange { display: flex; align-items: baseline; gap: 1.2cqw; font-size: 1.5cqw; white-space: nowrap; }
  .wrange b { font-size: 2.6cqw; font-weight: 700; letter-spacing: -.01em; }
  .wrange em { color: var(--s-faint); }
  .wrange i { display: inline-block; width: 4cqw; height: 2cqw; border-bottom: var(--hair) solid var(--s-frame); vertical-align: bottom; }

  /* 요일 칸 */
  .wd { display: flex; flex-direction: column; min-height: 0; border: var(--hair) solid var(--s-frame); }
  .wd-h { flex: none; display: flex; align-items: baseline; gap: .9cqw; padding: .7cqw 1.3cqw; border-bottom: var(--hair) solid var(--s-line); background: #f8f9f9; }
  .wd-h b { font-size: 1.3cqw; font-weight: 600; letter-spacing: .08em; }
  .wd-h span { font-size: 1.3cqw; color: var(--s-soft); }
  .wd-h span.blankd { display: inline-block; width: 3cqw; border-bottom: var(--hair) solid var(--s-frame); height: 1.4cqw; }
  .wd > .lines, .wd > .dots { flex: 1 1 0; }
  .stack { display: flex; flex-direction: column; gap: 1.4cqw; min-height: 0; }
  .stack > .wd { flex: 1 1 0; }

  /* 습관 체크 표 */
  .hab { display: grid; grid-template-columns: 1fr repeat(7, 2.4cqw); grid-auto-rows: 1fr; flex: 1 1 0; min-height: 0; }
  .hab > span { display: flex; align-items: center; justify-content: center; border-bottom: var(--hair) solid var(--s-line); font-size: 1.05cqw; color: var(--s-soft); }
  .hab > span.nm { justify-content: flex-start; padding-left: 1cqw; }
  .hab > span.hd { font-weight: 600; border-bottom-color: var(--s-frame); }
  .hab u { width: 1.5cqw; height: 1.5cqw; border: var(--hair) solid var(--s-frame); border-radius: 50%; }

  /* 가로 스프레드 */
  .spread { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 1fr 1fr; gap: 1.6cqw; }

  /* 가로 타임라인 */
  .wt { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 3.6cqw repeat(7, 1fr); border: var(--hair) solid var(--s-frame); }
  .wt-col { display: flex; flex-direction: column; min-height: 0; border-right: var(--hair) solid var(--s-line); }
  .wt-col:last-child { border-right: 0; }
  .wt-col > * { flex: 1 1 0; min-height: 0; border-bottom: var(--hair) solid var(--s-line); display: flex; align-items: center; justify-content: center; font-size: 1.05cqw; color: var(--s-faint); }
  .wt-col > *:last-child { border-bottom: 0; }
  .wt-col > .dh { flex: none; height: 3.6cqw; background: #f8f9f9; gap: .6cqw; color: var(--s-ink); border-bottom-color: var(--s-frame); }
  .wt-col > .dh b { font-weight: 600; font-size: 1.1cqw; letter-spacing: .06em; }
  .wt-col > .dh span { color: var(--s-soft); font-size: 1.1cqw; }
  .wt-col > .top { flex: 2.2 1 0; border-bottom: var(--stroke) solid var(--s-soft); align-items: flex-start; justify-content: flex-start; padding: .4cqw .6cqw; font-size: .95cqw; letter-spacing: .06em; }
  .wt-col > .half { border-bottom-style: dashed; }
  `;

  const { h } = Bujo;
  const DOW3 = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  /** 이번 주 7일: [{ dow, name, d(날짜 숫자 | ""), cls }] */
  function days(ctx) {
    if (ctx.dated) return h.weekDates(ctx).map(dt => ({ dow: dt.getDay(), name: DOW3[dt.getDay()], d: dt.getDate(), cls: h.dowCls(dt.getDay()) }));
    return Array.from({ length: 7 }, (_, i) => { const dow = h.dowAt(i, ctx.weekStart); return { dow, name: DOW3[dow], d: "", cls: h.dowCls(dow) }; });
  }

  /** 주 범위 제목: 2026. 10. 12 — 10. 18 */
  function range(ctx) {
    if (!ctx.dated) return `<div class="wrange"><b>WEEK</b><i></i><em>.</em><i></i><em>—</em><i></i><em>.</em><i></i></div>`;
    const w = h.weekDates(ctx), a = w[0], b = w[6];
    return `<div class="wrange"><b>${a.getFullYear()}. ${h.pad(a.getMonth() + 1)}. ${h.pad(a.getDate())}</b><em>—</em><b>${h.pad(b.getMonth() + 1)}. ${h.pad(b.getDate())}</b></div>`;
  }

  const dayHead = x => `<div class="wd-h"><b class="${x.cls}">${x.name}</b>${x.d !== "" ? `<span class="${x.cls}">${x.d}</span>` : '<span class="blankd"></span>'}</div>`;
  const dayBox = (x, body) => `<div class="wd">${dayHead(x)}${body}</div>`;

  const habits = ctx => {
    const ds = days(ctx);
    return `<div class="hab"><span class="hd nm">HABIT</span>${ds.map(x => `<span class="hd ${x.cls}">${x.name[0]}</span>`).join("")}` +
      h.rep(6, () => `<span class="nm"></span>${h.rep(7, () => "<span><u></u></span>")}`) + `</div>`;
  };

  const vertical = ctx => `
  <div class="pg sat-blue">
    <div class="head"><div class="bar">WEEKLY</div>${range(ctx)}</div>
    <div class="cols" style="grid-template-columns:64fr 36fr;flex:1;gap:3cqw">
      <div class="stack">${days(ctx).map(x => dayBox(x, h.lines(3))).join("")}</div>
      <div class="fx">
        <div class="ttl">GOALS <small>이번 주 목표</small></div><div class="box" style="flex:4">${h.checks(4)}</div>
        <div class="ttl mt">HABITS</div><div class="box" style="flex:6">${habits(ctx)}</div>
        <div class="ttl mt">NOTES</div><div class="box dots" style="flex:8"></div>
      </div>
    </div>
  </div>`;

  const spread = ctx => `
  <div class="pg sat-blue" style="padding:4.2cqw 4.2cqw 3.8cqw;gap:2cqw">
    <div class="head"><div class="bar">WEEKLY SPREAD</div>${range(ctx)}</div>
    <div class="spread">
      ${days(ctx).map(x => dayBox(x, h.lines(6))).join("")}
      <div class="wd"><div class="wd-h"><b>NOTES</b><span>· GOALS</span></div><div class="dots"></div></div>
    </div>
  </div>`;

  const timeline = ctx => {
    const hours = [];
    for (let hr = 6; hr <= 23; hr++) hours.push(hr);
    const label = `<div class="wt-col"><span class="dh"></span><span class="top"></span>${hours.map(hr => `<span>${hr}</span>`).join("")}</div>`;
    const cols = days(ctx).map(x => `<div class="wt-col"><span class="dh"><b class="${x.cls}">${x.name}</b>${x.d !== "" ? `<span class="${x.cls}">${x.d}</span>` : ""}</span>` +
      `<span class="top">TOP</span>${hours.map(() => "<span></span>").join("")}</div>`).join("");
    return `
  <div class="pg sat-blue" style="padding:4.2cqw 4.2cqw 3.8cqw;gap:2cqw">
    <div class="head"><div class="bar">WEEKLY TIMELINE</div>${range(ctx)}</div>
    <div class="wt">${label}${cols}</div>
  </div>`;
  };

  Bujo.define({
    css: CSS,
    section: "period",
    id: "weekly-spread",
    name: "위클리",
    en: "Weekly Spread",
    date: "week",
    weekStart: true,
    summary: "일주일을 한눈에 보는 페이지입니다. 세로 디자인 하나와 가로 디자인 둘을 제공합니다. 날짜를 지정하면 그 날짜가 속한 주의 날짜가 채워집니다.",
    parts: [
      "주 범위 (시작일 — 종료일)",
      "요일별 칸 7개",
      "주간 목표 · 습관 체크 · 노트 (세로)",
      "요일 × 시간 타임라인 (가로 타임라인)"
    ],
    usage: [
      "툴바에서 날짜 \"지정\"을 고르고 그 주의 아무 날짜나 선택합니다.",
      "주 시작 요일(일 · 월)을 고릅니다.",
      "일요일 밤이나 월요일 아침에 이번 주 목표와 일정을 적습니다.",
      "매일 그날 칸에 한 줄씩 기록하고, 습관 칸을 채웁니다."
    ],
    tips: [
      "가로 디자인은 태블릿을 가로로 쓸 때 펼침면처럼 보입니다.",
      "타임라인 디자인은 근무 · 수업 시간표를 고정해 두고 남은 시간을 계획하기 좋습니다.",
      "주말 칸이 작게 느껴지면 주 시작을 월요일로 바꿔 보세요. 토 · 일이 끝에 나란히 놓입니다."
    ],
    variants: [
      { key: "vertical", name: "세로형",     desc: "요일 7칸을 세로로 쌓고, 오른쪽에 목표 · 습관 · 노트.", html: vertical },
      { key: "spread",   name: "가로 스프레드", desc: "4 × 2 칸에 7일과 노트. 가장 일반적인 위클리 스프레드.", html: spread, land: true },
      { key: "timeline", name: "가로 타임라인", desc: "요일별 TOP 칸과 6~23시 시간 칸. 주간 타임 블로킹용.", html: timeline, land: true }
    ]
  });
})();
