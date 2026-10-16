/*
 * 템플릿 카탈로그 (catalog.html, builder.html 공용)
 * - 새 템플릿을 만들면 해당 항목에 href(예: "daily/timebox.html")와 designs(디자인 수)를 넣으면 '제작됨'으로 표시된다.
 * - cycle: 사용 주기, prio: 1(핵심) ~ 3(선택)
 */
window.CATALOG = [
  {
    code: "A", name: "데일리", en: "Daily",
    desc: "하루를 계획하고, 기록하고, 돌아보는 핵심 페이지입니다.",
    items: [
      { id: "daily-timebox", href: "daily/timebox.html", designs: 4, name: "타임박스 플래너", en: "Time Box Planner", prio: 1, cycle: "매일",
        desc: "할 일 목록, 브레인덤프, 시간대별 10분 단위 타임 플랜을 한 장에 담습니다.",
        parts: ["날짜·요일", "To Do 체크리스트", "브레인 덤프", "04~24시 타임 플랜"] },
      { id: "daily-rapid-log", href: "daily/rapid-log.html", designs: 3, name: "래피드 로그", en: "Rapid Log", prio: 1, cycle: "매일",
        desc: "불릿 기호로 할 일·이벤트·메모를 빠르게 적는 기본 불릿저널 페이지입니다.",
        parts: ["날짜 헤더", "도트 그리드 본문", "하단 기호 키"] },
      { id: "daily-reflection", href: "daily/reflection.html", designs: 3, name: "데일리 회고", en: "Daily Reflection", prio: 1, cycle: "매일 저녁",
        desc: "하루를 정리하는 질문형 페이지입니다.",
        parts: ["오늘의 기분", "감사한 일 3가지", "잘한 일 / 아쉬운 일", "내일의 한 가지"] },
      { id: "daily-all-in-one", href: "daily/all-in-one.html", designs: 2, name: "올인원 데일리", en: "All-in-one Daily", prio: 2, cycle: "매일",
        desc: "계획, 기록, 회고, 미니 트래커를 한 페이지에 압축한 버전입니다.",
        parts: ["Top 3", "시간표", "로그", "물·수면·기분 체크"] },
      { id: "daily-half", href: "daily/half.html", designs: 3, name: "하프 데일리", en: "Half-page Daily", prio: 3, cycle: "매일",
        desc: "한 페이지를 위아래로 나눠 이틀을 기록합니다. 기록이 적은 날에 맞습니다.",
        parts: ["상·하단 날짜 칸", "로그 영역 2개"] }
    ]
  },
  {
    code: "B", name: "기간 로그", en: "Periodic Logs",
    desc: "주·월·연 단위로 일정과 할 일을 내려다보는 페이지입니다.",
    items: [
      { id: "monthly-calendar", href: "period/monthly-calendar.html", designs: 3, name: "먼슬리 캘린더", en: "Monthly Calendar", prio: 1, cycle: "매월",
        desc: "한 달 일정을 달력 형태로 봅니다.",
        parts: ["월·연도", "7×6 달력 그리드", "월간 목표 칸"] },
      { id: "monthly-log", href: "period/monthly-log.html", designs: 3, name: "먼슬리 로그", en: "Monthly Log", prio: 1, cycle: "매월",
        desc: "원조 불릿저널 방식의 월간 페이지입니다. 날짜 세로 목록과 월간 할 일로 나뉩니다.",
        parts: ["1~31일 세로 목록", "월간 태스크 리스트"] },
      { id: "weekly-spread", href: "period/weekly.html", designs: 3, name: "위클리 스프레드", en: "Weekly Spread", prio: 2, cycle: "매주",
        desc: "일주일을 한눈에 보는 페이지입니다. 가로 비율 버전도 함께 제공합니다.",
        parts: ["7일 칸", "주간 목표", "주간 습관 체크"] },
      { id: "future-log", href: "period/future-log.html", designs: 3, name: "퓨처 로그", en: "Future Log", prio: 2, cycle: "6~12개월",
        desc: "앞으로 몇 달 동안의 일정과 할 일을 미리 적어 두는 페이지입니다.",
        parts: ["월별 칸 6개 또는 12개", "월마다 미니 달력"] },
      { id: "year-at-a-glance", href: "period/year.html", designs: 3, name: "연간 개요", en: "Year at a Glance", prio: 3, cycle: "매년",
        desc: "12개월 미니 달력을 한 장에 담은 연간 페이지입니다.",
        parts: ["12개월 미니 달력", "연간 목표"] }
    ]
  },
  {
    code: "C", name: "트래커", en: "Trackers",
    desc: "반복되는 행동과 상태를 칸 채우기로 기록하는 페이지입니다.",
    items: [
      { id: "habit-tracker", href: "tracker/habit.html", designs: 3, name: "습관 트래커", en: "Habit Tracker", prio: 1, cycle: "매월",
        desc: "습관 여러 개를 1~31일 그리드로 체크합니다.",
        parts: ["습관 이름 열", "31일 체크 그리드", "달성률"] },
      { id: "mood-tracker", href: "tracker/mood.html", designs: 3, name: "기분 트래커", en: "Mood Tracker", prio: 2, cycle: "매월",
        desc: "날마다 기분을 색이나 기호로 기록해 한 달의 흐름을 봅니다.",
        parts: ["색상 범례", "31칸 무드 그리드"] },
      { id: "sleep-tracker", href: "tracker/sleep.html", designs: 2, name: "수면 트래커", en: "Sleep Tracker", prio: 3, cycle: "매월",
        desc: "잠든 시간과 깬 시간을 막대로 칠합니다.",
        parts: ["시간축", "날짜별 수면 막대", "수면 질 체크"] },
      { id: "health-tracker", href: "tracker/health.html", designs: 2, name: "건강 트래커", en: "Health Tracker", prio: 3, cycle: "매월",
        desc: "물 섭취, 운동, 걸음 수처럼 건강 관련 지표를 기록합니다.",
        parts: ["물 컵 체크", "운동 종류·시간", "체중 기록"] },
      { id: "expense-tracker", href: "tracker/expense.html", designs: 2, name: "지출 트래커", en: "Expense Tracker", prio: 2, cycle: "매월",
        desc: "날짜별 지출과 카테고리를 적는 간단한 가계부입니다.",
        parts: ["날짜·항목·금액 표", "카테고리 합계", "월 예산"] }
    ]
  },
  {
    code: "D", name: "컬렉션", en: "Collections",
    desc: "주제별로 모아 두는 페이지입니다. 날짜와 상관없이 계속 이어서 씁니다.",
    items: [
      { id: "goals", href: "collection/goals.html", designs: 3, name: "목표 설정", en: "Goals", prio: 2, cycle: "분기·연",
        desc: "큰 목표를 실행 단계로 나눕니다.",
        parts: ["목표", "이유", "세부 단계 체크리스트", "기한"] },
      { id: "project-planner", href: "collection/project.html", designs: 3, name: "프로젝트 플래너", en: "Project Planner", prio: 2, cycle: "수시",
        desc: "프로젝트 하나의 할 일, 마일스톤, 메모를 관리합니다.",
        parts: ["개요", "마일스톤 타임라인", "태스크", "메모"] },
      { id: "brain-dump", href: "collection/brain-dump.html", designs: 3, name: "브레인 덤프", en: "Brain Dump", prio: 2, cycle: "수시",
        desc: "머릿속 생각을 정리하지 않고 쏟아 내는 줄 노트입니다.",
        parts: ["넓은 줄 영역", "분류 체크 칸"] },
      { id: "reading-log", href: "collection/reading.html", designs: 3, name: "독서 기록", en: "Reading Log", prio: 3, cycle: "수시",
        desc: "읽은 책 목록과 한 줄 감상을 적습니다.",
        parts: ["제목·저자", "기간", "별점", "한 줄 메모"] },
      { id: "checklist", href: "collection/checklist.html", designs: 3, name: "체크리스트", en: "Checklist", prio: 3, cycle: "수시",
        desc: "장보기, 여행 준비물 같은 범용 체크리스트입니다.",
        parts: ["제목", "2단 체크박스 목록"] },
      { id: "meal-planner", href: "collection/meal.html", designs: 2, name: "식단 계획", en: "Meal Planner", prio: 3, cycle: "매주",
        desc: "일주일 식단과 장볼 목록을 짭니다.",
        parts: ["7일 × 아침·점심·저녁", "장보기 목록"] }
    ]
  },
  {
    code: "E", name: "회고", en: "Reviews",
    desc: "일정 기간을 돌아보고 다음 기간을 준비하는 페이지입니다.",
    items: [
      { id: "weekly-review", href: "review/weekly.html", designs: 2, name: "주간 회고", en: "Weekly Review", prio: 2, cycle: "매주",
        desc: "한 주의 성과, 배운 점, 다음 주 계획을 정리합니다.",
        parts: ["이번 주 하이라이트", "Keep / Problem / Try", "다음 주 Top 3"] },
      { id: "monthly-review", href: "review/monthly.html", designs: 2, name: "월간 회고", en: "Monthly Review", prio: 2, cycle: "매월",
        desc: "트래커 결과와 함께 한 달을 돌아보고, 미완료 항목을 옮깁니다.",
        parts: ["목표 달성 체크", "트래커 요약", "이월 항목", "다음 달 목표"] }
    ]
  },
  {
    code: "F", name: "설정", en: "Setup",
    desc: "저널 앞부분에 한 번 만들어 두는 안내·색인 페이지입니다.",
    items: [
      { id: "cover", href: "setup/cover.html", designs: 3, name: "표지", en: "Cover", prio: 3, cycle: "1회",
        desc: "연도나 기간, 이름을 적는 표지입니다.",
        parts: ["제목", "기간", "이름"] },
      { id: "key", href: "setup/key.html", designs: 2, name: "키 (기호 범례)", en: "Key", prio: 2, cycle: "1회",
        desc: "불릿 기호와 개인 기호, 색상 규칙을 정리합니다.",
        parts: ["기본 기호 표", "사용자 기호 칸", "색상 규칙"] },
      { id: "index", href: "setup/index.html", designs: 3, name: "인덱스", en: "Index", prio: 3, cycle: "1회·수시",
        desc: "주제별 페이지 위치를 적는 색인입니다. 노트 앱 링크 기능과 함께 쓰면 좋습니다.",
        parts: ["주제", "페이지 번호 열"] }
    ]
  },
  {
    code: "G", name: "속지", en: "Base Paper",
    desc: "자유롭게 쓰는 기본 배경지입니다. 다른 템플릿의 배경으로도 씁니다.",
    items: [
      { id: "paper-dot", href: "paper/dot.html", designs: 3, name: "도트 그리드", en: "Dot Grid", prio: 1, cycle: "기본",
        desc: "불릿저널 표준 속지입니다. 5mm 간격 점이 찍혀 있습니다.",
        parts: ["5mm 도트", "옅은 회색"] },
      { id: "paper-grid", href: "paper/grid.html", designs: 3, name: "모눈", en: "Grid", prio: 2, cycle: "기본",
        desc: "표나 트래커를 직접 그릴 때 씁니다.",
        parts: ["5mm 모눈"] },
      { id: "paper-lined", href: "paper/lined.html", designs: 3, name: "줄지", en: "Lined", prio: 2, cycle: "기본",
        desc: "긴 글이나 일기를 쓸 때 씁니다.",
        parts: ["7mm 줄 간격", "상단 날짜 칸"] },
      { id: "paper-blank", href: "paper/blank.html", designs: 3, name: "무지", en: "Blank", prio: 3, cycle: "기본",
        desc: "그림이나 마인드맵을 그리는 빈 페이지입니다.",
        parts: ["여백 가이드만 표시"] }
    ]
  }
];
