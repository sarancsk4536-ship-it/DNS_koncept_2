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
  };

  const copyTypePlacement = (sourceId, id, parentId, order, overrides = {}) => {
    const source = TYPE_CATALOG.nodes.find((node) => node.id === sourceId);
    const title = overrides.title || source.title;
    return {
      ...source,
      id,
      parentId,
      order,
      level: 5,
      title,
      fullPath: overrides.fullPath || `Ручной инструмент > Наборы ручного инструмента > ${title}`,
      origin: overrides.origin || "Пользовательская группировка",
      ...overrides,
    };
  };

  const typeNodeOverrides = new Map([
    ["N0453", { title: "Перемешивание строительных смесей", fullPath: "Электроинструменты > Перемешивание строительных смесей" }],
    ["N0454", { title: "Резка металла, бетона и плитки", fullPath: "Электроинструмент > Резка металла, бетона и плитки" }],
    ["N0455", { title: "Резка стали", fullPath: "Электроинструмент > Резка металла, бетона и плитки > Резка стали" }],
    ["N0456", { title: "Резка бетона", fullPath: "Электроинструмент > Резка металла, бетона и плитки > Резка бетона" }],
    ["N0457", { title: "Резка плитки", fullPath: "Электроинструмент > Резка металла, бетона и плитки > Резка плитки" }],
    ["N0083", { title: "Монтаж и крепление", fullPath: "Электроинструмент > Монтаж и крепление" }],
    ["N0106", { title: "Отвертки и ключи", fullPath: "Ручной инструмент > Отвертки и ключи" }],
    ["N0125", { title: "Ударно-рычажный инструмент", fullPath: "Ручной инструмент > Ударно-рычажный инструмент" }],
    ["N0112", { title: "Ключи разводные", fullPath: "Ручной инструмент > Отвертки и ключи > Ключи разводные" }],
    ["N0174", { parentId: "N0170", fullPath: "Ручной инструмент > Малярный и отделочный инструмент > Шпатели и кельмы" }],
    ["N0096", { title: "Аккумуляторы, зарядные устройства и комплекты", fullPath: "Электроинструменты > Аккумуляторы, зарядные устройства и комплекты" }],
    ["N0329", { title: "Строительная и силовая техника", fullPath: "Строительная и силовая техника" }],
    ["N0352", { title: "Пневмоинструмент и компрессорное оборудование", fullPath: "Пневмоинструмент и компрессорное оборудование" }],
    ["N0001", { title: "Электроинструмент", order: 1, fullPath: "Электроинструмент" }],
    ["N0177", { title: "Оснастка, расходные материалы и аксессуары", order: 2, fullPath: "Оснастка, расходные материалы и аксессуары" }],
    ["N0105", { title: "Ручной инструмент", order: 3 }],
    ["N0329", { title: "Строительная и силовая техника", order: 4, fullPath: "Строительная и силовая техника" }],
    ["N0296", { title: "Измерительный и диагностический инструмент", order: 5, fullPath: "Измерительный и диагностический инструмент" }],
    ["N0405", { title: "Сварочное и паяльное оборудование", order: 6, fullPath: "Сварочное и паяльное оборудование" }],
    ["N0352", { title: "Пневмоинструмент и компрессорное оборудование", order: 7, fullPath: "Пневмоинструмент и компрессорное оборудование" }],
    ["N0429", { title: "СИЗ, хранение и организация рабочего места", order: 9, fullPath: "СИЗ, хранение и организация рабочего места" }],
    ["N0336", { parentId: "CUSTOM_CLEANING_ROOT", order: 1, fullPath: "Клининговое оборудование > Клининговая и сезонная техника" }],
    ["N0367", { parentId: "CUSTOM_WORKSHOP_ROOT", order: 1, fullPath: "Станки и оборудование для мастерской > Станки и оборудование мастерской" }],
    ["N0053", {
      title: "Шлифовальные машины по бетону",
      parentId: "N0050",
      order: 3.5,
      fullPath: "Электроинструменты > Шлифование, полирование и обработка поверхностей > Шлифовальные и полировальные машины > Шлифовальные машины по бетону",
      sourceNames: ["Шлифовальные машины по бетону"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17a9c78c16404e77/slifovalnye-masiny-po-betonu/"],
      sourceTypes: ["leaf"],
      action: "Сопоставить с категорией DNS",
    }],
    ["N0128", {
      title: "Кувалды",
      fullPath: "Ручной инструмент > Ударный инструмент > Молотки, кувалды и топоры > Кувалды",
      sourceNames: ["Кувалды"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17aa1cdc16404e77/kuvaldy/?stock=now-today-tomorrow-later-out_of_stock&order=popular"],
      sourceTypes: ["filtered-category"],
      action: "Сопоставить с категорией DNS",
    }],
    ["N0132", {
      sourceNames: ["Ломы, монтировки и гвоздодеры"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17aa01dd16404e77/lomy-lomy-gvozdodery/?q=Гвоздодёр&stock=now-today-tomorrow-later-out_of_stock&order=popular"],
      sourceTypes: ["filtered-category"],
      action: "Сопоставить с категорией DNS",
    }],
    ["N0136", {
      sourceNames: ["Струбцины"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17aa139c16404e77/strubciny/"],
      sourceTypes: ["leaf"],
      action: "Сопоставить с категорией DNS",
    }],
    ["N0353", { parentId: "N0329", order: 2, fullPath: "Строительная и силовая техника > Бетонные и растворные работы" }],
    ["N0360", { parentId: "N0329", order: 3, fullPath: "Строительная и силовая техника > Подъем, доступ и освещение" }],
    ["N0367", { parentId: "CUSTOM_WORKSHOP_ROOT", order: 1, fullPath: "Станки и оборудование для мастерской > Станки и оборудование мастерской" }],
    ["N0336", { parentId: "CUSTOM_CLEANING_ROOT", order: 1, fullPath: "Клининговое оборудование > Клининговая и сезонная техника" }],
    ["N0383", { title: "Компрессорный инструмент", order: 1, fullPath: "Пневмоинструмент и компрессорное оборудование > Компрессорный инструмент" }],
    ["N0388", { order: 2 }],
    ["N0085", { parentId: "N0083" }],
    ["N0086", { parentId: "N0083" }],
    ["N0087", { parentId: "N0083" }],
    ["N0088", { parentId: "N0083" }],
    ["N0089", { parentId: "N0083" }],
    ["N0090", { parentId: "N0083" }],
    ["N0092", { parentId: "CUSTOM_HEAT" }],
    ["N0094", { parentId: "CUSTOM_HEAT" }],
    ["N0093", { parentId: "CUSTOM_COATINGS" }],
    ["N0095", { parentId: "CUSTOM_COATINGS" }],
    ["N0089", { parentId: "N0083" }],
    ["N0090", { parentId: "N0083" }],
    ["N0127", { parentId: "N0125", fullPath: "Ручной инструмент > Ударно-рычажный инструмент > Молотки и киянки" }],
    ["N0128", { parentId: "N0125", title: "Кувалды", fullPath: "Ручной инструмент > Ударно-рычажный инструмент > Кувалды" }],
    ["N0129", { parentId: "N0125", fullPath: "Ручной инструмент > Ударно-рычажный инструмент > Топоры и колуны" }],
    ["N0132", { parentId: "N0125", fullPath: "Ручной инструмент > Ударно-рычажный инструмент > Ломы, монтировки и гвоздодеры" }],
    ["N0133", { parentId: "N0125", fullPath: "Ручной инструмент > Ударно-рычажный инструмент > Зубила и кернеры" }],
    ["N0310", { parentId: "CUSTOM_LINEAR_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Линейные измерения > Рулетки, линейки и измерительные ленты" }],
    ["N0315", { parentId: "CUSTOM_LINEAR_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Линейные измерения > Микрометры" }],
    ["N0316", { parentId: "CUSTOM_LINEAR_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Линейные измерения > Маркеры и карандаши строительные" }],
    ["N0311", { parentId: "CUSTOM_ANGULAR_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Угловые измерения > Угольники, транспортиры и малки" }],
    ["N0312", { parentId: "CUSTOM_ANGULAR_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Угловые измерения > Уровни и отвесы" }],
    ["N0318", { parentId: "N0296", fullPath: "Измерительный и диагностический инструмент > Электроизмерительные приборы" }],
    ["N0325", { parentId: "CUSTOM_TEMPERATURE_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Температурные измерения > Пирометры и лазерные термометры" }],
    ["N0326", { parentId: "CUSTOM_TEMPERATURE_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Температурные измерения > Тепловизоры" }],
    ["N0313", { parentId: "CUSTOM_PHYSICAL_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Физические параметры > Механические штангенциркули" }],
    ["N0314", { parentId: "CUSTOM_PHYSICAL_MEASUREMENTS", fullPath: "Измерительный и диагностический инструмент > Физические параметры > Электронные штангенциркули" }],
  ]);
  const excludedTypeNodeIds = new Set(["N0084", "N0091", "N0118", "N0159", "N0160", "N0130", "N0126", "N0131", "N0308", "N0309", "N0317", "N0324", "N0140", "N0360", "N0361", "N0365", "N0377", "N0380", "N0384"]);
  [
    "N0032", "N0200", "N0065", "N0247", "N0463", "N0094", "N0268", "N0095", "N0269",
    "CUSTOM_CLAMP_SPRING", "CUSTOM_CLAMP_TIES", "N0151", "CUSTOM_NEEDLE_FILES", "N0315",
    "N0464", "N0363", "N0273", "N0340", "N0267",
  ].forEach((id) => excludedTypeNodeIds.add(id));

  const reparentedAccessoryPaths = [
    {
      parentId: "N0003",
      fullPath: "Электроинструмент > Сверление, закручивание и долбление > Закручивание крепежа",
      ids: ["N0009", "N0010", "N0011", "N0012", "N0013"],
    },
    {
      parentId: "CUSTOM_DRILLING_ACCESSORIES",
      fullPath: "Электроинструмент > Сверление, закручивание и долбление > Оснастка для сверления и долбления",
      ids: ["N0021", "N0022", "N0023", "N0024", "N0025", "N0026", "N0027", "N0028", "N0029", "N0030", "N0032"],
    },
    {
      parentId: "N0453",
      fullPath: "Электроинструмент > Перемешивание строительных смесей",
      ids: ["N0031"],
    },
    {
      parentId: "CUSTOM_SAWING_ACCESSORIES",
      fullPath: "Электроинструмент > Пиление и резка > Оснастка для пиления и резки",
      ids: ["N0036", "N0038", "N0040", "N0043", "N0045", "N0046", "PATCH_DIAMOND_DISCS_CUTTING"],
    },
    {
      parentId: "CUSTOM_GRINDING_ACCESSORIES",
      fullPath: "Электроинструмент > Шлифование, полирование и обработка поверхностей > Оснастка для шлифования и полирования",
      ids: ["N0062", "N0063", "N0064", "N0065", "N0066", "N0067", "N0068", "N0069", "N0070", "N0071", "N0072", "N0073", "N0074", "N0075", "N0076"],
    },
    {
      parentId: "N0077",
      fullPath: "Электроинструмент > Шлифование, полирование и обработка поверхностей > Фрезерование и строгание",
      ids: ["N0079", "N0080", "N0082"],
    },
  ];
  reparentedAccessoryPaths.forEach(({ parentId, fullPath, ids }) => ids.forEach((id, index) => {
    const source = TYPE_CATALOG.nodes.find((node) => node.id === id);
    typeNodeOverrides.set(id, {
      parentId,
      order: index + 1,
      fullPath: source?.title ? `${fullPath} > ${source.title}` : fullPath,
    });
  }));
  const directCuttingHandPath = "Ручной инструмент > Режущий и столярно-слесарный инструмент";
  [
    ["N0141", 1], ["N0142", 2], ["N0143", 3], ["N0144", 4],
    ["N0145", 5], ["N0147", 7], ["N0148", 8], ["N0138", 9],
  ].forEach(([id, order]) => {
    const source = TYPE_CATALOG.nodes.find((node) => node.id === id);
    const title = id === "N0143" ? "Ножовки и пилы" : source?.title;
    typeNodeOverrides.set(id, {
      parentId: "N0139",
      order,
      ...(id === "N0143" ? { title } : {}),
      fullPath: `${directCuttingHandPath} > ${title}`,
    });
  });
  typeNodeOverrides.set("N0146", {
    parentId: "CUSTOM_SCISSORS_SHARPENERS_GROUP",
    order: 1,
    fullPath: `${directCuttingHandPath} > Ножницы и ножеточки > Ножницы по металлу`,
  });
  typeNodeOverrides.set("N0169", {
    parentId: "N0139",
    order: 10,
    fullPath: `${directCuttingHandPath} > Ножи монтерские`,
  });
  typeNodeOverrides.set("N0149", {
    parentId: "N0139",
    order: 11,
    fullPath: `${directCuttingHandPath} > Столярный инструмент`,
  });
  [
    ["N0362", 4, "Домкраты гидравлические"],
    ["N0363", 5, "Домкраты механические"],
    ["N0364", 6, "Лестницы и стремянки"],
    ["N0366", 7, "Строительные фонари"],
  ].forEach(([id, order, title]) => typeNodeOverrides.set(id, {
    parentId: "N0329",
    order,
    fullPath: `Строительная и силовая техника > ${title}`,
  }));
  typeNodeOverrides.set("N0362", {
    parentId: "CUSTOM_WORKSHOP_BENCHES_GROUP",
    order: 3,
    fullPath: "Станки и оборудование для мастерской > Станки и оборудование мастерской > Верстаки и стеллажи для мастерской > Домкраты гидравлические",
  });
  typeNodeOverrides.set("N0363", {
    parentId: "CUSTOM_WORKSHOP_BENCHES_GROUP",
    order: 4,
    fullPath: "Станки и оборудование для мастерской > Станки и оборудование мастерской > Верстаки и стеллажи для мастерской > Домкраты механические",
  });
  typeNodeOverrides.set("N0385", {
    parentId: "N0383",
    order: 1,
    fullPath: "Пневмоинструмент и компрессорное оборудование > Компрессорный инструмент > Компрессоры",
  });
  typeNodeOverrides.set("N0386", {
    parentId: "N0383",
    order: 2,
    fullPath: "Пневмоинструмент и компрессорное оборудование > Компрессорный инструмент > Шланги для компрессоров",
  });
  typeNodeOverrides.set("N0387", {
    parentId: "N0388",
    order: 5,
    fullPath: "Пневмоинструмент и компрессорное оборудование > Пневматический инструмент > Наборы пневматического инструмента",
  });
  ["N0092", "N0094"].forEach((id) => typeNodeOverrides.set(id, { parentId: "CUSTOM_HEAT", fullPath: "Электроинструмент > Нагрев и термообработка" }));
  ["N0093", "N0095"].forEach((id) => typeNodeOverrides.set(id, { parentId: "CUSTOM_COATINGS", fullPath: "Электроинструмент > Нанесение покрытий" }));
  ["N0089", "N0090"].forEach((id, index) => typeNodeOverrides.set(id, { parentId: "N0083", order: index + 5, fullPath: "Электроинструмент > Монтаж и крепление" }));

  const addedTypeNodes = [
    {
      id: "CUSTOM_LINEAR_MEASUREMENTS", parentId: "N0296", order: 2, level: 2,
      title: "Линейные измерения", fullPath: "Измерительный и диагностический инструмент > Линейные измерения",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_ANGULAR_MEASUREMENTS", parentId: "N0296", order: 3, level: 2,
      title: "Угловые измерения", fullPath: "Измерительный и диагностический инструмент > Угловые измерения",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_TEMPERATURE_MEASUREMENTS", parentId: "N0296", order: 7, level: 2,
      title: "Температурные измерения", fullPath: "Измерительный и диагностический инструмент > Температурные измерения",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_PHYSICAL_MEASUREMENTS", parentId: "N0296", order: 8, level: 2,
      title: "Физические параметры", fullPath: "Измерительный и диагностический инструмент > Физические параметры",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_KNIVES_GROUP", parentId: "N0140", order: 1, level: 3,
      title: "Ножи", fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножи, пилы и труборезы > Ножи",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_SAWS_GROUP", parentId: "N0140", order: 2, level: 3,
      title: "Пилы и ножовки", fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножи, пилы и труборезы > Пилы и ножовки",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_PIPE_GROUP", parentId: "N0140", order: 3, level: 3,
      title: "Труборезы и болторезы", fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножи, пилы и труборезы > Труборезы и болторезы",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_SCISSORS_SHARPENERS_GROUP", parentId: "N0139", order: 6, level: 3,
      title: "Ножницы и ножеточки", fullPath: "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножницы и ножеточки",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_CLEANING_ROOT",
      parentId: null,
      order: 8,
      level: 1,
      title: "Клининговое оборудование",
      fullPath: "Клининговое оборудование",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_WORKSHOP_ROOT",
      parentId: null,
      order: 10,
      level: 1,
      title: "Станки и оборудование для мастерской",
      fullPath: "Станки и оборудование для мастерской",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", parentId: "N0376", order: 1, level: 4,
      title: "Заточные станки (точила), оснастка",
      fullPath: "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_WORKSHOP_BENCHES_GROUP", parentId: "N0367", order: 5, level: 4,
      title: "Верстаки и стеллажи для мастерской",
      fullPath: "Станки и оборудование для мастерской > Станки и оборудование мастерской > Верстаки и стеллажи для мастерской",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_HAND_SETS",
      parentId: "N0105",
      order: 7.5,
      level: 2,
      title: "Наборы ручного инструмента",
      fullPath: "Ручной инструмент > Наборы ручного инструмента",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Пользовательская группировка",
    },
    copyTypePlacement("N0117", "CUSTOM_HAND_SETS_01", "CUSTOM_HAND_SETS", 1),
    copyTypePlacement("N0118", "CUSTOM_HAND_SETS_02", "CUSTOM_HAND_SETS", 2, {
      title: "Наборы столярно-слесарного инструмента",
      fullPath: "Ручной инструмент > Наборы ручного инструмента > Наборы столярно-слесарного инструмента",
      origin: "Переименование по запросу",
    }),
    copyTypePlacement("N0111", "CUSTOM_HAND_SETS_03", "CUSTOM_HAND_SETS", 3),
    copyTypePlacement("N0109", "CUSTOM_HAND_SETS_04", "CUSTOM_HAND_SETS", 4),
    copyTypePlacement("N0159", "CUSTOM_HAND_SETS_05", "CUSTOM_HAND_SETS", 5, {
      fullPath: "Ручной инструмент > Наборы ручного инструмента > Наборы шарнирно-губцевого инструмента",
      origin: "Дублирование по запросу",
    }),
    copyTypePlacement("N0121", "CUSTOM_HAND_SETS_06", "CUSTOM_HAND_SETS", 6),
    copyTypePlacement("N0160", "CUSTOM_HAND_SETS_07", "CUSTOM_HAND_SETS", 7),
    copyTypePlacement("N0114", "CUSTOM_TORQUE_KEYS", "N0115", 8, {
      fullPath: "Ручной инструмент > Торцевой инструмент > Динамометрические ключи",
      origin: "Дублирование по запросу",
    }),
    copyTypePlacement("N0159", "CUSTOM_PLIER_SETS", "N0152", 8, {
      title: "Наборы шарнирно-губцевого инструмента",
      fullPath: "Ручной инструмент > Шарнирно-губцевый инструмент > Наборы шарнирно-губцевого инструмента",
      origin: "Прямой путь без промежуточных категорий",
    }),
    copyTypePlacement("N0147", "CUSTOM_PLIER_BOLT_CUTTERS", "N0152", 9, {
      fullPath: "Ручной инструмент > Шарнирно-губцевый инструмент > Болторезы",
      origin: "Дублирование по запросу",
    }),
    copyTypePlacement("N0146", "CUSTOM_PLIER_METAL_SCISSORS", "N0152", 10, {
      fullPath: "Ручной инструмент > Шарнирно-губцевый инструмент > Ножницы по металлу",
      origin: "Дублирование по запросу",
    }),
    {
      id: "CUSTOM_MOUNTING_ACCESSORIES",
      parentId: "N0001",
      order: 6.1,
      level: 2,
      title: "Оснастка для монтажа и крепления",
      fullPath: "Электроинструменты > Оснастка для монтажа и крепления",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_HEAT_ACCESSORIES",
      parentId: "N0001",
      order: 6.3,
      level: 2,
      title: "Оснастка для нагрева и термообработки",
      fullPath: "Электроинструменты > Оснастка для нагрева и термообработки",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_COATINGS_ACCESSORIES",
      parentId: "N0001",
      order: 6.5,
      level: 2,
      title: "Оснастка для нанесения покрытий",
      fullPath: "Электроинструменты > Оснастка для нанесения покрытий",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_FASTENING_ACCESSORIES",
      parentId: "N0002",
      order: 1.5,
      level: 3,
      title: "Оснастка для закручивания",
      fullPath: "Электроинструменты > Сверление, закручивание и долбление > Оснастка для закручивания",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_DRILLING_ACCESSORIES",
      parentId: "N0002",
      order: 2.5,
      level: 3,
      title: "Оснастка для сверления и долбления",
      fullPath: "Электроинструменты > Сверление, закручивание и долбление > Оснастка для сверления и долбления",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_MIXING_ACCESSORIES",
      parentId: "N0453",
      order: 2,
      level: 3,
      title: "Оснастка для смешивания",
      fullPath: "Электроинструменты > Перемешивание строительных смесей > Оснастка для смешивания",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_SAWING_ACCESSORIES",
      parentId: "N0033",
      order: 2,
      level: 3,
      title: "Оснастка для пиления и резки",
      fullPath: "Электроинструменты > Пиление и резка > Оснастка для пиления и резки",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_GRINDING_ACCESSORIES",
      parentId: "N0049",
      order: 3,
      level: 3,
      title: "Оснастка для шлифования и полирования",
      fullPath: "Электроинструменты > Шлифование, полирование и обработка поверхностей > Оснастка для шлифования и полирования",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_ROUTING_ACCESSORIES",
      parentId: "N0049",
      order: 4,
      level: 3,
      title: "Оснастка для фрезерования и строгания",
      fullPath: "Электроинструменты > Шлифование, полирование и обработка поверхностей > Оснастка для фрезерования и строгания",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка по запросу",
    },
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
      id: "CUSTOM_HEAT",
      parentId: "N0001",
      order: 6.2,
      level: 2,
      title: "Нагрев и термообработка",
      fullPath: "Электроинструменты > Нагрев и термообработка",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка V24",
    },
    {
      id: "CUSTOM_COATINGS",
      parentId: "N0001",
      order: 6.4,
      level: 2,
      title: "Нанесение покрытий",
      fullPath: "Электроинструменты > Нанесение покрытий",
      kind: "Навигационная группа",
      itemRole: "Навигация",
      duplicateCount: 0,
      action: "Создать навигационный узел",
      sourceNames: [],
      sourceUrls: [],
      sourceTypes: [],
      origin: "Структурная правка V24",
    },
    {
      id: "CUSTOM_VIBRATORY_SCREEDS",
      parentId: "N0353",
      order: 2.5,
      level: 5,
      title: "Виброрейки",
      fullPath: "Строительная и силовая техника > Бетонные и растворные работы > Приготовление и уплотнение > Виброрейки",
      kind: "Товарная категория",
      itemRole: "Товарная категория",
      duplicateCount: 1,
      action: "Сопоставить с категорией DNS",
      sourceNames: ["Виброрейки"],
      sourceUrls: ["https://www.dns-shop.ru/catalog/17aa2ab416404e77/vibroplity/?q=Виброрейка&stock=now-today-tomorrow-later-out_of_stock&order=popular"],
      sourceTypes: ["filtered-category"],
      origin: "Дополнение пользователя V24",
    },
  ];

  const proposedTypeLeaf = (id, parentId, order, title, fullPath, sourceUrls = []) => ({
    id, parentId, order, level: 5, title, fullPath,
    kind: "Товарная категория", itemRole: "Товарная категория", duplicateCount: 0,
    action: sourceUrls.length ? "Сопоставить с категорией DNS" : "Добавить категорию и сопоставить с ассортиментом", sourceNames: [], sourceUrls, sourceTypes: sourceUrls.length ? ["leaf"] : [], origin: sourceUrls.length ? "Категория DNS по запросу" : "Добавлено по запросу — требуется сопоставление с ассортиментом",
  });
  addedTypeNodes.push(
    proposedTypeLeaf("CUSTOM_SHOVELS", "N0125", 4, "Лопаты", "Ручной инструмент > Ударно-рычажный инструмент > Лопаты"),
    proposedTypeLeaf("CUSTOM_FILES", "N0149", 3, "Напильники", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Столярный инструмент > Напильники"),
    proposedTypeLeaf("CUSTOM_NEEDLE_FILES", "N0149", 4, "Надфили", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Столярный инструмент > Надфили"),
    proposedTypeLeaf("CUSTOM_WOOD_SAWS", "N0139", 3.1, "Ножовки по дереву", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножовки по дереву"),
    proposedTypeLeaf("CUSTOM_METAL_SAWS", "N0139", 3.2, "Ножовки по металлу", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножовки по металлу"),
    proposedTypeLeaf("CUSTOM_OFFICE_SCISSORS", "CUSTOM_SCISSORS_SHARPENERS_GROUP", 2, "Ножницы канцелярские", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножницы и ножеточки > Ножницы канцелярские"),
    proposedTypeLeaf("CUSTOM_BUILDING_SCISSORS", "CUSTOM_SCISSORS_SHARPENERS_GROUP", 3, "Ножницы строительные", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножницы и ножеточки > Ножницы строительные"),
    proposedTypeLeaf("CUSTOM_SHARPENERS", "CUSTOM_SCISSORS_SHARPENERS_GROUP", 4, "Ножеточки", "Ручной инструмент > Режущий и столярно-слесарный инструмент > Ножницы и ножеточки > Ножеточки"),
    proposedTypeLeaf("CUSTOM_PUNCHES", "N0152", 11, "Просекатели", "Ручной инструмент > Шарнирно-губцевый инструмент > Просекатели", ["https://www.dns-shop.ru/catalog/f71b2ee1df976124/prosekateli/"]),
    proposedTypeLeaf("CUSTOM_HAND_RIVETERS", "N0152", 12, "Ручные заклепочники", "Ручной инструмент > Шарнирно-губцевый инструмент > Ручные заклепочники", ["https://www.dns-shop.ru/catalog/17aa04e816404e77/rucnye-zaklepocniki/"]),
    proposedTypeLeaf("CUSTOM_KIRKI", "N0125", 5, "Кирки", "Ручной инструмент > Ударно-рычажный инструмент > Кирки", ["https://www.dns-shop.ru/catalog/17aa024616404e77/kirki/"]),
    proposedTypeLeaf("CUSTOM_PIPE_KEYS", "N0107", 14, "Ключи трубные", "Ручной инструмент > Отвертки и ключи > Ключи трубные", ["https://www.dns-shop.ru/catalog/17aa21ca16404e77/kluci-trubnye/"]),
    proposedTypeLeaf("CUSTOM_CURVIMETERS", "CUSTOM_LINEAR_MEASUREMENTS", 4, "Курвиметры", "Измерительный и диагностический инструмент > Линейные измерения > Курвиметры"),
    proposedTypeLeaf("CUSTOM_EXACT_SCALES", "CUSTOM_PHYSICAL_MEASUREMENTS", 3, "Точные весы", "Измерительный и диагностический инструмент > Физические параметры > Точные весы", ["https://www.dns-shop.ru/catalog/17a8ce7616404e77/vesy-kuhonnye/?f%5Bj%5D=flmt&virtual_category_uid=d4d98ab420a1e049"]),
    copyTypePlacement("N0318", "CUSTOM_ELECTRICAL_MEASURING", "N0161", 10, {
      fullPath: "Ручной инструмент > Электромонтажный инструмент > Электроизмерительные приборы",
      origin: "Дублирование по запросу",
    }),
    proposedTypeLeaf("CUSTOM_CLAMP_LOCKING", "N0134", 20, "Клещи зажимные", "Ручной инструмент > Зажимной инструмент > Клещи зажимные"),
    proposedTypeLeaf("CUSTOM_CLAMP_SPRING", "N0134", 21, "Пружинные зажимы", "Ручной инструмент > Зажимной инструмент > Пружинные зажимы"),
    proposedTypeLeaf("CUSTOM_CLAMP_TIES", "N0134", 22, "Ремни стяжные", "Ручной инструмент > Зажимной инструмент > Ремни стяжные"),
    proposedTypeLeaf("CUSTOM_CLAMP_TWEEZERS", "N0134", 23, "Пинцеты", "Ручной инструмент > Зажимной инструмент > Пинцеты"),
    proposedTypeLeaf("CUSTOM_CLEANING_SCRUBBERS", "CUSTOM_CLEANING_ROOT", 20, "Инвентарь для уборки", "Клининговое оборудование > Инвентарь для уборки", ["https://www.dns-shop.ru/catalog/29849ebf1b198259/inventar-dla-uborki/"]),
    proposedTypeLeaf("CUSTOM_SHARPENING_STATIONS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 1, "Заточные станки (точила)", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила)", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?virtual_category_uid=a7543f3854fe974f"]),
    proposedTypeLeaf("CUSTOM_CHAIN_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 2, "Заточные станки (точила) для пильных цепей", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) для пильных цепей", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5Bj%5D=aj6a&virtual_category_uid=3b6d61e48b9c3cfa"]),
    proposedTypeLeaf("CUSTOM_MULTIFUNCTION_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 3, "Заточные станки (точила) многофункциональные", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) многофункциональные", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5Bj%5D=guap&virtual_category_uid=f4b11f7dbd170b50"]),
    proposedTypeLeaf("CUSTOM_FLEX_SHAFT_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 4, "Заточные станки (точила) с гибким валом", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) с гибким валом", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5B95%5D=hmi&virtual_category_uid=9c41e400fc7e2a52"]),
    proposedTypeLeaf("CUSTOM_BELT_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 5, "Заточные станки (точила) с шлифовальной лентой", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) с шлифовальной лентой", ["https://www.dns-shop.ru/catalog/recipe/d225d1b7b4194953/zatocnye-stanki-tocila-s-slifovalnoj-lentoj/"]),
    proposedTypeLeaf("CUSTOM_DRILL_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 6, "Заточные станки (точила) для сверл", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) для сверл", ["https://www.dns-shop.ru/catalog/recipe/d975e67919a067c4/zatocnye-stanki-tocila-dla-sverl/"]),
    proposedTypeLeaf("CUSTOM_SHARPENING_WHEELS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 7, "Заточные круги", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные круги", ["https://www.dns-shop.ru/catalog/290f1ffcb1fb7fd7/zatocnye-krugi/?f%5B2kx%5D=hmn&virtual_category_uid=6eec8c7ad34d15ef"]),
    proposedTypeLeaf("CUSTOM_WORKBENCHES", "CUSTOM_WORKSHOP_BENCHES_GROUP", 1, "Верстаки", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Верстаки и стеллажи для мастерской > Верстаки", ["https://www.dns-shop.ru/catalog/f5d6e3e6b2227fd7/verstaki/"]),
    proposedTypeLeaf("CUSTOM_WORKSHOP_SHELVES", "CUSTOM_WORKSHOP_BENCHES_GROUP", 2, "Стеллажи и полки", "Станки и оборудование для мастерской > Станки и оборудование мастерской > Верстаки и стеллажи для мастерской > Стеллажи и полки", ["https://www.dns-shop.ru/catalog/c213419aa0ee7db5/stellazi-i-polki/?stock=now-today-tomorrow-later-out_of_stock&order=popular"]),
  );

  const requestedDnsMappings = [
    ["N0005", "Ленточные шуруповерты", "https://www.dns-shop.ru/catalog/17a9c6ec16404e77/surupoverty-dreli-surupoverty/?q=%D0%9B%D0%B5%D0%BD%D1%82%D0%BE%D1%87%D0%BD%D1%8B%D0%B5+%D1%88%D1%83%D1%80%D1%83%D0%BF%D0%BE%D0%B2%D0%B5%D1%80%D1%82%D1%8B&stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["N0129", "Топоры", "https://www.dns-shop.ru/catalog/17aa021116404e77/topory/?stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["CUSTOM_SHOVELS", "Лопаты", "https://www.dns-shop.ru/catalog/43578f0992bb94d2/lopaty/"],
    ["N0137", "Тиски", "https://www.dns-shop.ru/catalog/17aa136916404e77/tiski/"],
    ["CUSTOM_CLAMP_LOCKING", "Клещи зажимные", "https://www.dns-shop.ru/catalog/17aa00a016404e77/klesi/?q=%D0%9A%D0%BB%D0%B5%D1%89%D0%B8+%D0%B7%D0%B0%D0%B6%D0%B8%D0%BC%D0%BD%D1%8B%D0%B5&stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["CUSTOM_CLAMP_TWEEZERS", "Пинцеты", "https://www.dns-shop.ru/catalog/17aa332116404e77/pincety/?stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["CUSTOM_WOOD_SAWS", "Ножовки по дереву", "https://www.dns-shop.ru/catalog/recipe/f6d2f4b1a3b2afd5/nozovki-po-derevu/"],
    ["CUSTOM_METAL_SAWS", "Ножовки по металлу", "https://www.dns-shop.ru/catalog/17aa2f3816404e77/nozovki-i-pily/"],
    ["N0145", "Труборезы", "https://www.dns-shop.ru/catalog/4e8dbe4fec30f34c/truborezy/?stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["CUSTOM_OFFICE_SCISSORS", "Ножницы канцелярские", "https://www.dns-shop.ru/catalog/d4c306b42629f079/noznicy/"],
    ["CUSTOM_BUILDING_SCISSORS", "Ножницы строительные", "https://www.dns-shop.ru/catalog/509866b654b99cc7/noznicy-stroitelnye/?stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["CUSTOM_SHARPENERS", "Ножеточки", "https://www.dns-shop.ru/catalog/78a4ce2d81c68611/nozetocki/"],
    ["N0138", "Плиткорезы ручные", "https://www.dns-shop.ru/catalog/7da4a414c2af4e43/rucnye-plitkorezy/?stock=now-today-tomorrow-later-out_of_stock&order=popular"],
    ["CUSTOM_FILES", "Напильники", "https://www.dns-shop.ru/catalog/17aa027916404e77/napilniki/"],
    ["CUSTOM_CURVIMETERS", "Курвиметры", "https://www.dns-shop.ru/catalog/baed35891076a5b4/kurvimetry/"],
    ["N0311", "Угольники, транспортиры и малки", "https://www.dns-shop.ru/catalog/1bac93771fd1746c/linejki-ugolniki/"],
    ["N0362", "Домкраты", "https://www.dns-shop.ru/catalog/17a90f6716404e77/domkraty/"],
  ];
  requestedDnsMappings.forEach(([id, title, url]) => {
    const source = addedTypeNodes.find((node) => node.id === id) || TYPE_CATALOG.nodes.find((node) => node.id === id);
    const previous = typeNodeOverrides.get(id) || {};
    const parentPath = (previous.fullPath || source.fullPath).split(" > ").slice(0, -1).join(" > ");
    typeNodeOverrides.set(id, {
      ...previous, title, fullPath: `${parentPath} > ${title}`,
      sourceNames: [title], sourceUrls: [url], sourceTypes: [url.includes("?") ? "filtered-category" : "leaf"],
      useExactDnsUrl: true, action: "Сопоставить с категорией DNS", origin: "Сопоставление по ссылке пользователя V33",
    });
  });

  const cleaningReplacementLinks = [
    ["SHAMPOOS", "Автомобильные шампуни", "https://www.dns-shop.ru/catalog/17aa129516404e77/avtomobilnye-sampuni/?virtual_category_uid=37a1a7d7d6e0cf8b"],
    ["BODY_CLEANERS", "Очищающие жидкости для кузова", "https://www.dns-shop.ru/catalog/17aa122c16404e77/ocisausie-zidkosti-dla-kuzova/?virtual_category_uid=428872d7ef32bc5c"],
    ["ENGINE_CLEANERS", "Очищающие жидкости для чистки под капотом", "https://www.dns-shop.ru/catalog/17aa12cb16404e77/ocistiteli-dvigatela/?virtual_category_uid=ff9682ef9d76b8b1"],
    ["INTERIOR_CLEANERS", "Очищающие жидкости для салона", "https://www.dns-shop.ru/catalog/17aa126116404e77/ocisausie-zidkosti-dla-salona/?virtual_category_uid=fed02346dae035be"],
    ["GLASS_CLEANERS", "Очищающие жидкости для стекол", "https://www.dns-shop.ru/catalog/17aa12ff16404e77/sredstva-dla-stekol-i-zerkal/?virtual_category_uid=fbc1cf46303aa075"],
    ["HOSES", "Шланги", "https://www.dns-shop.ru/catalog/17a9d65f16404e77/slangi/?virtual_category_uid=f9d4efa8f06074c0"],
  ];
  [
    ["N0273", "Оснастка, расходные материалы и аксессуары > Клининг и удаление пыли > Мойки высокого давления"],
    ["N0340", "Клининговое оборудование > Клининговая и сезонная техника > Мойки высокого давления"],
  ].forEach(([sourceId, parentPath]) => {
    const source = TYPE_CATALOG.nodes.find((node) => node.id === sourceId);
    cleaningReplacementLinks.forEach(([key, title, url], index) => {
      addedTypeNodes.push({
        ...proposedTypeLeaf(`V33_${sourceId}_${key}`, source.parentId, source.order + index / 10, title, `${parentPath} > ${title}`, [url]),
        itemRole: source.itemRole, useExactDnsUrl: true, sourceNames: [title], sourceTypes: ["filtered-category"],
      });
    });
  });

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

  const hiddenNavigationNodeIds = new Set([
    "CUSTOM_MOUNTING_ACCESSORIES", "CUSTOM_HEAT_ACCESSORIES", "CUSTOM_COATINGS_ACCESSORIES",
    "CUSTOM_FASTENING_ACCESSORIES", "CUSTOM_MIXING_ACCESSORIES", "CUSTOM_ROUTING_ACCESSORIES",
    "CUSTOM_KNIVES_GROUP", "CUSTOM_SAWS_GROUP", "CUSTOM_PIPE_GROUP",
  ]);
  const typeNodes = [
    ...collapseSingletonTypeGroups(TYPE_CATALOG.nodes
      .filter((node) => node.id !== "N0163" && !excludedTypeNodeIds.has(node.id))
      .map((node) => ({ ...node, ...(typeNodeOverrides.get(node.id) || {}) }))),
    ...addedTypeNodes
      .filter((node) => !hiddenNavigationNodeIds.has(node.id) && !excludedTypeNodeIds.has(node.id))
      .map((node) => ({ ...node, ...(typeNodeOverrides.get(node.id) || {}) })),
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

  function addCategoryFromTypeCatalog(title) {
    if (FULL.categories.some((item) => item.name === title)) return;
    const node = TYPE_CATALOG.nodes.find((item) => item.title === title && item.sourceUrls?.length);
    const url = node?.sourceUrls?.[0];
    if (!url) return;
    const id = url.match(/\/catalog\/([^/]+)\//)?.[1] || `type-${node.id}`;
    if (FULL.categories.some((item) => String(item.id) === String(id) || item.url === url)) return;
    FULL.categories.push({
      id,
      name: title,
      dnsName: title,
      url,
      pageType: "leaf",
      group: "Электроинструмент",
      sourceNames: [title],
      placements: [],
    });
  }

  function addExplicitCategory(name, url, group = "Ручной инструмент") {
    if (FULL.categories.some((item) => item.name === name || item.url === url)) return;
    const id = url.match(/\/catalog\/([^/]+)\//)?.[1] || `custom-${FULL.categories.length + 1}`;
    FULL.categories.push({
      id,
      name,
      dnsName: name,
      url,
      pageType: url.includes("?q=") ? "filtered-category" : "leaf",
      group,
      sourceNames: [name],
      placements: [],
    });
  }

  [
    "Отбойные молотки",
    "Дрели для алмазного сверления",
    "Установки алмазного бурения",
    "Маркеры и карандаши строительные",
    "Губки шлифовальные",
    "Лестницы и стремянки",
    "Строительные фены",
    "Пневматические краскораспылители",
    "Сверла по стеклу и плитке",
    "Ступенчатые сверла",
    "Буры SDS-Plus и SDS-Max",
    "Зубила для перфораторов и отбойных молотков",
    "Наборы буров",
    "Наборы зубил",
    "Наборы буров и зубил",
    "Коронки",
    "Коронки для УШМ",
    "Наборы коронок",
    "Адаптеры для коронок",
    "Пильные диски",
    "Пилки для электрических лобзиков",
    "Полотна для сабельных пил",
    "Ножовочные полотна",
    "Насадки для реноваторов",
    "Лезвия для строительных ножей",
    "Диски для эксцентриковых шлифмашин",
    "Подошвы для шлифмашин",
    "Опорные тарелки",
    "Щетки для УШМ и дрелей",
    "Гайки для УШМ",
    "Стойки для УШМ",
    "Полировальные пасты",
    "Фрезы",
    "Наборы фрез",
    "Ножи для рубанков",
    "Насадки для гравировальных машин",
    "Клеевые стержни",
    "Скобы для степлеров",
    "Пеногенераторы и фильтры для моек",
    "Оснастка для моек высокого давления",
    "Мешки для строительных пылесосов",
    "Фильтры для строительных пылесосов",
    "Насадки для строительных пылесосов",
    "Пылесборники",
    "Шланги для компрессоров",
  ].forEach(addCategoryFromTypeCatalog);
  [
    ["Ломы, монтировки и гвоздодеры", "https://www.dns-shop.ru/catalog/17aa01dd16404e77/lomy-lomy-gvozdodery/?q=Гвоздодёр&stock=now-today-tomorrow-later-out_of_stock&order=popular", "Ручной инструмент"],
    ["Струбцины", "https://www.dns-shop.ru/catalog/17aa139c16404e77/strubciny/", "Ручной инструмент"],
    ["Кувалды", "https://www.dns-shop.ru/catalog/17aa1cdc16404e77/kuvaldy/?stock=now-today-tomorrow-later-out_of_stock&order=popular", "Ручной инструмент"],
    ["Виброрейки", "https://www.dns-shop.ru/catalog/17aa2ab416404e77/vibroplity/?q=Виброрейка&stock=now-today-tomorrow-later-out_of_stock&order=popular", "Оборудование и станки"],
    ["Шлифовальные машины по бетону", "https://www.dns-shop.ru/catalog/17a9c78c16404e77/slifovalnye-masiny-po-betonu/", "Электроинструмент"],
    ["Заточные станки (точила)", "https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?virtual_category_uid=a7543f3854fe974f", "Оборудование и станки"],
    ["Заточные станки (точила) для пильных цепей", "https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5Bj%5D=aj6a&virtual_category_uid=3b6d61e48b9c3cfa", "Оборудование и станки"],
    ["Заточные станки (точила) многофункциональные", "https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5Bj%5D=guap&virtual_category_uid=f4b11f7dbd170b50", "Оборудование и станки"],
    ["Заточные станки (точила) с гибким валом", "https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5B95%5D=hmi&virtual_category_uid=9c41e400fc7e2a52", "Оборудование и станки"],
    ["Заточные станки (точила) с шлифовальной лентой", "https://www.dns-shop.ru/catalog/recipe/d225d1b7b4194953/zatocnye-stanki-tocila-s-slifovalnoj-lentoj/", "Оборудование и станки"],
    ["Заточные станки (точила) для сверл", "https://www.dns-shop.ru/catalog/recipe/d975e67919a067c4/zatocnye-stanki-tocila-dla-sverl/", "Оборудование и станки"],
    ["Заточные круги", "https://www.dns-shop.ru/catalog/290f1ffcb1fb7fd7/zatocnye-krugi/?f%5B2kx%5D=hmn&virtual_category_uid=6eec8c7ad34d15ef", "Оборудование и станки"],
    ["Верстаки", "https://www.dns-shop.ru/catalog/f5d6e3e6b2227fd7/verstaki/", "Оборудование и станки"],
    ["Стеллажи и полки", "https://www.dns-shop.ru/catalog/c213419aa0ee7db5/stellazi-i-polki/?stock=now-today-tomorrow-later-out_of_stock&order=popular", "Оборудование и станки"],
    ["Инвентарь для уборки", "https://www.dns-shop.ru/catalog/29849ebf1b198259/inventar-dla-uborki/", "Клининг"],
  ].forEach(([name, url, group]) => addExplicitCategory(name, url, group));

  const requestedCategoryByName = new Map();
  [...requestedDnsMappings, ...cleaningReplacementLinks].forEach(([id, title, url]) => {
    let category = FULL.categories.find((item) => item.url === url);
    if (!category) {
      const node = typeNodeById.get(id);
      category = {
        id: `user-dns-${id}`, name: title, dnsName: title, url,
        pageType: url.includes("?") ? "filtered-category" : "leaf",
        group: node ? typeAncestors(node)[0]?.title || "Ручной инструмент" : "Клининг",
        sourceNames: [title], placements: [],
      };
      FULL.categories.push(category);
    }
    requestedCategoryByName.set(title, category);
  });
  const scenarioCategoryByName = new Map([
    ...FULL.categories.map((item) => [item.name, item]),
    ...requestedCategoryByName,
  ]);
  const categoryIds = (...names) => [...new Set(names
    .map((name) => scenarioCategoryByName.get(name))
    .filter((category) => category?.url)
    .map((category) => category.id)
    .filter(Boolean)
    .map(String))];
  const resource = (name, category = "", spec = "", optional = false, proposed = false) => ({ name, category: category || name, spec, optional, proposed });
  const resourceSet = (powerTools = [], handTools = [], consumables = [], ppe = [], relatedCategories = []) => ({ powerTools, handTools, consumables, ppe, relatedCategories });
  const resourceGroupDefs = window.WORK_STAGES_V35.groups;
  const normalizeResourceItem = (item) => {
    const source = typeof item === "string" ? resource(item) : item;
    const category = scenarioCategoryByName.get(source.category || source.name);
    return {
      name: source.name,
      categoryName: source.category || source.name,
      categoryId: category?.url ? String(category.id) : "",
      spec: source.spec || "",
      optional: Boolean(source.optional),
      proposed: Boolean(source.proposed),
    };
  };
  const scenarioOperation = (name, definition) => {
    if (Array.isArray(definition)) return { name, categoryIds: categoryIds(...definition) };
    const resources = Object.fromEntries(resourceGroupDefs.map(({ key }) => [key, (definition?.[key] || [])
      .map(normalizeResourceItem)
      .filter((item) => item.categoryId)]));
    const allResources = resourceGroupDefs.flatMap(({ key }) => resources[key]);
    const resourceCategoryIds = [...new Set(allResources.map((item) => item.categoryId).filter(Boolean))];
    const relatedCategoryIds = categoryIds(...(definition?.relatedCategories || [])).filter((id) => !resourceCategoryIds.includes(id));
    return {
      name,
      resources,
      categoryIds: [...resourceCategoryIds, ...relatedCategoryIds],
      additionalCategoryIds: relatedCategoryIds,
      missingResourceCount: allResources.filter((item) => !item.categoryId).length,
    };
  };
  const replaceOperation = (work, aliases, name, definition) => {
    const aliasSet = new Set([name, ...aliases]);
    const next = scenarioOperation(name, definition);
    const index = work.operations.findIndex((item) => aliasSet.has(item.name));
    if (index >= 0) {
      const preservedCategoryIds = work.operations[index].categoryIds.map(String).filter((id) => !next.categoryIds.includes(id));
      next.categoryIds.push(...preservedCategoryIds);
      next.additionalCategoryIds = [...new Set([...(next.additionalCategoryIds || []), ...preservedCategoryIds])];
      work.operations[index] = next;
    }
    else work.operations.push(next);
  };
  const replaceWork = (stage, name, operations) => {
    const next = { name, operations: operations.map(([operationName, definition]) => scenarioOperation(operationName, definition)) };
    const index = stage.works.findIndex((item) => item.name === name);
    if (index >= 0) stage.works[index] = next;
    else stage.works.push(next);
  };
  const reorderOperations = (work, orderedNames) => {
    if (!work) return;
    const rank = new Map(orderedNames.map((name, index) => [name, index]));
    work.operations = work.operations
      .map((operation, index) => ({ operation, index }))
      .sort((a, b) => (rank.get(a.operation.name) ?? 1000 + a.index) - (rank.get(b.operation.name) ?? 1000 + b.index))
      .map(({ operation }) => operation);
  };
  const reorderWorks = (stage, orderedNames) => {
    if (!stage) return;
    const rank = new Map(orderedNames.map((name, index) => [name, index]));
    stage.works = stage.works
      .map((work, index) => ({ work, index }))
      .sort((a, b) => (rank.get(a.work.name) ?? 1000 + a.index) - (rank.get(b.work.name) ?? 1000 + b.index))
      .map(({ work }) => work);
  };

  const proposedResource = (name, spec = "") => resource(name, "", spec, false, true);
  const templateWork = (name, operations) => ({
    name,
    operations: operations.map(([operationName, definition]) => scenarioOperation(operationName, definition)),
  });
  const templateStage = (id, name, works) => ({ id, name, works });

  // V35: отдельный справочник этапов и сопоставленных категорий.
  FULL.stages = window.WORK_STAGES_V35.stages;

  const dnsCategoryById = new Map([...FULL.categories, ...window.WORK_STAGES_V35.categories].map((item) => [String(item.id), item]));
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
    if (node.useExactDnsUrl) return targets;
    [...(node.sourceNames || []), node.title].forEach((name) => {
      add(dnsCategoryByName.get(name));
      (dnsTargetsBySource.get(name) || []).forEach(add);
    });
    return targets;
  };

  const stageDisplayOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const visibleStages = FULL.stages
    .filter((stage) => stageDisplayOrder.includes(String(stage.id)))
    .sort((a, b) => stageDisplayOrder.indexOf(String(a.id)) - stageDisplayOrder.indexOf(String(b.id)));
  const stageImagePath = (slug) => `assets/generated/stages/${slug}.webp`;
  const STAGE_IMAGES = new Map([
    ["Проектирование и земляные работы", stageImagePath("preparation-safety-and-layout")],
    ["Демонтажные работы", stageImagePath("demolition-and-clearing")],
    ["Возведение коробки, перегородок, кровли и фасада", stageImagePath("walls-and-partitions")],
    ["Черновая инженерия — Электрика и сантехника", stageImagePath("engineering-utilities")],
    ["Черновая отделка — Штукатурка и стяжка", stageImagePath("rough-construction-work")],
    ["Плиточные работы", stageImagePath("tile-stone-and-glass")],
    ["Предчистовая подготовка - Шпаклёвка и шлифовка", stageImagePath("surface-preparation")],
    ["Чистовая отделка потолка и стен", stageImagePath("finish-work")],
    ["Установка дверей, окон и напольного покрытия", stageImagePath("wooden-structures")],
    ["Финишные работы и сдача", stageImagePath("cleaning-inspection-and-handover")],
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
    ["Универсальное крепление и сборка", stageImagePath("assembly-and-fastening")],
    ["Сварка металлоконструкций", stageImagePath("welding-of-metal-structures")],
    ["Стены и перегородки", stageImagePath("walls-and-partitions")],
    ["Кровельные работы", stageImagePath("metal-structures")],
    ["Фасады и наружная отделка", stageImagePath("installation-of-structures-and-equipment")],
    ["Двери, окна и столярный монтаж", stageImagePath("wooden-structures")],
    ["Сборка мебели и кухонных модулей", stageImagePath("assembly-and-fastening")],
    ["Подготовка фасадных оснований", stageImagePath("surface-preparation")],
    ["Минеральные основания", stageImagePath("mineral-substrates")],
    ["Основания под плитку", stageImagePath("tile-substrates")],
    ["Стены и потолки", stageImagePath("walls-and-ceilings")],
    ["Деревянные поверхности", stageImagePath("wooden-structures")],
    ["Плитка, камень и стекло", stageImagePath("tile-stone-and-glass")],
    ["Механизированное нанесение покрытий", stageImagePath("pneumatic-painting-and-surface-treatment")],
    ["Покраска и финишная обработка", stageImagePath("painting-and-finishing")],
    ["Напольные покрытия", stageImagePath("finish-work")],
    ["Мойка объекта", stageImagePath("site-washing")],
    ["Пылеудаление", stageImagePath("dust-removal")],
    ["Приёмочный контроль", stageImagePath("final-inspection")],
    ["Компрессорное оборудование", stageImagePath("compressor-equipment")],
    ["Ремонт автомобилей и техники", stageImagePath("vehicle-and-equipment-repair")],
    ["Станочные работы", stageImagePath("machine-tool-work")],
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
    layers: '<svg viewBox="0 0 24 24"><path d="m3 7 9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4"/></svg>',
    workbench: '<svg viewBox="0 0 24 24"><path d="M3 8h18v4H3zM5 12v9m14-9v9M7 4v4m10-4v4M5 17h14"/></svg>',
    ladder: '<svg viewBox="0 0 24 24"><path d="M7 3 4 21M17 3l3 18M7 6h10M6 11h12M5 16h14"/></svg>',
    equipment: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 6V3h8v3M7 10h4v4H7zM15 10h3m-3 4h3M6 18v3m12-3v3"/></svg>',
    light: '<svg viewBox="0 0 24 24"><path d="M8 15a6 6 0 1 1 8 0l-1 3H9zM9 21h6M12 1v2M2 10H0m24 0h-2"/></svg>',

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
    if (context.startsWith("resource:")) return context.slice(9);
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
      name: "Строительная и силовая техника",
      rootName: "Строительная и силовая техника",
      categories: ["Электрогенераторы", "Бетоносмесители", "Строительные пылесосы"],
    },
  ];

  function popularCategoryCard(group) {
    const categories = group.categories.map((name) => dnsCategoryByName.get(name)).filter(Boolean);
    const typeRoot = typeRoots.find((node) => node.title === group.rootName);
    return `<article class="popular-card"><button type="button" class="popular-card-title" ${navAttrs("type-node", typeRoot?.id || "")}>${escapeHtml(group.name)}</button><div>${categories.map((category) => `<a href="${escapeHtml(category.url)}" target="_blank" rel="noopener">${escapeHtml(category.name)}</a>`).join("")}</div></article>`;
  }

  function renderHome() {
    const entries = [
      { kind: "stages", name: "Подбор по этапам работ", image: stageImagePath("selection-by-work-stages") },
      { kind: "types", name: "По типу инструмента", image: "assets/generated/phase-01/entry-03-tool-types.webp" },
      { kind: "platforms", name: "Аккумуляторные платформы", image: "assets/generated/phase-01/entry-01-accumulator-platforms.webp" },
    ];
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Ремонт и строительство" }])}
      <section class="page-intro"><h1>Ремонт и строительство</h1></section>
      <section class="entry-grid">${entries.map((item) => catalogCard({ name: item.name, image: item.image, attrs: navAttrs(item.kind), className: "entry-card" })).join("")}</section>
      <section class="section-block"><div class="section-heading"><h2>Популярные категории</h2></div><div class="popular-grid">${popularGroups.map(popularCategoryCard).join("")}</div></section>`;
  }

  function renderTypes() {
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Ремонт и строительство" }])}
      <section class="page-intro"><h1>По типу инструмента</h1></section>
      <section class="type-grid">${typeRoots.map((node) => catalogCard({ name: node.title, meta: typeNodeMeta(node), attrs: navAttrs("type-node", node.id) })).join("")}</section>`;
  }

  function renderTypeNode() {
    const node = typeNodeById.get(state.id);
    if (!node) return renderNotFound();
    const ancestors = typeAncestors(node);
    const crumbs = [
      { name: "Каталог", kind: "home" },
      { name: "По типу инструмента", kind: "types" },
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
      <section class="icon-card-grid platform-category-grid">${leaves.map((leaf) => {
        const platformLabel = platform.name.replace(/\s*\([^)]*категори[^)]*\)\s*$/i, "").trim();
        const brandlessLabel = platformLabel.toLocaleLowerCase("ru-RU").startsWith(brand.prefix.toLocaleLowerCase("ru-RU") + " ")
          ? platformLabel.slice(brand.prefix.length).trim() : "";
        const voltage = platformLabel.match(/(\d+(?:\/\d+)?V)$/i)?.[1];
        const suffixes = [platformLabel, brandlessLabel, voltage ? `${brand.prefix} ${voltage}` : ""].filter(Boolean);
        let categoryName = leaf.name.trim();
        for (const suffix of suffixes) {
          if (normalize(categoryName).endsWith(" " + normalize(suffix))) {
            categoryName = categoryName.slice(0, -(suffix.length + 1)).trim();
            break;
          }
        }
        return iconCard({ name: categoryName, meta: platformLabel, context: "platform", className: "platform-category-card", tag: "a",
          attrs: `href="${escapeHtml(leaf.url)}" target="_blank" rel="noopener"` });
      }).join("")}</section>`;
  }

  function renderStages() {
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Подбор по этапам работ" }])}
      <section class="page-intro"><h1>Подбор по этапам работ</h1></section>
      <section class="stage-grid">${visibleStages.map((stage, stageIndex) => catalogCard({ name: stage.name, meta: `${stage.works.length} сценариев`, image: stage.image || STAGE_IMAGES.get(stage.name) || "", badge: `<b class="stage-badge">${String(stageIndex + 1).padStart(2, "0")}</b>`, attrs: navAttrs("stage", String(stage.id)) })).join("")}</section>`;
  }

  function operationMeta(operation) {
    const linked = operation.categoryIds.length;
    const missing = operation.missingResourceCount || 0;
    if (missing) return `${linked} категорий · ${missing} требуют сопоставления`;
    return `${linked} категорий`;
  }

  function operationIconCard(stage, workIndex, operationIndex) {
    const operation = stage.works[workIndex].operations[operationIndex];
    return iconCard({ name: operation.name, meta: operationMeta(operation), context: "operation", attrs: navAttrs("operation", String(stage.id), `${workIndex}:${operationIndex}`) });
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
    const categories = operation.categoryIds.map((id) => dnsCategoryById.get(String(id))).filter(Boolean);
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
    const cards = resourceGroupDefs.filter(({ key }) => operation.resources[key]?.length)
      .map(({ key, title, icon }) => {
        const count = operation.resources[key].length;
        return iconCard({ name: title, meta: `${count} категорий`, context: `resource:${icon}`,
          attrs: navAttrs("resource-group", String(stage.id), `${workIndex}:${operationIndex}:${key}`) });
      }).join("");
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(heading)}</h1><p class="stage-description">Выберите, что нужно для работы.</p></section>
      <section class="icon-card-grid resource-navigation-grid">${cards}</section>`;
  }

  function renderResourceGroup() {
    const stage = visibleStages.find((item) => String(item.id) === state.id);
    const [wi, oi, key] = state.extra.split(":");
    const work = stage?.works?.[Number(wi)];
    const operation = work?.operations?.[Number(oi)];
    const definition = resourceGroupDefs.find((item) => item.key === key);
    const items = operation?.resources?.[key];
    if (!stage || !work || !operation || !definition || !items?.length) return renderNotFound();
    const crumbs = [{ name: "Каталог", kind: "home" }, { name: "Этапы работ", kind: "stages" },
      { name: stage.name, kind: "stage", id: String(stage.id) }];
    if (work.operations.length > 1) crumbs.push({ name: work.name, kind: "work", id: String(stage.id), extra: wi });
    crumbs.push({ name: work.operations.length > 1 ? operation.name : work.name, kind: "operation", id: String(stage.id), extra: `${wi}:${oi}` });
    crumbs.push({ name: definition.title });
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(definition.title)}</h1><p class="stage-description">${escapeHtml(work.operations.length > 1 ? operation.name : work.name)}</p></section>
      <section class="icon-card-grid category-selection-grid">${items.map((item) => {
        const category = dnsCategoryById.get(String(item.categoryId));
        return iconCard({ name: item.name, meta: "Открыть в DNS", tag: "a", context: "dns",
          attrs: `href="${escapeHtml(category.url)}" target="_blank" rel="noopener"` });
      }).join("")}</section>`;
  }

  function renderStage() {
    const stage = visibleStages.find((item) => String(item.id) === state.id);
    if (!stage) return renderNotFound();
    const content = `<section class="icon-card-grid stage-scenario-grid">${stage.works.map((work, workIndex) => {
      const target = workNavigation(stage, workIndex);
      const meta = work.operations.length === 1 ? "Выбрать инструменты" : `${work.operations.length} подзадач`;
      return iconCard({ name: work.name, meta, context: "operation", attrs: navAttrs(target.kind, target.id, target.extra) });
    }).join("")}</section>`;
    return `${breadcrumbs([{ name: "Каталог", kind: "home" }, { name: "Подбор по этапам работ", kind: "stages" }, { name: stage.name }])}
      <section class="page-intro"><span class="stage-eyebrow">ЭТАП ${String(stage.id).padStart(2, "0")} / 10</span><h1>${escapeHtml(stage.name)}</h1><p class="stage-description">${escapeHtml(stage.description)}</p></section>
      ${content}
      ${stage.contextNote ? `<p class="stage-context-note">${escapeHtml(stage.contextNote)}</p>` : ""}`;
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
    const views = { home: renderHome, types: renderTypes, "type-node": renderTypeNode, macro: renderMacro, group: renderGroup, subgroup: renderSubgroup, "tax-category": renderTaxCategory, "virtual-category": renderVirtualCategory, platforms: renderPlatforms, brand: renderBrand, platform: renderPlatform, stages: renderStages, stage: renderStage, work: renderWork, operation: renderOperation, "resource-group": renderResourceGroup };
    page.innerHTML = (views[state.kind] || renderNotFound)();
    document.title = `${page.querySelector("h1")?.textContent || "Каталог"} — DNS`;
  }

  function megaLevelItem({ name, meta, navKind, navId = "", navExtra = "", previewKind, previewId = "", previewExtra = "" }) {
    return `<button type="button" class="mega-level-item" ${navAttrs(navKind, navId, navExtra)} ${previewAttrs(previewKind, previewId, previewExtra)}><span><strong>${escapeHtml(name)}</strong>${meta ? `<small>${escapeHtml(meta)}</small>` : ""}</span><b aria-hidden="true">›</b></button>`;
  }

  function renderMegaCatalog() {
    return `<div class="mega-catalog-layout"><div class="mega-directory">
      <section class="mega-path-block"><button type="button" class="mega-path-title" ${navAttrs("stages")}><span class="mega-path-number">01</span><span><strong>Подбор по этапам работ</strong></span></button><div class="mega-level-list stages">${visibleStages.map((stage) => megaLevelItem({ name: stage.name, meta: `${stage.works.length} сценариев`, navKind: "stage", navId: String(stage.id), previewKind: "stage", previewId: String(stage.id) })).join("")}</div></section>
      <section class="mega-path-block"><button type="button" class="mega-path-title" ${navAttrs("types")}><span class="mega-path-number">02</span><span><strong>По типу инструмента</strong></span></button><div class="mega-level-list">${typeRoots.map((node) => megaLevelItem({ name: node.title, meta: typeNodeMeta(node), navKind: "type-node", navId: node.id, previewKind: "type-node", previewId: node.id })).join("")}</div></section>
      <section class="mega-path-block"><button type="button" class="mega-path-title" ${navAttrs("platforms")}><span class="mega-path-number">03</span><span><strong>Аккумуляторные платформы</strong></span></button><div class="mega-level-list brands">${availableBrands.map((brand) => megaLevelItem({ name: brandSectionName(brand), meta: `${platformsForBrand(brand).length} платформ`, navKind: "brand", navId: brand.id, previewKind: "brand", previewId: brand.id })).join("")}</div></section>
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
        ? stage.works[0].operations.map((operation, operationIndex) => ({ name: operation.name, meta: operationMeta(operation), kind: "operation", extra: `0:${operationIndex}` }))
        : stage.works.map((work, workIndex) => {
            const target = workNavigation(stage, workIndex);
            return { name: work.name, meta: work.operations.length === 1 ? operationMeta(work.operations[0]) : `${work.operations.length} операций`, kind: target.kind, extra: target.extra };
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
    const resourceTree = (stage, wi, oi) => resourceGroupDefs.filter(({ key }) => stage.works[wi].operations[oi].resources[key]?.length)
      .map(({ key, title }) => `<details><summary><strong>${escapeHtml(title)}</strong></summary><ul>${stage.works[wi].operations[oi].resources[key].map((item) => {
        const category = dnsCategoryById.get(item.categoryId);
        return `<li><a href="${escapeHtml(category.url)}" target="_blank" rel="noopener">${escapeHtml(item.name)}</a></li>`;
      }).join("")}</ul></details>`).join("");
    const stageTree = visibleStages.map((stage) => `<details><summary><strong>${escapeHtml(stage.name)}</strong><small>${stage.works.length} сценариев</small></summary><div>${stage.works.map((work, wi) =>
      `<details><summary><strong>${escapeHtml(work.name)}</strong></summary><div>${work.operations.length === 1 ? resourceTree(stage, wi, 0) : work.operations.map((op, oi) =>
        `<details><summary><strong>${escapeHtml(op.name)}</strong></summary><div>${resourceTree(stage, wi, oi)}</div></details>`).join("")}</div></details>`).join("")}</div></details>`).join("");
    modalRoot.innerHTML = `<div class="tree-overlay" data-action="close-tree"><aside class="tree-panel"><header><div><h2>Дерево каталога</h2></div><button type="button" data-action="close-tree" aria-label="Закрыть">×</button></header><div class="tree-content"><details open><summary><strong>Подбор по этапам работ</strong><small>${visibleStages.length} этапов</small></summary><div>${stageTree}</div></details><details open><summary><strong>По типу инструмента</strong><small>${typeRoots.length} разделов</small></summary><div>${renderTypeTree()}</div></details><details open><summary><strong>Аккумуляторные платформы</strong><small>${availableBrands.length} брендов</small></summary><div>${platformTree}</div></details></div></aside></div>`;
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
    ...visibleStages.flatMap((stage) => stage.works.flatMap((work, wi) => [
      { name: work.name, caption: stage.name, ...workNavigation(stage, wi) },
      ...(work.operations.length > 1 ? work.operations.map((op, oi) => ({ name: op.name, caption: work.name, kind: "operation", id: String(stage.id), extra: `${wi}:${oi}` })) : []),
    ])),
    ...FULL.categories.map((item) => ({ name: item.name, caption: "Категория DNS", url: item.url })),
  ];

  function updateSearch() {
    const term = normalize(searchInput.value);
    if (term.length < 2) { searchResults.hidden = true; return; }
    const matches = searchItems.filter((item) => normalize(item.name).includes(term)).slice(0, 14);
    searchResults.innerHTML = matches.length ? matches.map((item) => item.url
      ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.caption)}</small></a>`
      : `<button type="button" ${navAttrs(item.kind, item.id, item.extra || "")}><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.caption)}</small></button>`).join("") : "<p>Совпадений нет</p>";
    searchResults.hidden = false;
  }

  root.addEventListener("click", (event) => {
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
