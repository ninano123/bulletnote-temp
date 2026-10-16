/* 템플릿: collection/meal — collection/meal.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .wrange { display: flex; align-items: baseline; gap: 1.2cqw; font-size: 1.5cqw; white-space: nowrap; }
  .wrange b { font-size: 2.2cqw; font-weight: 700; }
  .wrange em { color: var(--s-faint); }
  .wrange i { display: inline-block; width: 4cqw; height: 2cqw; border-bottom: var(--hair) solid var(--s-frame); vertical-align: bottom; }
  .dh { display: flex; flex-direction: column; align-items: center; line-height: 1.3; }
  .dh small { font-size: 1cqw; font-weight: 400; color: var(--s-soft); }
  `;

  const { h } = Bujo;
  const DOW3 = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const MEALS = [["BREAKFAST", "아침"], ["LUNCH", "점심"], ["DINNER", "저녁"], ["SNACK", "간식"]];

  function days(ctx) {
    if (ctx.dated) return h.weekDates(ctx).map(dt => ({ name: DOW3[dt.getDay()], d: dt.getDate(), cls: h.dowCls(dt.getDay()) }));
    return Array.from({ length: 7 }, (_, i) => { const dow = h.dowAt(i, ctx.weekStart); return { name: DOW3[dow], d: "", cls: h.dowCls(dow) }; });
  }
  function range(ctx) {
    if (!ctx.dated) return `<div class="wrange"><b>WEEK</b><i></i><em>.</em><i></i><em>—</em><i></i><em>.</em><i></i></div>`;
    const w = h.weekDates(ctx);
    return `<div class="wrange"><b>${h.pad(w[0].getMonth() + 1)}. ${h.pad(w[0].getDate())}</b><em>—</em><b>${h.pad(w[6].getMonth() + 1)}. ${h.pad(w[6].getDate())}</b></div>`;
  }
  const dayLabel = x => `<span class="dh"><b class="${x.cls}">${x.name}</b>${x.d !== "" ? `<small class="${x.cls}">${x.d}</small>` : ""}</span>`;

  const weekly = ctx => {
    const ds = days(ctx);
    return `
  <div class="pg sat-blue">
    <div class="head"><div class="bar">MEAL PLANNER</div>${range(ctx)}</div>
    <div class="fx" style="flex:5">${h.table({
      cols: [{ t: "", w: "7cqw" }, ...MEALS.map(([e, k]) => ({ t: `${e} <span style="font-weight:400;color:var(--s-faint);margin-left:.6cqw">${k}</span>` }))],
      rows: 7,
      cell: (r, c) => (c === 0 ? dayLabel(ds[r]) : "")
    })}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:2.6">
      <div class="fx"><div class="ttl">GROCERY <small>장보기</small></div>
        <div class="cols" style="grid-template-columns:1fr 1fr;gap:0;flex:1;border:var(--hair) solid var(--s-frame)">${h.checks(8)}${h.checks(8)}</div></div>
      <div class="fx"><div class="ttl">PREP <small>미리 준비할 것</small></div><div class="box" style="flex:1">${h.markLines(8, "•")}</div></div>
    </div>
  </div>`;
  };

  const landscape = ctx => {
    const ds = days(ctx);
    return `
  <div class="pg sat-blue" style="padding:4.2cqw 4.2cqw 3.8cqw;gap:2cqw">
    <div class="head"><div class="bar">MEAL PLANNER</div>${range(ctx)}</div>
    <div class="cols" style="grid-template-columns:78fr 22fr;flex:1;gap:2.4cqw">
      <div class="fx">${h.table({
        cols: [{ t: "", w: "9cqw" }, ...ds.map(x => ({ t: dayLabel(x) }))],
        rows: 4,
        cell: (r, c) => (c === 0 ? `<span class="dh"><b>${MEALS[r][0]}</b><small>${MEALS[r][1]}</small></span>` : "")
      })}</div>
      <div class="fx"><div class="ttl">GROCERY <small>장보기</small></div><div class="box" style="flex:1">${h.checks(14)}</div></div>
    </div>
  </div>`;
  };

  Bujo.define({
    css: CSS,
    section: "collection",
    id: "meal-planner",
    name: "식단 계획",
    en: "Meal Planner",
    date: "week",
    weekStart: true,
    summary: "일주일 식단과 장볼 목록을 함께 짭니다. 식단을 먼저 정하면 장보기와 도시락 준비가 쉬워지고 식비도 줄어듭니다.",
    parts: [
      "주 범위 (날짜 지정 시 자동 채움)",
      "요일 × 아침 · 점심 · 저녁 · 간식 표",
      "장보기 체크리스트",
      "미리 준비할 것 (세로형)"
    ],
    usage: [
      "주말에 다음 주 식단을 칸마다 적습니다.",
      "식단에 필요한 재료 중 집에 없는 것을 장보기에 적습니다.",
      "장을 보며 체크하고, 손질 · 반찬 만들기처럼 미리 할 일은 PREP에 적습니다."
    ],
    tips: [
      "남은 재료를 다음 끼니에 이어 쓰도록 식단을 짜면 버리는 음식이 줄어듭니다.",
      "외식하는 끼니도 적어 두면 한 주 식비를 가늠하기 쉽습니다.",
      "지출 트래커의 식비 분류와 함께 보면 효과를 확인할 수 있습니다."
    ],
    variants: [
      { key: "weekly",    name: "주간 식단표", desc: "요일 7줄 × 끼니 4칸, 아래에 장보기와 준비할 것.", html: weekly },
      { key: "landscape", name: "가로형",     desc: "가로 방향. 요일 7열 × 끼니 4줄과 장보기 목록.", html: landscape, land: true }
    ]
  });
})();
