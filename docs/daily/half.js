/* 템플릿: daily/half — daily/half.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .half-cut { margin: 3cqw -2cqw; }
  .half-head { margin-bottom: 2cqw; align-items: center; }
  `;

  const { h } = Bujo;

  /** 위아래 두 칸에 같은 구성을 반복하고 가운데 절취선을 넣는다 */
  const stacked = body => {
    const half = `<div class="fx" style="flex:1">
      <div class="head half-head">${h.dateLine()}<span class="bar sm">HALF DAILY</span></div>
      ${body}
    </div>`;
    return `<div class="pg" style="gap:0">${half}<div class="cut half-cut"></div>${half}</div>`;
  };

  const lined = stacked(`<div class="box gut" style="flex:1">${h.lines(12)}<span class="gut-line"></span></div>`);

  const todoNotes = stacked(`
    <div class="cols" style="grid-template-columns:45fr 55fr;flex:1">
      <div class="fx"><div class="ttl">TO DO</div><div class="box" style="flex:1">${h.checks(7)}</div></div>
      <div class="fx"><div class="ttl">NOTES</div><div class="box dots" style="flex:1"></div></div>
    </div>`);

  const sideCol = `
    <div class="fx">
      <div class="bar sm" style="margin-bottom:2cqw">HALF DAILY</div>
      ${h.dateLine()}
      <div class="ttl mt">TO DO</div>
      <div class="box" style="flex:6">${h.checks(6)}</div>
      <div class="ttl mt">LOG</div>
      <div class="box" style="flex:15">${h.lines(15)}</div>
    </div>`;

  const sideBySide = `
  <div class="pg">
    <div class="cols" style="grid-template-columns:1fr auto 1fr;gap:3cqw;flex:1">
      ${sideCol}<div class="vcut"></div>${sideCol}
    </div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "daily",
    id: "daily-half",
    name: "하프 데일리",
    en: "Half-page Daily",
    summary: "한 페이지를 둘로 나눠 이틀을 기록하는 양식입니다. 기록할 내용이 적은 날, 주말, 여행 중에 페이지를 아낄 수 있습니다.",
    parts: [
      "하루 칸 2개 (위 · 아래 또는 좌 · 우)",
      "칸마다 날짜 · 요일",
      "줄지, 할 일 + 노트, 또는 할 일 + 로그",
      "가운데 절취선 (인쇄해서 반으로 잘라 써도 됩니다)"
    ],
    usage: [
      "첫 번째 칸에 오늘 날짜를 적고 기록합니다.",
      "다음 날은 같은 페이지의 두 번째 칸을 씁니다.",
      "남은 할 일은 다음 페이지 첫 칸으로 이월(>)합니다."
    ],
    tips: [
      "주말 이틀(토 · 일)을 한 장에 묶어 쓰기 좋습니다.",
      "좌우 2일 디자인은 세로로 긴 10:16 비율에서 특히 잘 맞습니다.",
      "인쇄해서 쓸 때는 절취선을 따라 잘라 A5 · 반장 크기 다이어리에 붙일 수 있습니다."
    ],
    variants: [
      { key: "lined",      name: "상하 줄지",       desc: "위아래 두 칸, 칸마다 여백선 줄지.",      html: lined },
      { key: "todo-notes", name: "상하 할 일 + 노트", desc: "위아래 두 칸, 칸마다 할 일과 도트 노트.", html: todoNotes },
      { key: "side",       name: "좌우 2일",        desc: "세로로 긴 두 칸. 할 일과 로그를 길게 적습니다.", html: sideBySide }
    ]
  });
})();
