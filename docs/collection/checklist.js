/* 템플릿: collection/checklist — collection/checklist.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .title-line { display: flex; align-items: flex-end; gap: 1.4cqw; flex: 1; min-width: 30cqw; }
  .title-line b { font-size: 1.4cqw; font-weight: 600; letter-spacing: .06em; }
  .title-line i { flex: 1; height: 2.6cqw; border-bottom: var(--hair) solid var(--s-frame); }
  .cat-t { display: flex; align-items: flex-end; gap: 1cqw; margin-bottom: 1cqw; }
  .cat-t b { font-size: 2cqw; font-weight: 700; color: var(--s-line); line-height: 1; }
  .cat-t i { flex: 1; height: 2.4cqw; border-bottom: var(--stroke) solid var(--s-soft); }
  .q4 { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 3cqw; }
  `;

  const { h } = Bujo;
  const titleLine = `<div class="title-line"><b>TITLE</b><i></i></div>`;

  const twoCol = `
  <div class="pg">
    <div class="head"><div class="bar">CHECKLIST</div>${titleLine}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:1;gap:3cqw">
      <div class="box">${h.checks(24)}</div>
      <div class="box">${h.checks(24)}</div>
    </div>
  </div>`;

  const categories = `
  <div class="pg">
    <div class="head"><div class="bar">CHECKLIST</div>${titleLine}</div>
    <div class="q4">${h.rep(4, k => `
      <div class="fx"><div class="cat-t"><b>${k + 1}</b><i></i></div><div class="box" style="flex:1">${h.checks(10)}</div></div>`)}</div>
  </div>`;

  const packing = `
  <div class="pg">
    <div class="head"><div class="bar">PACKING LIST</div>${titleLine}</div>
    <div class="dateline"><b>DATE</b><i></i><em>~</em><i></i><b style="margin-left:2.4cqw">TO</b><i style="width:20cqw"></i></div>
    ${h.table({
      cols: [{ t: "#", w: "3.6cqw" }, { t: "항목", l: true }, { t: "수량", w: "6cqw" }, { t: "챙김", w: "6cqw" }, { t: "돌아올 때", w: "8cqw" }],
      rows: 28,
      cell: (r, c) => (c === 0 ? r + 1 : c >= 3 ? '<u class="cb"></u>' : "")
    })}
  </div>`;

  Bujo.define({
    css: CSS,
    section: "collection",
    id: "checklist",
    name: "체크리스트",
    en: "Checklist",
    summary: "장보기, 준비물, 할 일 묶음처럼 확인하며 지워 나가는 목록입니다.",
    parts: [
      "제목 줄",
      "체크박스 목록 (2단 48칸)",
      "번호 붙은 분류 4칸",
      "준비물 표 (수량 · 챙김 · 돌아올 때)"
    ],
    usage: [
      "제목에 목록의 이름을 적습니다. 예: 이사 준비, 장보기, 출장 준비물.",
      "항목을 적고, 끝내거나 챙기면 체크합니다.",
      "분류형은 칸마다 분류 이름(예: 옷, 세면도구, 전자기기, 서류)을 적고 나눠 씁니다.",
      "준비물 표는 떠날 때 \"챙김\", 돌아올 때 \"돌아올 때\" 칸에 다시 체크해 빠뜨린 물건을 막습니다."
    ],
    tips: [
      "자주 쓰는 목록(여행 준비물, 주간 장보기)은 한 번 만들어 두고 복사해 쓰세요.",
      "노트 앱에서 체크박스 위에 도장 · 스티커 기능을 쓰면 빠르게 지울 수 있습니다."
    ],
    variants: [
      { key: "two-col",    name: "2단 목록",   desc: "체크박스 24줄 × 2단. 가장 단순한 범용 체크리스트.", html: twoCol },
      { key: "categories", name: "분류 4칸",   desc: "분류 이름을 적는 4칸에 각각 체크박스 10줄.", html: categories },
      { key: "packing",    name: "준비물 표",  desc: "여행 · 출장용. 수량, 챙김, 돌아올 때 확인 칸.", html: packing }
    ]
  });
})();
