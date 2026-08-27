(() => {
  "use strict";

  const FULL = window.CATALOG_DATA_V2;
  const TAXONOMY = window.MANAGEMENT_TAXONOMY_V6;
  const TYPE_CATALOG = window.TYPE_CATALOG_V12;
  const root = document.getElementById("root");

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  if (!FULL?.categories || !FULL?.stages || !TAXONOMY?.groups || !TYPE_CATALOG?.nodes) {
    root.innerHTML = '<main class="loading-card"><h1>Не удалось загрузить структуру</h1><p>Проверьте файлы данных каталога.</p></main>';
    return;
  }

  const normalize = (value) => String(value || "").toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();
  const initialRoute = window.__DNS_INITIAL_ROUTE || {};
  const state = {
    kind: initialRoute.kind || "home",
    id: initialRoute.id || "",
    extra: initialRoute.extra || "",
    homeMode: window.__DNS_HOME_MODE || "expanded",
  };

  const copyTypePlacement = (sourceId, id, parentId, order) => {
    const source = TYPE_CATALOG.nodes.find((node) => node.id === sourceId);
    return {
      ...source,
      id,
      parentId,
      order,
      level: 5,
      fullPath: `Ручной инструмент > Наборы и мультитулы > ${source.title}`,
      origin: "Дополнительная пользовательская группировка",
    };
  };

  const addedTypeNodes = [
    {
      id: "CUSTOM_HAND_SETS",
      parentId: "N0105",
      order: 7.5,
      level: 2,
      title: "Наборы и мультитулы",
      fullPath: "Ручной инструмент > Наборы и мультитулы",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Дополнительная пользовательская группировка",
    },
    copyTypePlacement("N0109", "CUSTOM_HAND_SETS_01", "CUSTOM_HAND_SETS", 1),
    copyTypePlacement("N0110", "CUSTOM_HAND_SETS_02", "CUSTOM_HAND_SETS", 2),
    copyTypePlacement("N0111", "CUSTOM_HAND_SETS_03", "CUSTOM_HAND_SETS", 3),
    copyTypePlacement("N0117", "CUSTOM_HAND_SETS_04", "CUSTOM_HAND_SETS", 4),
    copyTypePlacement("N0118", "CUSTOM_HAND_SETS_05", "CUSTOM_HAND_SETS", 5),
    copyTypePlacement("N0121", "CUSTOM_HAND_SETS_06", "CUSTOM_HAND_SETS", 6),
    copyTypePlacement("N0159", "CUSTOM_HAND_SETS_07", "CUSTOM_HAND_SETS", 7),
    copyTypePlacement("N0160", "CUSTOM_HAND_SETS_08", "CUSTOM_HAND_SETS", 8),
    {
      id: "CUSTOM_ELECTRICAL_01",
      parentId: "N0161",
      order: 8,
      level: 5,
      title: "Отвертки диэлектрические",
      fullPath: "Ручной инструмент > Электромонтажный инструмент > Отвертки диэлектрические",
      kind: "Товарная категория",
      itemRole: "Товарная категория",
      duplicateCount: 1,
      action: "Добавить категорию",
      sourceNames: ["Отвертки диэлектрические"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17a9ffd116404e77/otvertki/?f%5Bbz%5D=s09p-6era&virtual_category_uid=112e028acdec087f"],
      sourceTypes: ["filtered-category"],
      origin: "Дополнение пользователя",
    },
    {
      id: "CUSTOM_ELECTRICAL_02",
      parentId: "N0161",
      order: 9,
      level: 5,
      title: "Матрицы для опрессовки и пробивки",
      fullPath: "Ручной инструмент > Электромонтажный инструмент > Матрицы для опрессовки и пробивки",
      kind: "Товарная категория",
      itemRole: "Оснастка / расходный материал",
      duplicateCount: 1,
      action: "Добавить категорию",
      sourceNames: ["Матрицы для опрессовки и пробивки"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/c13cc49620e2b642/matricy-dla-opressovki-i-probivki/"],
      sourceTypes: ["leaf"],
      origin: "Дополнение пользователя",
    },
    {
      id: "CUSTOM_TILE_HAND_TOOLS",
      parentId: "N0170",
      order: 2,
      level: 3,
      title: "Плиточный инструмент",
      fullPath: "Ручной инструмент > Малярный и отделочный инструмент > Плиточный инструмент",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Дополнение пользователя 2026-08-27",
    },
    {
      id: "CUSTOM_TILE_HAND_CUTTERS",
      parentId: "CUSTOM_TILE_HAND_TOOLS",
      order: 1,
      level: 5,
      title: "Плиткорезы ручные",
      fullPath: "Ручной инструмент > Малярный и отделочный инструмент > Плиточный инструмент > Плиткорезы ручные",
      kind: "Товарная категория",
      itemRole: "Товарная категория",
      duplicateCount: 1,
      action: "Перенести из зажимного инструмента",
      sourceNames: ["Плиткорезы ручные"],
      sourceUrls: [],
      sourceTypes: ["structure-only"],
      origin: "Дополнение пользователя 2026-08-27",
    },
    {
      id: "CUSTOM_HAND_SAWS_METAL",
      parentId: "N0140",
      order: 3,
      level: 5,
      title: "Ножовки по металлу",
      fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножи, пилы и труборезы > Ножовки по металлу",
      kind: "Товарная категория",
      itemRole: "Товарная категория",
      duplicateCount: 1,
      action: "Разделить категорию",
      sourceNames: ["Ножовки и пилы"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/recipe/9bdbb894748ef307/nozovki-po-metallu/"],
      sourceTypes: ["recipe"],
      origin: "Дополнение пользователя 2026-08-27",
    },
    {
      id: "CUSTOM_HAND_SAWS_WOOD",
      parentId: "N0140",
      order: 3.1,
      level: 5,
      title: "Ножовки по дереву",
      fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножи, пилы и труборезы > Ножовки по дереву",
      kind: "Товарная категория",
      itemRole: "Товарная категория",
      duplicateCount: 1,
      action: "Разделить категорию",
      sourceNames: ["Ножовки и пилы"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/recipe/f6d2f4b1a3b2afd5/nozovki-po-derevu/"],
      sourceTypes: ["recipe"],
      origin: "Дополнение пользователя 2026-08-27",
    },
    {
      id: "CUSTOM_HAND_FILES",
      parentId: "N0149",
      order: 3,
      level: 5,
      title: "Напильники и надфили",
      fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Столярный инструмент > Напильники и надфили",
      kind: "Товарная категория",
      itemRole: "Товарная категория",
      duplicateCount: 1,
      action: "Добавить категорию",
      sourceNames: ["Напильники"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17aa027916404e77/napilniki/"],
      sourceTypes: ["leaf"],
      origin: "Дополнение пользователя 2026-08-27",
    },
  ];

  function collapseSingletonTypeGroups(nodes) {
    let result = nodes.map((node) => ({ ...node }));
    let changed = true;
    while (changed) {
      changed = false;
      const childrenByParent = new Map();
      result.forEach((node) => {
        const parentId = node.parentId || "__root__";
        if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
        childrenByParent.get(parentId).push(node);
      });
      for (const parent of result) {
        const children = childrenByParent.get(parent.id) || [];
        if (children.length !== 1) continue;
        const wrapper = children[0];
        const grandchildren = childrenByParent.get(wrapper.id) || [];
        if (wrapper.itemRole !== "Навигация" || !grandchildren.length) continue;
        result = result
          .filter((node) => node.id !== wrapper.id)
          .map((node) => node.parentId === wrapper.id ? { ...node, parentId: parent.id } : node);
        changed = true;
        break;
      }
    }
    return result;
  }

  const typeRoleRank = (node) => {
    if (node.itemRole === "Оснастка / расходный материал") return 20;
    if (node.itemRole === "Расходный материал") return 30;
    if (/аксессуар/i.test(node.itemRole || "")) return 40;
    return 10;
  };

  const typeNodes = [
    ...collapseSingletonTypeGroups(TYPE_CATALOG.nodes.filter((node) => !["N0163", "N0138", "N0143", "N0159"].includes(node.id)))
      .map((node) => node.id === "N0135" ? { ...node, title: "Струбцины и тиски", fullPath: "Ручной инструмент > Зажимной инструмент > Струбцины и тиски" } : node),
    ...addedTypeNodes,
  ].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ru"));
  const typeNodeById = new Map(typeNodes.map((node) => [node.id, node]));
  const typeChildrenByParentId = new Map();
  typeNodes.forEach((node) => {
    const parentId = node.parentId || "__root__";
    if (!typeChildrenByParentId.has(parentId)) typeChildrenByParentId.set(parentId, []);
    typeChildrenByParentId.get(parentId).push(node);
  });
  typeChildrenByParentId.forEach((children) => children.sort((a, b) => {
    const leavesOnly = children.every((child) => !(typeChildrenByParentId.get(child.id) || []).length);
    if (leavesOnly) {
      const roleDifference = typeRoleRank(a) - typeRoleRank(b);
      if (roleDifference) return roleDifference;
    }
    return a.order - b.order || a.title.localeCompare(b.title, "ru");
  }));
  const typeChildren = (nodeId = "__root__") => typeChildrenByParentId.get(nodeId) || [];
  const typeRoots = typeChildren();
  const typeDescendantLeaves = (node) => {
    const children = typeChildren(node.id);
    return children.length ? children.flatMap(typeDescendantLeaves) : [node];
  };
  const typeAncestors = (node) => {
    const result = [];
    let current = node?.parentId ? typeNodeById.get(node.parentId) : null;
    while (current) {
      result.unshift(current);
      current = current.parentId ? typeNodeById.get(current.parentId) : null;
    }
    return result;
  };
  const taxCategories = TAXONOMY.groups.flatMap((group) => group.categories);
  const taxCategoryById = new Map(taxCategories.map((item) => [item.id, item]));
  const virtualCategories = TAXONOMY.virtualCategories || [];
  const virtualCategoryById = new Map(virtualCategories.map((item) => [item.id, item]));
  const virtualCategoriesBySourceId = new Map();
  virtualCategories.forEach((item) => {
    if (!virtualCategoriesBySourceId.has(item.sourceCategoryId)) virtualCategoriesBySourceId.set(item.sourceCategoryId, []);
    virtualCategoriesBySourceId.get(item.sourceCategoryId).push(item);
  });
  const navigationSections = [...TAXONOMY.navigationSections].sort((a, b) => a.order - b.order);
  const navigationSectionById = new Map(navigationSections.map((item) => [item.id, item]));
  const navigationGroups = navigationSections.flatMap((section) => section.groups.map((group) => ({ ...group, sectionId: section.id })));
  const navigationGroupById = new Map(navigationGroups.map((item) => [item.id, item]));
  const navigationSubgroups = navigationGroups.flatMap((group) => (group.subgroups || []).map((subgroup) => ({
    ...subgroup,
    key: `${group.id}::${subgroup.id}`,
    groupId: group.id,
    sectionId: group.sectionId,
  })));
  const navigationSubgroupByKey = new Map(navigationSubgroups.map((item) => [item.key, item]));
  const navigationPlacementsByCategoryId = new Map();
  navigationGroups.forEach((group) => {
    const subgroupByCategory = new Map();
    (group.subgroups || []).forEach((subgroup) => subgroup.categoryIds.forEach((categoryId) => subgroupByCategory.set(categoryId, `${group.id}::${subgroup.id}`)));
    group.categoryIds.forEach((categoryId) => {
      if (!navigationPlacementsByCategoryId.has(categoryId)) navigationPlacementsByCategoryId.set(categoryId, []);
      navigationPlacementsByCategoryId.get(categoryId).push({
        sectionId: group.sectionId,
        groupId: group.id,
        subgroupKey: subgroupByCategory.get(categoryId) || "",
      });
    });
  });

  const placementForCategory = (categoryId, preferredGroupId = "") => {
    const placements = navigationPlacementsByCategoryId.get(categoryId) || [];
    return placements.find((item) => item.groupId === preferredGroupId) || placements[0];
  };

  const dnsCategoryById = new Map(FULL.categories.map((item) => [String(item.id), item]));
  const dnsCategoryByName = new Map(FULL.categories.map((item) => [item.name, item]));
  const dnsCategoryByUrl = new Map(FULL.categories.map((item) => [item.url, item]));
  const dnsTargetsBySource = new Map();
  FULL.categories.forEach((category) => (category.sourceNames || []).forEach((sourceName) => {
    if (!dnsTargetsBySource.has(sourceName)) dnsTargetsBySource.set(sourceName, []);
    dnsTargetsBySource.get(sourceName).push(category);
  }));

  const typeTargetsFor = (node) => {
    const targets = [];
    const add = (category) => {
      if (!category?.url || targets.some((item) => item.url === category.url)) return;
      targets.push(category);
    };
    (node.sourceUrls || []).forEach((url, index) => {
      add(dnsCategoryByUrl.get(url) || { id: `source-${node.id}-${index}`, name: node.sourceNames?.[index] || node.title, url });
    });
    [...(node.sourceNames || []), node.title].forEach((name) => {
      add(dnsCategoryByName.get(name));
      (dnsTargetsBySource.get(name) || []).forEach(add);
    });
    return targets;
  };

  const stageCategoryByName = new Map(FULL.categories.map((item) => [item.name, item]));
  const categoryIdsForNames = (names) => names.map((name) => stageCategoryByName.get(name)?.id).filter(Boolean);
  const externalCategory = (name, url = "") => ({ id: `external-${normalize(name).replace(/[^a-zа-я0-9]+/g, "-")}`, name, url });

  function ensureStageWork(stageName, workName) {
    const stage = FULL.stages.find((item) => item.name === stageName);
    if (!stage) return null;
    let work = stage.works.find((item) => item.name === workName);
    if (!work) {
      work = { name: workName, operations: [] };
      stage.works.push(work);
    }
    return work;
  }

  function ensureStageOperation(stageName, workName, operationName, categoryNames = [], externalCategories = []) {
    const work = ensureStageWork(stageName, workName);
    if (!work) return;
    let operation = work.operations.find((item) => item.name === operationName);
    if (!operation) {
      operation = { name: operationName, categoryIds: [], externalCategories: [] };
      work.operations.push(operation);
    }
    const ids = categoryIdsForNames(categoryNames).map(String);
    const currentIds = new Set((operation.categoryIds || []).map(String));
    ids.forEach((id) => currentIds.add(id));
    operation.categoryIds = [...currentIds];
    const currentExternal = new Map((operation.externalCategories || []).map((item) => [item.name, item]));
    externalCategories.forEach((item) => currentExternal.set(item.name, item));
    operation.externalCategories = [...currentExternal.values()];
  }

  // Демонтаж: добавляем ручной ударно-рычажный инструмент к разрушению бетона и кладки.
  ensureStageOperation("Демонтаж и расчистка", "Демонтаж", "Разрушение бетона и кладки",
    ["Молотки"],
    [externalCategory("Кувалды и кирки"), externalCategory("Ломы, монтировки и гвоздодеры")]);

  // Черновые работы.
  ensureStageOperation("Черновые строительные работы", "Полы и основания", "Устройство стяжки и заливка наливного пола",
    ["Дрели-миксеры", "Бетоносмесители", "Лазерные нивелиры и уровни", "Уровни, угломеры и уклономеры", "Шпатели", "Мастерки, кельмы, расшивки"]);
  ensureStageOperation("Черновые строительные работы", "Тепло- и звукоизоляция", "Раскрой и крепление изоляционных материалов",
    ["Специализированные ножи", "Степлеры электрические", "Скобы для пистолетов", "Рулетки"]);

  // Инженерные коммуникации.
  ensureStageOperation("Инженерные коммуникации", "Сантехника и отопление", "Монтаж смесителя и сифона",
    ["Ключи разводные", "Плоскогубцы и пассатижи", "Отвертки", "Наборы ключей"],
    [externalCategory("Труборезы")]);
  ensureStageOperation("Инженерные коммуникации", "Сантехника и отопление", "Монтаж водонагревателей и радиаторов",
    ["Перфораторы", "Дрели", "Шуруповёрты и дрели-шуруповёрты", "Буры", "Сверла", "Наборы ключей", "Ключи разводные", "Наборы торцевых головок", "Лазерные нивелиры и уровни", "Рулетки", "Детекторы проводки"]);
  ensureStageOperation("Инженерные коммуникации", "Сантехника и отопление", "Герметизация соединений и устранение протечек",
    ["Ключи разводные", "Плоскогубцы и пассатижи", "Отвертки", "Аккумуляторные пистолеты для герметика", "Специализированные ножи"]);
  ensureStageOperation("Инженерные коммуникации", "Электромонтаж", "Монтаж розеток, выключателей и светильников",
    ["Отвертки", "Пробники напряжения", "Мультиметры", "Стрипперы", "Инструменты для обжима", "Пресс-клещи (кримперы)", "Дрели", "Перфораторы", "Сверла", "Коронки", "Детекторы проводки", "Лазерные нивелиры и уровни"],
    [externalCategory("Отвертки диэлектрические", "https://www.dns-shop.ru/catalog/17a9ffd116404e77/otvertki/?f%5Bbz%5D=s09p-6era&virtual_category_uid=112e028acdec087f")]);

  // Монтаж конструкций и оборудования — новые пользовательские сценарии.
  ensureStageOperation("Монтаж конструкций и оборудования", "Деревянные конструкции", "Монтаж террасы, настила или навеса",
    ["Шуруповёрты и дрели-шуруповёрты", "Дрели", "Пилы дисковые", "Пилы торцовочные", "Лобзики электрические", "Пильные диски", "Наборы бит", "Сверла", "Молотки", "Рулетки", "Лазерные нивелиры и уровни"],
    [externalCategory("Струбцины")]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Металлические конструкции", "Изготовление каркаса, ворот или секции забора",
    ["Сварочные аппараты", "Маски сварочные", "Электроды", "Сварочная проволока", "Углошлифовальные машины (УШМ)", "Отрезные и обдирочные диски", "Дрели", "Сверла", "Наборы ключей", "Рулетки", "Лазерные нивелиры и уровни"]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Сборка и крепление", "Сборка мебели и кухонных модулей",
    ["Шуруповёрты и дрели-шуруповёрты", "Аккумуляторные отвертки", "Отвертки", "Наборы бит", "Ключи имбусовые", "Рулетки", "Уровни, угломеры и уклономеры", "Лобзики электрические"],
    [externalCategory("Струбцины")]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Стены и перегородки", "Монтаж перегородки из ГКЛ",
    ["Шуруповёрты и дрели-шуруповёрты", "Дрели", "Наборы бит", "Специализированные ножи", "Ножницы по металлу", "Рулетки", "Лазерные нивелиры и уровни", "Детекторы проводки"]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Сборка и крепление", "Разметка, сверление и крепление",
    ["Шуруповёрты и дрели-шуруповёрты", "Дрели", "Перфораторы", "Сверла", "Буры", "Коронки", "Наборы бит", "Рулетки", "Лазерные нивелиры и уровни", "Детекторы проводки"]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Навеска предметов и оборудования", "Навеска полок, карнизов, ТВ и оборудования",
    ["Перфораторы", "Дрели", "Шуруповёрты и дрели-шуруповёрты", "Сверла", "Буры", "Коронки", "Наборы бит", "Отвертки", "Рулетки", "Лазерные нивелиры и уровни", "Детекторы проводки"]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Двери, окна и столярный монтаж", "Монтаж дверной коробки, полотна и наличников",
    ["Шуруповёрты и дрели-шуруповёрты", "Дрели", "Наборы бит", "Лобзики электрические", "Пилы торцовочные", "Стамески", "Молотки", "Рулетки", "Уровни, угломеры и уклономеры", "Аккумуляторные пистолеты для герметика"],
    [externalCategory("Ножовки по дереву", "https://www.dns-shop.ru/catalog/recipe/f6d2f4b1a3b2afd5/nozovki-po-derevu/"), externalCategory("Струбцины")]);
  ensureStageOperation("Монтаж конструкций и оборудования", "Двери, окна и столярный монтаж", "Герметизация и утепление окон",
    ["Аккумуляторные пистолеты для герметика", "Специализированные ножи", "Скребки", "Рулетки", "Уровни, угломеры и уклономеры"]);

  // Подготовка поверхностей.
  ensureStageOperation("Подготовка поверхностей", "Стены и потолки", "Подготовка и окрашивание стен и потолков",
    ["Скребки", "Шпатели", "Мастерки, кельмы, расшивки", "Шлифовальные машины для стен и потолка", "Шлифовальные листы", "Валики и бугели", "Кисти малярные", "Краскопульты", "Респираторы", "Очки защитные"]);

  // Чистовая отделка.
  ensureStageOperation("Чистовая отделка", "Плитка, камень и стекло", "Укладка плитки и кухонного фартука",
    ["Дрели-миксеры", "Углошлифовальные машины (УШМ)", "Алмазные диски", "Сверла", "Коронки", "Лазерные нивелиры и уровни", "Рулетки", "Шпатели", "Мастерки, кельмы, расшивки"],
    [externalCategory("Плиткорезы ручные")]);
  ensureStageOperation("Чистовая отделка", "Покраска и финишная обработка", "Подготовка и окрашивание стен и потолков",
    ["Скребки", "Шпатели", "Шлифовальные машины для стен и потолка", "Шлифовальные листы", "Валики и бугели", "Кисти малярные", "Краскопульты", "Респираторы"]);
  ensureStageOperation("Чистовая отделка", "Напольные покрытия", "Укладка ламината и монтаж плинтуса",
    ["Лобзики электрические", "Пилы торцовочные", "Пилы дисковые", "Пилки для электролобзиков", "Пильные диски", "Шуруповёрты и дрели-шуруповёрты", "Дрели", "Специализированные ножи", "Молотки", "Рулетки", "Уровни, угломеры и уклономеры"]);

  // Мастерская и обслуживание — возвращаем этап в пользовательскую навигацию.
  ensureStageOperation("Мастерская и обслуживание", "Организация мастерской и гаража", "Хранение и организация инструмента",
    ["Ящики для хранения инструмента", "Сумки для инструмента", "Рюкзаки для инструмента", "Короба и контейнеры для хранения", "Фонари", "Лестницы и стремянки"]);
  ensureStageOperation("Мастерская и обслуживание", "Организация мастерской и гаража", "Оснащение рабочего места",
    ["Компрессоры", "Сверлильные станки", "Заточные станки (точила)", "Шлифовально-полировальные станки", "Строительные пылесосы", "Фонари"]);
  ensureStageOperation("Мастерская и обслуживание", "Обслуживание инструмента", "Заточка и восстановление режущего инструмента",
    ["Заточные станки (точила)", "Прямые шлифовальные машины", "Гравировальные машинки", "Насадки для гравировальных машин", "Шлифовальные листы"],
    [externalCategory("Напильники и надфили", "https://www.dns-shop.ru/catalog/17aa027916404e77/napilniki/")]);

  // Дополнительный частотный сценарий: безопасное сверление в готовых стенах.
  ensureStageOperation("Подготовка, безопасность и разметка", "Измерение и разметка", "Поиск скрытой проводки и коммуникаций перед сверлением",
    ["Детекторы проводки", "Тепловизоры", "Пробники напряжения"]);

  const operationCategoryCount = (operation) => (operation.categoryIds || []).length + (operation.externalCategories || []).length;
  const operationCategories = (operation) => [
    ...(operation.categoryIds || []).map((id) => FULL.categories.find((item) => String(item.id) === String(id))).filter(Boolean),
    ...(operation.externalCategories || []),
  ];
  const stageCategoryCount = (stage) => {
    const keys = new Set();
    (stage.works || []).forEach((work) => (work.operations || []).forEach((operation) => {
      (operation.categoryIds || []).forEach((id) => keys.add(`id:${id}`));
      (operation.externalCategories || []).forEach((item) => keys.add(`name:${item.name}`));
    }));
    return keys.size;
  };

  const visibleStages = FULL.stages;
  const stageImagePath = (slug) => `assets/generated/stages/${slug}.webp`;
  const STAGE_IMAGES = new Map([
    ["Подготовка, безопасность и разметка", stageImagePath("preparation-safety-and-layout")],
    ["Демонтаж и расчистка", stageImagePath("demolition-and-clearing")],
    ["Черновые строительные работы", stageImagePath("rough-construction-work")],
    ["Инженерные коммуникации", stageImagePath("engineering-utilities")],
    ["Монтаж конструкций и оборудования", stageImagePath("installation-of-structures-and-equipment")],
    ["Подготовка поверхностей", stageImagePath("surface-preparation")],
    ["Чистовая отделка", stageImagePath("finish-work")],
    ["Уборка, проверка и сдача", stageImagePath("cleaning-inspection-and-handover")],
    ["Мастерская и обслуживание", stageImagePath("workshop-and-maintenance")],
  ]);
  const WORK_IMAGES = new Map([
    ["Безопасность и СИЗ", stageImagePath("safety-and-ppe")],
    ["Временное электроснабжение", stageImagePath("temporary-power-supply")],
    ["Измерение и разметка", stageImagePath("measurement-and-layout")],
    ["Организация рабочего места", stageImagePath("worksite-organization")],
    ["Освещение и работа на высоте", stageImagePath("lighting-and-work-at-height")],
    ["Подготовка инструмента", stageImagePath("tool-preparation")],
    ["Демонтаж", stageImagePath("demolition-and-clearing")],
    ["Бетон, кладка и отверстия", stageImagePath("concrete-masonry-and-holes")],
    ["Подготовка основания", stageImagePath("base-preparation")],
    ["Сантехника и отопление", stageImagePath("plumbing-and-heating")],
    ["Электромонтаж", stageImagePath("electrical-installation")],
    ["Деревянные конструкции", stageImagePath("wooden-structures")],
    ["Металлические конструкции", stageImagePath("metal-structures")],
    ["Пневматический монтаж", stageImagePath("pneumatic-installation")],
    ["Сборка и крепление", stageImagePath("assembly-and-fastening")],
    ["Сварка металлоконструкций", stageImagePath("welding-of-metal-structures")],
    ["Стены и перегородки", stageImagePath("walls-and-partitions")],
    ["Минеральные основания", stageImagePath("mineral-substrates")],
    ["Основания под плитку", stageImagePath("tile-substrates")],
    ["Стены и потолки", stageImagePath("walls-and-ceilings")],
    ["Плитка, камень и стекло", stageImagePath("tile-stone-and-glass")],
    ["Пневматическая окраска и обработка", stageImagePath("pneumatic-painting-and-surface-treatment")],
    ["Покраска и финишная обработка", stageImagePath("painting-and-finishing")],
    ["Мойка объекта", stageImagePath("site-washing")],
    ["Пылеудаление", stageImagePath("dust-removal")],
    ["Финальный контроль", stageImagePath("final-inspection")],
    ["Компрессорное оборудование", stageImagePath("compressor-equipment")],
    ["Ремонт автомобилей и техники", stageImagePath("vehicle-and-equipment-repair")],
    ["Станочные работы", stageImagePath("machine-tool-work")],
    ["Полы и основания", stageImagePath("base-preparation")],
    ["Тепло- и звукоизоляция", stageImagePath("walls-and-partitions")],
    ["Навеска предметов и оборудования", stageImagePath("assembly-and-fastening")],
    ["Двери, окна и столярный монтаж", stageImagePath("wooden-structures")],
    ["Напольные покрытия", stageImagePath("finish-work")],
    ["Организация мастерской и гаража", stageImagePath("workshop-and-maintenance")],
    ["Обслуживание инструмента", stageImagePath("machine-tool-work")],
  ]);
  const BRAND_DEFS = [
    ["FinePower", "FinePower", "#f47b20"], ["Makita", "Makita", "#008c95"], ["Worx", "Worx", "#ef7b18"],
    ["CAT", "CAT", "#e1ae10"], ["Einhell", "Einhell", "#d71920"], ["GreenWorks", "GreenWorks", "#62a944"],
    ["Wesco", "Wesco", "#5d6570"], ["Ryobi", "Ryobi", "#83ad22"], ["Bosch", "Bosch", "#0c815a"],
    ["DeWalt", "DeWalt", "#e1ae10"], ["Patriot", "Patriot", "#dd3d31"], ["P.I.T", "P.I.T", "#f47b20"],
    ["Metabo", "Metabo", "#318b71"], ["Hyundai", "Hyundai", "#2566a8"], ["Sturm!", "Sturm!", "#f2872d"],
    ["Зубр", "ЗУБР", "#2f8b48"], ["Интерскол", "Интерскол", "#d53a34"], ["RedVerg", "RedVerg", "#d64132"],
    ["SENIX", "SENIX", "#247ba0"], ["Daewoo", "Daewoo", "#2574ad"], ["Aceline", "Aceline", "#f47b20"],
    ["DEKO", "DEKO", "#ff6b22"], ["AEG", "AEG", "#db252c"], ["Hanskonner", "Hanskonner", "#34383c"],
    ["Karcher", "Karcher", "#d1ac08"],
  ].map(([prefix, name, tone], index) => ({ id: `brand-${index + 1}`, prefix, name, tone }));

  const batteryPlatformRoot = FULL.typeBlocks
    .find((block) => String(block.id) === "1")?.groups
    .find((group) => group.name === "Аккумуляторные платформы");

  const platformsForBrand = (brand) => (batteryPlatformRoot?.children || [])
    .filter((platform) => normalize(platform.name).startsWith(normalize(brand.prefix)));
  const availableBrands = BRAND_DEFS.filter((brand) => platformsForBrand(brand).length);
  const brandSectionName = (brand) => `Платформы ${brand.name}`;

  const GENERIC_PLATFORM_IMAGE = "assets/generated/phase-01/entry-01-accumulator-platforms.webp";

  function slugifyAssetName(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[^\w\s.-]|_/g, "")
      .toLocaleLowerCase("ru-RU")
      .replace(/ё/g, "е")
      .replace(/[.\/]+/g, "-")
      .replace(/[^a-zа-я0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function brandImagePath(brand) {
    if (brand.name === "ЗУБР") return "assets/generated/platform-brands/zubr.webp";
    if (brand.name === "Интерскол") return "assets/generated/platform-brands/interskol.webp";
    return `assets/generated/platform-brands/${slugifyAssetName(brand.name)}.webp`;
  }
  const platformImagePath = (platformName) => `assets/generated/platforms/${slugifyAssetName(platformName)}.webp`;

  function platformVoltage(platformName) {
    const name = String(platformName || "");
    const oneBase = name.match(/OneBase(12|20)/i);
    if (oneBase) return `${oneBase[1]} V`;
    const flex = name.match(/(10\.8\/12|18\/54|18\/36)(?:\s*)V?/i);
    if (flex) return `${flex[1]} V`;
    const volts = name.match(/(\d+(?:\.\d+)?)\s*(?:V|Volt)/i);
    if (volts) return `${volts[1]} V`;
    const fallback = name.match(/(?:^|\s)(12|18|20|21|24|36|40|54|60|82)(?:\s|$)/);
    return fallback ? `${fallback[1]} V` : "Li-ion";
  }

  const targetsFor = (taxCategory) => {
    const targets = [...(dnsTargetsBySource.get(taxCategory.name) || [])];
    (taxCategory.targetIds || []).map((id) => dnsCategoryById.get(String(id))).filter(Boolean).forEach((category) => {
      if (!targets.some((item) => String(item.id) === String(category.id))) targets.push(category);
    });
    return targets;
  };

  function navAttrs(kind, id = "", extra = "") {
    return `data-nav-kind="${escapeHtml(kind)}" data-nav-id="${encodeURIComponent(id)}" data-nav-extra="${encodeURIComponent(extra)}"`;
  }

  function previewAttrs(kind, id = "", extra = "") {
    return `data-mega-preview-kind="${escapeHtml(kind)}" data-mega-preview-id="${encodeURIComponent(id)}" data-mega-preview-extra="${encodeURIComponent(extra)}"`;
  }

  function catalogCard({ name, attrs = "", meta = "", className = "", badge = "", image = "", tag = "button" }) {
    const mediaClass = image ? " has-image" : "";
    const open = tag === "a" ? `<a class="photo-card ${escapeHtml(className)}${mediaClass}" ${attrs}>` : `<button type="button" class="photo-card ${escapeHtml(className)}${mediaClass}" ${attrs}>`;
    const close = tag === "a" ? "</a>" : "</button>";
    const media = image ? `<span class="photo-card-media" aria-hidden="true"><img src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async" onerror="if(!this.dataset.fallbackApplied){this.dataset.fallbackApplied='1';this.src='${GENERIC_PLATFORM_IMAGE}';}" /></span>` : "";
    return `${open}${media}${badge}<span class="photo-card-copy"><strong>${escapeHtml(name)}</strong>${meta ? `<small>${escapeHtml(meta)}</small>` : ""}</span>${close}`;
  }

  const ICONS = {
    tool: '<svg viewBox="0 0 24 24"><path d="m14.5 6.5 3-3 3 3-3 3m-2-1-9.7 9.7a2.1 2.1 0 0 1-3-3l9.7-9.7m-7 6 3 3"/></svg>',
    drill: '<svg viewBox="0 0 24 24"><path d="M4 8h10l3 3-3 3H9v5H5v-5H4zM17 10h3m-8-2V5h4v4"/></svg>',
    cut: '<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="8" cy="16" r="3"/><path d="m10.5 9.5 9-5m-9 10 9 5M13 12h7"/></svg>',
    measure: '<svg viewBox="0 0 24 24"><path d="M4 17 17 4l3 3L7 20zM9 15l-2-2m5-1-2-2m5-1-2-2"/></svg>',
    safety: '<svg viewBox="0 0 24 24"><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
    battery: '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="15" height="11" rx="2"/><path d="M19 10h2v5h-2M7 12h4m-2-2v4"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="m4 8 8-4 8 4-8 4zM4 8v9l8 4 8-4V8m-8 4v9"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M13 3c1 4-2 5-2 8 0 2 1 3 3 3 2.5 0 4-2 3-5 3 2.5 4 5.5 3 8a8 8 0 1 1-14-7c0 3 1 5 3 5 1.5 0 2.5-1 2.5-2.5C12.5 8 11 6 13 3z"/></svg>',
    water: '<svg viewBox="0 0 24 24"><path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/><path d="M9 16c.5 1.2 1.5 2 3 2"/></svg>',
    surface: '<svg viewBox="0 0 24 24"><path d="M4 7h16M6 12h12M8 17h8"/><circle cx="7" cy="7" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="11" cy="17" r="2"/></svg>',
    checklist: '<svg viewBox="0 0 24 24"><path d="m4 6 2 2 3-4M11 6h9M4 13l2 2 3-4m2 2h9M4 20l2 2 3-4m2 2h9"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 7h7l2 2h9v10H3zM3 7V5h7l2 2"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
  };

  function iconKind(name, context = "") {
    const value = normalize(name);
    if (context === "operation") return "checklist";
    if (context === "subgroup") return "folder";
    if (context === "platform") return "battery";
    if (context === "dns") return "grid";
    if (/защит|безопас|перчат|маск/.test(value)) return "safety";
    if (/измер|размет|уров|контрол|линей|уголь|рулет|дальном|нивел|температур/.test(value)) return "measure";
    if (/аккум|акб|заряд|питан/.test(value)) return "battery";
    if (/сверл|дрел|бур|перфорат|корон/.test(value)) return "drill";
    if (/пил|рез|диск|нож|полот|лобз|ушм|штроб/.test(value)) return "cut";
    if (/шлиф|полир|зачист|поверхност|щет/.test(value)) return "surface";
    if (/свар|пая/.test(value)) return "flame";
    if (/хран|ящик|сумк|мастерск|рабочего места/.test(value)) return "box";
    if (/мойк|пылесос|уборк|очист/.test(value)) return "water";
    return "tool";
  }

  function iconCard({ name, attrs = "", meta = "", badge = "", tag = "button", context = "", className = "" }) {
    const open = tag === "a" ? `<a class="icon-card ${escapeHtml(className)}" ${attrs}>` : `<button type="button" class="icon-card ${escapeHtml(className)}" ${attrs}>`;
    const close = tag === "a" ? "</a>" : "</button>";
    const icon = ICONS[iconKind(name, context)] || ICONS.tool;
    return `${open}<span class="icon-card-symbol" aria-hidden="true">${icon}</span><span class="icon-card-copy"><strong>${escapeHtml(name)}</strong>${meta ? `<small>${escapeHtml(meta)}</small>` : ""}</span>${badge}<span class="icon-card-arrow" aria-hidden="true">›</span>${close}`;
  }

  function dnsCategoryIconCard(category, className = "") {
    return iconCard({ name: category.name, meta: "Категория DNS", tag: "a", attrs: `href="${escapeHtml(category.url)}" target="_blank" rel="noopener"`, context: "dns", className });
  }

  function typeNodeMeta(node) {
    const children = typeChildren(node.id);
    if (children.length) return `${children.length} ${children.length === 1 ? "раздел" : children.length < 5 ? "раздела" : "разделов"}`;
    const targetCount = typeTargetsFor(node).length;
    return targetCount > 1 ? `${targetCount} категории DNS` : "Категория";
  }

  function typeLeafCard(node) {
    const targets = typeTargetsFor(node);
    if (targets.length === 1) {
      return iconCard({
        name: node.title,
        meta: "Категория DNS",
        tag: "a",
        attrs: `href="${escapeHtml(targets[0].url)}" target="_blank" rel="noopener"`,
        context: "dns",
      });
    }
    const badge = targets.length > 1 ? `<b class="icon-status">${targets.length}</b>` : "";
    return iconCard({ name: node.title, meta: targets.length > 1 ? `${targets.length} категории DNS` : "Категория", badge, attrs: navAttrs("type-node", node.id) });
  }

  function taxCategoryIconCard(taxCategory, placementGroupId = "") {
    const targets = targetsFor(taxCategory);
    const meta = targets.length === 0 ? "Требуется сопоставление" : targets.length === 1 ? "1 категория DNS" : `${targets.length} категорий DNS`;
    const badge = targets.length === 0 ? '<b class="icon-status warning">Нет ссылки</b>' : targets.length > 1 ? `<b class="icon-status">${targets.length}</b>` : "";
    return iconCard({ name: taxCategory.name, meta, badge, attrs: navAttrs("tax-category", taxCategory.id, placementGroupId) });
  }

  function virtualCategoryIconCard(virtualCategory, placementGroupId = "") {
    const source = taxCategoryById.get(virtualCategory.sourceCategoryId);
    const targets = source ? targetsFor(source) : [];
    const meta = targets.length === 0 ? "Требуется сопоставление" : targets.length === 1 ? "1 категория DNS" : `${targets.length} категорий DNS`;
    const badge = targets.length > 1 ? `<b class="icon-status">${targets.length}</b>` : targets.length === 0 ? '<b class="icon-status warning">Нет ссылки</b>' : "";
    return iconCard({ name: virtualCategory.name, meta, badge, attrs: navAttrs("virtual-category", virtualCategory.id, placementGroupId) });
  }

  function displayNodesForCategory(taxCategory) {
    return virtualCategoriesBySourceId.get(taxCategory.id) || [taxCategory];
  }

  function displayNodesForIds(categoryIds) {
    return categoryIds
      .map((id) => taxCategoryById.get(id))
      .filter(Boolean)
      .flatMap(displayNodesForCategory);
  }

  function displayNodeCard(node, placementGroupId = "") {
    return node.sourceCategoryId ? virtualCategoryIconCard(node, placementGroupId) : taxCategoryIconCard(node, placementGroupId);
  }

  function displayNodeNav(node, placementGroupId = "") {
    return node.sourceCategoryId ? navAttrs("virtual-category", node.id, placementGroupId) : navAttrs("tax-category", node.id, placementGroupId);
  }

  root.innerHTML = `
    <div class="site-frame">
      <header class="site-header"><div class="header-shell">
        <button class="brand" type="button" ${navAttrs("home")}><span class="brand-symbol">DNS</span><span><strong>Инструменты</strong><small>структура каталога</small></span></button>
        <button id="catalog-toggle" class="catalog-button" type="button" data-action="toggle-catalog" aria-expanded="false"><i></i>Каталог<span>⌄</span></button>
        <div class="search-wrap"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg><input id="catalog-search" type="search" placeholder="Найти категорию, бренд, этап или инструмент" autocomplete="off" /><div id="search-results" class="search-results" hidden></div></div>
        <div class="header-mode-switch" aria-label="Вариант первого уровня"><button type="button" data-home-mode="compact" class="${state.homeMode === "compact" ? "active" : ""}">3 входа</button><button type="button" data-home-mode="expanded" class="${state.homeMode === "expanded" ? "active" : ""}">Типы на 1 уровне</button></div>
        <button class="tree-button" type="button" data-action="open-tree">Дерево структуры</button>
      </div></header>
      <div id="mega-root"></div>
      <main id="page" class="page-shell"></main>
      <footer><strong>Прототип структуры каталога DIY</strong><span>Управленческая иерархия сохранена как справочник, пользовательская навигация развивается независимо</span></footer>
      <div id="modal-root"></div>
    </div>`;

  const page = document.getElementById("page");
  const megaRoot = document.getElementById("mega-root");
  const modalRoot = document.getElementById("modal-root");
  const catalogToggle = document.getElementById("catalog-toggle");
  const searchInput = document.getElementById("catalog-search");
  const searchResults = document.getElementById("search-results");

  function breadcrumbs(items) {
    return `<nav class="breadcrumbs" aria-label="Навигация">${items.map((item, index) => `${index ? "<i>›</i>" : ""}${item.kind ? `<button type="button" ${navAttrs(item.kind, item.id || "", item.extra || "")}>${escapeHtml(item.name)}</button>` : `<span>${escapeHtml(item.name)}</span>`}`).join("")}</nav>`;
  }

  function navigate(kind, id = "", extra = "") {
    state.kind = kind;
    state.id = id;
    state.extra = extra;
    closeCatalog();
    searchResults.hidden = true;
    searchInput.value = "";
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function flattenLeaves(node) {
    if (!node?.children?.length) return [node];
    return node.children.flatMap(flattenLeaves);
  }

  const popularGroups = [
    {
      name: "Электроинструменты",
      rootName: "Электроинструменты",
      categories: ["Шуруповёрты и дрели-шуруповёрты", "Дрели", "Перфораторы", "Углошлифовальные машины (УШМ)"],
    },
    {
      name: "Оснастка и расходные материалы",
      rootName: "Оснастка и расходные материалы",
      categories: ["Наборы сверл", "Пильные диски", "Отрезные и обдирочные диски"],
    },
    {
      name: "Измерение и разметка",
      rootName: "Измерительный инструмент",
      categories: ["Лазерные нивелиры и уровни", "Лазерные дальномеры", "Рулетки"],
    },
    {
      name: "Силовая техника и оборудование",
      rootName: "Силовая техника",
      categories: ["Электрогенераторы", "Компрессоры", "Строительные пылесосы"],
    },
  ];

  function popularCategoryCard(group) {
    const categories = group.categories.map((name) => dnsCategoryByName.get(name)).filter(Boolean);
    const typeRoot = typeRoots.find((node) => node.title === group.rootName);
    return `<article class="popular-card"><button type="button" class="popular-card-title" ${navAttrs("type-node", typeRoot?.id || "")}>${escapeHtml(group.name)}</button><div>${categories.map((category) => `<a href="${escapeHtml(category.url)}" target="_blank" rel="noopener">${escapeHtml(category.name)}</a>`).join("")}</div></article>`;
  }

  function renderModeSwitch() {
    return `<div class="catalog-mode-panel"><div><strong>Вариант первого уровня каталога</strong><small>Переключатель для сравнения архитектуры без смены сборки.</small></div><div class="catalog-mode-switch" role="group" aria-label="Вариант первого уровня"><button type="button" data-home-mode="compact" class="${state.homeMode === "compact" ? "active" : ""}">3 входа</button><button type="button" data-home-mode="expanded" class="${state.homeMode === "expanded" ? "active" : ""}">Типы инструмента на 1 уровне</button></div></div>`;
  }

  function renderHome() {
    const compactEntries = [
      { kind: "platforms", name: "Аккумуляторные платформы", image: "assets/generated/phase-01/entry-01-accumulator-platforms.webp" },
      { kind: "stages", name: "Подбор по этапам работ", image: stageImagePath("selection-by-work-stages") },
      { kind: "types", name: "По типу инструмента", image: "assets/generated/phase-01/entry-03-tool-types.webp" },
    ];
    const fixedExpandedEntries = [
      { kind: "platforms", name: "Аккумуляторные платформы", image: "assets/generated/phase-01/entry-01-accumulator-platforms.webp" },
      { kind: "stages", name: "Подбор по этапам работ", image: stageImagePath("selection-by-work-stages") },
    ];
    const entriesHtml = state.homeMode === "compact"
      ? `<section class="entry-grid">${compactEntries.map((item) => catalogCard({ name: item.name, image: item.image, attrs: navAttrs(item.kind), className: "entry-card" })).join("")}</section>`
      : `<section class="first-level-grid">${fixedExpandedEntries.map((item) => catalogCard({ name: item.name, image: item.image, attrs: navAttrs(item.kind), className: "entry-card first-level-featured" })).join("")}${typeRoots.map((node) => catalogCard({ name: node.title, meta: typeNodeMeta(node), attrs: navAttrs("type-node", node.id), className: "first-level-type" })).join("")}</section>`;
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Инструменты для ремонта и стройки" }])}
      <section class="page-intro"><h1>Инструменты для ремонта и стройки</h1></section>
      ${renderModeSwitch()}
      ${entriesHtml}
      <section class="section-block"><div class="section-heading"><h2>Популярные категории</h2></div><div class="popular-grid">${popularGroups.map(popularCategoryCard).join("")}</div></section>`;
  }

  function renderTypes() {
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Инструменты для ремонта и стройки" }])}
      <section class="page-intro"><h1>По типу инструмента</h1></section>
      <section class="type-grid">${typeRoots.map((node) => catalogCard({ name: node.title, meta: typeNodeMeta(node), attrs: navAttrs("type-node", node.id) })).join("")}</section>`;
  }

  function renderTypeNode() {
    const node = typeNodeById.get(state.id);
    if (!node) return renderNotFound();
    const ancestors = typeAncestors(node);
    const crumbs = [
      { name: "Каталог", kind: "home" },
      ...(state.homeMode === "compact" ? [{ name: "По типу инструмента", kind: "types" }] : []),
      ...ancestors.map((item) => ({ name: item.title, kind: "type-node", id: item.id })),
      { name: node.title },
    ];
    const children = typeChildren(node.id);
    if (!children.length) {
      const targets = typeTargetsFor(node);
      return `${breadcrumbs(crumbs)}
        <section class="page-intro compact-intro"><h1>${escapeHtml(node.title)}</h1></section>
        ${targets.length ? `<section class="icon-card-grid">${targets.map(dnsCategoryIconCard).join("")}</section>` : '<div class="mapping-warning"><strong>Категория пока не сопоставлена с DNS</strong></div>'}`;
    }
    const onlyLeaves = children.every((child) => !typeChildren(child.id).length);
    const content = onlyLeaves
      ? `<section class="icon-card-grid">${children.map(typeLeafCard).join("")}</section>`
      : `<section class="group-photo-grid type-direction-grid">${children.map((child) => catalogCard({ name: child.title, meta: typeNodeMeta(child), attrs: navAttrs("type-node", child.id) })).join("")}</section>`;
    return `${breadcrumbs(crumbs)}
      <section class="page-intro"><h1>${escapeHtml(node.title)}</h1></section>
      ${content}`;
  }

  function renderMacro() {
    const section = navigationSectionById.get(state.id);
    if (!section) return renderNotFound();
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "По типу инструмента", kind: "types" }, { name: section.name }])}
      <section class="page-intro"><h1>${escapeHtml(section.name)}</h1></section>
      <section class="group-photo-grid type-direction-grid">${section.groups.map((group) => catalogCard({ name: group.name, meta: group.subgroups?.length ? `${group.subgroups.length} подгруппы` : `${displayNodesForIds(group.categoryIds).length} категорий`, attrs: navAttrs("group", group.id) })).join("")}</section>`;
  }

  function renderGroup() {
    const group = navigationGroupById.get(state.id);
    const section = group && navigationSectionById.get(group.sectionId);
    if (!group || !section) return renderNotFound();
    const categories = displayNodesForIds(group.categoryIds);
    const content = group.subgroups?.length
      ? `<section class="icon-card-grid">${group.subgroups.map((subgroup) => iconCard({ name: subgroup.name, meta: `${displayNodesForIds(subgroup.categoryIds).length} категорий`, context: "subgroup", attrs: navAttrs("subgroup", `${group.id}::${subgroup.id}`) })).join("")}</section>`
      : `<section class="icon-card-grid">${categories.map((node) => displayNodeCard(node, group.id)).join("")}</section>`;
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "По типу инструмента", kind: "types" }, { name: section.name, kind: "macro", id: section.id }, { name: group.name }])}
      <section class="page-intro"><h1>${escapeHtml(group.name)}</h1></section>
      ${content}`;
  }

  function renderSubgroup() {
    const subgroup = navigationSubgroupByKey.get(state.id);
    const group = subgroup && navigationGroupById.get(subgroup.groupId);
    const section = group && navigationSectionById.get(group.sectionId);
    if (!subgroup || !group || !section) return renderNotFound();
    const categories = displayNodesForIds(subgroup.categoryIds);
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: section.name, kind: "macro", id: section.id }, { name: group.name, kind: "group", id: group.id }, { name: subgroup.name }])}
      <section class="page-intro compact-intro"><h1>${escapeHtml(subgroup.name)}</h1></section>
      <section class="icon-card-grid">${categories.map((node) => displayNodeCard(node, group.id)).join("")}</section>`;
  }

  function renderTaxCategory() {
    const taxCategory = taxCategoryById.get(state.id);
    const placement = taxCategory && placementForCategory(taxCategory.id, state.extra);
    const group = placement && navigationGroupById.get(placement.groupId);
    const section = placement && navigationSectionById.get(placement.sectionId);
    const subgroup = placement?.subgroupKey ? navigationSubgroupByKey.get(placement.subgroupKey) : null;
    if (!taxCategory || !group || !section) return renderNotFound();
    const targets = targetsFor(taxCategory);
    const crumbs = [{ name: "Каталог", kind: "home" }, { name: section.name, kind: "macro", id: section.id }, { name: group.name, kind: "group", id: group.id }];
    if (subgroup) crumbs.push({ name: subgroup.name, kind: "subgroup", id: subgroup.key });
    crumbs.push({ name: taxCategory.name });
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(taxCategory.name)}</h1></section>
      ${targets.length ? `<section class="icon-card-grid">${targets.map(dnsCategoryIconCard).join("")}</section>` : '<div class="mapping-warning"><strong>Категория пока не сопоставлена с DNS</strong></div>'}`;
  }

  function renderVirtualCategory() {
    const virtualCategory = virtualCategoryById.get(state.id);
    const taxCategory = virtualCategory && taxCategoryById.get(virtualCategory.sourceCategoryId);
    const placement = taxCategory && placementForCategory(taxCategory.id, state.extra);
    const group = placement && navigationGroupById.get(placement.groupId);
    const section = placement && navigationSectionById.get(placement.sectionId);
    const subgroup = placement?.subgroupKey ? navigationSubgroupByKey.get(placement.subgroupKey) : null;
    if (!virtualCategory || !taxCategory || !group || !section) return renderNotFound();
    const targets = targetsFor(taxCategory);
    const crumbs = [{ name: "Каталог", kind: "home" }, { name: section.name, kind: "macro", id: section.id }, { name: group.name, kind: "group", id: group.id }];
    if (subgroup) crumbs.push({ name: subgroup.name, kind: "subgroup", id: subgroup.key });
    crumbs.push({ name: virtualCategory.name });
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(virtualCategory.name)}</h1></section>
      ${targets.length ? `<section class="icon-card-grid">${targets.map(dnsCategoryIconCard).join("")}</section>` : '<div class="mapping-warning"><strong>Категория пока не сопоставлена с DNS</strong></div>'}`;
  }

  function renderPlatforms() {
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Аккумуляторные платформы" }])}
      <section class="page-intro"><h1>Аккумуляторные платформы</h1></section>
      <section class="brand-grid">${availableBrands.map((brand) => catalogCard({ name: brandSectionName(brand), meta: `${platformsForBrand(brand).length} платформ`, image: brandImagePath(brand), attrs: navAttrs("brand", brand.id) })).join("")}</section>`;
  }

  function renderBrand() {
    const brand = BRAND_DEFS.find((item) => item.id === state.id);
    if (!brand) return renderNotFound();
    const platforms = platformsForBrand(brand);
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Аккумуляторные платформы", kind: "platforms" }, { name: brandSectionName(brand) }])}
      <section class="page-intro"><h1>${escapeHtml(brandSectionName(brand))}</h1></section>
      <section class="platform-grid">${platforms.map((platform) => {
        const voltage = platformVoltage(platform.name);
        return catalogCard({ name: platform.name, meta: `${flattenLeaves(platform).length} категорий`, image: platformImagePath(platform.name), badge: `<b class="voltage-badge">${escapeHtml(voltage)}</b>`, attrs: navAttrs("platform", brand.id, platform.name) });
      }).join("")}</section>`;
  }

  function renderPlatform() {
    const brand = BRAND_DEFS.find((item) => item.id === state.id);
    const platform = brand && platformsForBrand(brand).find((item) => item.name === state.extra);
    if (!brand || !platform) return renderNotFound();
    const leaves = flattenLeaves(platform).filter(Boolean);
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Аккумуляторные платформы", kind: "platforms" }, { name: brandSectionName(brand), kind: "brand", id: brand.id }, { name: platform.name }])}
      <section class="page-intro compact-intro"><h1>${escapeHtml(platform.name)}</h1></section>
      <section class="icon-card-grid">${leaves.map((leaf) => {
        const category = dnsCategoryByUrl.get(leaf.url);
        if (category) return dnsCategoryIconCard(category);
        return iconCard({ name: leaf.name, meta: "Категория платформы", context: "platform", tag: "a", attrs: `href="${escapeHtml(leaf.url || "#")}" target="_blank" rel="noopener"` });
      }).join("")}</section>`;
  }

  function renderStages() {
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Подбор по этапам работ" }])}
      <section class="page-intro"><h1>Подбор по этапам работ</h1></section>
      <section class="stage-grid">${visibleStages.map((stage) => catalogCard({ name: stage.name, meta: `${stageCategoryCount(stage)} категорий`, image: STAGE_IMAGES.get(stage.name) || "", badge: `<b class="stage-badge">${String(stage.id).padStart(2, "0")}</b>`, attrs: navAttrs("stage", String(stage.id)) })).join("")}</section>`;
  }

  function operationIconCard(stage, workIndex, operationIndex) {
    const operation = stage.works[workIndex].operations[operationIndex];
    return iconCard({ name: operation.name, meta: `${operationCategoryCount(operation)} категорий`, context: "operation", attrs: navAttrs("operation", String(stage.id), `${workIndex}:${operationIndex}`) });
  }

  function workNavigation(stage, workIndex) {
    const work = stage.works[workIndex];
    return work.operations.length === 1
      ? { kind: "operation", id: String(stage.id), extra: `${workIndex}:0` }
      : { kind: "work", id: String(stage.id), extra: String(workIndex) };
  }

  function renderOperationPage(stage, workIndex, operationIndex) {
    const work = stage?.works?.[workIndex];
    const operation = work?.operations?.[operationIndex];
    if (!stage || !work || !operation) return renderNotFound();
    const categories = operationCategories(operation);
    const singleWork = stage.works.length === 1;
    const singleOperation = work.operations.length === 1;
    const crumbs = [{ name: "Каталог", kind: "home" }, { name: "Этапы работ", kind: "stages" }, { name: stage.name, kind: "stage", id: String(stage.id) }];
    let heading = operation.name;
    if (singleWork && singleOperation) {
      heading = stage.name;
    } else if (singleOperation) {
      crumbs.push({ name: work.name });
      heading = work.name;
    } else {
      if (!singleWork) crumbs.push({ name: work.name, kind: "work", id: String(stage.id), extra: String(workIndex) });
      crumbs.push({ name: operation.name });
    }
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(heading)}</h1></section>
      <section class="icon-card-grid">${categories.map((category) => category.url ? dnsCategoryIconCard(category) : iconCard({ name: category.name, meta: "Категория в структуре · ссылка требует сопоставления", context: "dns", className: "unmapped-card" })).join("")}</section>`;
  }

  function renderStage() {
    const stage = visibleStages.find((item) => String(item.id) === state.id);
    if (!stage) return renderNotFound();
    const onlyWork = stage.works.length === 1 ? stage.works[0] : null;
    if (onlyWork?.operations.length === 1) return renderOperationPage(stage, 0, 0);
    const content = onlyWork
      ? `<section class="icon-card-grid">${onlyWork.operations.map((operation, operationIndex) => operationIconCard(stage, 0, operationIndex)).join("")}</section>`
      : `<section class="group-photo-grid stage-work-grid">${stage.works.map((work, workIndex) => {
          const target = workNavigation(stage, workIndex);
          const meta = work.operations.length === 1 ? `${operationCategoryCount(work.operations[0])} категорий` : `${work.operations.length} операций`;
          return catalogCard({ name: work.name, meta, image: WORK_IMAGES.get(work.name) || "", badge: `<b class="stage-badge">${workIndex + 1}</b>`, attrs: navAttrs(target.kind, target.id, target.extra) });
        }).join("")}</section>`;
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Подбор по этапам работ", kind: "stages" }, { name: stage.name }])}
      <section class="page-intro"><h1>${escapeHtml(stage.name)}</h1></section>
      ${content}`;
  }

  function renderWork() {
    const stage = visibleStages.find((item) => String(item.id) === state.id);
    const workIndex = Number(state.extra);
    const work = stage?.works?.[workIndex];
    if (!stage || !work) return renderNotFound();
    if (work.operations.length === 1) return renderOperationPage(stage, workIndex, 0);
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Этапы работ", kind: "stages" }, { name: stage.name, kind: "stage", id: String(stage.id) }, { name: work.name }])}
      <section class="page-intro compact-intro"><h1>${escapeHtml(work.name)}</h1></section>
      <section class="icon-card-grid">${work.operations.map((operation, operationIndex) => operationIconCard(stage, workIndex, operationIndex)).join("")}</section>`;
  }

  function renderOperation() {
    const stage = visibleStages.find((item) => String(item.id) === state.id);
    const [workIndex, operationIndex] = state.extra.split(":").map(Number);
    return renderOperationPage(stage, workIndex, operationIndex);
  }

  function renderNotFound() {
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Раздел не найден" }])}<section class="page-intro"><h1>Раздел не найден</h1></section>`;
  }

  function renderPage() {
    const views = { home: renderHome, types: renderTypes, "type-node": renderTypeNode, macro: renderMacro, group: renderGroup, subgroup: renderSubgroup, "tax-category": renderTaxCategory, "virtual-category": renderVirtualCategory, platforms: renderPlatforms, brand: renderBrand, platform: renderPlatform, stages: renderStages, stage: renderStage, work: renderWork, operation: renderOperation };
    page.innerHTML = (views[state.kind] || renderNotFound)();
    document.title = `${page.querySelector("h1")?.textContent || "Каталог"} — DNS`;
  }

  function megaLevelItem({ name, meta, navKind, navId = "", navExtra = "", previewKind, previewId = "", previewExtra = "" }) {
    return `<button type="button" class="mega-level-item" ${navAttrs(navKind, navId, navExtra)} ${previewAttrs(previewKind, previewId, previewExtra)}><span><strong>${escapeHtml(name)}</strong>${meta ? `<small>${escapeHtml(meta)}</small>` : ""}</span><b aria-hidden="true">›</b></button>`;
  }

  function renderMegaCatalog() {
    const typeSection = state.homeMode === "compact"
      ? `<section class="mega-path-block"><button type="button" class="mega-path-title" ${navAttrs("types")}><span class="mega-path-number">03</span><span><strong>По типу инструмента</strong></span></button><div class="mega-level-list">${typeRoots.map((node) => megaLevelItem({ name: node.title, meta: typeNodeMeta(node), navKind: "type-node", navId: node.id, previewKind: "type-node", previewId: node.id })).join("")}</div></section>`
      : typeRoots.map((node, index) => `<section class="mega-path-block compact-root"><button type="button" class="mega-path-title" ${navAttrs("type-node", node.id)}><span class="mega-path-number">${String(index + 3).padStart(2, "0")}</span><span><strong>${escapeHtml(node.title)}</strong><small>${escapeHtml(typeNodeMeta(node))}</small></span></button><div class="mega-level-list">${typeChildren(node.id).map((child) => megaLevelItem({ name: child.title, meta: typeNodeMeta(child), navKind: "type-node", navId: child.id, previewKind: "type-node", previewId: child.id })).join("")}</div></section>`).join("");
    return `<div class="mega-catalog-layout"><div class="mega-directory">
      <section class="mega-path-block"><button type="button" class="mega-path-title" ${navAttrs("platforms")}><span class="mega-path-number">01</span><span><strong>Аккумуляторные платформы</strong></span></button><div class="mega-level-list brands">${availableBrands.map((brand) => megaLevelItem({ name: brandSectionName(brand), meta: `${platformsForBrand(brand).length} платформ`, navKind: "brand", navId: brand.id, previewKind: "brand", previewId: brand.id })).join("")}</div></section>
      <section class="mega-path-block"><button type="button" class="mega-path-title" ${navAttrs("stages")}><span class="mega-path-number">02</span><span><strong>Подбор по этапам работ</strong></span></button><div class="mega-level-list stages">${visibleStages.map((stage) => megaLevelItem({ name: stage.name, meta: `${stageCategoryCount(stage)} категорий`, navKind: "stage", navId: String(stage.id), previewKind: "stage", previewId: String(stage.id) })).join("")}</div></section>
      ${typeSection}
    </div><aside id="mega-third-panel" class="mega-third-panel"><div class="mega-third-empty" aria-hidden="true"></div></aside></div>`;
  }

  function renderMegaPreview(kind, id) {
    if (kind === "brand") {
      const brand = BRAND_DEFS.find((item) => item.id === id);
      if (!brand) return "";
      const platforms = platformsForBrand(brand);
      return `<header><h3>${escapeHtml(brandSectionName(brand))}</h3></header><div class="mega-third-list">${platforms.map((platform) => `<button type="button" ${navAttrs("platform", brand.id, platform.name)}><span><strong>${escapeHtml(platform.name)}</strong><small>${flattenLeaves(platform).length} категорий</small></span><b>›</b></button>`).join("")}</div>`;
    }
    if (kind === "stage") {
      const stage = visibleStages.find((item) => String(item.id) === id);
      if (!stage) return "";
      const items = stage.works.length === 1
        ? stage.works[0].operations.map((operation, operationIndex) => ({ name: operation.name, meta: `${operationCategoryCount(operation)} категорий`, kind: "operation", extra: `0:${operationIndex}` }))
        : stage.works.map((work, workIndex) => {
            const target = workNavigation(stage, workIndex);
            return { name: work.name, meta: work.operations.length === 1 ? `${operationCategoryCount(work.operations[0])} категорий` : `${work.operations.length} операций`, kind: target.kind, extra: target.extra };
          });
      return `<header><h3>${escapeHtml(stage.name)}</h3></header><div class="mega-third-list">${items.map((item) => `<button type="button" ${navAttrs(item.kind, String(stage.id), item.extra)}><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.meta)}</small></span><b>›</b></button>`).join("")}</div>`;
    }
    if (kind === "type-node") {
      const node = typeNodeById.get(id);
      if (!node) return "";
      const children = typeChildren(node.id);
      return `<header><h3>${escapeHtml(node.title)}</h3></header><div class="mega-third-list">${children.map((child) => {
        const targets = typeChildren(child.id).length ? [] : typeTargetsFor(child);
        if (targets.length === 1) {
          return `<a href="${escapeHtml(targets[0].url)}" target="_blank" rel="noopener"><span><strong>${escapeHtml(child.title)}</strong><small>Категория DNS</small></span><b>›</b></a>`;
        }
        return `<button type="button" ${navAttrs("type-node", child.id)}><span><strong>${escapeHtml(child.title)}</strong><small>${escapeHtml(typeNodeMeta(child))}</small></span><b>›</b></button>`;
      }).join("")}</div>`;
    }
    return "";
  }

  function updateMegaPreview(element) {
    const panel = document.getElementById("mega-third-panel");
    if (!panel || !element) return;
    const kind = element.dataset.megaPreviewKind;
    const id = decodeURIComponent(element.dataset.megaPreviewId || "");
    const html = renderMegaPreview(kind, id);
    if (html) panel.innerHTML = html;
  }

  function openCatalog() {
    megaRoot.innerHTML = `<div class="mega-overlay" data-action="close-catalog"><section class="mega-panel"><aside><button type="button" class="active" ${navAttrs("home")}><span class="root-icon">⌂</span><strong>Ремонт и строительство</strong></button></aside><div class="mega-main"><header><div><h2>Ремонт и строительство</h2></div></header>${renderMegaCatalog()}</div></section></div>`;
    catalogToggle.classList.add("active");
    catalogToggle.setAttribute("aria-expanded", "true");
  }

  function closeCatalog() {
    megaRoot.innerHTML = "";
    catalogToggle.classList.remove("active");
    catalogToggle.setAttribute("aria-expanded", "false");
  }

  function renderTypeTree() {
    const branch = (node, open = false) => {
      const children = typeChildren(node.id);
      if (!children.length) {
        const targets = typeTargetsFor(node);
        if (targets.length === 1) return `<li><a href="${escapeHtml(targets[0].url)}" target="_blank" rel="noopener">${escapeHtml(node.title)}</a></li>`;
        return `<li><button type="button" ${navAttrs("type-node", node.id)}>${escapeHtml(node.title)}</button></li>`;
      }
      const leavesOnly = children.every((child) => !typeChildren(child.id).length);
      const body = leavesOnly
        ? `<ul>${children.map((child) => branch(child)).join("")}</ul>`
        : `<div>${children.map((child) => branch(child)).join("")}</div>`;
      return `<details${open ? " open" : ""}><summary><strong>${escapeHtml(node.title)}</strong><small>${escapeHtml(typeNodeMeta(node))}</small></summary>${body}</details>`;
    };
    return typeRoots.map((node) => branch(node, true)).join("");
  }

  function renderTree() {
    const platformTree = availableBrands.map((brand) => `<details><summary><strong>${escapeHtml(brandSectionName(brand))}</strong><small>${platformsForBrand(brand).length} платформ</small></summary><ul>${platformsForBrand(brand).map((platform) => `<li><button type="button" ${navAttrs("platform", brand.id, platform.name)}>${escapeHtml(platform.name)}</button></li>`).join("")}</ul></details>`).join("");
    const stageTree = visibleStages.map((stage) => `<details><summary><strong>${escapeHtml(stage.name)}</strong><small>${stage.works.length} видов работ</small></summary><div>${stage.works.map((work, workIndex) => work.operations.length === 1
      ? `<ul><li><button type="button" ${navAttrs("operation", String(stage.id), `${workIndex}:0`)}>${escapeHtml(work.name)}</button><span>${operationCategoryCount(work.operations[0])}</span></li></ul>`
      : `<details><summary><strong>${escapeHtml(work.name)}</strong><small>${work.operations.length} операций</small></summary><ul>${work.operations.map((operation, operationIndex) => `<li><button type="button" ${navAttrs("operation", String(stage.id), `${workIndex}:${operationIndex}`)}>${escapeHtml(operation.name)}</button></li>`).join("")}</ul></details>`).join("")}</div></details>`).join("");
    modalRoot.innerHTML = `<div class="tree-overlay" data-action="close-tree"><aside class="tree-panel"><header><div><h2>Дерево каталога</h2></div><button type="button" data-action="close-tree" aria-label="Закрыть">×</button></header><div class="tree-content"><details open><summary><strong>Аккумуляторные платформы</strong><small>${availableBrands.length} брендов</small></summary><div>${platformTree}</div></details><details open><summary><strong>Подбор по этапам работ</strong><small>${visibleStages.length} этапов</small></summary><div>${stageTree}</div></details><details open><summary><strong>${state.homeMode === "expanded" ? "Типы инструмента на первом уровне" : "По типу инструмента"}</strong><small>${typeRoots.length} разделов</small></summary><div>${renderTypeTree()}</div></details></div></aside></div>`;
  }

  const searchItems = [
    ...typeNodes.map((item) => {
      const targets = typeChildren(item.id).length ? [] : typeTargetsFor(item);
      return {
        name: item.title,
        caption: item.kind === "Товарная категория" ? "Категория DNS" : "Раздел по типу",
        kind: "type-node",
        id: item.id,
        url: targets.length === 1 ? targets[0].url : "",
      };
    }),
    ...availableBrands.map((item) => ({ name: brandSectionName(item), caption: "Аккумуляторные платформы", kind: "brand", id: item.id })),
    ...visibleStages.map((item) => ({ name: item.name, caption: "Этап работ", kind: "stage", id: String(item.id) })),
    ...FULL.categories.map((item) => ({ name: item.name, caption: "Категория DNS", url: item.url })),
  ];

  function updateSearch() {
    const term = normalize(searchInput.value);
    if (term.length < 2) { searchResults.hidden = true; return; }
    const matches = searchItems.filter((item) => normalize(item.name).includes(term)).slice(0, 14);
    searchResults.innerHTML = matches.length ? matches.map((item) => item.url
      ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.caption)}</small></a>`
      : `<button type="button" ${navAttrs(item.kind, item.id)}><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.caption)}</small></button>`).join("") : "<p>Совпадений нет</p>";
    searchResults.hidden = false;
  }

  root.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-home-mode]");
    if (modeButton) {
      state.homeMode = modeButton.dataset.homeMode === "compact" ? "compact" : "expanded";
      window.__DNS_HOME_MODE = state.homeMode;
      root.querySelectorAll("[data-home-mode]").forEach((button) => button.classList.toggle("active", button.dataset.homeMode === state.homeMode));
      if (state.kind !== "home") { state.kind = "home"; state.id = ""; state.extra = ""; }
      closeCatalog();
      renderPage();
      return;
    }
    const nav = event.target.closest("[data-nav-kind]");
    if (nav) {
      navigate(nav.dataset.navKind, decodeURIComponent(nav.dataset.navId || ""), decodeURIComponent(nav.dataset.navExtra || ""));
      modalRoot.innerHTML = "";
      return;
    }
    const action = event.target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "toggle-catalog") megaRoot.innerHTML ? closeCatalog() : openCatalog();
    if (action.dataset.action === "close-catalog" && action === event.target) closeCatalog();
    if (action.dataset.action === "open-tree") { closeCatalog(); renderTree(); }
    if (action.dataset.action === "close-tree" && (action === event.target || action.tagName === "BUTTON")) modalRoot.innerHTML = "";
  });

  root.addEventListener("mouseover", (event) => updateMegaPreview(event.target.closest("[data-mega-preview-kind]")));
  root.addEventListener("focusin", (event) => updateMegaPreview(event.target.closest("[data-mega-preview-kind]")));
  searchInput.addEventListener("input", updateSearch);
  searchInput.addEventListener("focus", updateSearch);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeCatalog(); modalRoot.innerHTML = ""; searchResults.hidden = true; }
  });

  renderPage();
  if (window.__DNS_OPEN_CATALOG_ON_READY__) {
    window.__DNS_OPEN_CATALOG_ON_READY__ = false;
    openCatalog();
  }
  if (window.__DNS_OPEN_TREE_ON_READY__) {
    window.__DNS_OPEN_TREE_ON_READY__ = false;
    renderTree();
  }
  window.__DNS_APP_READY__ = true;
  window.dispatchEvent(new Event("dns-app-ready"));
})();
