/* 템플릿: paper/lined — paper/lined.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  /* 코넬 노트 */
  .cornell { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 27fr 73fr; grid-template-rows: 1fr auto; border: var(--hair) solid var(--s-frame); }
  .cornell > div { position: relative; min-height: 0; }
  .cornell .cue { border-right: var(--stroke) solid var(--s-soft); }
  .cornell .sum { grid-column: 1 / -1; height: 26cqw; border-top: var(--stroke) solid var(--s-soft); }
  .cornell .lbl { position: absolute; top: .6cqw; left: 1cqw; font-size: 1cqw; font-weight: 600; letter-spacing: .1em; color: var(--s-faint); background: #fff; padding: 0 .4cqw; }
  .cornell .bg-lined { position: absolute; inset: 0; }
  `;

  const { h } = Bujo;
  const head = `<div class="paper-head">${h.dateLine()}<span class="tline">TITLE<i></i></span></div>`;
  const pageNo = `<div class="page-no">PAGE<i></i></div>`;

  const basic = `<div class="pg paper-pg">${head}<div class="paper-body bg-lined"></div>${pageNo}</div>`;

  const margin = `<div class="pg paper-pg">${head}<div class="paper-body bg-lined" style="--pitch:2.9cqw"><span class="gut-line" style="left:7cqw"></span></div>${pageNo}</div>`;

  const cornell = `
  <div class="pg paper-pg">
    ${head}
    <div class="cornell">
      <div class="cue"><div class="bg-lined"></div><span class="lbl">CUE · 키워드 · 질문</span></div>
      <div><div class="bg-lined"></div><span class="lbl">NOTES · 필기</span></div>
      <div class="sum"><div class="bg-lined"></div><span class="lbl">SUMMARY · 요약</span></div>
    </div>
    ${pageNo}
  </div>`;

  Bujo.define({
    css: CSS,
    section: "paper",
    id: "paper-lined",
    name: "줄지",
    en: "Lined",
    summary: "가로줄 속지입니다. 긴 글, 일기, 강의 · 회의 필기처럼 문장을 많이 쓰는 날에 맞습니다.",
    parts: [
      "줄 간격: 기본 페이지 너비의 3.3% (A4 기준 약 7mm), 여백선형 2.9% (약 6mm)",
      "날짜 · 제목 머리글",
      "왼쪽 여백선 (여백선형)",
      "키워드 · 필기 · 요약 영역 (코넬 노트)"
    ],
    usage: [
      "기본 줄지는 일기나 긴 글을 쓸 때 사용합니다.",
      "여백선형은 여백에 불릿 기호나 시각을 적고 오른쪽에 내용을 씁니다.",
      "코넬 노트는 수업 · 회의 중 오른쪽에 필기하고, 끝난 뒤 왼쪽에 키워드 · 질문을, 아래에 요약을 적습니다."
    ],
    tips: [
      "태블릿에서 글씨를 크게 쓰는 편이면 기본(7mm), 작게 쓰는 편이면 여백선형(6mm)이 편합니다.",
      "코넬 노트의 왼쪽 키워드만 보고 내용을 떠올려 보면 복습이 됩니다."
    ],
    variants: [
      { key: "basic",   name: "기본 줄지", desc: "머리글과 7mm 줄.", html: basic },
      { key: "margin",  name: "여백선 줄지", desc: "왼쪽 여백선과 6mm 줄.", html: margin },
      { key: "cornell", name: "코넬 노트",  desc: "키워드 · 필기 · 요약 세 영역으로 나눈 필기용 줄지.", html: cornell }
    ]
  });
})();
