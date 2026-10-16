/* 템플릿: paper/dot — paper/dot.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const { h } = Bujo;
  const head = `<div class="paper-head">${h.dateLine()}<span class="tline">TITLE<i></i></span></div>`;
  const pageNo = `<div class="page-no">PAGE<i></i></div>`;

  const plain = `<div class="pg paper-pg"><div class="paper-body dots"></div>${pageNo}</div>`;
  const withHead = `<div class="pg paper-pg">${head}<div class="paper-body dots"></div>${pageNo}</div>`;
  const fine = `<div class="pg paper-pg">${head}<div class="paper-body dots fine"></div>${pageNo}</div>`;

  Bujo.define({
    section: "paper",
    id: "paper-dot",
    name: "도트 그리드",
    en: "Dot Grid",
    summary: "불릿저널의 표준 속지입니다. 점이 일정한 간격으로 찍혀 있어 글을 쓰기도, 표나 그림을 그리기도 좋습니다.",
    parts: [
      "도트 간격: 기본 페이지 너비의 2.5% (A4 기준 약 5mm), 촘촘형 1.9% (약 4mm)",
      "날짜 · 제목 머리글 (헤더형)",
      "페이지 번호 칸"
    ],
    usage: [
      "노트 앱에 \"사용자 템플릿\"으로 등록해 새 페이지를 추가할 때마다 고릅니다.",
      "점을 따라 줄 맞춰 글을 쓰거나, 점을 이어 표 · 트래커를 직접 그립니다.",
      "페이지 번호를 적어 두면 인덱스에서 찾기 쉽습니다."
    ],
    tips: [
      "도트 간격은 비율과 상관없이 페이지 너비에 맞춰 같은 개수로 찍힙니다.",
      "작은 글씨를 쓰거나 그림을 정밀하게 그릴 때는 촘촘형이 편합니다.",
      "다른 템플릿이 맞지 않는 날에는 도트 한 장으로 자유롭게 기록하세요."
    ],
    variants: [
      { key: "plain", name: "기본",     desc: "머리글 없이 페이지 가득 도트. 페이지 번호만.", html: plain },
      { key: "head",  name: "헤더형",   desc: "날짜 · 제목 머리글과 도트.", html: withHead },
      { key: "fine",  name: "촘촘한 도트", desc: "약 4mm 간격의 촘촘한 도트와 머리글.", html: fine }
    ]
  });
})();
