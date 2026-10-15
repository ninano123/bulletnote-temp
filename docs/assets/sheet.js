/*
 * 템플릿 페이지 엔진
 * - Bujo.mount(opts)로 페이지(헤더·안내·툴바·디자인 갤러리)를 그린다.
 * - 비율 전환, PDF(브라우저 인쇄), JPG(html-to-image) 내보내기를 처리한다.
 * - Bujo.h 에 시트 마크업 헬퍼가 있다.
 * file:// 에서도 열리도록 모듈이 아닌 일반 스크립트로 작성한다.
 */
(function () {
  "use strict";

  const RATIOS = [
    { id: "iso",    name: "ISO A",   sub: "A4·A5",      ar: "1 / 1.4142", mm: [210, 297],     px: [1654, 2339] },
    { id: "3x4",    name: "3 : 4",   sub: "iPad 기본형", ar: "3 / 4",      mm: [180, 240],     px: [1536, 2048] },
    { id: "10x16",  name: "10 : 16", sub: "Galaxy Tab", ar: "10 / 16",    mm: [160, 256],     px: [1600, 2560] },
    { id: "letter", name: "Letter",  sub: "US Letter",  ar: "8.5 / 11",   mm: [215.9, 279.4], px: [1700, 2200] }
  ];

  const SECTIONS = {
    daily: {
      label: "A · DAILY",
      pages: [
        { id: "daily-timebox",    href: "timebox.html",    name: "타임박스 플래너" },
        { id: "daily-rapid-log",  href: "rapid-log.html",  name: "래피드 로그" },
        { id: "daily-reflection", href: "reflection.html", name: "데일리 회고" },
        { id: "daily-all-in-one", href: "all-in-one.html", name: "올인원 데일리" },
        { id: "daily-half",       href: "half.html",       name: "하프 데일리" }
      ]
    }
  };

  // JPG에 임베드할 폰트 (시트에서 쓰는 굵기만)
  const FONT_BASE = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/";
  const FONT_FILES = [[400, "Regular"], [600, "SemiBold"], [700, "Bold"]];

  /* ───────────── 저장 ───────────── */
  const store = {
    get(k, d) { try { return localStorage.getItem("bujo." + k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("bujo." + k, v); } catch (e) { /* 무시 */ } }
  };

  /* ───────────── 마크업 헬퍼 ───────────── */
  const WEEK = ["S", "M", "T", "W", "T", "F", "S"];
  const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");
  // 토요일은 항상 .sat 클래스를 달고, 시트에 .sat-blue 가 있을 때만 파란색으로 보인다
  const week = () => WEEK.map((d, i) => `<span${i === 0 ? ' class="sun"' : i === 6 ? ' class="sat"' : ""}>${d}</span>`).join("");

  const h = {
    rep,
    week,
    /** 빈 줄 n개 */
    lines: (n, cls = "") => `<div class="lines ${cls}">${rep(n, () => "<i></i>")}</div>`,
    /** 번호 붙은 줄 */
    numLines: (n, cls = "") => `<div class="lines ${cls}">${rep(n, i => `<i><span class="num">${i + 1}</span></i>`)}</div>`,
    /** 앞에 기호(•, ○, – 등)가 붙은 줄 */
    markLines: (n, mark, cls = "") => `<div class="lines ${cls}">${rep(n, () => `<i><span class="mk">${mark}</span></i>`)}</div>`,
    /** 체크박스 줄 */
    checks: (n, cls = "") => `<div class="lines ${cls}">${rep(n, () => '<i><u class="cb"></u></i>')}</div>`,
    /** 시각 라벨이 붙은 줄. half=true면 30분 줄을 점선으로 추가 */
    hourLines: (from, to, half = false) =>
      `<div class="lines hours">${rep(to - from + 1, k =>
        `<i><span class="hr">${from + k}</span></i>` + (half ? '<i class="half"><span class="hr"></span></i>' : "")
      )}</div>`,
    /** 레퍼런스형 날짜 상자: DATE | Y | M | D + 요일 */
    dateBox: () =>
      `<div class="datebox"><div class="db-ymd"><b>DATE</b><div><span>Y</span><span>M</span><span>D</span></div></div>` +
      `<div class="db-wk">${week()}</div></div>`,
    /** 한 줄 날짜: DATE ____ . __ . __  S M T W T F S */
    dateLine: () => `<div class="dateline"><b>DATE</b><i></i><em>.</em><i></i><em>.</em><i></i><span class="wk-mini">${week()}</span></div>`,
    /**
     * 시간 그리드. sub = 한 시간을 나눌 칸 수 (6 → 10분, 2 → 30분)
     * rows 를 주면 from/to 대신 그 목록으로 행을 만든다: [{ label, cls }]
     */
    timeGrid: ({ from = 4, to = 24, sub = 6, head = true, rows: list } = {}) => {
      const step = 60 / sub;
      const labels = rep(sub, k => `<span>${String(((k + 1) * step) % 60).padStart(2, "0")}</span>`);
      list = list || Array.from({ length: to - from + 1 }, (_, k) => ({ label: from + k }));
      const rows = list.map(r =>
        `<div class="tg-row${r.cls ? " " + r.cls : ""}"><b>${r.label}</b>${rep(sub, j => `<i${j === sub / 2 - 1 ? ' class="mid"' : ""}></i>`)}</div>`).join("");
      return `<div class="tg" style="--sub:${sub}">${head ? `<div class="tg-head"><span></span>${labels}</div>` : ""}` +
        `<div class="tg-body">${rows}</div></div>`;
    },
    /** 동그라미 척도 1..n */
    scale: (n, cls = "") => `<div class="scale ${cls}">${rep(n, i => `<span>${i + 1}</span>`)}</div>`,
    /** 물컵 n개 */
    cups: n => `<div class="scale cups">${rep(n, () => "<span></span>")}</div>`,
    /** 기분 얼굴 5단계 (좋음 → 나쁨) */
    faces: (cls = "") => {
      const mouth = [19, 17, 15, 13, 12];
      return `<div class="scale faces ${cls}">${rep(5, k =>
        `<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">` +
        `<circle cx="12" cy="12" r="10.4"/><circle cx="8.6" cy="10" r=".9" fill="currentColor" stroke="none"/>` +
        `<circle cx="15.4" cy="10" r=".9" fill="currentColor" stroke="none"/>` +
        `<path d="M7.6 15.2 Q12 ${mouth[k]} 16.4 15.2"/></svg></span>`)}</div>`;
    },
    /** 불릿 기호 범례 한 줄 */
    keyLine: () => `<div class="keyline">${[
      ["•", "할 일"], ["×", "완료"], ["&gt;", "이월"], ["&lt;", "일정 이동"], ["○", "이벤트"], ["–", "메모"], ["*", "중요"], ["!", "영감"]
    ].map(([s, t]) => `<span><b>${s}</b>${t}</span>`).join("")}</div>`
  };

  /* ───────────── 상태 ───────────── */
  // 주소의 ?ratio=10x16&size=l 이 저장된 설정보다 우선한다
  const params = new URLSearchParams(location.search);
  if (params.get("ratio")) store.set("ratio", params.get("ratio"));
  if (params.get("size")) store.set("size", params.get("size"));
  let ratio = RATIOS.find(r => r.id === (params.get("ratio") || store.get("ratio"))) || RATIOS[0];
  let page = null;

  const el = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const fileName = v => `${page.id}_${v.no}-${v.key}_${ratio.id}`;

  // 번호: v.no 가 있으면 그대로(예: "01-A" 파생 디자인), 없으면 01, 02… 순서대로 매긴다
  function numberVariants(variants) {
    let n = 0;
    variants.forEach(v => { if (!v.no) v.no = String(++n).padStart(2, "0"); });
  }

  /* ───────────── 페이지 그리기 ───────────── */
  function mount(opts) {
    page = opts;
    numberVariants(opts.variants);
    const sec = SECTIONS[opts.section];
    const app = document.getElementById("app");

    const siblings = sec.pages.map(p =>
      `<li><a href="${p.href}"${p.id === opts.id ? ' aria-current="page"' : ""}>${p.name}</a></li>`).join("");
    const list = (tag, items) => `<${tag}>${items.map(x => `<li>${x}</li>`).join("")}</${tag}>`;

    app.innerHTML = `
      <header class="hero"><div class="wrap">
        <a class="crumb" href="../index.html#catalog">← 템플릿 분류</a><br>
        <span class="label-bar">${sec.label}</span>
        <h1>${opts.name} <small style="font-size:16px;font-weight:400;color:var(--ink-faint)">${opts.en}</small></h1>
        <p>${opts.summary}</p>
      </div></header>
      <nav class="toc sub" aria-label="같은 분류"><div class="wrap"><ul>${siblings}</ul></div></nav>
      <main class="wrap">
        <section>
          <div class="info-grid">
            <div class="panel"><h3>구성 요소</h3>${list("ul", opts.parts)}</div>
            <div class="panel"><h3>이렇게 쓰세요</h3>${list("ol", opts.usage)}</div>
            <div class="panel"><h3>팁</h3>${list("ul", opts.tips)}</div>
          </div>
        </section>
        <section>
          <h2>디자인 <small>${opts.variants.length}종</small></h2>
          <p class="lead">비율을 고른 뒤 디자인마다 있는 PDF·JPG 버튼으로 내보냅니다. PDF는 인쇄 창에서 "PDF로 저장"을 고르세요.</p>
          <div class="toolbar" id="toolbar"></div>
          <div class="gallery" id="gallery"></div>
        </section>
      </main>
      <footer>하루 불릿저널 템플릿 · ${opts.name}</footer>`;

    renderToolbar();
    renderGallery();
    applyRatio();

    // 페이지를 JS로 그리므로 #v-디자인 링크는 그린 뒤에 직접 이동한다
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  function renderToolbar() {
    const tb = document.getElementById("toolbar");
    const size = params.get("size") || store.get("size", "m");
    tb.innerHTML = `
      <div class="tb-group"><span class="tb-label">비율</span>
        <div class="seg" data-seg="ratio">${RATIOS.map(r =>
          `<button type="button" data-v="${r.id}" title="${r.sub}">${r.name}</button>`).join("")}</div></div>
      <div class="tb-group"><span class="tb-label">미리보기</span>
        <div class="seg" data-seg="size"><button type="button" data-v="m">보통</button><button type="button" data-v="l">크게</button></div></div>
      <span class="tb-spacer"></span>
      <button type="button" class="btn primary" data-act="pdf-all">전체 디자인 PDF</button>
      <div class="tb-info" id="tb-info"></div>`;

    tb.querySelector('[data-seg="ratio"]').addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      ratio = RATIOS.find(r => r.id === b.dataset.v);
      store.set("ratio", ratio.id);
      applyRatio();
    });
    tb.querySelector('[data-seg="size"]').addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      store.set("size", b.dataset.v);
      applySize(b.dataset.v);
    });
    tb.querySelector('[data-act="pdf-all"]').addEventListener("click", () =>
      printSheets(page.variants.map((v, i) => ({ v, i })), `${page.id}_all_${ratio.id}`));
    applySize(size);
  }

  function renderGallery() {
    const g = document.getElementById("gallery");
    page.variants.forEach((v, i) => {
      const card = el(`
        <article class="variant" id="v-${v.key}">
          <div class="v-head"><span class="v-no">${v.no}</span>
            <div><h3>${v.name}</h3><p>${v.desc}</p></div></div>
          <div class="sheet-frame"><div class="sheet">${v.html}</div></div>
          <div class="v-actions">
            <button type="button" class="btn" data-act="pdf">PDF</button>
            <button type="button" class="btn" data-act="jpg">JPG</button>
          </div>
        </article>`);
      card.querySelector('[data-act="pdf"]').addEventListener("click", () => printSheets([{ v, i }], fileName(v)));
      card.querySelector('[data-act="jpg"]').addEventListener("click", e => exportJpg(v, i, e.currentTarget));
      g.append(card);
    });
  }

  function applyRatio() {
    const g = document.getElementById("gallery");
    g.style.setProperty("--ar", ratio.ar);
    g.querySelectorAll(".sheet").forEach(s => (s.dataset.ratio = ratio.id));
    pressed("ratio", ratio.id);
    document.getElementById("tb-info").textContent =
      `${ratio.name} (${ratio.sub}) · PDF ${ratio.mm[0]} × ${ratio.mm[1]} mm · JPG ${ratio.px[0]} × ${ratio.px[1]} px`;
  }

  function applySize(v) {
    document.getElementById("gallery").classList.toggle("large", v === "l");
    pressed("size", v);
  }

  function pressed(seg, v) {
    document.querySelectorAll(`[data-seg="${seg}"] button`).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
  }

  /* ───────────── PDF (인쇄) ───────────── */
  function printSheets(items, name) {
    const root = document.createElement("div");
    root.id = "print-root";
    root.innerHTML = items.map(({ v }) =>
      `<div class="print-page"><div class="sheet-frame"><div class="sheet" data-ratio="${ratio.id}">${v.html}</div></div></div>`).join("");

    const style = document.createElement("style");
    style.textContent = `@page { size: ${ratio.mm[0]}mm ${ratio.mm[1]}mm; margin: 0; }`;

    const title = document.title;
    document.head.append(style);
    document.body.append(root);
    document.body.classList.add("is-printing");
    document.title = name; // 크롬은 문서 제목을 PDF 파일 이름으로 제안한다

    const cleanup = () => {
      root.remove(); style.remove();
      document.body.classList.remove("is-printing");
      document.title = title;
    };
    window.addEventListener("afterprint", cleanup, { once: true });
    document.fonts.ready.then(() => window.print());
  }

  /* ───────────── JPG ───────────── */
  async function exportJpg(v, i, btn) {
    if (!window.htmlToImage) { alert("이미지 변환 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요."); return; }
    const [W, H] = ratio.px;
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = "저장 중…";

    // 목표 픽셀 크기 그대로 화면 밖에 그린 뒤 캡처한다 (cqw 단위가 그대로 확대된다)
    const host = document.createElement("div");
    host.style.cssText = `position:fixed;left:${-W - 200}px;top:0;width:${W}px;pointer-events:none;`;
    host.innerHTML = `<div class="sheet-frame"><div class="sheet" data-ratio="${ratio.id}" style="aspect-ratio:auto;height:${H}px;box-shadow:none">${v.html}</div></div>`;
    document.body.append(host);

    try {
      await document.fonts.ready;
      await nextFrame();
      const opts = { width: W, height: H, canvasWidth: W, canvasHeight: H, pixelRatio: 1, quality: 0.95, backgroundColor: "#fff" };
      const css = await embedFontCSS();
      if (css) opts.fontEmbedCSS = css; else opts.skipFonts = true;
      const url = await window.htmlToImage.toJpeg(host.querySelector(".sheet"), opts);
      const a = document.createElement("a");
      a.href = url; a.download = fileName(v) + ".jpg";
      document.body.append(a); a.click(); a.remove();
    } catch (e) {
      console.error(e);
      alert("JPG 저장에 실패했습니다: " + (e && e.message ? e.message : e));
    } finally {
      host.remove();
      btn.disabled = false; btn.textContent = label;
    }
  }

  let fontPromise = null;
  function embedFontCSS() {
    if (!fontPromise) {
      fontPromise = Promise.all(FONT_FILES.map(async ([w, n]) => {
        const res = await fetch(`${FONT_BASE}Pretendard-${n}.woff2`);
        if (!res.ok) throw new Error(`font ${res.status}`);
        const blob = await res.blob();
        const data = await new Promise((ok, fail) => {
          const fr = new FileReader();
          fr.onload = () => ok(fr.result);
          fr.onerror = () => fail(fr.error);
          fr.readAsDataURL(blob);
        });
        return `@font-face{font-family:"Pretendard";font-weight:${w};font-style:normal;src:url(${data}) format("woff2");}`;
      })).then(a => a.join("\n")).catch(e => {
        console.warn("폰트 임베드 실패, 시스템 폰트로 저장합니다.", e);
        fontPromise = null;
        return "";
      });
    }
    return fontPromise;
  }

  window.Bujo = { mount, h, RATIOS };
})();
