/* 템플릿: setup/index — setup/index.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .cats { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); gap: 2.4cqw 3cqw; }
  `;

  const { h } = Bujo;
  const COLS = [{ t: "주제", l: true }, { t: "페이지", w: "11cqw" }];
  const vol = `<div class="dateline"><b>VOL.</b><i style="width:5cqw"></i></div>`;

  const single = `
  <div class="pg">
    <div class="head"><div class="bar">INDEX</div>${vol}</div>
    ${h.table({ cols: COLS, rows: 34 })}
  </div>`;

  const twoCol = `
  <div class="pg">
    <div class="head"><div class="bar">INDEX</div>${vol}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:1;gap:3cqw">
      <div class="fx">${h.table({ cols: [{ t: "주제", l: true }, { t: "쪽", w: "8cqw" }], rows: 34 })}</div>
      <div class="fx">${h.table({ cols: [{ t: "주제", l: true }, { t: "쪽", w: "8cqw" }], rows: 34 })}</div>
    </div>
  </div>`;

  const CATS = [["DAILY", "데일리"], ["MONTHLY", "먼슬리 · 위클리"], ["COLLECTIONS", "컬렉션"], ["TRACKERS", "트래커"], ["REVIEWS", "회고"], ["OTHERS", "기타"]];
  const byCategory = `
  <div class="pg">
    <div class="head"><div class="bar">INDEX</div>${vol}</div>
    <div class="cats">${CATS.map(([e, k]) =>
      `<div class="fx"><div class="ttl">${e} <small>${k}</small></div>${h.table({ cols: [{ t: "주제", l: true }, { t: "쪽", w: "8cqw" }], rows: 8, head: false })}</div>`).join("")}</div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "setup",
    id: "index",
    name: "인덱스",
    en: "Index",
    summary: "주제별 페이지 위치를 적는 색인입니다. 저널이 두꺼워져도 원하는 페이지를 바로 찾을 수 있습니다.",
    parts: [
      "권 번호",
      "주제 · 페이지 번호 표 (34줄 또는 2단 68줄)",
      "분류별 색인 6칸 (데일리 · 먼슬리 · 컬렉션 · 트래커 · 회고 · 기타)"
    ],
    usage: [
      "새 컬렉션이나 월을 시작할 때마다 인덱스에 주제와 페이지 번호를 적습니다.",
      "같은 주제가 여러 곳에 흩어져 있으면 \"독서 기록 12, 45, 78\"처럼 이어 적습니다.",
      "데일리는 날마다 적지 말고 \"10월 데일리 20~51\"처럼 범위로 적습니다."
    ],
    tips: [
      "노트 앱의 링크 · 북마크 기능이 있다면 인덱스의 주제마다 해당 페이지 링크를 걸어 두세요.",
      "분류별 색인은 컬렉션이 많은 저널에서 찾기가 더 빠릅니다."
    ],
    variants: [
      { key: "single",   name: "단일 목록", desc: "주제 · 페이지 34줄.", html: single },
      { key: "two-col",  name: "2단 목록",  desc: "주제 · 쪽 34줄 × 2단.", html: twoCol },
      { key: "category", name: "분류별",    desc: "데일리 · 먼슬리 · 컬렉션 · 트래커 · 회고 · 기타 6칸.", html: byCategory }
    ]
  });
})();
