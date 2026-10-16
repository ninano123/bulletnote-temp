/* 템플릿: paper/grid — paper/grid.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .paper-body.bg-grid { border: var(--hair) solid var(--s-frame); background-position: center; }
  `;

  const { h } = Bujo;
  const head = `<div class="paper-head">${h.dateLine()}<span class="tline">TITLE<i></i></span></div>`;
  const pageNo = `<div class="page-no">PAGE<i></i></div>`;

  const basic = `<div class="pg paper-pg"><div class="paper-body bg-grid"></div>${pageNo}</div>`;
  const major = `<div class="pg paper-pg"><div class="paper-body bg-grid major"></div>${pageNo}</div>`;
  const fine = `<div class="pg paper-pg">${head}<div class="paper-body bg-grid" style="--pitch:1.9cqw"></div>${pageNo}</div>`;

  Bujo.define({
    css: CSS,
    section: "paper",
    id: "paper-grid",
    name: "모눈",
    en: "Grid",
    summary: "가로 · 세로 선이 일정한 간격으로 그어진 모눈 속지입니다. 표, 트래커, 도식, 손글씨 정렬에 좋습니다.",
    parts: [
      "모눈 간격: 페이지 너비의 2.5% (A4 기준 약 5mm), 촘촘형 1.9% (약 4mm)",
      "5칸마다 굵은 선 (공학용)",
      "날짜 · 제목 머리글 (헤더형)",
      "페이지 번호 칸"
    ],
    usage: [
      "노트 앱에 사용자 템플릿으로 등록해 표나 트래커를 직접 그릴 때 씁니다.",
      "공학용은 굵은 선을 기준으로 크기를 세기 쉬워 도면 · 그래프에 맞습니다.",
      "글을 쓸 때는 한 칸 또는 두 칸을 한 줄로 삼으면 줄이 반듯해집니다."
    ],
    tips: [
      "선이 신경 쓰이면 도트 그리드가 더 가볍게 느껴집니다.",
      "직접 만든 트래커를 자주 쓴다면 한 번 그려 둔 페이지를 복사해 쓰세요."
    ],
    variants: [
      { key: "basic", name: "기본 5mm",  desc: "페이지 가득 5mm 모눈.", html: basic },
      { key: "major", name: "공학용",    desc: "5칸마다 굵은 선이 들어간 모눈.", html: major },
      { key: "fine",  name: "헤더 + 4mm", desc: "날짜 · 제목 머리글과 촘촘한 4mm 모눈.", html: fine }
    ]
  });
})();
