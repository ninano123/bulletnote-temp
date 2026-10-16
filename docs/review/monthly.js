/* 템플릿: review/monthly — review/monthly.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .res3 { display: flex; gap: 1.2cqw; font-size: 1.05cqw; color: var(--s-faint); }
  .res3 span { display: inline-flex; align-items: center; gap: .4cqw; }
  .res3 u { width: 1.3cqw; height: 1.3cqw; border: var(--hair) solid var(--s-frame); border-radius: 50%; }
  .wheel { width: 70cqw; aspect-ratio: 1; align-self: center; flex: none; }
  .wheel svg { width: 100%; height: 100%; display: block; }
  `;

  const { h } = Bujo;
  const res3 = '<span class="res3"><span><u></u>달성</span><span><u></u>일부</span><span><u></u>못함</span></span>';

  const basic = ctx => `
  <div class="pg">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">MONTHLY REVIEW</div></div>
    <div class="fx" style="flex:2.4"><div class="ttl">GOALS <small>이달의 목표와 결과</small></div>
      ${h.table({ cols: [{ t: "목표", l: true }, { t: "결과", w: "18cqw" }, { t: "메모", w: "22cqw", l: true }], rows: 5, cell: (r, c) => (c === 1 ? res3 : "") })}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:2.4">
      <div class="fx"><div class="ttl">HABITS <small>습관 트래커 요약</small></div>
        ${h.table({ cols: [{ t: "습관", l: true }, { t: "일수", w: "7cqw" }, { t: "%", w: "6cqw" }], rows: 5 })}</div>
      <div class="fx"><div class="ttl">NUMBERS <small>이달의 숫자</small></div>
        ${h.table({ cols: [{ t: "항목", l: true }, { t: "값", w: "13cqw" }], rows: 5 })}</div>
    </div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:2">
      <div class="fx"><div class="ttl">HIGHLIGHTS <small>좋았던 일</small></div><div class="box" style="flex:1">${h.numLines(4)}</div></div>
      <div class="fx"><div class="ttl">LESSONS <small>배운 것 · 아쉬운 것</small></div><div class="box" style="flex:1">${h.lines(4)}</div></div>
    </div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:2">
      <div class="fx"><div class="ttl">MIGRATION <small>다음 달로 옮길 일</small></div><div class="box" style="flex:1">${h.markLines(4, "&gt;")}</div></div>
      <div class="fx"><div class="ttl">NEXT MONTH <small>다음 달 목표</small></div><div class="box" style="flex:1">${h.checks(4)}</div></div>
    </div>
  </div>`;

  const AREAS = ["건강", "일 · 커리어", "돈", "관계", "가족", "성장", "즐거움", "공간 · 환경"];
  const wheelSvg = (() => {
    const c = 100, n = AREAS.length, step = 7.6;
    const pt = (r, a) => [(c + r * Math.sin(a)).toFixed(2), (c - r * Math.cos(a)).toFixed(2)];
    let s = "";
    for (let k = 10; k >= 1; k--) s += `<circle cx="${c}" cy="${c}" r="${k * step}" fill="${k % 2 ? "#fff" : "#fafbfb"}" stroke="${k === 10 ? "#9da2a4" : "#e1e4e5"}" stroke-width="${k === 10 ? .35 : .25}"/>`;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI;
      const [x, y] = pt(10 * step, a);
      s += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="#cfd3d4" stroke-width=".25"/>`;
      const [lx, ly] = pt(10 * step + 9, a + Math.PI / n);
      s += `<text x="${lx}" y="${ly}" font-size="4.2" font-weight="600" fill="#2b2d2e" text-anchor="middle" dominant-baseline="central">${AREAS[i]}</text>`;
    }
    for (let k = 2; k <= 10; k += 2) {
      const [x, y] = pt(k * step, Math.PI / n);
      s += `<text x="${x}" y="${y}" font-size="2.6" fill="#a3a8aa" text-anchor="middle" dominant-baseline="central">${k}</text>`;
    }
    return `<svg viewBox="0 0 200 200">${s}</svg>`;
  })();

  const wheel = ctx => `
  <div class="pg">
    <div class="head"><div class="bar">WHEEL OF LIFE</div>${h.monthTitle(ctx, ctx.year, ctx.month, "sm")}</div>
    <div class="ttl" style="margin:0"><small>영역마다 이달의 만족도(1~10)만큼 칸을 칠하고, 꼭짓점을 이어 모양을 봅니다.</small></div>
    <div class="wheel">${wheelSvg}</div>
    ${h.table({ cols: [{ t: "영역", w: "14cqw", l: true }, { t: "점수", w: "7cqw" }, { t: "다음 달에 해 볼 한 가지", l: true }], rows: 8, cell: (r, c) => (c === 0 ? AREAS[r] : "") })}
  </div>`;

  Bujo.define({
    css: CSS,
    section: "review",
    id: "monthly-review",
    name: "월간 회고",
    en: "Monthly Review",
    date: "month",
    summary: "한 달을 돌아보고 다음 달을 준비하는 페이지입니다. 목표와 트래커 결과를 정리하고, 끝내지 못한 일을 다음 달로 옮깁니다.",
    parts: [
      "월 제목",
      "목표별 결과 (달성 · 일부 · 못함)",
      "습관 트래커 요약 · 이달의 숫자",
      "좋았던 일 · 배운 것",
      "다음 달로 옮길 일 · 다음 달 목표",
      "삶의 수레바퀴 (8개 영역 × 10단계)"
    ],
    usage: [
      "월말에 이달의 먼슬리 · 트래커 · 데일리를 훑어봅니다.",
      "목표마다 결과를 표시하고, 습관 달성 일수와 %를 옮겨 적습니다.",
      "끝내지 못한 일은 아직 필요한지 따져 보고, 필요하면 MIGRATION에 적어 다음 달 먼슬리 로그로 옮깁니다.",
      "수레바퀴는 영역마다 만족도만큼 칠한 뒤, 점수가 낮은 영역에서 다음 달에 해 볼 한 가지를 정합니다."
    ],
    tips: [
      "이달의 숫자에는 읽은 책 권수, 운동 횟수, 지출 합계처럼 셀 수 있는 것을 적습니다.",
      "옮기는 데 귀찮음이 느껴지는 일은 사실 중요하지 않은 일일 수 있습니다. 과감히 지우세요.",
      "수레바퀴는 매달 같은 영역으로 기록해야 변화가 보입니다."
    ],
    variants: [
      { key: "basic", name: "기본형",     desc: "목표 결과, 습관 요약, 좋았던 일 · 배운 것, 이월, 다음 달 목표.", html: basic },
      { key: "wheel", name: "삶의 수레바퀴", desc: "8개 영역 만족도를 원형 차트에 칠하고 다음 달 행동을 정합니다.", html: wheel }
    ]
  });
})();
