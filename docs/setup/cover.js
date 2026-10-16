/* 템플릿: setup/cover — setup/cover.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .fields { display: flex; flex-direction: column; gap: 2.2cqw; }
  .fields > div { display: flex; align-items: flex-end; gap: 2cqw; }
  .fields b { flex: none; width: 10cqw; font-size: 1.3cqw; font-weight: 600; letter-spacing: .12em; color: var(--s-soft); }
  .fields i { flex: 1; height: 2.6cqw; border-bottom: var(--hair) solid var(--s-frame); }

  /* 01 미니멀 */
  .min { align-items: center; justify-content: space-between; text-align: center; padding: 14cqw 12cqw 12cqw; }
  .min .kicker { font-size: 1.5cqw; letter-spacing: .5em; color: var(--s-soft); }
  .min .year { font-size: 16cqw; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
  .min .year i { display: inline-block; width: 40cqw; height: 14cqw; border-bottom: var(--stroke) solid var(--s-ink); }
  .min .rule { width: 8cqw; border-top: var(--stroke) solid var(--s-ink); }
  .min .fields { width: 100%; text-align: left; }

  /* 02 바 */
  .vol { display: flex; align-items: baseline; gap: 2cqw; }
  .vol b { font-size: 1.4cqw; font-weight: 600; letter-spacing: .14em; color: var(--s-soft); }
  .vol span { font-size: 12cqw; font-weight: 700; line-height: .9; letter-spacing: -.02em; }
  .vol span i { display: inline-block; width: 22cqw; height: 10cqw; border-bottom: var(--stroke) solid var(--s-ink); }
  .big-title { font-size: 5cqw; font-weight: 700; letter-spacing: .02em; line-height: 1.1; }

  /* 03 프레임 */
  .frame-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .frame { width: 62cqw; background: #fff; border: var(--stroke) solid var(--s-ink); padding: 5cqw 5cqw 4.4cqw; display: flex; flex-direction: column; align-items: center; gap: 3cqw; text-align: center; }
  .frame .kicker { font-size: 1.3cqw; letter-spacing: .4em; color: var(--s-soft); }
  .frame .ttl-l { width: 100%; height: 6cqw; border-bottom: var(--hair) solid var(--s-frame); display: flex; align-items: flex-end; justify-content: center; font-size: 4.2cqw; font-weight: 700; }
  .frame .fields { width: 100%; text-align: left; gap: 1.8cqw; }
  `;

  const { h } = Bujo;
  const fields = (list) => `<div class="fields">${list.map(t => `<div><b>${t}</b><i></i></div>`).join("")}</div>`;
  const yearOr = (ctx, blank) => (ctx.dated ? ctx.year : blank);

  const minimal = ctx => `
  <div class="pg min">
    <div class="kicker">BULLET JOURNAL</div>
    <div class="fx" style="align-items:center;gap:3cqw">
      <div class="year">${yearOr(ctx, "<i></i>")}</div>
      <div class="rule"></div>
    </div>
    ${fields(["NAME", "START", "END", "NO."])}
  </div>`;

  const barStyle = ctx => `
  <div class="pg">
    <div class="bar" style="font-size:1.9cqw;padding:1.4cqw 3cqw">DAILY BULLET JOURNAL</div>
    <div class="vol" style="margin-top:6cqw"><b>VOL.</b><span><i></i></span></div>
    <div class="big-title">${ctx.dated ? `${ctx.year}` : ""}</div>
    <div class="box dots" style="flex:1"></div>
    <div class="cols" style="grid-template-columns:1fr 1fr">
      ${fields(["NAME", "CONTACT"])}${fields(["START", "END"])}
    </div>
  </div>`;

  const framed = ctx => `
  <div class="pg dots" style="padding:0"></div>
  <div class="frame-wrap">
    <div class="frame">
      <div class="kicker">BULLET JOURNAL</div>
      <div class="ttl-l">${ctx.dated ? ctx.year : ""}</div>
      ${fields(["NAME", "START", "END"])}
    </div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "setup",
    id: "cover",
    name: "표지",
    en: "Cover",
    date: "year",
    summary: "저널 맨 앞에 두는 표지입니다. 날짜를 지정하면 연도가 크게 들어가고, 지정하지 않으면 손으로 적을 빈칸이 됩니다.",
    parts: [
      "제목 (BULLET JOURNAL)",
      "연도 또는 권 번호",
      "이름 · 시작일 · 종료일"
    ],
    usage: [
      "툴바에서 날짜 \"지정\"을 고르고 연도를 선택하면 연도가 인쇄됩니다.",
      "저널을 시작하는 날 시작일을, 마지막 페이지를 쓴 날 종료일을 적습니다.",
      "여러 권을 쓴다면 NO. · VOL.에 권 번호를 적습니다."
    ],
    tips: [
      "바 스타일의 도트 칸에는 올해의 단어나 그림을 그려 넣어 보세요.",
      "노트 앱에서 표지를 노트 썸네일로 쓰면 여러 저널을 구분하기 쉽습니다."
    ],
    variants: [
      { key: "minimal", name: "미니멀",   desc: "큰 연도와 짧은 선, 아래에 이름 · 기간.", html: minimal },
      { key: "bar",     name: "바 스타일", desc: "레퍼런스와 같은 회색 바, 권 번호, 꾸미기용 도트 칸.", html: barStyle },
      { key: "framed",  name: "도트 프레임", desc: "도트 배경 가운데 테두리 상자에 제목과 정보.", html: framed }
    ]
  });
})();
