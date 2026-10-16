/* 템플릿: period/year — period/year.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  /* 연도 제목 */
  .ytitle { display: flex; align-items: baseline; gap: 1.6cqw; white-space: nowrap; }
  .ytitle b { font-size: 4.6cqw; font-weight: 700; line-height: 1; letter-spacing: -.01em; }
  .ytitle b i { display: inline-block; width: 13cqw; height: 4.4cqw; border-bottom: var(--hair) solid var(--s-frame); vertical-align: bottom; }
  .ytitle span { font-size: 1.4cqw; font-weight: 600; letter-spacing: .18em; color: var(--s-soft); }

  /* 12개월 미니 달력 */
  .ym-grid { flex: 1 1 0; min-height: 0; display: grid; gap: 2.6cqw 3.2cqw; align-content: space-between; }
  .ym { display: flex; flex-direction: column; gap: .8cqw; border-top: var(--stroke) solid var(--s-soft); padding-top: 1cqw; }
  .ym-h { display: flex; align-items: baseline; gap: 1cqw; }
  .ym-h b { font-size: 2cqw; font-weight: 700; }
  .ym-h span { font-size: 1.05cqw; font-weight: 600; letter-spacing: .14em; color: var(--s-soft); }

  /* Year in pixels */
  .px { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 3.4cqw repeat(12, 1fr); grid-template-rows: auto repeat(31, 1fr); border-left: var(--hair) solid var(--s-line); border-top: var(--hair) solid var(--s-line); }
  .px > span { border-right: var(--hair) solid var(--s-line); border-bottom: var(--hair) solid var(--s-line); display: flex; align-items: center; justify-content: center; font-size: 1cqw; color: var(--s-faint); min-height: 0; }
  .px > span.mh { font-weight: 600; color: var(--s-soft); letter-spacing: .06em; padding: .6cqw 0; background: #f8f9f9; }
  .px > span.dl { background: #f8f9f9; }
  .px > span.no { background: repeating-linear-gradient(135deg, #eef0f0 0 .35cqw, #fff .35cqw .7cqw); }
  .px-legend { display: flex; flex-wrap: wrap; gap: 1cqw 2.4cqw; font-size: 1.15cqw; color: var(--s-soft); }
  .px-legend span { display: inline-flex; align-items: center; gap: .8cqw; }
  .px-legend u { width: 2cqw; height: 2cqw; border: var(--hair) solid var(--s-frame); }
  .px-legend i { display: inline-block; width: 9cqw; border-bottom: var(--hair) solid var(--s-frame); height: 1.6cqw; }
  `;

  const { h } = Bujo;

  const yearTitle = (ctx, label) =>
    `<div class="ytitle"><b>${ctx.dated ? ctx.year : "<i></i>"}</b><span>${label}</span></div>`;

  /** 1~12월 미니 달력 블록 */
  const months = ctx => h.rep(12, k =>
    `<div class="ym"><div class="ym-h"><b>${h.pad(k + 1)}</b><span>${h.MONTH_EN[k]}</span></div>${h.miniCal(ctx, ctx.year, k + 1)}</div>`);

  const glance = ctx => `
  <div class="pg sat-blue">
    <div class="head"><div class="bar">YEAR AT A GLANCE</div>${yearTitle(ctx, "YEAR")}</div>
    <div class="ym-grid" style="grid-template-columns:repeat(3,1fr)">${months(ctx)}</div>
    <div class="fx"><div class="ttl">GOALS <small>올해의 목표</small></div><div class="box" style="height:13cqw">${h.numLines(4)}</div></div>
  </div>`;

  /** 그해에 없는 날짜인지 (날짜 없음이면 2월 29일은 있다고 본다) */
  const missing = (ctx, m, d) => {
    const days = ctx.dated ? new Date(ctx.year, m, 0).getDate() : [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
    return d > days;
  };

  const pixels = ctx => {
    let cells = '<span class="mh"></span>' + h.rep(12, k => `<span class="mh">${h.MONTH_SHORT[k][0]}</span>`);
    for (let d = 1; d <= 31; d++) {
      cells += `<span class="dl">${d}</span>` + h.rep(12, k => `<span${missing(ctx, k + 1, d) ? ' class="no"' : ""}></span>`);
    }
    return `
  <div class="pg">
    <div class="head"><div class="bar">YEAR IN PIXELS</div>${yearTitle(ctx, "MOOD · HABIT")}</div>
    <div class="px">${cells}</div>
    <div class="px-legend">${h.rep(5, () => "<span><u></u><i></i></span>")}</div>
  </div>`;
  };

  const landscape = ctx => `
  <div class="pg sat-blue" style="padding:4.2cqw 4.2cqw 3.8cqw;gap:2cqw">
    <div class="head"><div class="bar">YEAR AT A GLANCE</div>${yearTitle(ctx, "YEAR")}</div>
    <div class="ym-grid" style="grid-template-columns:repeat(6,1fr);gap:2cqw 2.2cqw">${months(ctx)}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr;gap:2.6cqw">
      <div class="fx"><div class="ttl">GOALS <small>올해의 목표</small></div><div class="box" style="height:9cqw">${h.numLines(3)}</div></div>
      <div class="fx"><div class="ttl">KEY DATES <small>기념일 · 큰 일정</small></div><div class="box" style="height:9cqw">${h.markLines(3, "○")}</div></div>
    </div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "period",
    id: "year-at-a-glance",
    name: "연간 개요",
    en: "Year at a Glance",
    date: "year",
    weekStart: true,
    summary: "한 해를 한 장에 담는 페이지입니다. 12개월 미니 달력으로 큰 일정을 표시하거나, Year in Pixels로 하루 한 칸씩 기분 · 습관을 칠합니다.",
    parts: [
      "연도 표시",
      "1~12월 미니 달력",
      "올해의 목표 · 중요한 날",
      "Year in Pixels: 12개월 × 31일 칸과 색상 범례"
    ],
    usage: [
      "툴바에서 날짜 \"지정\"을 고르고 연도를 선택하면 그해 달력이 채워집니다.",
      "연초에 올해의 목표와 기념일 · 시험 · 여행 같은 큰 일정을 표시합니다.",
      "Year in Pixels는 범례 5칸에 색과 의미(예: 최고 · 좋음 · 보통 · 별로 · 나쁨)를 정하고, 매일 그날 칸을 칠합니다."
    ],
    tips: [
      "Year in Pixels에서 빗금 칸은 그해에 없는 날짜입니다. 날짜를 지정하지 않으면 2월 29일은 칸으로 남겨 둡니다.",
      "기분 대신 운동 · 독서 같은 습관 하나를 정해 1년 동안 칠해도 좋습니다.",
      "연간 개요는 저널 맨 앞, 퓨처 로그 바로 앞에 두면 찾기 쉽습니다."
    ],
    variants: [
      { key: "glance",    name: "12개월 달력",   desc: "3 × 4 미니 달력과 올해의 목표.", html: glance },
      { key: "pixels",    name: "Year in Pixels", desc: "12개월 × 31일 칸. 하루 한 칸씩 기분이나 습관을 색으로 칠합니다.", html: pixels },
      { key: "landscape", name: "가로 12개월",   desc: "가로 방향 6 × 2 미니 달력과 목표 · 중요한 날.", html: landscape, land: true }
    ]
  });
})();
