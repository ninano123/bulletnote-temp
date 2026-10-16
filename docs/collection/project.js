/* 템플릿: collection/project — collection/project.html 과 builder.html 에서 함께 쓴다 */
(function () {
  const CSS = `
  /* 프로젝트 이름 줄 */
  .pname { display: flex; align-items: flex-end; gap: 1.4cqw; flex: 1; min-width: 30cqw; }
  .pname b { font-size: 1.4cqw; font-weight: 600; letter-spacing: .06em; white-space: nowrap; }
  .pname i { flex: 1; height: 2.6cqw; border-bottom: var(--hair) solid var(--s-frame); }

  /* 시작 · 마감 · 상태 */
  .meta3 { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 2cqw; }
  .meta3 > div { border: var(--hair) solid var(--s-frame); padding: 1cqw 1.4cqw; display: flex; flex-direction: column; gap: 1.2cqw; }
  .meta3 b { font-size: 1.1cqw; font-weight: 600; letter-spacing: .06em; color: var(--s-soft); }
  .meta3 i { height: 2cqw; border-bottom: var(--hair) solid var(--s-frame); }
  .status { display: flex; gap: 1.6cqw; font-size: 1.15cqw; color: var(--s-soft); height: 2cqw; align-items: center; }
  .status span { display: inline-flex; align-items: center; gap: .6cqw; }
  .status u { width: 1.4cqw; height: 1.4cqw; border: var(--hair) solid var(--s-frame); border-radius: 50%; }

  /* 칸반 */
  .kanban { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.4cqw; }
  .kcol { display: flex; flex-direction: column; min-height: 0; border: var(--hair) solid var(--s-frame); }
  .kcol > b { flex: none; padding: 1cqw 1.4cqw; font-size: 1.3cqw; font-weight: 600; letter-spacing: .08em; border-bottom: var(--stroke) solid var(--s-soft); display: flex; justify-content: space-between; }
  .kcol > b small { font-weight: 400; color: var(--s-faint); letter-spacing: 0; }
  .kcol > .lines { flex: 1 1 0; }
  .kcol.doing > b { background: #f6f7f7; }
  `;

  const { h } = Bujo;
  const pname = `<div class="pname"><b>PROJECT</b><i></i></div>`;
  const meta = `<div class="meta3">
    <div><b>START</b><i></i></div><div><b>DUE</b><i></i></div>
    <div><b>STATUS</b><span class="status"><span><u></u>계획</span><span><u></u>진행</span><span><u></u>보류</span><span><u></u>완료</span></span></div>
  </div>`;

  const basic = `
  <div class="pg">
    <div class="head"><div class="bar">PROJECT PLANNER</div>${pname}</div>
    ${meta}
    <div class="fx"><div class="ttl">OVERVIEW <small>목적 · 범위 · 완료 기준</small></div><div class="box" style="height:11cqw">${h.lines(3)}</div></div>
    <div class="fx" style="flex:3"><div class="ttl">MILESTONES <small>주요 단계</small></div>
      ${h.table({ cols: [{ t: "#", w: "3.6cqw" }, { t: "마일스톤", l: true }, { t: "기한", w: "10cqw" }, { t: "DONE", w: "5.4cqw" }], rows: 6, cell: (r, c) => (c === 0 ? r + 1 : c === 3 ? '<u class="cb"></u>' : "") })}</div>
    <div class="cols" style="grid-template-columns:55fr 45fr;flex:5">
      <div class="fx"><div class="ttl">TASKS</div><div class="box" style="flex:1">${h.checks(12)}</div></div>
      <div class="fx"><div class="ttl">NOTES <small>아이디어 · 자료 · 연락처</small></div><div class="box dots" style="flex:1"></div></div>
    </div>
  </div>`;

  const kanban = `
  <div class="pg">
    <div class="head"><div class="bar">PROJECT KANBAN</div>${pname}</div>
    <div class="fx"><div class="ttl">GOAL <small>이 프로젝트가 끝나면</small></div><div class="box" style="height:7cqw">${h.lines(2)}</div></div>
    <div class="kanban">
      <div class="kcol"><b>TO DO <small>할 일</small></b>${h.checks(20)}</div>
      <div class="kcol doing"><b>DOING <small>진행 중</small></b>${h.checks(20)}</div>
      <div class="kcol"><b>DONE <small>완료</small></b>${h.checks(20)}</div>
    </div>
  </div>`;

  const WEEKS = 12;
  const gantt = `
  <div class="pg" style="padding:4.2cqw 4.2cqw 3.8cqw;gap:1.8cqw">
    <div class="head"><div class="bar">PROJECT TIMELINE</div>${pname}<div class="dateline"><b>START</b><i></i><em>.</em><i></i></div></div>
    ${h.table({
      cols: [{ t: "#", w: "2.6cqw" }, { t: "TASK", w: "20cqw", l: true }, { t: "담당", w: "6cqw" }, ...Array.from({ length: WEEKS }, (_, k) => ({ t: `W${k + 1}` })), { t: "DONE", w: "4cqw" }],
      rows: 14,
      cell: (r, c) => (c === 0 ? r + 1 : c === WEEKS + 3 ? '<u class="cb"></u>' : "")
    })}
    <div class="cols" style="grid-template-columns:1fr 1fr;gap:2.4cqw">
      <div class="fx"><div class="ttl">MILESTONES</div><div class="box" style="height:7cqw">${h.markLines(2, "•")}</div></div>
      <div class="fx"><div class="ttl">RISKS <small>위험 · 의존성</small></div><div class="box" style="height:7cqw">${h.lines(2)}</div></div>
    </div>
  </div>`;

  Bujo.define({
    css: CSS,
    section: "collection",
    id: "project-planner",
    name: "프로젝트 플래너",
    en: "Project Planner",
    summary: "프로젝트 하나의 할 일, 마일스톤, 진행 상황을 관리합니다. 한 장 요약형, 칸반 보드, 주 단위 간트 차트 중에서 고릅니다.",
    parts: [
      "프로젝트 이름 · 시작 · 마감 · 상태",
      "개요 (목적 · 범위 · 완료 기준)",
      "마일스톤 표 · 할 일 목록",
      "칸반 보드 (할 일 · 진행 중 · 완료)",
      "12주 간트 차트 (가로)"
    ],
    usage: [
      "프로젝트 이름과 마감일을 적고, 끝났을 때의 모습을 개요에 적습니다.",
      "큰 단계를 마일스톤으로, 작은 일을 할 일로 나눕니다.",
      "칸반은 할 일을 TO DO에 적고, 시작하면 DOING, 끝나면 DONE으로 옮겨 적습니다.",
      "간트 차트는 할 일마다 진행할 주의 칸을 칠합니다."
    ],
    tips: [
      "칸반의 DOING 칸은 3개 이하로 유지하면 일이 끝까지 진행됩니다.",
      "간트 차트의 START에 첫 주 날짜를 적으면 W1~W12가 실제 주가 됩니다.",
      "마일스톤 날짜는 퓨처 로그와 먼슬리 캘린더에도 옮겨 두세요."
    ],
    variants: [
      { key: "basic",  name: "기본형",   desc: "한 장 요약. 개요, 마일스톤, 할 일, 노트.", html: basic },
      { key: "kanban", name: "칸반",     desc: "할 일 · 진행 중 · 완료 세 칸 보드.", html: kanban },
      { key: "gantt",  name: "간트 차트", desc: "가로 방향. 할 일 14줄 × 12주 칸.", html: gantt, land: true }
    ]
  });
})();
