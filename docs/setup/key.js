/* 템플릿: setup/key — setup/key.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  .sym { font-size: 1.9cqw; font-weight: 600; color: var(--s-ink); }
  .tbl > span.desc { font-size: 1.1cqw; color: var(--s-soft); }
  .tbl > span.mean { color: var(--s-ink); font-weight: 600; }
  .swatches { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4cqw 3cqw; }
  .swatches > span { display: flex; align-items: flex-end; gap: 1.2cqw; }
  .swatches u { flex: none; width: 2.8cqw; height: 2.8cqw; border: var(--hair) solid var(--s-frame); border-radius: 50%; }
  .swatches i { flex: 1; height: 2.4cqw; border-bottom: var(--hair) solid var(--s-frame); }

  /* 가이드 */
  .flow { display: flex; align-items: center; justify-content: center; gap: 5cqw; border: var(--hair) solid var(--s-frame); padding: 2cqw 2.4cqw; }
  .flow .st { display: flex; flex-direction: column; align-items: center; gap: .6cqw; font-size: 1.1cqw; color: var(--s-soft); }
  .flow .st b { font-size: 2.6cqw; font-weight: 600; color: var(--s-ink); line-height: 1; }
  .flow .st b.strike { text-decoration: line-through; font-size: 1.6cqw; }
  .flow .arrow { color: var(--s-faint); font-size: 1.6cqw; }
  .flow .ends { display: grid; grid-template-columns: repeat(4, auto); gap: 2.4cqw; }
  .sample { border: var(--hair) solid var(--s-frame); padding: 1.4cqw 2cqw; display: flex; flex-direction: column; gap: .9cqw; font-size: 1.3cqw; color: var(--s-soft); }
  .sample > div { display: grid; grid-template-columns: 3.2cqw 1fr auto; align-items: baseline; }
  .sample b { font-weight: 600; color: var(--s-ink); font-size: 1.5cqw; text-align: center; }
  .sample em { font-size: 1.05cqw; color: var(--s-faint); }
  .sample .done { text-decoration: line-through; color: var(--s-faint); }
  `;

  const { h } = Bujo;

  const BASIC = [
    ["•", "할 일", "해야 할 일. 처리하면 기호를 바꿉니다."],
    ["×", "완료", "끝낸 할 일 위에 X를 덧그립니다."],
    ["&gt;", "이월", "다음 날 · 다음 달로 넘긴 할 일."],
    ["&lt;", "일정 이동", "퓨처 로그 · 먼슬리로 옮긴 할 일."],
    ["○", "이벤트", "약속 · 기념일처럼 날짜가 정해진 일."],
    ["–", "메모", "기억할 내용 · 생각 · 관찰."],
    ["*", "중요", "기호 앞에 붙여 우선순위를 표시."],
    ["!", "영감", "아이디어 · 다시 볼 만한 내용."]
  ];

  const basic = `
  <div class="pg">
    <div class="head"><div class="bar">KEY</div><div class="ttl" style="margin:0"><small>기호 범례</small></div></div>
    <div class="fx" style="flex:8"><div class="ttl">BULLETS <small>기본 기호</small></div>
      ${h.table({ cols: [{ t: "기호", w: "7cqw" }, { t: "의미", w: "13cqw", l: true }, { t: "설명", l: true }], rows: BASIC.length,
        cell: (r, c) => [{ html: `<span class="sym">${BASIC[r][0]}</span>` }, { html: BASIC[r][1], cls: "mean" }, { html: BASIC[r][2], cls: "desc" }][c] })}</div>
    <div class="fx" style="flex:5"><div class="ttl">MY SIGNIFIERS <small>나만의 기호</small></div>
      ${h.table({ cols: [{ t: "기호", w: "7cqw" }, { t: "의미", w: "13cqw", l: true }, { t: "설명", l: true }], rows: 5 })}</div>
    <div class="fx"><div class="ttl">COLOR CODE <small>색 규칙</small></div><div class="swatches">${h.rep(8, () => "<span><u></u><i></i></span>")}</div></div>
  </div>`;

  const guide = `
  <div class="pg">
    <div class="head"><div class="bar">HOW TO BULLET</div><div class="ttl" style="margin:0"><small>할 일의 일생</small></div></div>
    <div class="fx"><div class="ttl">LIFE OF A TASK <small>• 하나가 끝나는 네 가지 길</small></div>
      <div class="flow">
        <span class="st"><b>•</b>할 일</span><span class="arrow">→</span>
        <span class="ends">
          <span class="st"><b>×</b>완료</span>
          <span class="st"><b>&gt;</b>이월</span>
          <span class="st"><b>&lt;</b>일정 이동</span>
          <span class="st"><b class="strike">할 일</b>취소</span>
        </span>
      </div></div>
    <div class="fx"><div class="ttl">EXAMPLE <small>래피드 로그 예시</small></div>
      <div class="sample">
        <div><b>×</b><span class="done">은행 서류 제출</span><em>완료</em></div>
        <div><b>*•</b><span>발표 자료 마무리</span><em>중요한 할 일</em></div>
        <div><b>&gt;</b><span>세탁소 들르기</span><em>내일로 이월</em></div>
        <div><b>&lt;</b><span>여름 휴가 숙소 알아보기</span><em>퓨처 로그로</em></div>
        <div><b>○</b><span>19:00 민지 생일 저녁</span><em>이벤트</em></div>
        <div><b>–</b><span>회의에서 나온 의견: 일정 2주 연장</span><em>메모</em></div>
        <div><b>!</b><span>블로그 글감 — 태블릿 불릿저널</span><em>영감</em></div>
      </div></div>
    <div class="cols" style="grid-template-columns:1fr 1fr">
      <div class="fx"><div class="ttl">MIGRATION <small>월말 · 월초 옮기기</small></div>
        <div class="box" style="height:16cqw;padding:1.2cqw 1.6cqw;font-size:1.15cqw;color:var(--s-soft);line-height:1.7;justify-content:center">
          남은 •를 하나씩 보며 묻습니다.<br>· 아직 중요한가? 아니면 줄을 긋습니다.<br>· 이번 달에 할 일이면 &gt; 먼슬리 로그로.<br>· 나중 일이면 &lt; 퓨처 로그로.</div></div>
      <div class="fx"><div class="ttl">MY RULES <small>나만의 규칙</small></div><div class="box" style="height:16cqw">${h.markLines(4, "•")}</div></div>
    </div>
    <div class="fx" style="flex:1"><div class="ttl">PRACTICE <small>기호 연습</small></div><div class="box dots" style="flex:1"></div></div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "setup",
    id: "key",
    name: "키",
    en: "Key",
    summary: "저널에서 쓰는 기호와 색 규칙을 한곳에 정리하는 페이지입니다. 저널 앞쪽에 두고 헷갈릴 때마다 펼쳐 봅니다.",
    parts: [
      "기본 기호 8개와 설명",
      "나만의 기호 칸",
      "색 규칙 8칸",
      "할 일의 일생 · 예시 · 옮기기 안내 (가이드형)"
    ],
    usage: [
      "기본 기호를 그대로 쓰거나, 쓰지 않는 기호는 줄을 그어 지웁니다.",
      "자주 쓰게 된 나만의 기호(예: ? 알아볼 것, $ 돈 관련)를 추가합니다.",
      "색 규칙에 색과 의미(예: 빨강 = 마감, 파랑 = 가족)를 정해 둡니다."
    ],
    tips: [
      "기호는 적을수록 오래 씁니다. 처음에는 •, ×, >, ○, – 다섯 개로 시작하세요.",
      "가이드형은 불릿저널을 처음 시작하는 사람에게 설명용으로 좋습니다.",
      "노트 앱 펜 색을 색 규칙과 똑같이 즐겨찾기에 등록해 두면 편합니다."
    ],
    variants: [
      { key: "basic", name: "기본 키",  desc: "기본 기호 표, 나만의 기호, 색 규칙.", html: basic },
      { key: "guide", name: "가이드형", desc: "할 일의 일생, 래피드 로그 예시, 옮기기 방법, 나만의 규칙.", html: guide }
    ]
  });
})();
