/* 템플릿: tracker/health — tracker/health.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .cups8 { display: flex; gap: .35cqw; }
  .cups8 u { width: 1.15cqw; height: 1.45cqw; border: var(--hair) solid var(--s-frame); border-radius: 0 0 .4cqw .4cqw; }
  .mini5 { display: flex; gap: .5cqw; }
  .mini5 u { width: 1.3cqw; height: 1.3cqw; border: var(--hair) solid var(--s-frame); border-radius: 50%; }
  .dh { display: flex; flex-direction: column; align-items: center; line-height: 1.25; }
  .dh small { font-size: .85cqw; font-weight: 400; }
  .wl { width: 100%; height: 100%; display: flex; align-items: flex-end; padding: 0 .5cqw .3cqw; }
  .wl i { flex: 1; border-bottom: var(--hair) solid var(--s-frame); }
  `;

  const { h } = Bujo;
  const cups = '<span class="cups8">' + h.rep(8, () => "<u></u>") + "</span>";
  const five = '<span class="mini5">' + h.rep(5, () => "<u></u>") + "</span>";
  const dayHead = x => `<span class="dh"><b class="${x.cls}">${x.d}</b>${x.letter ? `<small class="${x.cls}">${x.letter}</small>` : ""}</span>`;

  const daily = ctx => {
    const days = h.monthDays(ctx);
    return `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">HEALTH TRACKER</div></div>
    ${h.table({
      cols: [{ t: "DAY", w: "3.8cqw" }, { t: "", w: "2.8cqw" }, { t: "WATER", w: "13cqw" }, { t: "MOVE", w: "4.6cqw" }, { t: "운동", l: true }, { t: "분", w: "5.4cqw" }, { t: "걸음", w: "7.4cqw" }, { t: "체중", w: "6.6cqw" }],
      rows: 31,
      rowCls: r => (days[r] && days[r].we ? "we" : r >= days.length ? "no" : ""),
      cell: (r, c) => {
        const x = days[r];
        if (!x) return "";
        return [{ html: x.d, cls: x.cls }, { html: x.letter, cls: x.cls }, cups, '<u class="cb"></u>', "", "", "", ""][c];
      }
    })}
    <div class="cols" style="grid-template-columns:1fr 1fr 1fr">
      ${["GOAL · 목표", "TOTAL · 합계", "NOTE · 메모"].map(t => `<div class="fx"><div class="ttl">${t}</div><div class="box" style="height:7cqw">${h.lines(2)}</div></div>`).join("")}
    </div>
  </div>`;
  };

  const weightWorkout = ctx => {
    const days = h.monthDays(ctx);
    const gcols = [{ t: "kg", w: "6cqw" }, ...days.map(x => ({ t: dayHead(x) }))];
    return `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">WEIGHT &amp; WORKOUT</div></div>
    <div class="fx" style="flex:4"><div class="ttl">WEIGHT <small>왼쪽에 기준 체중을 적고 날마다 점을 찍습니다</small></div>
      ${h.table({ cols: gcols, rows: 10, cell: (r, c) => (c === 0 ? '<span class="wl"><i></i></span>' : { html: "", cls: days[c - 1].we ? "we" : "" }) })}</div>
    <div class="fx" style="flex:5"><div class="ttl">WORKOUT LOG <small>운동 기록</small></div>
      ${h.table({ cols: [{ t: "DATE", w: "7cqw" }, { t: "운동", l: true }, { t: "시간", w: "7cqw" }, { t: "강도", w: "9.4cqw" }, { t: "메모", l: true }], rows: 14, cell: (r, c) => (c === 3 ? five : "") })}</div>
  </div>`;
  };

  Bujo.define({
    css: CSS,
    section: "tracker",
    id: "health-tracker",
    name: "건강 트래커",
    en: "Health Tracker",
    date: "month",
    summary: "물 섭취, 운동, 걸음 수, 체중 같은 건강 지표를 한 달 단위로 기록합니다.",
    parts: [
      "월 제목",
      "날짜별 물(8컵) · 운동 여부 · 운동 종류 · 시간 · 걸음 · 체중",
      "체중 그래프 (기준 체중을 직접 적는 눈금)",
      "운동 기록 표 (종류 · 시간 · 강도 · 메모)"
    ],
    usage: [
      "물을 한 컵 마실 때마다 컵을 하나씩 칠합니다.",
      "운동한 날 MOVE 칸에 체크하고 종류와 시간을 적습니다.",
      "체중 그래프는 왼쪽 눈금에 0.5kg 또는 1kg 간격으로 숫자를 적은 뒤, 날마다 점을 찍어 잇습니다."
    ],
    tips: [
      "물 8컵은 약 2L 기준입니다. 컵 크기에 맞게 바꿔 세세요.",
      "체중은 매일보다 같은 요일 · 같은 시간에 재는 편이 흐름을 보기 좋습니다.",
      "운동 강도는 숨찬 정도로 1~5를 정해 두면 비교하기 쉽습니다."
    ],
    variants: [
      { key: "daily",  name: "데일리 건강표", desc: "날짜마다 물 · 운동 · 걸음 · 체중을 한 줄에.", html: daily },
      { key: "weight", name: "체중 · 운동",   desc: "체중 꺾은선 그래프와 운동 기록 표.", html: weightWorkout }
    ]
  });
})();
