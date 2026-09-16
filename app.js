(() => {
  "use strict";

  const FULL = window.CATALOG_DATA_V2;
  const TAXONOMY = window.MANAGEMENT_TAXONOMY_V6;
  const TYPE_CATALOG = window.TYPE_CATALOG_V12;
  const POPULARITY = window.CATEGORY_POPULARITY_V62 || window.CATEGORY_POPULARITY_V61 || window.CATEGORY_POPULARITY_V60 || window.CATEGORY_POPULARITY_V59 || { sourceRows: [], aliases: {}, aggregates: {}, matchesById: {} };
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
  // V59: категории, полностью исключенные из активного концепта.
  const V59_REMOVED_CATEGORY_TITLES = new Set([
    "Паркетная доска",
    "Подложки под ламинат и паркет",
    "Санитарные герметики",
    "Сэндвич-панели / панели для оконных откосов",
    "Ванны и душевые кабины",
    "Герметики для оконных и дверных швов",
    "Ламинат",
    "Встраиваемые светильники и софиты",
    "Выключатели",
    "Вязальная проволока",
    "Гвозди",
    "Гидроизоляционные ленты и манжеты",
    "Гипсокартон",
    "Грунтовки",
    "Губки для затирки",
    "Дюбели / дюбель-гвозди",
    "Дюбели для теплоизоляции / фасадные дюбели",
    "Интерьерные краски / краски для стен и потолков",
    "Клей обойный",
    "Клеммы и соединители проводов",
    "Лампы",
    "Люстры и подвесные светильники",
    "Монтажная пена",
    "Монтажные клеи / жидкие гвозди",
    "Наливные полы / ровнители для пола",
    "Наливные шланги для стиральных и посудомоечных машин",
    "Напольные плинтусы",
    "Настенно-потолочные светильники",
    "Подвесы для профиля",
    "Профили для гипсокартонных конструкций",
    "Рамки для розеток и выключателей",
    "Розетки",
    "Саморезы и шурупы",
    "Сварочные электроды",
    "Сифоны и сливная арматура",
    "Сливные шланги для стиральных и посудомоечных машин",
    "Смесители",
    "Унитазы",
    "ФУМ-лента",
    "Шпатлевки"
  ].map(normalize));
  // V59: категории из приложенного списка переводятся в «План» во всех активных точках входа.
  const V59_PLAN_CATEGORY_TITLES = new Set([
    "Наколенники",
    "Сварочные перчатки",
    "Механические штангенциркули",
    "Пирометры и лазерные термометры",
    "Тепловизоры",
    "Точные весы",
    "Электронные штангенциркули",
    "Крепления",
    "Мишени для лазерных плоскостей",
    "Оптические нивелиры",
    "Оснастка для электроизмерительных инструментов",
    "Отражающие пластины",
    "Приемники лазерного луча",
    "Тестеры-трассоискатели",
    "Мойки высокого давления",
    "Воздуходувки",
    "Автомобильные шампуни",
    "Инвентарь для уборки",
    "Насадки для строительных пылесосов",
    "Оснастка для моек высокого давления",
    "Очищающие жидкости для кузова",
    "Очищающие жидкости для салона",
    "Очищающие жидкости для стекол",
    "Очищающие жидкости для чистки под капотом",
    "Подметальные машины",
    "Снегоуборщики",
    "Снежные отвалы",
    "Щетки для подметальных машин",
    "Зубила для перфораторов и отбойных молотков",
    "Адаптеры для коронок",
    "Кондукторы для сверления и мебельного монтажа",
    "Насадки миксеры",
    "Оснастка для вибраторов бетона",
    "Рукав для мотопомпы",
    "Сверла по керамике, плитке и стеклу",
    "Наборы сверл",
    "Наборы бит и сверл",
    "Наборы буров и зубил",
    "Насадки для гравировальных машин",
    "Клеевые стержни",
    "Наборы коронок",
    "Адаптеры для бит",
    "Адаптеры для перфораторов",
    "Адаптеры для торцевых головок",
    "Болты, винты, гайки, шайбы и шпильки",
    "Гайки для УШМ",
    "Державки",
    "Жала",
    "Коллекторы",
    "Коронки для УШМ",
    "Лепестковые диски",
    "Наборы буров",
    "Наборы зубил",
    "Наборы фрез",
    "Наборы щеток для дрелей",
    "Наборы экстракторов",
    "Направляющие шины для ленточных шлифовальных машин",
    "Насадки специальные",
    "Ножовочные полотна",
    "Оловоотсосы",
    "Опорные тарелки",
    "Оснастка для щеточных шлифмашин",
    "Пеногенераторы и фильтры для моек",
    "Пластины для шлифмашин",
    "Подошвы для шлифмашин",
    "Полимерные диски",
    "Полировальные диски",
    "Полировальные пасты",
    "Припои",
    "Пылесборники",
    "Сварочные наконечники",
    "Скобы для степлеров",
    "Сопла газовые",
    "Стойки для УШМ",
    "Торцевые головки и насадки",
    "Тройники полипропиленовые",
    "Удлинители торцевых головок",
    "Флюсы",
    "Щеточные венцы",
    "Наборы пневматического инструмента",
    "Пневматические заклепочники",
    "Пневматические краскораспылители",
    "Пневмовинтоверты",
    "Пневмодрели",
    "Пневмопистолеты",
    "Пневмотрещотки",
    "Пневмошлифмашины",
    "Козлы",
    "Наборы отверток",
    "Мультитулы",
    "Шестигранные ключи",
    "Наборы шарнирно-губцевого инструмента",
    "Зубила и кернеры",
    "Киянки",
    "Клещи",
    "Тиски",
    "Шпатели и кельмы",
    "Воротки для торцевых головок",
    "Грабли",
    "Губки шлифовальные",
    "Динамометрические ключи",
    "Длинногубцы и круглогубцы",
    "Игольчатые валики",
    "Инструменты для витой пары",
    "Кисти малярные",
    "Клещи зажимные",
    "Мастерки, кельмы, расшивки",
    "Матрицы для опрессовки и пробивки",
    "Многофункциональные ножи",
    "Наборы автоинструмента",
    "Наборы отверток с битами",
    "Наборы столярно-слесарного инструмента",
    "Ножеточки",
    "Ножницы канцелярские",
    "Ножовки по дереву",
    "Пинцеты",
    "Пистолеты для герметика (ручные)",
    "Пистолеты для монтажной пены",
    "Плиткорезы ручные",
    "Стусла",
    "Съемники стопорных колец",
    "Маски сварочные",
    "Паяльные станции",
    "Горелки, оснастка",
    "Паяльники",
    "Паяльные ванны и термостолы",
    "Паяльные фены",
    "Плазменные резаки",
    "Сварочные аппараты MIG/MAG",
    "Сварочные аппараты MMA",
    "Сварочные аппараты TIG",
    "Сварочные электрогенераторы",
    "Термопинцеты",
    "Домкраты",
    "Заточные круги",
    "Заточные станки (точила)",
    "Заточные станки (точила) для сверл",
    "Заточные станки (точила) многофункциональные",
    "Заточные станки (точила) с гибким валом",
    "Заточные станки (точила) с шлифовальной лентой",
    "Стеллажи и полки",
    "Бензиновые электрогенераторы",
    "Дизельные электрогенераторы",
    "Блоки автозапуска для электрогенераторов",
    "Виброрейки",
    "Инверторные электрогенераторы",
    "Стабилизаторы напряжения и ИБП",
    "Строгальные станки",
    "Диски для затирочных машин",
    "Ленточно-дисковые шлифовальные станки",
    "Ленточнопильные станки",
    "Лобзиковые станки",
    "Настольные дисковые пилы",
    "Оснастка для бетонных вибраторов",
    "Сверлильные станки",
    "Стружкоотсосы",
    "Токарные станки",
    "Шлифовально-полировальные станки",
    "Вибротрамбовки",
    "Строительные тазы / ёмкости для раствора",
    "Мешки для мусора",
    "Тачки и телеги",
    "Перфорированные панели / Pegboard",
    "Браслеты",
    "Вкладыши для кейсов",
    "Кейсы",
    "Кобуры",
    "Короба и контейнеры для хранения",
    "Спецодежда",
    "Аккумуляторные дренажные насосы",
    "Ленточные шуруповерты",
    "Станки/инструмент для гибки арматуры",
    "Триммеры аккумуляторные",
    "Удлинители для сверл",
    "Электроплиткорезы",
    "Гравировальные машинки",
    "Клеевые пистолеты",
    "Адаптеры для аккумуляторов",
    "Аккумуляторы для электроинструментов",
    "Вибрационные шлифовальные машины",
    "Дрели для алмазного сверления",
    "Ленточные шлифовальные машины",
    "Модульные электроинструменты",
    "Наборы аккумуляторов с зарядным устройством",
    "Наборы электроинструментов",
    "Полировальные машины",
    "Прямые шлифовальные машины",
    "Установки алмазного бурения",
    "Щеточные шлифовальные машины"
  ].map(normalize));
  const v59IsRemovedTitle = (title) => V59_REMOVED_CATEGORY_TITLES.has(normalize(title));
  const v59IsPlanTitle = (title) => V59_PLAN_CATEGORY_TITLES.has(normalize(title));

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

  const typeNodeOverrideEntries = [
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
    ["N0429", { title: "Средства индивидуальной защиты и хранение инструмента", order: 9, fullPath: "Средства индивидуальной защиты и хранение инструмента" }],
    ["N0336", { parentId: "CUSTOM_CLEANING_ROOT", order: 1, fullPath: "Клининговое оборудование > Клининговая и сезонная техника" }],
    ["N0368", { parentId: "CUSTOM_WORKSHOP_ROOT", order: 1, fullPath: "Станки и оборудование для мастерской > Станки для обработки металла" }],
    ["N0372", { parentId: "CUSTOM_WORKSHOP_ROOT", order: 2, fullPath: "Станки и оборудование для мастерской > Станки для обработки дерева" }],
    ["N0376", { parentId: "CUSTOM_WORKSHOP_ROOT", order: 3, fullPath: "Станки и оборудование для мастерской > Шлифовальные и точильные станки" }],
    ["N0381", { parentId: "CUSTOM_WORKSHOP_ROOT", order: 4, fullPath: "Станки и оборудование для мастерской > Удаление стружки" }],
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
  ];
  const typeNodeOverrides = new Map();
  const setTypeNodeOverride = (id, patch) => typeNodeOverrides.set(id, { ...(typeNodeOverrides.get(id) || {}), ...patch });
  typeNodeOverrideEntries.forEach(([id, patch]) => setTypeNodeOverride(id, patch));
  const excludedTypeNodeIds = new Set(["N0084", "N0091", "N0118", "N0159", "N0160", "N0130", "N0126", "N0131", "N0308", "N0309", "N0317", "N0324", "N0140", "N0360", "N0361", "N0365", "N0377", "N0380", "N0384", "N0367"]);
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
    setTypeNodeOverride(id, {
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
    setTypeNodeOverride(id, {
      parentId: "N0139",
      order,
      ...(id === "N0143" ? { title } : {}),
      fullPath: `${directCuttingHandPath} > ${title}`,
    });
  });
  setTypeNodeOverride("N0146", {
    parentId: "CUSTOM_SCISSORS_SHARPENERS_GROUP",
    order: 1,
    fullPath: `${directCuttingHandPath} > Ножницы и ножеточки > Ножницы по металлу`,
  });
  setTypeNodeOverride("N0169", {
    parentId: "N0139",
    order: 10,
    fullPath: `${directCuttingHandPath} > Ножи монтерские`,
  });
  setTypeNodeOverride("N0149", {
    parentId: "N0139",
    order: 11,
    fullPath: `${directCuttingHandPath} > Столярный инструмент`,
  });
  [
    ["N0362", 4, "Домкраты гидравлические"],
    ["N0363", 5, "Домкраты механические"],
    ["N0364", 6, "Лестницы и стремянки"],
    ["N0366", 7, "Строительные фонари"],
  ].forEach(([id, order, title]) => setTypeNodeOverride(id, {
    parentId: "N0329",
    order,
    fullPath: `Строительная и силовая техника > ${title}`,
  }));
  setTypeNodeOverride("N0362", {
    parentId: "CUSTOM_WORKSHOP_BENCHES_GROUP",
    order: 3,
    fullPath: "Станки и оборудование для мастерской > Верстаки и стеллажи для мастерской > Домкраты гидравлические",
  });
  setTypeNodeOverride("N0363", {
    parentId: "CUSTOM_WORKSHOP_BENCHES_GROUP",
    order: 4,
    fullPath: "Станки и оборудование для мастерской > Верстаки и стеллажи для мастерской > Домкраты механические",
  });
  setTypeNodeOverride("N0385", {
    parentId: "N0383",
    order: 1,
    fullPath: "Пневмоинструмент и компрессорное оборудование > Компрессорный инструмент > Компрессоры",
  });
  setTypeNodeOverride("N0386", {
    parentId: "N0383",
    order: 2,
    fullPath: "Пневмоинструмент и компрессорное оборудование > Компрессорный инструмент > Шланги для компрессоров",
  });
  setTypeNodeOverride("N0387", {
    parentId: "N0388",
    order: 5,
    fullPath: "Пневмоинструмент и компрессорное оборудование > Пневматический инструмент > Наборы пневматического инструмента",
  });
  ["N0092", "N0094"].forEach((id) => setTypeNodeOverride(id, { parentId: "CUSTOM_HEAT", fullPath: "Электроинструмент > Нагрев и термообработка" }));
  ["N0093", "N0095"].forEach((id) => setTypeNodeOverride(id, { parentId: "CUSTOM_COATINGS", fullPath: "Электроинструмент > Нанесение покрытий" }));
  ["N0089", "N0090"].forEach((id, index) => setTypeNodeOverride(id, { parentId: "N0083", order: index + 5, fullPath: "Электроинструмент > Монтаж и крепление" }));

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
      fullPath: "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0, action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [], origin: "Структурная правка по запросу",
    },
    {
      id: "CUSTOM_WORKSHOP_BENCHES_GROUP", parentId: "CUSTOM_WORKSHOP_ROOT", order: 5, level: 2,
      title: "Верстаки и стеллажи для мастерской",
      fullPath: "Станки и оборудование для мастерской > Верстаки и стеллажи для мастерской",
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
    proposedTypeLeaf("CUSTOM_PIPE_KEYS", "N0106", 14, "Ключи трубные", "Ручной инструмент > Отвертки и ключи > Ключи трубные", ["https://www.dns-shop.ru/catalog/17aa21ca16404e77/kluci-trubnye/"]),
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
    proposedTypeLeaf("CUSTOM_SHARPENING_STATIONS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 1, "Заточные станки (точила)", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила)", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?virtual_category_uid=a7543f3854fe974f"]),
    proposedTypeLeaf("CUSTOM_CHAIN_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 2, "Заточные станки (точила) для пильных цепей", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) для пильных цепей", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5Bj%5D=aj6a&virtual_category_uid=3b6d61e48b9c3cfa"]),
    proposedTypeLeaf("CUSTOM_MULTIFUNCTION_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 3, "Заточные станки (точила) многофункциональные", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) многофункциональные", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5Bj%5D=guap&virtual_category_uid=f4b11f7dbd170b50"]),
    proposedTypeLeaf("CUSTOM_FLEX_SHAFT_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 4, "Заточные станки (точила) с гибким валом", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) с гибким валом", ["https://www.dns-shop.ru/catalog/17a9c75616404e77/zatocnye-stanki-tocila/?f%5B95%5D=hmi&virtual_category_uid=9c41e400fc7e2a52"]),
    proposedTypeLeaf("CUSTOM_BELT_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 5, "Заточные станки (точила) с шлифовальной лентой", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) с шлифовальной лентой", ["https://www.dns-shop.ru/catalog/recipe/d225d1b7b4194953/zatocnye-stanki-tocila-s-slifovalnoj-lentoj/"]),
    proposedTypeLeaf("CUSTOM_DRILL_SHARPENERS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 6, "Заточные станки (точила) для сверл", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные станки (точила) для сверл", ["https://www.dns-shop.ru/catalog/recipe/d975e67919a067c4/zatocnye-stanki-tocila-dla-sverl/"]),
    proposedTypeLeaf("CUSTOM_SHARPENING_WHEELS", "CUSTOM_SHARPENING_STATIONS_ACCESSORIES", 7, "Заточные круги", "Станки и оборудование для мастерской > Шлифовальные и точильные станки > Заточные станки (точила), оснастка > Заточные круги", ["https://www.dns-shop.ru/catalog/290f1ffcb1fb7fd7/zatocnye-krugi/?f%5B2kx%5D=hmn&virtual_category_uid=6eec8c7ad34d15ef"]),
    proposedTypeLeaf("CUSTOM_WORKBENCHES", "CUSTOM_WORKSHOP_BENCHES_GROUP", 1, "Верстаки", "Станки и оборудование для мастерской > Верстаки и стеллажи для мастерской > Верстаки", ["https://www.dns-shop.ru/catalog/f5d6e3e6b2227fd7/verstaki/"]),
    proposedTypeLeaf("CUSTOM_WORKSHOP_SHELVES", "CUSTOM_WORKSHOP_BENCHES_GROUP", 2, "Стеллажи и полки", "Станки и оборудование для мастерской > Верстаки и стеллажи для мастерской > Стеллажи и полки", ["https://www.dns-shop.ru/catalog/c213419aa0ee7db5/stellazi-i-polki/?stock=now-today-tomorrow-later-out_of_stock&order=popular"]),
  );

  ["N0319", "N0320", "N0321", "N0322", "N0323"].forEach((sourceId, index) => {
    const source = TYPE_CATALOG.nodes.find((node) => node.id === sourceId);
    if (!source) return;
    addedTypeNodes.push(copyTypePlacement(sourceId, `CUSTOM_ELECTRICAL_MEASURING__${sourceId}`, "CUSTOM_ELECTRICAL_MEASURING", index + 1, {
      fullPath: `Ручной инструмент > Электромонтажный инструмент > Электроизмерительные приборы > ${source.title}`,
      origin: "Дублирование дочерней категории V57",
    }));
  });

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
    setTypeNodeOverride(id, {
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


  // V56 — структурные правки раздела «По типу инструмента».
  // Правки выполняются на уровне навигационных размещений: исходные товарные категории
  // и их URL переиспользуются, а разрешённые ТЗ дубли создаются как дополнительные точки входа.
  TYPE_CATALOG.version = Math.max(Number(TYPE_CATALOG.version || 0), 19);

  const v56SetOverride = (id, patch) => {
    const previous = typeNodeOverrides.get(id) || {};
    setTypeNodeOverride(id, { ...previous, ...patch });
  };

  const v56SourceById = new Map(TYPE_CATALOG.nodes.map((node) => [node.id, node]));
  const v56ChildrenByParent = new Map();
  TYPE_CATALOG.nodes.forEach((node) => {
    const key = node.parentId || "__root__";
    if (!v56ChildrenByParent.has(key)) v56ChildrenByParent.set(key, []);
    v56ChildrenByParent.get(key).push(node);
  });
  v56ChildrenByParent.forEach((items) => items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ru")));

  const v56CloneBranch = (sourceRootId, cloneRootId, parentId, order, rootFullPath) => {
    const sourceRoot = v56SourceById.get(sourceRootId);
    if (!sourceRoot) return;
    const walk = (source, cloneId, cloneParentId, cloneOrder, fullPath) => {
      addedTypeNodes.push({
        ...source,
        id: cloneId,
        parentId: cloneParentId,
        order: cloneOrder,
        fullPath,
        origin: "Навигационное дублирование по ТЗ V56",
      });
      const children = v56ChildrenByParent.get(source.id) || [];
      children.forEach((child) => {
        walk(child, `${cloneRootId}__${child.id}`, cloneId, child.order, `${fullPath} > ${child.title}`);
      });
    };
    walk(sourceRoot, cloneRootId, parentId, order, rootFullPath);
  };

  // 1. Клининговое оборудование: убрать уровень «Клининговая и сезонная техника».
  excludedTypeNodeIds.add("N0336");
  [
    ["N0337", 1, "Мойки высокого давления"],
    ["N0341", 2, "Уборка территории"],
    ["N0347", 3, "Строительные пылесосы"],
  ].forEach(([id, order, title]) => v56SetOverride(id, {
    parentId: "CUSTOM_CLEANING_ROOT",
    order,
    fullPath: `Клининговое оборудование > ${title}`,
  }));
  [
    ["N0338", "N0337", "Мойки высокого давления", "Мойки высокого давления"],
    ["N0339", "N0337", "Мойки высокого давления", "Оснастка для моек высокого давления"],
    ["N0342", "N0341", "Уборка территории", "Снегоуборщики"],
    ["N0343", "N0341", "Уборка территории", "Снежные отвалы"],
    ["N0344", "N0341", "Уборка территории", "Воздуходувки"],
    ["N0345", "N0341", "Уборка территории", "Подметальные машины"],
    ["N0346", "N0341", "Уборка территории", "Щетки для подметальных машин"],
    ["N0348", "N0347", "Строительные пылесосы", "Строительные пылесосы"],
    ["N0349", "N0347", "Строительные пылесосы", "Мешки для строительных пылесосов"],
    ["N0350", "N0347", "Строительные пылесосы", "Фильтры для строительных пылесосов"],
    ["N0351", "N0347", "Строительные пылесосы", "Насадки для строительных пылесосов"],
  ].forEach(([id, parentId, parentTitle, title]) => v56SetOverride(id, {
    parentId,
    fullPath: `Клининговое оборудование > ${parentTitle} > ${title}`,
  }));
  // V33-замены химии для моек остаются в той же ветке, но путь должен соответствовать новой иерархии.
  addedTypeNodes.forEach((node) => {
    if (node.id.startsWith("V33_N0340_")) {
      node.fullPath = `Клининговое оборудование > Мойки высокого давления > ${node.title}`;
    }
  });

  // 2. Пневмоинструмент: убрать уровни «Компрессорный инструмент» и «Пневматический инструмент».
  excludedTypeNodeIds.add("N0383");
  excludedTypeNodeIds.add("N0388");
  [
    ["N0385", 1, "Компрессоры"],
    ["N0386", 2, "Шланги для компрессоров"],
    ["N0387", 3, "Наборы пневматического инструмента"],
    ["N0389", 4, "Закручивание и монтаж"],
    ["N0394", 5, "Забивной и ударный инструмент"],
    ["N0399", 6, "Сверление и шлифование"],
    ["N0402", 7, "Покраска и продувка"],
  ].forEach(([id, order, title]) => v56SetOverride(id, {
    parentId: "N0352",
    order,
    fullPath: `Пневмоинструмент и компрессорное оборудование > ${title}`,
  }));
  const v56PneumaticSubpaths = [
    ["N0390", "Закручивание и монтаж", "Пневмогайковерты"],
    ["N0391", "Закручивание и монтаж", "Пневмовинтоверты"],
    ["N0392", "Закручивание и монтаж", "Пневмотрещотки"],
    ["N0393", "Закручивание и монтаж", "Пневматические заклепочники"],
    ["N0395", "Забивной и ударный инструмент", "Пневматические нейлеры"],
    ["N0396", "Забивной и ударный инструмент", "Пневмодолота"],
    ["N0397", "Забивной и ударный инструмент", "Гвозди для нейлеров"],
    ["N0398", "Забивной и ударный инструмент", "Скобы для пистолетов"],
    ["N0400", "Сверление и шлифование", "Пневмодрели"],
    ["N0401", "Сверление и шлифование", "Пневмошлифмашины"],
    ["N0403", "Покраска и продувка", "Пневмопистолеты"],
    ["N0404", "Покраска и продувка", "Пневматические краскораспылители"],
  ];
  v56PneumaticSubpaths.forEach(([id, parentTitle, title]) => v56SetOverride(id, {
    fullPath: `Пневмоинструмент и компрессорное оборудование > ${parentTitle} > ${title}`,
  }));

  // 3. Электрогенераторы: самостоятельный уровень с типами генераторов и оснасткой.
  excludedTypeNodeIds.add("N0331");
  v56SetOverride("N0330", { fullPath: "Строительная и силовая техника > Энергоснабжение" });
  v56SetOverride("N0334", {
    parentId: "N0330",
    order: 2,
    fullPath: "Строительная и силовая техника > Энергоснабжение > Стабилизаторы напряжения и ИБП",
  });
  addedTypeNodes.push({
    id: "CUSTOM_V56_GENERATORS", parentId: "N0330", order: 1, level: 3,
    title: "Электрогенераторы",
    fullPath: "Строительная и силовая техника > Энергоснабжение > Электрогенераторы",
    kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0,
    action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [],
    origin: "Структурная правка V56",
  });
  v56SetOverride("N0332", {
    parentId: "CUSTOM_V56_GENERATORS", order: 1,
    title: "Электрогенераторы",
    fullPath: "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Электрогенераторы",
    sourceNames: ["Электрогенераторы"],
    sourceUrls: ["https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/"],
    sourceTypes: ["leaf"], useExactDnsUrl: true,
  });
  addedTypeNodes.push(
    proposedTypeLeaf("CUSTOM_V56_GAS_GENERATORS", "CUSTOM_V56_GENERATORS", 2, "Бензиновые электрогенераторы", "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Бензиновые электрогенераторы", ["https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/?f%5B27h%5D=e9t&virtual_category_uid=3fd9fc315bdded0b"]),
    proposedTypeLeaf("CUSTOM_V56_DIESEL_GENERATORS", "CUSTOM_V56_GENERATORS", 3, "Дизельные электрогенераторы", "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Дизельные электрогенераторы", ["https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/?f%5B27h%5D=e9u&virtual_category_uid=13d0af34aeabbfdb"]),
    proposedTypeLeaf("CUSTOM_V56_INVERTER_GENERATORS", "CUSTOM_V56_GENERATORS", 4, "Инверторные электрогенераторы", "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Инверторные электрогенераторы", ["https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/?f%5Bbz%5D=1p55&virtual_category_uid=eb792b3eb2a55474"]),
    proposedTypeLeaf("CUSTOM_V56_WELDING_GENERATORS_ENERGY", "CUSTOM_V56_GENERATORS", 5, "Сварочные электрогенераторы", "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Сварочные электрогенераторы", ["https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/?f%5B1n%5D=2nbe&virtual_category_uid=671810c363483c5b"]),
    {
      id: "CUSTOM_V56_GENERATOR_ACCESSORIES", parentId: "CUSTOM_V56_GENERATORS", order: 6, level: 4,
      title: "Оснастка для электрогенераторов",
      fullPath: "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Оснастка для электрогенераторов",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0,
      action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [],
      origin: "Структурная правка V56",
    }
  );
  v56SetOverride("N0333", {
    parentId: "CUSTOM_V56_GENERATOR_ACCESSORIES", order: 1,
    title: "Блоки автозапуска для электрогенераторов",
    fullPath: "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Оснастка для электрогенераторов > Блоки автозапуска для электрогенераторов",
    sourceNames: ["Блоки автозапуска для электрогенераторов"],
    sourceUrls: ["https://www.dns-shop.ru/catalog/ad165696ca647fd7/bloki-avtozapuska-dla-elektrogeneratorov/"],
    sourceTypes: ["leaf"], useExactDnsUrl: true,
  });
  v56SetOverride("N0335", {
    parentId: "CUSTOM_V56_GENERATOR_ACCESSORIES", order: 2,
    title: "Силовые удлинители",
    fullPath: "Строительная и силовая техника > Энергоснабжение > Электрогенераторы > Оснастка для электрогенераторов > Силовые удлинители",
    sourceNames: ["Силовые удлинители"],
    sourceUrls: ["https://www.dns-shop.ru/catalog/recipe/85da2e34e0408dc7/silovye-udliniteli/"],
    sourceTypes: ["filtered-category"], useExactDnsUrl: true,
  });
  ["CUSTOM_V56_GAS_GENERATORS", "CUSTOM_V56_DIESEL_GENERATORS", "CUSTOM_V56_INVERTER_GENERATORS", "CUSTOM_V56_WELDING_GENERATORS_ENERGY"].forEach((id) => {
    const node = addedTypeNodes.find((item) => item.id === id);
    if (node) { node.useExactDnsUrl = true; node.sourceTypes = ["filtered-category"]; }
  });

  // 4–8. Сварочное оборудование.
  ["N0412", "N0413", "N0414"].forEach((id) => excludedTypeNodeIds.add(id));
  v56SetOverride("N0407", {
    title: "Сварочные аппараты",
    order: 1,
    fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Сварочные аппараты",
  });
  v56SetOverride("N0408", {
    parentId: "N0407", order: 1,
    fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Сварочные аппараты > Сварочные аппараты",
  });
  addedTypeNodes.push(
    proposedTypeLeaf("CUSTOM_V56_WELD_MMA", "N0407", 2, "Сварочные аппараты MMA", "Сварочное и паяльное оборудование > Сварочное оборудование > Сварочные аппараты > Сварочные аппараты MMA", ["https://www.dns-shop.ru/catalog/recipe/7ffbabb57542bfec/svarocnye-apparaty-mma/"]),
    proposedTypeLeaf("CUSTOM_V56_WELD_MIGMAG", "N0407", 3, "Сварочные аппараты MIG/MAG", "Сварочное и паяльное оборудование > Сварочное оборудование > Сварочные аппараты > Сварочные аппараты MIG/MAG", ["https://www.dns-shop.ru/catalog/recipe/5a31c4875ee070a1/svarocnye-apparaty-migmag/"]),
    proposedTypeLeaf("CUSTOM_V56_WELD_TIG", "N0407", 4, "Сварочные аппараты TIG", "Сварочное и паяльное оборудование > Сварочное оборудование > Сварочные аппараты > Сварочные аппараты TIG", ["https://www.dns-shop.ru/catalog/recipe/899c7533609f1403/svarocnye-apparaty-tig/"]),
    proposedTypeLeaf("CUSTOM_V56_WELDING_GENERATORS_WELD", "N0407", 5, "Сварочные электрогенераторы", "Сварочное и паяльное оборудование > Сварочное оборудование > Сварочные аппараты > Сварочные электрогенераторы", ["https://www.dns-shop.ru/catalog/17a9d22a16404e77/elektrogeneratory/?f%5B1n%5D=2nbe&virtual_category_uid=671810c363483c5b"]),
    {
      id: "CUSTOM_V56_PLASMA_GROUP", parentId: "N0406", order: 2, level: 3,
      title: "Плазменные резаки, оснастка",
      fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Плазменные резаки, оснастка",
      kind: "Навигационная группа", itemRole: "Навигация", duplicateCount: 0,
      action: "Создать навигационный узел", sourceNames: [], sourceUrls: [], sourceTypes: [],
      origin: "Структурная правка V56",
    },
    proposedTypeLeaf("CUSTOM_V56_WELD_BURNERS", "N0406", 3, "Горелки, оснастка", "Сварочное и паяльное оборудование > Сварочное оборудование > Горелки, оснастка", ["https://www.dns-shop.ru/catalog/2436c2b189ce42e1/gorelki-osnastka/"])
  );
  ["CUSTOM_V56_WELD_MMA", "CUSTOM_V56_WELD_MIGMAG", "CUSTOM_V56_WELD_TIG", "CUSTOM_V56_WELDING_GENERATORS_WELD", "CUSTOM_V56_WELD_BURNERS"].forEach((id) => {
    const node = addedTypeNodes.find((item) => item.id === id);
    if (node) node.useExactDnsUrl = true;
  });
  v56SetOverride("N0409", {
    parentId: "CUSTOM_V56_PLASMA_GROUP", order: 1,
    fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Плазменные резаки, оснастка > Плазменные резаки",
    sourceNames: ["Плазменные резаки"], sourceUrls: ["https://www.dns-shop.ru/catalog/726ca736ad7b4245/plazmennye-rezaki/"], sourceTypes: ["leaf"], useExactDnsUrl: true,
  });
  v56SetOverride("N0410", {
    parentId: "CUSTOM_V56_PLASMA_GROUP", order: 2,
    fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Плазменные резаки, оснастка > Маски сварочные",
    sourceNames: ["Маски сварочные"], sourceUrls: ["https://www.dns-shop.ru/catalog/17aa25ad16404e77/maski-svarocnye/?virtual_category_uid=374dcf8df9e7c8d8"], sourceTypes: ["filtered-category"], useExactDnsUrl: true,
  });
  v56SetOverride("N0411", {
    parentId: "CUSTOM_V56_PLASMA_GROUP", order: 3,
    title: "Сварочные перчатки",
    fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Плазменные резаки, оснастка > Сварочные перчатки",
    sourceNames: ["Сварочные перчатки"], sourceUrls: ["https://www.dns-shop.ru/catalog/recipe/d967507ff5297ef1/svarocnye-percatki/"], sourceTypes: ["filtered-category"], useExactDnsUrl: true,
  });
  v56SetOverride("N0415", {
    parentId: "N0406", order: 4,
    fullPath: "Сварочное и паяльное оборудование > Сварочное оборудование > Сварка пластиковых труб",
  });

  // 9. Продублировать «Пневматическая оснастка» в пневмоинструмент.
  v56CloneBranch(
    "N0291",
    "CUSTOM_V56_PNEUMATIC_ACCESSORIES_COPY",
    "N0352",
    8,
    "Пневмоинструмент и компрессорное оборудование > Пневматическая оснастка"
  );
  // В исходной ветке единственная промежуточная группа автоматически схлопывается;
  // дополнительное размещение должно визуально повторять ту же структуру.
  const v56PneumaticCopyWrapperId = "CUSTOM_V56_PNEUMATIC_ACCESSORIES_COPY__N0292";
  const v56PneumaticCopyRootId = "CUSTOM_V56_PNEUMATIC_ACCESSORIES_COPY";
  const v56WrapperIndex = addedTypeNodes.findIndex((node) => node.id === v56PneumaticCopyWrapperId);
  if (v56WrapperIndex >= 0) addedTypeNodes.splice(v56WrapperIndex, 1);
  addedTypeNodes.forEach((node) => {
    if (node.parentId === v56PneumaticCopyWrapperId) {
      node.parentId = v56PneumaticCopyRootId;
      node.fullPath = `Пневмоинструмент и компрессорное оборудование > Пневматическая оснастка > ${node.title}`;
    }
  });

  // 10. Продублировать «Сварка и пайка» в «Сварочное и паяльное оборудование».
  v56SetOverride("N0418", { order: 3, fullPath: "Сварочное и паяльное оборудование > Паяльное оборудование" });
  v56CloneBranch(
    "N0280",
    "CUSTOM_V56_WELDING_ACCESSORIES_COPY",
    "N0405",
    2,
    "Сварочное и паяльное оборудование > Сварка и пайка"
  );

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

  const normalizePopularityName = (value) => normalize(value).replace(/[–—−]/g, "-").replace(/\s+/g, " ").trim();
  const popularitySourceByName = new Map((POPULARITY.sourceRows || []).map((row) => [normalizePopularityName(row.sourceName), row]));
  const popularityAliases = new Map(Object.entries(POPULARITY.aliases || {}).map(([name, sourceName]) => [normalizePopularityName(name), sourceName]));
  const popularityAggregates = new Map(Object.entries(POPULARITY.aggregates || {}).map(([name, sourceNames]) => [normalizePopularityName(name), sourceNames]));
  const popularityFor = (categoryId, title) => {
    const key = normalizePopularityName(title);
    const stored = POPULARITY.matchesById?.[String(categoryId)];
    if (stored && (!stored.projectTitle || normalizePopularityName(stored.projectTitle) === key)) return stored;
    let result;
    const exact = popularitySourceByName.get(key);
    if (exact) {
      result = { categoryId: String(categoryId), sourceName: exact.sourceName, popularityPercent: Number(exact.popularityPercent), matchType: "exact", matched: true, sourceRows: [exact] };
    } else if (popularityAliases.has(key)) {
      const sourceName = popularityAliases.get(key);
      const row = popularitySourceByName.get(normalizePopularityName(sourceName));
      result = row ? { categoryId: String(categoryId), sourceName: row.sourceName, popularityPercent: Number(row.popularityPercent), matchType: "alias", matched: true, sourceRows: [row] } : null;
    } else if (popularityAggregates.has(key)) {
      const sourceRows = popularityAggregates.get(key).map((name) => popularitySourceByName.get(normalizePopularityName(name))).filter(Boolean);
      const requestedCount = popularityAggregates.get(key).length;
      result = sourceRows.length === requestedCount ? { categoryId: String(categoryId), sourceName: sourceRows.map((row) => row.sourceName).join(" + "), popularityPercent: sourceRows.reduce((sum, row) => sum + Number(row.popularityPercent), 0), matchType: "aggregate", matched: true, sourceRows } : null;
    }
    if (!result) result = { categoryId: String(categoryId), sourceName: "", popularityPercent: null, matchType: "unmatched", matched: false, sourceRows: [] };
    POPULARITY.matchesById[String(categoryId)] = result;
    return result;
  };
  const sortFinalCategories = (items, context = {}) => items.map((item, index) => ({ item, index })).sort((left, right) => {
    const a = left.item, b = right.item;
    const roleA = Number(context.roleOf ? context.roleOf(a) : 0);
    const roleB = Number(context.roleOf ? context.roleOf(b) : 0);
    if (roleA !== roleB) return roleA - roleB;
    const planA = context.planOf ? Boolean(context.planOf(a)) : false;
    const planB = context.planOf ? Boolean(context.planOf(b)) : false;
    if (planA !== planB) return Number(planA) - Number(planB);
    const idA = context.idOf ? context.idOf(a) : a.id;
    const idB = context.idOf ? context.idOf(b) : b.id;
    const titleA = context.titleOf ? context.titleOf(a) : (a.title || a.name || "");
    const titleB = context.titleOf ? context.titleOf(b) : (b.title || b.name || "");
    const popA = popularityFor(idA, titleA);
    const popB = popularityFor(idB, titleB);
    if (popA.matched !== popB.matched) return popA.matched ? -1 : 1;
    if (popA.matched && popB.matched && popA.popularityPercent !== popB.popularityPercent) return popB.popularityPercent - popA.popularityPercent;
    const orderA = Number(context.orderOf ? context.orderOf(a, left.index) : (Number.isFinite(a.order) ? a.order : left.index));
    const orderB = Number(context.orderOf ? context.orderOf(b, right.index) : (Number.isFinite(b.order) ? b.order : right.index));
    if (orderA !== orderB) return orderA - orderB;
    return String(titleA).localeCompare(String(titleB), "ru");
  }).map(({ item }) => item);

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
  ]
    .filter((node) => node.itemRole === "Навигация" || !v59IsRemovedTitle(node.title))
    .map((node) => {
      if (node.itemRole === "Навигация") return node;
      const active = Boolean((node.sourceUrls || []).length);
      const forcedPlan = v59IsPlanTitle(node.title);
      return {
        ...node,
        productCount: node.productCount ?? (active ? null : 0),
        plan: forcedPlan ? true : (node.plan ?? !active),
        ...(forcedPlan ? { planReason: "Переведено в «План» по списку пользователя V59" } : {}),
      };
    }).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ru"));
  const typeNodeById = new Map(typeNodes.map((node) => [node.id, node]));
  const typeChildrenByParentId = new Map();
  typeNodes.forEach((node) => {
    const parentId = node.parentId || "__root__";
    if (!typeChildrenByParentId.has(parentId)) typeChildrenByParentId.set(parentId, []);
    typeChildrenByParentId.get(parentId).push(node);
  });
  typeChildrenByParentId.forEach((children) => {
    const leavesOnly = children.every((child) => !(typeChildrenByParentId.get(child.id) || []).length);
    const sorted = leavesOnly
      ? sortFinalCategories(children, {
          roleOf: typeRoleRank,
          planOf: (node) => Boolean(node.plan) || node.productCount === 0,
          idOf: (node) => node.id,
          titleOf: (node) => node.title,
          orderOf: (node, index) => Number.isFinite(node.order) ? node.order : index,
        })
      : [...children].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ru"));
    children.splice(0, children.length, ...sorted);
  });
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
  const taxCategories = TAXONOMY.groups.flatMap((group) => group.categories)
    .filter((category) => !v59IsRemovedTitle(category.name))
    .map((category) => v59IsPlanTitle(category.name) ? { ...category, plan: true, planReason: "Переведено в «План» по списку пользователя V59" } : category);
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
  const rawResourceGroupDefs = window.WORK_STAGES_V35.groups;

  // V61: функциональная декомпозиция предпоследнего уровня «Этапов работ».
  // Исходные resources.* остаются стабильным техническим слоем, а UI группирует категории
  // по выполняемой задаче: пиление, резка, крепление, измерение, пневмоинструмент и т. д.
  const resourceGroupDefs = [
    { key: "power-fastening", title: "Закручивание и крепление", icon: "drill", displayOrder: 10 },
    { key: "power-drilling", title: "Сверление и долбление", icon: "drill", displayOrder: 11 },
    { key: "power-sawing", title: "Пиление", icon: "cut", displayOrder: 12 },
    { key: "power-cutting", title: "Резка и штробление", icon: "cut", displayOrder: 13 },
    { key: "power-sanding", title: "Шлифование и обработка поверхностей", icon: "cut", displayOrder: 14 },
    { key: "power-routing", title: "Фрезерование и строгание", icon: "cut", displayOrder: 15 },
    { key: "power-mixing", title: "Смешивание растворов", icon: "drill", displayOrder: 16 },
    { key: "power-heating", title: "Нагрев и сушка", icon: "equipment", displayOrder: 17 },
    { key: "power-coating", title: "Нанесение покрытий", icon: "equipment", displayOrder: 18 },
    { key: "power-concrete-rebar", title: "Бетон и арматура", icon: "equipment", displayOrder: 19 },
    { key: "power-garden", title: "Садовые работы", icon: "tool", displayOrder: 20 },
    { key: "power-pumps", title: "Насосы и откачка воды", icon: "equipment", displayOrder: 21 },
    { key: "power-other", title: "Другой электроинструмент", icon: "drill", displayOrder: 22 },

    { key: "ground-drilling", title: "Бурение грунта", icon: "equipment", displayOrder: 23 },
    { key: "compressors", title: "Компрессоры", icon: "equipment", displayOrder: 24 },
    { key: "pneumatic", title: "Пневмоинструмент", icon: "equipment", displayOrder: 25 },
    { key: "flooring", title: "Работа с наливным полом", icon: "equipment", displayOrder: 26 },

    { key: "hand-cutting", title: "Резка и раскрой", icon: "cut", displayOrder: 30 },
    { key: "hand-fastening", title: "Закручивание и крепление", icon: "tool", displayOrder: 31 },
    { key: "hand-impact", title: "Ударные и демонтажные работы", icon: "tool", displayOrder: 32 },
    { key: "hand-gripping", title: "Захват, зажим и перекусывание", icon: "tool", displayOrder: 33 },
    { key: "hand-electrical", title: "Электромонтаж", icon: "tool", displayOrder: 34 },
    { key: "hand-plumbing", title: "Трубы и сантехника", icon: "tool", displayOrder: 35 },
    { key: "hand-tile", title: "Работа с плиткой", icon: "tool", displayOrder: 36 },
    { key: "hand-carpentry", title: "Столярные работы", icon: "tool", displayOrder: 37 },
    { key: "hand-ground", title: "Земляные и садовые работы", icon: "tool", displayOrder: 38 },
    { key: "hand-rebar", title: "Работа с арматурой", icon: "tool", displayOrder: 39 },
    { key: "hand-finishing", title: "Штукатурные и отделочные работы", icon: "tool", displayOrder: 40 },
    { key: "hand-other", title: "Другой ручной инструмент", icon: "tool", displayOrder: 41 },

    { key: "measure-laser", title: "Лазерные нивелиры и дальномеры", icon: "measure", displayOrder: 50 },
    { key: "measure-manual", title: "Рулетки, уровни и угломеры", icon: "measure", displayOrder: 51 },
    { key: "measure-electrical", title: "Электроизмерение и диагностика", icon: "measure", displayOrder: 52 },
    { key: "measure-material", title: "Контроль материалов и среды", icon: "measure", displayOrder: 53 },
    { key: "measure-other", title: "Измерение и контроль", icon: "measure", displayOrder: 54 },

    { key: "consumables", title: "Расходные материалы", icon: "layers", displayOrder: 60 },
    { key: "tooling-drilling", title: "Оснастка для сверления и долбления", icon: "cut", displayOrder: 61 },
    { key: "tooling-sawing", title: "Оснастка для пиления", icon: "cut", displayOrder: 62 },
    { key: "tooling-cut-sand", title: "Оснастка для резки и шлифования", icon: "cut", displayOrder: 63 },
    { key: "tooling-fastening", title: "Оснастка для крепления", icon: "cut", displayOrder: 64 },
    { key: "tooling-routing", title: "Оснастка для фрезерования и строгания", icon: "cut", displayOrder: 65 },
    { key: "tooling-garden", title: "Оснастка для садовой техники", icon: "cut", displayOrder: 66 },
    { key: "tooling-ground", title: "Оснастка для бурения грунта", icon: "cut", displayOrder: 67 },
    { key: "tooling-mix-concrete", title: "Оснастка для раствора и бетона", icon: "cut", displayOrder: 68 },
    { key: "tooling-tile", title: "Оснастка для плиточных работ", icon: "cut", displayOrder: 69 },
    { key: "tooling-dust", title: "Пылеудаление", icon: "cleanup", displayOrder: 70 },
    { key: "tooling-cutting", title: "Режущая оснастка", icon: "cut", displayOrder: 71 },
    { key: "tooling-welding", title: "Оснастка для сварки труб", icon: "cut", displayOrder: 72 },
    { key: "hoses", title: "Шланги и рукава", icon: "layers", displayOrder: 73 },
    { key: "tooling-other", title: "Прочая оснастка", icon: "cut", displayOrder: 74 },
    { key: "battery", title: "АКБ и зарядные устройства", icon: "battery", displayOrder: 76 },
    { key: "accessories", title: "Аксессуары", icon: "battery", displayOrder: 78 },
    { key: "storage", title: "Хранение и организация", icon: "box", displayOrder: 79 },
    { key: "cleanup", title: "Уборка и пылеудаление", icon: "cleanup", displayOrder: 80 },
    { key: "transport", title: "Транспортировка материалов", icon: "cleanup", displayOrder: 81 },
    { key: "access-workplace", title: "Лестницы, козлы и верстаки", icon: "ladder", displayOrder: 82 },
    { key: "welding", title: "Сварка", icon: "equipment", displayOrder: 83 },
    { key: "concrete", title: "Бетон, раствор и уплотнение", icon: "equipment", displayOrder: 84 },
    { key: "water", title: "Насосы и водоснабжение", icon: "equipment", displayOrder: 85 },
    { key: "climate", title: "Сушка и обогрев", icon: "equipment", displayOrder: 86 },
    { key: "lighting", title: "Освещение и электропитание", icon: "light", displayOrder: 87 },
    { key: "generators", title: "Электрогенераторы", icon: "light", displayOrder: 88 },
    { key: "equipment", title: "Строительное оборудование", icon: "equipment", displayOrder: 89 },
    { key: "ppe", title: "Защита и спецодежда", icon: "safety", displayOrder: 90 },
  ].sort((a, b) => a.displayOrder - b.displayOrder);

  const normalizeStageResourceName = (value) => String(value || "")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .trim();
  const stageResourceHas = (name, ...parts) => {
    const source = normalizeStageResourceName(name);
    return parts.some((part) => source.includes(normalizeStageResourceName(part)));
  };
  const stageFunctionalGroupKey = (item, sourceKey) => {
    const name = item?.categoryName || item?.name || "";

    // Пользовательские межгрупповые правила V61.
    if (stageResourceHas(name, "отбивочные/разметочные шнуры", "маркеры и карандаши строительные", "мешки для мусора")) return "consumables";
    if (stageResourceHas(name, "электрогенераторы")) return "generators";
    if (stageResourceHas(name, "лестницы и стремянки", "верстаки", "козлы", "строительные козлы")) return "access-workplace";
    if (stageResourceHas(name, "пневм", "нейлеры пневматические")) return "pneumatic";
    if (stageResourceHas(name, "геодезические штативы")) return "measure-laser";

    if (sourceKey === "powerTools") {
      if (stageResourceHas(name, "шуруповерт", "винтоверт", "гайковерт", "аккумуляторные отвертки", "ленточные шуруповерты", "гвоздезабивные", "степлеры электрические", "аккумуляторные заклепочники", "аккумуляторные пистолеты для герметика")) return "power-fastening";
      if ((stageResourceHas(name, "перфоратор", "дрели") && !stageResourceHas(name, "дрели-миксеры")) || stageResourceHas(name, "отбойные молотки")) return "power-drilling";
      if (stageResourceHas(name, "лобзики", "пилы дисковые", "пилы торцовочные", "сабельные пилы", "цепные", "аккумуляторные пилы", "высоторезы")) return "power-sawing";
      if (stageResourceHas(name, "углошлифовальные", "отрезные пилы", "арматурорезы", "электрические ножницы", "электроплиткорезы", "реноваторы", "штроборезы")) return "power-cutting";
      if (stageResourceHas(name, "шлифовальные машины", "эксцентриковые")) return "power-sanding";
      if (stageResourceHas(name, "фрезеры", "электрорубанки")) return "power-routing";
      if (stageResourceHas(name, "дрели-миксеры")) return "power-mixing";
      if (stageResourceHas(name, "фены строительные")) return "power-heating";
      if (stageResourceHas(name, "краскопульты")) return "power-coating";
      if (stageResourceHas(name, "бетоносмесители", "вибраторы для бетона", "пистолеты для вязки арматуры", "станки/инструмент для гибки арматуры")) return "power-concrete-rebar";
      if (stageResourceHas(name, "триммеры", "кусторезы", "секаторы", "садовые измельчители")) return "power-garden";
      if (stageResourceHas(name, "дренажные насосы", "мотопомпы")) return "power-pumps";
      return "power-other";
    }

    if (sourceKey === "handTools") {
      if (stageResourceHas(name, "стрипперы", "кабелерезы", "пресс-клещи (кримперы)", "ножи монтерские", "отвертки диэлектрические")) return "hand-electrical";
      if (stageResourceHas(name, "строительные ножи", "ножницы по металлу", "ножовки и пилы", "болторезы", "просекатели")) return "hand-cutting";
      if (stageResourceHas(name, "отвертки", "ключи-трещотки", "наборы ключей", "наборы торцевых головок", "ручные заклепочники", "строительные степлеры")) return "hand-fastening";
      if (stageResourceHas(name, "молотки", "киянки", "кувалды", "ломы", "топоры", "кирки")) return "hand-impact";
      if (stageResourceHas(name, "струбцины", "клещи", "плоскогубцы", "длинногубцы", "бокорезы")) return "hand-gripping";
      if (stageResourceHas(name, "труборезы", "трубогибы", "калибраторы", "пресс-инструмент для труб", "ключи трубные", "ключи разводные")) return "hand-plumbing";
      if (stageResourceHas(name, "плиткорезы ручные", "щипцы / кусачки для плитки")) return "hand-tile";
      if (stageResourceHas(name, "стамески", "стусла")) return "hand-carpentry";
      if (stageResourceHas(name, "лопаты", "грабли")) return "hand-ground";
      if (stageResourceHas(name, "вязальные крючки")) return "hand-rebar";
      if (stageResourceHas(name, "валики", "кисти", "шпатели", "мастерки", "гладилки", "правила", "терки", "скребки", "пистолеты для герметика", "пистолеты для монтажной пены", "ручные шлифовальные", "игольчатые валики", "лопатки / шпатели для натяжных потолков", "зажимы / прищепки для натяжных потолков")) return "hand-finishing";
      if (stageResourceHas(name, "инвентарь для уборки")) return "cleanup";
      return "hand-other";
    }

    if (sourceKey === "measuring") {
      if (stageResourceHas(name, "лазерные нивелиры", "лазерные дальномеры")) return "measure-laser";
      if (stageResourceHas(name, "рулетки", "уровни, угломеры", "угольники", "курвиметры")) return "measure-manual";
      if (stageResourceHas(name, "мультиметры", "детекторы проводки", "пробники напряжения", "токоизмерительные клещи")) return "measure-electrical";
      if (stageResourceHas(name, "влагомеры")) return "measure-material";
      return "measure-other";
    }

    if (sourceKey === "tooling") {
      if (stageResourceHas(name, "сверла по керамике", "присоски для плитки", "терки для затирки", "емкости / ведра для затирочных работ")) return "tooling-tile";
      if (stageResourceHas(name, "буры", "сверла", "коронки", "адаптеры для коронок", "зубила для перфораторов", "кондукторы для сверления")) return "tooling-drilling";
      if (stageResourceHas(name, "пилки для электролобзиков", "пильные диски", "полотна для сабельных пил", "цепи для пил", "шины для пил", "заточные станки")) return "tooling-sawing";
      if (stageResourceHas(name, "алмазные диски", "отрезные и обдирочные диски", "диски, круги шлифовальные", "гибкие алмазные круги", "чаши алмазные", "шлифовальные листы", "щетки для ушм")) return "tooling-cut-sand";
      if (stageResourceHas(name, "наборы бит", "оснастка для степлеров")) return "tooling-fastening";
      if (stageResourceHas(name, "фрезы", "ножи для рубанков")) return "tooling-routing";
      if (stageResourceHas(name, "леска для триммеров", "ножи для триммеров", "триммерные головки")) return "tooling-garden";
      if (stageResourceHas(name, "шнеки для мотобуров")) return "tooling-ground";
      if (stageResourceHas(name, "насадки миксеры", "оснастка для вибраторов бетона")) return "tooling-mix-concrete";
      if (stageResourceHas(name, "системы пылеудаления")) return "tooling-dust";
      if (stageResourceHas(name, "лезвия для ножей", "ножи для арматурорезов", "ножи для ножниц по металлу", "насадки для реноваторов")) return "tooling-cutting";
      if (stageResourceHas(name, "насадки для аппарата сварки пластиковых труб")) return "tooling-welding";
      if (stageResourceHas(name, "рукав для мотопомпы")) return "hoses";
      return "tooling-other";
    }

    if (sourceKey === "consumables") return "consumables";
    if (sourceKey === "accessories") {
      if (stageResourceHas(name, "аккумуляторы для электроинструмента", "зарядные устройства для электроинструментов")) return "battery";
      if (stageResourceHas(name, "шланги")) return "hoses";
      return "accessories";
    }
    if (sourceKey === "storage") return "storage";
    if (sourceKey === "workplace" || sourceKey === "access") return "access-workplace";
    if (sourceKey === "ppe") return "ppe";
    if (sourceKey === "lighting") return "lighting";
    if (sourceKey === "transportCleanup") {
      if (stageResourceHas(name, "мешки для мусора")) return "consumables";
      if (stageResourceHas(name, "строительные пылесосы", "инвентарь для уборки")) return "cleanup";
      if (stageResourceHas(name, "тачки и телеги")) return "transport";
      return "cleanup";
    }
    if (sourceKey === "equipment") {
      if (stageResourceHas(name, "пневм", "нейлеры пневматические")) return "pneumatic";
      if (stageResourceHas(name, "сварочные аппараты", "аппараты для сварки пластиковых труб")) return "welding";
      if (stageResourceHas(name, "бетоносмесители", "вибраторы для бетона", "виброплиты", "виброрейки", "вибротрамбовки", "строительные тазы")) return "concrete";
      if (stageResourceHas(name, "дренажные насосы", "мотопомпы", "насосные станции", "циркуляционные насосы", "гидроаккумуляторы", "магистральные фильтры")) return "water";
      if (stageResourceHas(name, "газовые тепловые пушки", "осушители воздуха")) return "climate";
      if (stageResourceHas(name, "компрессоры")) return "compressors";
      if (stageResourceHas(name, "мотобуры")) return "ground-drilling";
      if (stageResourceHas(name, "краскоступы")) return "flooring";
      return "equipment";
    }
    return "equipment";
  };

  const operationFunctionalResourceItems = (operation) => {
    const seen = new Set();
    const items = [];
    for (const { key: sourceKey } of rawResourceGroupDefs) {
      for (const item of operation?.resources?.[sourceKey] || []) {
        const token = String(item.categoryId || item.categoryName || item.name || "");
        if (!token || seen.has(token)) continue;
        seen.add(token);
        items.push({ item, sourceKey, functionalKey: stageFunctionalGroupKey(item, sourceKey) });
      }
    }
    return items;
  };
  const resourceItemsForGroup = (operation, definition) => sortStageCategories(
    operationFunctionalResourceItems(operation)
      .filter(({ functionalKey }) => functionalKey === definition.key)
      .map(({ item }) => item),
    (item) => dnsCategoryById.get(String(item.categoryId)),
  );

  // Правило V60 сохраняется поверх новой функциональной декомпозиции V61:
  // 1 категория — сразу категория; 2 категории — их названия в заголовке перехода; 3+ — функциональное название блока.
  const resourceItemDisplayName = (item) => dnsCategoryById.get(String(item.categoryId))?.name || item.name;
  const resourceGroupDisplayName = (definition, items) => items.length === 2
    ? items.map(resourceItemDisplayName).join(", ")
    : definition.title;

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
    const resources = Object.fromEntries(rawResourceGroupDefs.map(({ key }) => [key, (definition?.[key] || [])
      .map(normalizeResourceItem)
      .filter((item) => item.categoryId)]));
    const allResources = rawResourceGroupDefs.flatMap(({ key }) => resources[key]);
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

  [...FULL.categories, ...window.WORK_STAGES_V35.categories].forEach((category) => {
    if (v59IsPlanTitle(category.name || category.dnsName)) {
      category.plan = true;
      category.planReason = "Переведено в «План» по списку пользователя V59";
    }
  });
  const dnsCategoryById = new Map([...FULL.categories, ...window.WORK_STAGES_V35.categories].map((item) => [String(item.id), item]));
  let showPlanCategories = true;
  const isPlanCategory = (category) => Boolean(category?.plan) || category?.productCount === 0;
  FULL.meta.stageCount = window.WORK_STAGES_V35.stages.length;
  const sortStageCategories = (items, categoryOf = (item) => item) => sortFinalCategories(items, {
    planOf: (item) => isPlanCategory(categoryOf(item)),
    idOf: (item) => categoryOf(item)?.id || item?.categoryId || "",
    titleOf: (item) => categoryOf(item)?.name || item?.name || "",
  });
  const productCountLabel = (count) => {
    if (count === null || count === undefined || count === "") return "Количество не подтверждено";
    const n = Number(count);
    if (!Number.isFinite(n)) return "Количество не подтверждено";
    const mod100 = Math.abs(n) % 100;
    const mod10 = Math.abs(n) % 10;
    const word = mod100 >= 11 && mod100 <= 14 ? "товаров" : mod10 === 1 ? "товар" : mod10 >= 2 && mod10 <= 4 ? "товара" : "товаров";
    return `${n} ${word}`;
  };
  const categoryMeta = (category) => isPlanCategory(category) ? "План" : productCountLabel(category?.productCount);
  const categoryCardClass = (category) => isPlanCategory(category) ? "plan-category-card" : "";
  const categoryIsVisible = (category) => showPlanCategories || !isPlanCategory(category);
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
    cleanup: '<svg viewBox="0 0 24 24"><path d="M4 18h9l-1.5 3h-9zM14 5l5 3-5 9H9l4-7-2-1 1.5-3z"/><circle cx="18" cy="18" r="2"/><path d="M13 18h3"/></svg>',
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
    const isPlan = Boolean(node.plan) || node.productCount === 0;
    if (targets.length === 1 && !isPlan) {
      return iconCard({
        name: node.title,
        meta: "Категория DNS",
        tag: "a",
        attrs: `href="${escapeHtml(targets[0].url)}" target="_blank" rel="noopener"`,
        context: "dns",
      });
    }
    const badge = targets.length > 1 ? `<b class="icon-status">${targets.length}</b>` : "";
    return iconCard({ name: node.title, meta: isPlan ? "План" : (targets.length > 1 ? `${targets.length} категории DNS` : "Категория"), badge, className: isPlan ? "plan-category-card" : "", attrs: navAttrs("type-node", node.id) });
  }

  function taxCategoryIconCard(taxCategory, placementGroupId = "") {
    const targets = targetsFor(taxCategory);
    const isPlan = Boolean(taxCategory.plan) || v59IsPlanTitle(taxCategory.name);
    const meta = isPlan ? "План" : (targets.length === 0 ? "Требуется сопоставление" : targets.length === 1 ? "1 категория DNS" : `${targets.length} категорий DNS`);
    const badge = isPlan ? "" : (targets.length === 0 ? '<b class="icon-status warning">Нет ссылки</b>' : targets.length > 1 ? `<b class="icon-status">${targets.length}</b>` : "");
    return iconCard({ name: taxCategory.name, meta, badge, className: isPlan ? "plan-category-card" : "", attrs: navAttrs("tax-category", taxCategory.id, placementGroupId) });
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
        <button id="plan-toggle" class="plan-toggle-button" type="button" data-action="toggle-plan" aria-pressed="false">Скрыть «План»</button>
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
  const planToggle = document.getElementById("plan-toggle");
  const syncPlanToggle = () => {
    if (!planToggle) return;
    planToggle.textContent = showPlanCategories ? "Скрыть «План»" : "Показать «План»";
    planToggle.setAttribute("aria-pressed", showPlanCategories ? "false" : "true");
    planToggle.classList.toggle("active", !showPlanCategories);
  };
  syncPlanToggle();

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
      routeId: "N0001",
      categories: ["Шуруповёрты и дрели-шуруповёрты", "Дрели", "Перфораторы", "Углошлифовальные машины (УШМ)"],
    },
    {
      name: "Оснастка и расходные материалы",
      routeId: "N0177",
      categories: ["Наборы сверл", "Пильные диски", "Отрезные и обдирочные диски"],
    },
    {
      name: "Измерение и разметка",
      routeId: "N0296",
      categories: ["Лазерные нивелиры и уровни", "Лазерные дальномеры", "Рулетки"],
    },
    {
      name: "Строительная и силовая техника",
      routeId: "N0329",
      categories: ["Электрогенераторы", "Бетоносмесители", "Строительные пылесосы"],
    },
  ];

  function popularCategoryCard(group) {
    const categories = group.categories.map((name) => dnsCategoryByName.get(name)).filter(Boolean);
    const typeRoot = typeNodeById.get(group.routeId);
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
    const categories = sortStageCategories(operation.categoryIds.map((id) => dnsCategoryById.get(String(id))).filter(Boolean));
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
    const allCategories = categories;
    const visibleCategories = allCategories.filter(categoryIsVisible);
    const showCategoriesDirectly = allCategories.length < 5 && operation.forceGroup !== true;
    const cards = showCategoriesDirectly
      ? visibleCategories.map((category) => iconCard({
          name: category.name, meta: categoryMeta(category), tag: "a", context: "dns", className: categoryCardClass(category),
          attrs: `href="${escapeHtml(category.url)}" target="_blank" rel="noopener"`,
        })).join("")
      : resourceGroupDefs.map((definition) => {
          const allItems = resourceItemsForGroup(operation, definition);
          const items = allItems.filter((item) => categoryIsVisible(dnsCategoryById.get(String(item.categoryId))));
          return { definition, items };
        })
          .filter(({ items }) => items.length)
          .map(({ definition, items }) => {
            if (items.length === 1) {
              const item = items[0];
              const category = dnsCategoryById.get(String(item.categoryId));
              if (!category) return "";
              return iconCard({
                name: category.name || item.name, meta: categoryMeta(category), tag: "a", context: "dns", className: categoryCardClass(category),
                attrs: `href="${escapeHtml(category.url)}" target="_blank" rel="noopener"`,
              });
            }
            return iconCard({
              name: resourceGroupDisplayName(definition, items),
              meta: items.length === 2 ? definition.title : `${items.length} категорий`,
              context: `resource:${definition.icon}`,
              attrs: navAttrs("resource-group", String(stage.id), `${workIndex}:${operationIndex}:${definition.key}`),
            });
          }).join("");
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(heading)}</h1><p class="stage-description">${showCategoriesDirectly ? "Выберите категорию." : "Выберите, что нужно для работы."}</p></section>
      ${cards ? `<section class="icon-card-grid ${showCategoriesDirectly ? "category-selection-grid" : "resource-navigation-grid"}">${cards}</section>` : `<section class="plan-empty-state"><strong>Все категории этой работы отмечены как «План».</strong><span>Нажмите «Показать «План»» в верхней панели, чтобы вернуть их.</span></section>`}`;
  }

  function renderResourceGroup() {
    const stage = visibleStages.find((item) => String(item.id) === state.id);
    const [wi, oi, key] = state.extra.split(":");
    const work = stage?.works?.[Number(wi)];
    const operation = work?.operations?.[Number(oi)];
    const definition = resourceGroupDefs.find((item) => item.key === key);
    const allItems = definition ? resourceItemsForGroup(operation, definition) : [];
    const items = allItems.filter((item) => categoryIsVisible(dnsCategoryById.get(String(item.categoryId))));
    if (!stage || !work || !operation || !definition || !allItems.length) return renderNotFound();
    const crumbs = [{ name: "Каталог", kind: "home" }, { name: "Этапы работ", kind: "stages" },
      { name: stage.name, kind: "stage", id: String(stage.id) }];
    if (work.operations.length > 1) crumbs.push({ name: work.name, kind: "work", id: String(stage.id), extra: wi });
    crumbs.push({ name: work.operations.length > 1 ? operation.name : work.name, kind: "operation", id: String(stage.id), extra: `${wi}:${oi}` });
    const groupDisplayName = resourceGroupDisplayName(definition, items);
    crumbs.push({ name: groupDisplayName });
    return `${breadcrumbs(crumbs)}
      <section class="page-intro compact-intro"><h1>${escapeHtml(groupDisplayName)}</h1><p class="stage-description">${escapeHtml(work.operations.length > 1 ? operation.name : work.name)}</p></section>
      ${items.length ? `<section class="icon-card-grid category-selection-grid">${items.map((item) => {
        const category = dnsCategoryById.get(String(item.categoryId));
        return iconCard({ name: item.name, meta: categoryMeta(category), tag: "a", context: "dns", className: categoryCardClass(category),
          attrs: `href="${escapeHtml(category.url)}" target="_blank" rel="noopener"` });
      }).join("")}</section>` : `<section class="plan-empty-state"><strong>Все категории этой группы отмечены как «План».</strong><span>Нажмите «Показать «План»» в верхней панели, чтобы вернуть их.</span></section>`}`;
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
      <section class="page-intro"><span class="stage-eyebrow">ЭТАП ${String(stage.id).padStart(2, "0")} / ${visibleStages.length}</span><h1>${escapeHtml(stage.name)}</h1><p class="stage-description">${escapeHtml(stage.description)}</p></section>
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
    const resourceTree = (stage, wi, oi) => {
      const operation = stage.works[wi].operations[oi];
      const allCategories = operation.categoryIds.map((id) => dnsCategoryById.get(String(id))).filter(Boolean);
      const categories = allCategories.filter(categoryIsVisible);
      if (allCategories.length < 5 && operation.forceGroup !== true) {
        return `<ul>${categories.map((category) => `<li><a href="${escapeHtml(category.url)}" target="_blank" rel="noopener">${escapeHtml(category.name)}${isPlanCategory(category) ? " — План" : ""}</a></li>`).join("")}</ul>`;
      }
      return resourceGroupDefs.map((definition) => {
        const items = resourceItemsForGroup(operation, definition).filter((item) => categoryIsVisible(dnsCategoryById.get(String(item.categoryId))));
        return { definition, items };
      })
        .filter(({ items }) => items.length)
        .map(({ definition, items }) => {
          if (items.length === 1) {
            const item = items[0];
            const category = dnsCategoryById.get(String(item.categoryId));
            if (!category) return "";
            return `<ul><li><a href="${escapeHtml(category.url)}" target="_blank" rel="noopener">${escapeHtml(item.name)}${isPlanCategory(category) ? " — План" : ""}</a></li></ul>`;
          }
          const label = resourceGroupDisplayName(definition, items);
          const meta = items.length === 2 ? `<small>${escapeHtml(definition.title)}</small>` : "";
          return `<details><summary><strong>${escapeHtml(label)}</strong>${meta}</summary><ul>${items.map((item) => {
            const category = dnsCategoryById.get(String(item.categoryId));
            if (!category) return "";
            return `<li><a href="${escapeHtml(category.url)}" target="_blank" rel="noopener">${escapeHtml(item.name)}${isPlanCategory(category) ? " — План" : ""}</a></li>`;
          }).join("")}</ul></details>`;
        }).join("");
    };
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
    if (action.dataset.action === "toggle-plan") {
      showPlanCategories = !showPlanCategories;
      syncPlanToggle();
      renderPage();
      if (modalRoot.innerHTML) renderTree();
    }
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
