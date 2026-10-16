/* 템플릿: period/monthly-log — period/monthly-log.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  /* 날짜 목록 줄: 날짜 | 요일 | 내용 */
  .days > i { gap: 0; }
  .days .dn { flex: none; width: 4.2cqw; text-align: center; font-size: 1.25cqw; color: var(--s-soft); }
  .days .dw { flex: none; width: 3cqw; text-align: center; font-size: 1.1cqw; color: var(--s-faint); border-right: var(--hair) solid var(--s-line); align-self: stretch; display: flex; align-items: center; justify-content: center; }
  .days > i.we { background: #f8f9f9; }

  /* 02 로그 + 트래커 표 */
  .mt-grid { display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; border: var(--hair) solid var(--s-frame); }
  .mt-row { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 4.2cqw 3cqw 1fr repeat(6, 3.4cqw); border-bottom: var(--hair) solid var(--s-line); }
  .mt-row:last-child { border-bottom: 0; }
  .mt-row > * { display: flex; align-items: center; justify-content: center; border-right: var(--hair) solid var(--s-line); font-size: 1.15cqw; color: var(--s-soft); min-width: 0; }
  .mt-row > :last-child { border-right: 0; }
  .mt-row .ev { justify-content: flex-start; }
  .mt-row.we { background: #f8f9f9; }
  .mt-row.hd { flex: none; height: 10cqw; border-bottom: var(--stroke) solid var(--s-soft); }
  .mt-row.hd > * { font-size: 1.05cqw; font-weight: 600; letter-spacing: .05em; color: var(--s-soft); }
  .mt-row.hd .hb { align-items: flex-end; padding-bottom: .6cqw; color: var(--s-faint); font-weight: 400; }
  `;

  const { h } = Bujo;

  /** 날짜 목록 행 데이터. 날짜 지정이면 그달 날수 · 요일, 아니면 31일 · 요일 빈칸 */
  function dayList(ctx, from = 1, to = null) {
    const days = ctx.dated ? new Date(ctx.year, ctx.month, 0).getDate() : 31;
    const last = Math.min(to || days, days);
    const out = [];
    for (let d = from; d <= last; d++) {
      const dow = ctx.dated ? new Date(ctx.year, ctx.month - 1, d).getDay() : null;
      out.push({ d, dow, letter: dow === null ? "" : h.WEEK[dow], cls: dow === null ? "" : h.dowCls(dow), we: dow === 0 || dow === 6 });
    }
    return out;
  }

  /** 날짜 · 요일 · 내용 줄. rows 를 주면 그 수만큼 칸을 맞춘다(빈 줄로 채움) */
  const dayLines = (list, rows = list.length) =>
    `<div class="lines days">${list.map(r =>
      `<i class="${r.we ? "we" : ""}"><span class="dn ${r.cls}">${r.d}</span><span class="dw ${r.cls}">${r.letter}</span></i>`).join("")}${
      h.rep(rows - list.length, () => '<i><span class="dn"></span><span class="dw"></span></i>')}</div>`;

  const classic = ctx => `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">MONTHLY LOG</div></div>
    <div class="cols" style="grid-template-columns:44fr 56fr;flex:1">
      <div class="fx"><div class="ttl">CALENDAR <small>날짜별 일정</small></div><div class="box" style="flex:1">${dayLines(dayList(ctx), 31)}</div></div>
      <div class="fx"><div class="ttl">TASKS <small>• 이달의 할 일</small></div><div class="box" style="flex:1">${h.markLines(31, "•")}</div></div>
    </div>
  </div>`;

  const tracker = ctx => {
    const list = dayList(ctx);
    const rows = list.map(r => `<div class="mt-row${r.we ? " we" : ""}"><span class="${r.cls}">${r.d}</span><span class="${r.cls}">${r.letter}</span><span class="ev"></span>${h.rep(6, () => "<span></span>")}</div>`).join("") +
      h.rep(31 - list.length, () => `<div class="mt-row"><span></span><span></span><span class="ev"></span>${h.rep(6, () => "<span></span>")}</div>`);
    return `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">LOG + TRACKER</div></div>
    <div class="mt-grid">
      <div class="mt-row hd"><span>DAY</span><span></span><span>EVENTS · 일정</span>${h.rep(6, () => '<span class="hb"></span>')}</div>
      ${rows}
    </div>
  </div>`;
  };

  const goals = ctx => {
    const list = dayList(ctx);
    return `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">MONTHLY PLAN</div></div>
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="fx"><div class="ttl">GOALS <small>이달의 목표</small></div><div class="box" style="height:11cqw">${h.checks(3)}</div></div>
      <div class="fx"><div class="ttl">FOCUS <small>집중할 습관 · 키워드</small></div><div class="box" style="height:11cqw">${h.markLines(3, "•")}</div></div>
    </div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:1;gap:3cqw">
      <div class="box" style="flex:1">${dayLines(list.slice(0, 16), 16)}</div>
      <div class="box" style="flex:1">${dayLines(list.slice(16), 16)}</div>
    </div>
    <div class="cols" style="grid-template-columns:3fr 2fr">
      <div class="fx"><div class="ttl">REVIEW <small>이달의 회고</small></div><div class="box" style="height:10cqw">${h.lines(3)}</div></div>
      <div class="fx"><div class="ttl">NEXT MONTH <small>다음 달로</small></div><div class="box" style="height:10cqw">${h.markLines(3, "&gt;")}</div></div>
    </div>
  </div>`;
  };

  Bujo.define({
    css: CSS,
    section: "period",
    id: "monthly-log",
    name: "먼슬리 로그",
    en: "Monthly Log",
    date: "month",
    summary: "원조 불릿저널 방식의 월간 페이지입니다. 왼쪽에 날짜를 세로로 늘어놓고 일정을 한 줄씩 적고, 오른쪽에는 이달에 할 일을 모읍니다.",
    parts: [
      "월 제목",
      "1~31일 세로 날짜 목록 (날짜 지정 시 요일 · 주말 표시)",
      "이달의 할 일 목록",
      "디자인에 따라 미니 습관 트래커, 목표 · 회고 칸"
    ],
    usage: [
      "월초에 날짜 목록 옆에 정해진 일정을 적습니다.",
      "이달 안에 할 일을 오른쪽 TASKS에 모읍니다.",
      "데일리 페이지에서 처리하지 못한 일은 이 목록으로 옮기거나(<) 다음 달로 넘깁니다(>).",
      "월말에 남은 할 일을 다음 달 먼슬리 로그로 이월합니다."
    ],
    tips: [
      "날짜를 지정하지 않으면 31줄이 그대로 나옵니다. 짧은 달은 남는 줄을 메모로 쓰세요.",
      "로그 + 트래커 디자인의 오른쪽 6칸 머리에는 습관 이름을 세로로 적습니다.",
      "먼슬리 캘린더와 펼침면으로 함께 쓰면 일정은 달력에, 할 일은 로그에 나눠 적을 수 있습니다."
    ],
    variants: [
      { key: "classic", name: "원조형",       desc: "왼쪽 날짜별 일정, 오른쪽 이달의 할 일. 라이더 캐롤의 기본 먼슬리 로그.", html: classic },
      { key: "tracker", name: "로그 + 트래커", desc: "날짜마다 일정 한 줄과 습관 6개 체크 칸.", html: tracker },
      { key: "goals",   name: "목표 · 회고형", desc: "목표와 집중 키워드, 두 단 날짜 목록, 월말 회고와 다음 달 이월 칸.", html: goals }
    ]
  });
})();
