/* 템플릿: tracker/habit — tracker/habit.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .dh { display: flex; flex-direction: column; align-items: center; line-height: 1.25; }
  .dh small { font-size: .85cqw; font-weight: 400; }
  .hn { height: 9cqw; }

  /* 원형 트래커 */
  .ring-wrap { position: relative; width: 82cqw; aspect-ratio: 1; align-self: center; }
  .ring-wrap svg { width: 100%; height: 100%; display: block; }
  .ring-c { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .ring-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2cqw 4cqw; }
  .ring-legend > span { display: flex; align-items: flex-end; gap: 1.2cqw; font-size: 1.2cqw; color: var(--s-soft); }
  .ring-legend b { font-weight: 600; color: var(--s-ink); width: 2cqw; }
  .ring-legend i { flex: 1; border-bottom: var(--hair) solid var(--s-frame); height: 2.2cqw; }
  `;

  const { h } = Bujo;

  const dayHead = x => `<span class="dh"><b class="${x.cls}">${x.d}</b>${x.letter ? `<small class="${x.cls}">${x.letter}</small>` : ""}</span>`;

  const horizontal = ctx => {
    const days = h.monthDays(ctx);
    const cols = [{ t: "HABIT", w: "13cqw", l: true }, ...days.map(x => ({ t: dayHead(x) })), { t: "%", w: "3.4cqw" }];
    return `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">HABIT TRACKER</div></div>
    <div class="fx" style="flex:4">${h.table({ cols, rows: 16, cell: (r, c) => (c > 0 && c <= days.length && days[c - 1].we ? { cls: "we" } : "") })}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="fx"><div class="ttl">REWARD <small>다 채우면 나에게 줄 보상</small></div><div class="box" style="height:9cqw">${h.lines(2)}</div></div>
      <div class="fx"><div class="ttl">NOTES</div><div class="box" style="height:9cqw">${h.lines(2)}</div></div>
    </div>
  </div>`;
  };

  const vertical = ctx => {
    const days = h.monthDays(ctx);
    const cols = [{ t: "DAY", w: "3.8cqw" }, { t: "", w: "2.8cqw" }, ...Array.from({ length: 8 }, () => ({ t: '<i class="hn"></i>' })), { t: "MEMO", w: "2.2fr", l: true }];
    return `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">HABIT TRACKER</div></div>
    ${h.table({
      cols, rows: 31,
      rowCls: r => (days[r] && days[r].we ? "we" : r >= days.length ? "no" : ""),
      cell: (r, c) => {
        const x = days[r];
        if (!x) return "";
        if (c === 0) return { html: x.d, cls: x.cls };
        if (c === 1) return { html: x.letter, cls: x.cls };
        return "";
      }
    })}
  </div>`;
  };

  /** 원형 트래커 SVG: 날짜 = 부채꼴, 습관 = 고리 */
  const ring = ctx => {
    const days = h.monthDays(ctx);
    const n = days.length, rings = 6, R0 = 30, R1 = 88, step = (R1 - R0) / rings;
    const pt = (r, a) => `${(100 + r * Math.sin(a)).toFixed(2)} ${(100 - r * Math.cos(a)).toFixed(2)}`;
    let paths = "";
    days.forEach((x, k) => {
      const a0 = (k / n) * 2 * Math.PI, a1 = ((k + 1) / n) * 2 * Math.PI;
      for (let i = 0; i < rings; i++) {
        const r = R0 + i * step, R = r + step;
        paths += `<path d="M${pt(R, a0)} A${R} ${R} 0 0 1 ${pt(R, a1)} L${pt(r, a1)} A${r} ${r} 0 0 0 ${pt(r, a0)} Z" fill="${x.we ? "#f6f7f7" : "#fff"}"/>`;
      }
      const am = ((k + .5) / n) * 2 * Math.PI, [tx, ty] = pt(94, am).split(" ");
      const color = x.dow === 0 ? "#c0605a" : x.dow === 6 ? "#4f7cb8" : "#6b7072";
      paths += `<text x="${tx}" y="${ty}" font-size="3.3" fill="${color}" stroke="none" text-anchor="middle" dominant-baseline="central">${x.d}</text>`;
    });
    const ringLabels = h.rep(rings, i => {
      const [tx, ty] = pt(R0 + (i + .5) * step, 0).split(" ");
      return `<text x="${+tx - 1.2}" y="${ty}" font-size="2.6" fill="#a3a8aa" text-anchor="end" dominant-baseline="central">${i + 1}</text>`;
    });
    return `
  <div class="pg sat-blue">
    <div class="head"><div class="bar">HABIT RING</div>${h.monthTitle(ctx, ctx.year, ctx.month, "sm")}</div>
    <div class="ring-wrap">
      <svg viewBox="0 0 200 200" stroke="#cfd3d4" stroke-width=".3">${paths}<g stroke="none">${ringLabels}</g>
        <circle cx="100" cy="100" r="${R0}" fill="none" stroke="#9da2a4" stroke-width=".35"/></svg>
      <div class="ring-c">${ctx.dated ? `<div class="mtitle sm" style="flex-direction:column;align-items:center;gap:.4cqw"><b>${h.pad(ctx.month)}</b><span>${h.MONTH_EN[ctx.month - 1]}</span></div>` : ""}</div>
    </div>
    <div class="fx"><div class="ttl">HABITS <small>안쪽 1번 고리부터</small></div>
      <div class="ring-legend">${h.rep(rings, i => `<span><b>${i + 1}</b><i></i></span>`)}</div></div>
    <div class="fx" style="flex:1"><div class="ttl">NOTES</div><div class="box dots" style="flex:1"></div></div>
  </div>`;
  };

  Bujo.define({
    css: CSS,
    section: "tracker",
    id: "habit-tracker",
    name: "습관 트래커",
    en: "Habit Tracker",
    date: "month",
    summary: "매일 반복하고 싶은 습관을 한 달 동안 칸 채우기로 기록합니다. 끊기지 않고 이어지는 칸이 다음 날도 하게 만드는 동기가 됩니다.",
    parts: [
      "월 제목",
      "습관 이름 칸",
      "1~31일 체크 칸 (날짜 지정 시 그달 날수 · 요일 · 주말 표시)",
      "달성률 · 보상 · 메모 칸"
    ],
    usage: [
      "월초에 이번 달 지킬 습관을 적습니다. 처음에는 3~5개가 적당합니다.",
      "습관을 지킨 날 그 칸을 칠하거나 ×를 그립니다.",
      "월말에 칠한 칸 수로 달성률(%)을 적고, 다음 달 습관을 조정합니다."
    ],
    tips: [
      "세로형은 습관 이름을 머리글 칸에 세로로 적습니다.",
      "원형은 안쪽 고리가 1번 습관입니다. 하루가 지날 때마다 시계 방향으로 한 칸씩 칠합니다.",
      "못 지킨 날을 비워 두기보다 이유를 짧게 메모하면 패턴이 보입니다."
    ],
    variants: [
      { key: "horizontal", name: "가로 그리드", desc: "습관 16줄 × 날짜 칸. 가장 기본적인 습관 트래커.", html: horizontal },
      { key: "vertical",   name: "세로 그리드", desc: "날짜 31줄 × 습관 8칸과 메모. 하루 한 줄씩 채웁니다.", html: vertical },
      { key: "ring",       name: "원형",       desc: "날짜를 부채꼴로, 습관 6개를 고리로 칠하는 원형 트래커.", html: ring }
    ]
  });
})();
