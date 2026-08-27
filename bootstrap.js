(() => {
  "use strict";

  const root = document.getElementById("root");
  if (!root) return;

  const popularGroups = [
    {
      title: "Электроинструменты",
      route: "N0001",
      links: [
        ["Шуруповёрты и дрели-шуруповёрты", "https://www.dns-shop.ru/catalog/17a9c6ec16404e77/surupoverty-dreli-surupoverty/"],
        ["Дрели", "https://www.dns-shop.ru/catalog/17a9c58016404e77/dreli/"],
        ["Перфораторы", "https://www.dns-shop.ru/catalog/17a9c5e816404e77/perforatory/"],
        ["Углошлифовальные машины (УШМ)", "https://www.dns-shop.ru/catalog/17a9c94316404e77/ugloslifovalnye-masiny-usm/"],
      ],
    },
    {
      title: "Оснастка и расходные материалы",
      route: "N0177",
      links: [
        ["Наборы сверл", "https://www.dns-shop.ru/catalog/347acafc7cf5e0d5/nabory-sverl/"],
        ["Пильные диски", "https://www.dns-shop.ru/catalog/17aa2ae916404e77/diski-pilnye/"],
        ["Отрезные и обдирочные диски", "https://www.dns-shop.ru/catalog/df2bb6dce8c13c15/diski-otreznye-obdirocnye/"],
      ],
    },
    {
      title: "Измерение и разметка",
      route: "N0296",
      links: [
        ["Лазерные нивелиры и уровни", "https://www.dns-shop.ru/catalog/17a9cbf716404e77/lazernye-niveliry-urovni/"],
        ["Лазерные дальномеры", "https://www.dns-shop.ru/catalog/17a9cb5b16404e77/lazernye-dalnomery/"],
        ["Рулетки", "https://www.dns-shop.ru/catalog/17a9ca8616404e77/ruletki/"],
      ],
    },
    {
      title: "Силовая техника и оборудование",
      route: "N0329",
      links: [
        ["Электрогенераторы", "https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/"],
        ["Компрессоры", "https://www.dns-shop.ru/catalog/17a9cf6c16404e77/kompressory/"],
        ["Строительные пылесосы", "https://www.dns-shop.ru/catalog/17aa321816404e77/stroitelnye-pylesosy/"],
      ],
    },
  ];

  const firstLevelTypeRoots = [
    ["N0001", "Электроинструменты"],
    ["N0105", "Ручной инструмент"],
    ["N0177", "Оснастка и расходные материалы"],
    ["N0296", "Измерительный инструмент"],
    ["N0329", "Силовая техника"],
    ["N0352", "Строительное и пневматическое оборудование"],
    ["N0405", "Сварочное и паяльное оборудование"],
    ["N0429", "Хранение, СИЗ и организация рабочего места"],
  ];
  let bootstrapHomeMode = window.__DNS_HOME_MODE || "expanded";

  const entryCard = (kind, name, image) => `
    <button type="button" class="photo-card entry-card has-image" data-bootstrap-kind="${kind}">
      <span class="photo-card-media" aria-hidden="true"><img src="${image}" alt="" decoding="async" /></span>
      <span class="photo-card-copy"><strong>${name}</strong></span>
    </button>`;

  const firstLevelTypeCard = ([id, name]) => `<button type="button" class="photo-card first-level-type" data-bootstrap-kind="type-node" data-bootstrap-id="${id}"><span class="photo-card-copy"><strong>${name}</strong><small>Раздел по типу инструмента</small></span></button>`;

  const popularCard = (group) => `
    <article class="popular-card">
      <button type="button" class="popular-card-title" data-bootstrap-kind="type-node" data-bootstrap-id="${group.route}">${group.title}</button>
      <div>${group.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join("")}</div>
    </article>`;

  root.innerHTML = `
    <div class="site-frame">
      <header class="site-header"><div class="header-shell">
        <button class="brand" type="button" data-bootstrap-kind="home"><span class="brand-symbol">DNS</span><span><strong>Инструменты</strong><small>структура каталога</small></span></button>
        <button class="catalog-button" type="button" data-bootstrap-action="load-catalog"><i></i>Каталог<span>⌄</span></button>
        <div class="search-wrap"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg><input type="search" placeholder="Каталог загружается…" autocomplete="off" disabled /></div>
        <button class="tree-button" type="button" data-bootstrap-action="load-tree">Дерево структуры</button>
      </div></header>
      <main class="page-shell">
        <nav class="breadcrumbs" aria-label="Навигация"><button type="button" data-bootstrap-kind="home">Каталог</button><i>›</i><span>Инструменты для ремонта и стройки</span></nav>
        <section class="page-intro"><h1>Инструменты для ремонта и стройки</h1></section>
        <div class="catalog-mode-panel"><div><strong>Вариант первого уровня каталога</strong><small>Можно сравнить исходные 3 входа и вынос типов инструмента на первый уровень.</small></div><div class="catalog-mode-switch" role="group"><button type="button" data-bootstrap-mode="compact" class="${bootstrapHomeMode === "compact" ? "active" : ""}">3 входа</button><button type="button" data-bootstrap-mode="expanded" class="${bootstrapHomeMode === "expanded" ? "active" : ""}">Типы инструмента на 1 уровне</button></div></div>
        <div id="bootstrap-entry-root">${bootstrapHomeMode === "compact" ? `<section class="entry-grid">${entryCard("platforms", "Аккумуляторные платформы", "assets/generated/phase-01/entry-01-accumulator-platforms.webp")}${entryCard("stages", "Подбор по этапам работ", "assets/generated/stages/selection-by-work-stages.webp")}${entryCard("types", "По типу инструмента", "assets/generated/phase-01/entry-03-tool-types.webp")}</section>` : `<section class="first-level-grid">${entryCard("platforms", "Аккумуляторные платформы", "assets/generated/phase-01/entry-01-accumulator-platforms.webp")}${entryCard("stages", "Подбор по этапам работ", "assets/generated/stages/selection-by-work-stages.webp")}${firstLevelTypeRoots.map(firstLevelTypeCard).join("")}</section>`}</div>
        <section class="section-block"><div class="section-heading"><h2>Популярные категории</h2></div><div class="popular-grid">${popularGroups.map(popularCard).join("")}</div></section>
      </main>
      <footer><strong>Прототип структуры каталога DIY</strong><span>Управленческая иерархия сохранена как справочник, пользовательская навигация развивается независимо</span></footer>
    </div>`;

  let appLoading = false;
  let appPromise = null;

  function showPendingMessage() {
    const page = root.querySelector("main.page-shell");
    if (!page || page.querySelector(".bootstrap-progress")) return;
    const note = document.createElement("div");
    note.className = "bootstrap-progress";
    note.setAttribute("role", "status");
    note.textContent = "Загружаем выбранный раздел…";
    page.prepend(note);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${src}?v=20260820-patch10`;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Не удалось загрузить ${src}`));
      document.head.appendChild(script);
    });
  }

  function loadApplication() {
    if (appPromise) return appPromise;
    appLoading = true;
    appPromise = Promise.all([
      loadScript("catalog-data.js"),
      loadScript("catalog-structure.js"),
      loadScript("type-catalog.js"),
    ])
      .then(() => loadScript("app.js"))
      .catch((error) => {
        console.error(error);
        const page = root.querySelector("main.page-shell") || root;
        page.innerHTML = '<div class="loading-card"><h1>Не удалось загрузить структуру</h1><p>Обновите страницу или проверьте соединение.</p></div>';
        throw error;
      })
      .finally(() => { appLoading = false; });
    return appPromise;
  }

  function queueRoute(kind, id = "", extra = "") {
    window.__DNS_INITIAL_ROUTE = { kind, id, extra };
    if (!window.__DNS_APP_READY__) showPendingMessage();
    loadApplication();
  }

  root.addEventListener("click", (event) => {
    const mode = event.target.closest("[data-bootstrap-mode]");
    if (mode) {
      bootstrapHomeMode = mode.dataset.bootstrapMode === "compact" ? "compact" : "expanded";
      window.__DNS_HOME_MODE = bootstrapHomeMode;
      queueRoute("home");
      return;
    }
    const route = event.target.closest("[data-bootstrap-kind]");
    if (route) {
      queueRoute(route.dataset.bootstrapKind, route.dataset.bootstrapId || "", route.dataset.bootstrapExtra || "");
      return;
    }
    const action = event.target.closest("[data-bootstrap-action]");
    if (action) {
      if (action.dataset.bootstrapAction === "load-tree") window.__DNS_OPEN_TREE_ON_READY__ = true;
      if (action.dataset.bootstrapAction === "load-catalog") window.__DNS_OPEN_CATALOG_ON_READY__ = true;
      queueRoute("home");
    }
  });

  // Полный каталог намеренно не загружаем автоматически.
  // Первый экран остаётся мгновенным; тяжёлые данные подгружаются
  // только при первом действии пользователя.
})();
