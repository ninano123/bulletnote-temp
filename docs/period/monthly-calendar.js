/* 템플릿: period/monthly-calendar — period/monthly-calendar.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const { h } = Bujo;

  const classic = ctx => `
  <div class="pg sat-blue">
    <div class="head"><div class="bar">MONTHLY CALENDAR</div>${h.monthTitle(ctx, ctx.year, ctx.month)}</div>
    ${h.calGrid(ctx, ctx.year, ctx.month)}
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="fx"><div class="ttl">GOALS <small>이달의 목표</small></div><div class="box" style="height:12cqw">${h.checks(3)}</div></div>
      <div class="fx"><div class="ttl">NOTES</div><div class="box" style="height:12cqw">${h.lines(3)}</div></div>
    </div>
  </div>`;

  const withTodo = ctx => `
  <div class="pg sat-blue">
    <div class="head">${h.monthTitle(ctx, ctx.year, ctx.month)}<div class="bar sm">MONTHLY</div></div>
    <div class="fx" style="flex:5">${h.calGrid(ctx, ctx.year, ctx.month)}</div>
    <div class="cols" style="grid-template-columns:1fr 1fr;flex:3">
      <div class="fx"><div class="ttl">TO DO <small>이달의 할 일</small></div><div class="box" style="flex:1">${h.checks(9)}</div></div>
      <div class="fx"><div class="ttl">KEY DATES <small>중요한 날 · 약속</small></div><div class="box" style="flex:1">${h.markLines(9, "○")}</div></div>
    </div>
  </div>`;

  const landscape = ctx => `
  <div class="pg sat-blue" style="padding:4.2cqw 4.2cqw 3.8cqw;gap:2cqw">
    <div class="head"><div class="bar">MONTHLY CALENDAR</div>${h.monthTitle(ctx, ctx.year, ctx.month, "sm")}</div>
    <div class="cols" style="grid-template-columns:76fr 24fr;flex:1;gap:2.6cqw">
      <div class="fx">${h.calGrid(ctx, ctx.year, ctx.month)}</div>
      <div class="fx">
        <div class="ttl">GOALS</div><div class="box" style="flex:4">${h.checks(4)}</div>
        <div class="ttl mt" style="margin-top:2cqw">TO DO</div><div class="box" style="flex:7">${h.checks(7)}</div>
        <div class="ttl mt" style="margin-top:2cqw">NOTES</div><div class="box dots" style="flex:5"></div>
      </div>
    </div>
  </div>`;

  Bujo.define({
    section: "period",
    id: "monthly-calendar",
    name: "먼슬리 캘린더",
    en: "Monthly Calendar",
    date: "month",
    weekStart: true,
    summary: "한 달 일정을 달력 형태로 내려다보는 페이지입니다. 날짜를 지정하면 그달의 숫자가 채워진 달력이 만들어지고, 지정하지 않으면 매달 손으로 채워 쓰는 빈 달력이 됩니다.",
    parts: [
      "월 제목 (숫자 · 영문 월 · 연도)",
      "7열 달력 그리드 (일요일 빨강, 토요일 파랑)",
      "이달의 목표 · 할 일",
      "메모 · 중요한 날 칸"
    ],
    usage: [
      "툴바에서 날짜 \"지정\"을 고르고 연 · 월을 선택합니다. 매달 새로 쓰려면 \"없음\"으로 두세요.",
      "주 시작 요일(일 · 월)을 고릅니다.",
      "월초에 퓨처 로그에 적어 둔 일정을 달력으로 옮깁니다.",
      "이달의 목표를 적고, 달력 칸에는 일정을 짧게 적습니다."
    ],
    tips: [
      "달력 칸이 작으니 일정은 키워드와 색으로 구분하세요.",
      "날짜 지정 PDF를 12달 만들어 두면 1년치 먼슬리가 준비됩니다.",
      "가로 디자인은 태블릿을 가로로 쓰거나 펼침면처럼 보고 싶을 때 맞습니다."
    ],
    variants: [
      { key: "classic",   name: "클래식",      desc: "큰 달력 그리드 아래에 이달의 목표와 메모.", html: classic },
      { key: "todo",      name: "캘린더 + 할 일", desc: "달력을 조금 줄이고 할 일 · 중요한 날 목록을 넉넉하게.", html: withTodo },
      { key: "landscape", name: "가로형",      desc: "가로 방향. 왼쪽 큰 달력, 오른쪽 목표 · 할 일 · 노트.", html: landscape, land: true }
    ]
  });
})();
