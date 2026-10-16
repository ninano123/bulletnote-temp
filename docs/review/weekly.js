/* 템플릿: review/weekly — review/weekly.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .wrange { display: flex; align-items: baseline; gap: 1.2cqw; font-size: 1.5cqw; white-space: nowrap; }
  .wrange b { font-size: 2.2cqw; font-weight: 700; }
  .wrange em { color: var(--s-faint); }
  .wrange i { display: inline-block; width: 4cqw; height: 2cqw; border-bottom: var(--hair) solid var(--s-frame); vertical-align: bottom; }
  .rate-box { height: 6.4cqw; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 2cqw; }
  .rate-box small { font-size: 1.1cqw; color: var(--s-faint); }

  /* KPT 세 칸 */
  .kpt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2cqw; }
  .kpt > div { display: flex; flex-direction: column; min-height: 0; border: var(--hair) solid var(--s-frame); }
  .kpt b { flex: none; padding: 1cqw 1.4cqw; font-size: 1.4cqw; font-weight: 700; letter-spacing: .06em; border-bottom: var(--stroke) solid var(--s-soft); display: flex; justify-content: space-between; align-items: baseline; }
  .kpt b small { font-size: 1.05cqw; font-weight: 400; color: var(--s-faint); letter-spacing: 0; }
  .kpt .lines { flex: 1 1 0; }

  /* 질문형 */
  .qa { flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; gap: 1.8cqw; }
  .qa > div { flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; }
  .qa .q { flex: none; display: flex; gap: 1.2cqw; align-items: baseline; font-size: 1.35cqw; font-weight: 600; margin-bottom: .6cqw; }
  .qa .q span { font-size: 1.7cqw; font-weight: 700; color: var(--s-line); }
  .qa .lines { flex: 1 1 0; border-top: var(--hair) solid var(--s-line); }
  .qa .lines > i:last-child { border-bottom: var(--hair) solid var(--s-line); }
  `;

  const { h } = Bujo;

  function range(ctx) {
    if (!ctx.dated) return `<div class="wrange"><b>WEEK</b><i></i><em>.</em><i></i><em>—</em><i></i><em>.</em><i></i></div>`;
    const w = h.weekDates(ctx);
    return `<div class="wrange"><b>${w[0].getFullYear()}. ${h.pad(w[0].getMonth() + 1)}. ${h.pad(w[0].getDate())}</b><em>—</em><b>${h.pad(w[6].getMonth() + 1)}. ${h.pad(w[6].getDate())}</b></div>`;
  }

  const kpt = ctx => `
  <div class="pg">
    <div class="head"><div class="bar">WEEKLY REVIEW</div>${range(ctx)}</div>
    <div class="cols" style="grid-template-columns:62fr 38fr">
      <div class="fx"><div class="ttl">HIGHLIGHTS <small>이번 주 가장 좋았던 일</small></div><div class="box" style="height:13cqw">${h.numLines(3)}</div></div>
      <div class="fx">
        <div class="ttl">SCORE <small>이번 주 점수</small></div><div class="box rate-box">${h.scale(5)}<small>/ 5</small></div>
        <div class="ttl mt" style="margin-top:1.6cqw">GOALS <small>달성</small></div><div class="box" style="height:4.4cqw;flex-direction:row;align-items:flex-end;padding:0 1.6cqw .8cqw"><span class="blank" style="flex:1"></span><span class="unit" style="margin-left:.6cqw">/</span><span class="blank" style="width:5cqw;margin-left:.6cqw"></span></div>
      </div>
    </div>
    <div class="kpt" style="flex:1">
      <div><b>KEEP<small>계속할 것</small></b>${h.markLines(9, "•")}</div>
      <div><b>PROBLEM<small>문제였던 것</small></b>${h.markLines(9, "•")}</div>
      <div><b>TRY<small>다음에 해 볼 것</small></b>${h.markLines(9, "•")}</div>
    </div>
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="fx"><div class="ttl">NEXT WEEK TOP 3 <small>다음 주 핵심</small></div><div class="box" style="height:11cqw">${h.checks(3)}</div></div>
      <div class="fx"><div class="ttl">THANKS <small>고마운 사람 · 일</small></div><div class="box" style="height:11cqw">${h.lines(3)}</div></div>
    </div>
  </div>`;

  const QUESTIONS = [
    "이번 주 가장 잘한 일은?",
    "이번 주에 배운 것은?",
    "에너지를 준 것과 빼앗은 것은?",
    "아쉬웠던 점, 다르게 해 볼 수 있었던 것은?",
    "고마운 사람은 누구이고 왜인가?",
    "다음 주에 가장 집중할 한 가지는?",
    "다음 주의 나에게 한 마디"
  ];
  const questions = ctx => `
  <div class="pg">
    <div class="head"><div class="bar">WEEKLY QUESTIONS</div>${range(ctx)}</div>
    <div class="qa">${QUESTIONS.map((q, k) => `<div><div class="q"><span>${k + 1}</span>${q}</div>${h.lines(k === 6 ? 2 : 3)}</div>`).join("")}</div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "review",
    id: "weekly-review",
    name: "주간 회고",
    en: "Weekly Review",
    date: "week",
    weekStart: true,
    summary: "한 주를 마치며 잘된 것과 아쉬운 것을 정리하고 다음 주를 준비하는 페이지입니다. KPT(Keep · Problem · Try) 방식과 질문형 두 가지가 있습니다.",
    parts: [
      "주 범위 (날짜 지정 시 자동 채움)",
      "하이라이트 · 점수 · 목표 달성",
      "KEEP · PROBLEM · TRY",
      "다음 주 핵심 3가지 · 고마운 일",
      "질문 7개 (질문형)"
    ],
    usage: [
      "일요일 저녁이나 금요일 오후에 15분을 정해 둡니다.",
      "이번 주 위클리 · 데일리를 훑어보며 좋았던 일을 하이라이트에 적습니다.",
      "계속할 것, 문제였던 것, 다음에 해 볼 것을 나눠 적습니다.",
      "다음 주 핵심 3가지를 정해 다음 위클리 페이지로 옮깁니다."
    ],
    tips: [
      "PROBLEM은 남 탓보다 내가 바꿀 수 있는 것 위주로 적으세요.",
      "TRY는 작고 구체적으로. \"운동하기\"보다 \"화 · 목 아침 20분 걷기\"처럼요.",
      "질문형은 생각이 잘 안 떠오르는 주에 쓰기 좋습니다."
    ],
    variants: [
      { key: "kpt",       name: "KPT",   desc: "하이라이트, 점수, Keep · Problem · Try, 다음 주 핵심 3가지.", html: kpt },
      { key: "questions", name: "질문형", desc: "한 주를 돌아보는 질문 7개에 답을 적습니다.", html: questions }
    ]
  });
})();
