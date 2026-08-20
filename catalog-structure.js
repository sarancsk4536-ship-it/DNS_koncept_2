(() => {
  "use strict";

  const macroSections = [
    { id: "power-tools", name: "Электроинструменты", order: 10, image: "assets/type-01-power-tools.webp" },
    { id: "hand-tools", name: "Ручной инструмент", order: 20, image: "assets/type-02-hand-tools.webp" },
    { id: "accessories", name: "Расходные материалы и оснастка", order: 30, image: "assets/type-03-accessories.webp" },
    { id: "power-equipment", name: "Силовая техника", order: 40, image: "assets/type-04-power-equipment.webp" },
    { id: "construction-equipment", name: "Строительное оборудование", order: 50, image: "assets/type-05-construction-equipment.webp" },
    { id: "measuring", name: "Измерительные инструменты", order: 60, image: "assets/type-06-measuring.webp" },
    { id: "welding", name: "Сварочное оборудование", order: 70, image: "assets/type-07-welding.webp" },
  ];

  const groups = [
    {
      id: "fastening-power-tools", macroId: "power-tools", order: 10,
      name: "Крепежный электроинструмент",
      categories: ["Винтовёрт", "Гайковерт", "Отвертка Аккумуляторная", "Шуруповерт", "Шуруповерт ленточный"],
    },
    {
      id: "drilling-impact-power-tools", macroId: "power-tools", order: 20,
      name: "Сверлильно-ударный электроинструмент",
      categories: ["Дрель", "Отбойный молоток", "Перфоратор аккумуляторный", "Перфоратор сетевой"],
    },
    {
      id: "mixing-power-tools", macroId: "power-tools", order: 25,
      name: "Смешивание",
      categories: ["Дрель-миксер"],
    },
    {
      id: "cutting-power-tools", macroId: "power-tools", order: 30,
      name: "Универсальный режущий электроинструмент",
      categories: ["Гравировальные машинки", "Реноватор"],
    },
    {
      id: "hard-material-cutting", macroId: "power-tools", order: 35,
      name: "Резка твердых материалов",
      categories: ["УШМ (Шлифмашина Угловая) Аккумуляторная", "УШМ (Шлифмашина Угловая) Сетевая", "Отрезные пилы", "Диски для отрезных пил", "Штроборез", "Шлифмашина по бетону"],
    },
    {
      id: "woodworking-power-tools", macroId: "power-tools", order: 40,
      name: "Деревообрабатывающий электроинструмент",
      categories: ["Лобзик", "Пила Дисковая", "Пила Сабельная", "Пила Торцовочная", "Рубанок электрический", "Фрезер"],
    },
    {
      id: "grinding-power-tools", macroId: "power-tools", order: 50,
      name: "Шлифовальный электроинструмент",
      categories: ["Полировальная машина", "Прямошлифовальная машина", "Шлифмашина Вибрационная", "Шлифмашина Ленточная", "Шлифмашина Эксцентриковая", "Щеточная шлифмашина"],
    },
    {
      id: "power-guns-batteries", macroId: "power-tools", order: 60,
      name: "Пистолеты и АКБ",
      categories: ["АКБ и ЗУ для электроинструмента", "Краскораспылитель электрический", "Пистолеты клеевые, для герметика", "Степлер электрический", "Фен строительный"],
    },


    {
      id: "screwdrivers", macroId: "hand-tools", order: 10,
      name: "Отвертки",
      categories: ["Набор отвёрток", "Наборы с битами", "Штучные отвертки"],
    },
    {
      id: "wrenches", macroId: "hand-tools", order: 20,
      name: "Ключи",
      categories: ["Наборы ключей", "Разводные и трубные ключи", "Шестигранные ключи"],
    },
    {
      id: "painting-tools", macroId: "hand-tools", order: 30,
      name: "Малярный инструмент",
      categories: ["Ровнение стен", "Скребки", "Шпатели и кельмы", "Валики и кисти"],
    },
    {
      id: "striking-prying-tools", macroId: "hand-tools", order: 40,
      name: "Ударно-рычажный инструмент",
      categories: ["Зубила и кернеры", "Кувалды и кирки", "Ломы, монтировки и гвоздодеры", "Молотки и киянки", "Топор"],
    },
    {
      id: "cutting-hand-tools", macroId: "hand-tools", order: 50,
      name: "Режущий инструмент",
      categories: ["Мультифункциональные ножи", "Пилы и ножовки", "Стамеска, долото и рубанок", "Строительные ножи", "Труборезы"],
    },
    {
      id: "tool-sets", macroId: "hand-tools", order: 60,
      name: "Наборы инструментов",
      categories: ["Набор автоинструмента", "Трещотки", "Универсальный набор инструмента для дома"],
    },
    {
      id: "pliers-tools", macroId: "hand-tools", order: 70,
      name: "Шарнирно-губцевые инструменты",
      categories: ["Бокорезы и кусачки", "Клещи и специализированный ручной инструмент", "Многофункциональные и стандартные пассатижи", "Мультитул", "Наборы шарнирно-губцевого инструмента", "Ножницы и болторезы", "Плоскогубцы, тонкогубцы"],
    },
    {
      id: "electrical-hand-tools", macroId: "hand-tools", order: 80,
      name: "Инструменты для электромонтажа",
      categories: ["Измерители параметров эл.сетей", "Отвертки диэлектрические", "Матрицы для опрессовки и пробивки"],
    },
    {
      id: "clamping-tools", macroId: "hand-tools", order: 90,
      name: "Зажимной инструмент",
      categories: ["Струбцины", "Тиски"],
    },
    {
      id: "tile-tools", macroId: "hand-tools", order: 100,
      name: "Инструменты для работы с плиткой",
      categories: ["Плиткорез"],
    },
    {
      id: "storage-ppe", macroId: "hand-tools", order: 110,
      name: "Хранение инструмента и СИЗ",
      categories: ["Сумки и рюкзаки для хранения", "Ящик для инструмента", "Короба и контейнеры для хранения"],
    },

    {
      id: "drilling-accessories", macroId: "accessories", order: 10,
      name: "Оснастка для сверления",
      categories: ["Коронки (перфоратор, УШМ, дрель)", "Сверла по бетону и камню", "Сверла по дереву (спиральные, перьевые,Форстнера)", "Сверла по металлу", "Сверла по стеклу и плитке", "Ступенчатые сверла"],
    },
    {
      id: "demolition-accessories", macroId: "accessories", order: 20,
      name: "Оснастка для бурения и разрушения",
      categories: ["Буры SDS+/SDS Max", "Долото/зубло перфоратора и отбойного молотка"],
    },
    {
      id: "fastening-accessories", macroId: "accessories", order: 30,
      name: "Оснастка для крепления",
      categories: ["Клеевые стержни", "Наборы бит", "Оснастка для степлеров и нейлеров", "Торцевые головки"],
    },
    {
      id: "cutting-accessories", macroId: "accessories", order: 40,
      name: "Оснастка для режущего инструмента",
      categories: ["Алмазные диски", "Диск пильный", "Лезвия для строительных ножей", "Отрезные диски", "Пилки для электролобзика", "Полотна для ножовок", "Полотно для сабельной пилы"],
    },
    {
      id: "grinding-accessories", macroId: "accessories", order: 50,
      name: "Оснастка для зачистки и шлифования",
      categories: ["Алмазные чашки", "Диски для эксцентриковых шлифмашин", "Лепестковые диски", "Полировальные диски", "Фибровые диски", "Шлифовальные ленты", "Щетки для УШМ"],
    },
    {
      id: "routing-precision-accessories", macroId: "accessories", order: 60,
      name: "Оснастка для фрезерования и точной обработки",
      categories: ["Насадки для гравировальных машин", "Фреза"],
    },
    {
      id: "accessory-sets", macroId: "accessories", order: 70,
      name: "Наборы оснастки",
      categories: ["Набор коронок", "Набор сверл", "Наборы буров и зубил", "Наборы сверл и оснастки", "Насадки для реноваторов"],
    },
    {
      id: "mixing-accessories", macroId: "accessories", order: 75,
      name: "Оснастка для смешивания",
      categories: ["Миксеры для строительных смесей"],
    },
    {
      id: "tool-accessories", macroId: "accessories", order: 80,
      name: "Аксессуары",
      categories: ["Магнитные держатели для бит", "Пылеулавливающий кожух", "Шаблоны для сверления и бурения"],
    },

    {
      id: "pressure-washers", macroId: "power-equipment", order: 10,
      name: "Мойки высокого давления",
      categories: ["Аппарат высокого давления аккумуляторный", "Аппарат высокого давления сетевой", "Пеногенераторы и фильтры для АВД", "Химия для аппаратов высокого давления"],
    },
    {
      id: "power-supply", macroId: "power-equipment", order: 20,
      name: "Электрогенераторы и стабилизаторы",
      categories: ["Силовой Удлинитель", "Стабилизатор Напряжения Стационарный и ИБП", "Электрогенератор"],
    },
    {
      id: "cleaning-equipment", macroId: "power-equipment", order: 30,
      name: "Клининговое оборудование",
      categories: ["Пылесборники и фильтра для строительных пылесосов", "Пылесос строительный"],
    },
    {
      id: "compressors-pneumatics", macroId: "power-equipment", order: 40,
      name: "Компрессоры и пневматический инструмент",
      categories: ["Компрессоры", "Набор пневматического инструмента", "Пневматические шлифовальные машины", "Пневматический монтажный инструмент", "Пневматическое забивное оборудование", "Пневматическое ударное оборудование", "Пневмопистолет", "Распылительный пневмоинструмент", "Шланг для пневматического оборудования"],
    },

    {
      id: "concrete-equipment", macroId: "construction-equipment", order: 10,
      name: "Строительное оборудование",
      categories: ["Бетоносмеситель", "Вибратор для бетона", "Виброплита"],
    },
    {
      id: "workshop-organization", macroId: "construction-equipment", order: 20,
      name: "Организация мастерской",
      categories: ["Домкраты гидравлические", "Домкраты механические", "Стремянки и лестницы", "Фонарь строительный"],
    },
    {
      id: "soldering-equipment", macroId: "construction-equipment", order: 30,
      name: "Паяльное оборудование",
      categories: ["Паяльная станция", "Паяльник электрический", "Присадочные материалы для пайки"],
    },
    {
      id: "machine-tools", macroId: "construction-equipment", order: 40,
      name: "Станочное оборудование",
      categories: ["Пильные станки", "Сверлильный станок", "Строгальные станки", "Стружкоотсос", "Токарный станок", "Шлифовальные и точильные станки"],
    },

    {
      id: "electronic-measuring", macroId: "measuring", order: 10,
      name: "Электронные измерители",
      categories: ["Лазерный дальномер", "Лазерный нивелир", "Оптический нивелир", "Температурные измерители", "Установка, индикация, питание измерителей"],
    },
    {
      id: "manual-measuring", macroId: "measuring", order: 20,
      name: "Измерители без источника питания",
      categories: ["Рулетки, линейки и ленты", "Угольник, транспортиры и малки", "Уровни и отвесы", "Штангенциркули и микрометры"],
    },

    {
      id: "welding-equipment", macroId: "welding", order: 10,
      name: "Сварочное оборудование",
      categories: ["Аппарат для сварки пластиковых труб", "Маска сварочная", "Сварочный аппарат", "Электроды и сварочная проволока", "Насадки для аппарата сварки пластиковых труб"],
    },
  ];

  const slug = (value) => String(value)
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .normalize("NFKD")
    .replace(/[^a-zа-я0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const siteExtensionTargets = {
    "Отрезные пилы": ["5c43b6f896624e77"],
    "Диски для отрезных пил": ["17aa2ae916404e77"],
    "Валики и кисти": ["72bd8d7c447103b6", "91052a62103df8ec"],
    "Короба и контейнеры для хранения": ["2d33b76dd56bac69"],
    "Насадки для аппарата сварки пластиковых труб": ["718a87b97a622cd1"],
  };

  groups.forEach((group) => {
    group.categories = group.categories.map((name, index) => ({
      id: `${group.id}--${String(index + 1).padStart(2, "0")}--${slug(name)}`,
      name,
      order: (index + 1) * 10,
      groupId: group.id,
      macroId: group.macroId,
      origin: siteExtensionTargets[name] ? "site-extension" : "management",
      targetIds: siteExtensionTargets[name] || [],
    }));
  });

  const groupMap = new Map(groups.map((group) => [group.id, group]));
  const categoryMap = new Map(groups.flatMap((group) => group.categories).map((category) => [category.name, category]));
  const fromGroups = (ids, exclude = []) => ids
    .flatMap((id) => groupMap.get(id)?.categories || [])
    .filter((category) => !exclude.includes(category.name))
    .map((category) => category.id);
  const pick = (names) => names.map((name) => categoryMap.get(name)?.id).filter(Boolean);
  const uniqueIds = (ids) => [...new Set(ids)];
  const hardMaterialSteelIds = pick(["УШМ (Шлифмашина Угловая) Аккумуляторная", "УШМ (Шлифмашина Угловая) Сетевая", "Отрезные пилы", "Диски для отрезных пил", "Отрезные диски"]);
  const hardMaterialConcreteIds = pick(["Штроборез", "Шлифмашина по бетону", "УШМ (Шлифмашина Угловая) Аккумуляторная", "УШМ (Шлифмашина Угловая) Сетевая", "Алмазные диски", "Алмазные чашки", "Пылеулавливающий кожух"]);
  const hardMaterialTileIds = pick(["Плиткорез", "УШМ (Шлифмашина Угловая) Аккумуляторная", "УШМ (Шлифмашина Угловая) Сетевая", "Алмазные диски"]);

  const navigationSections = [
    {
      id: "nav-power-tools", name: "Электроинструменты", order: 10, image: "assets/type-01-power-tools.webp",
      groups: [
        { id: "nav-drilling-fastening", name: "Сверление и крепёж", categoryIds: fromGroups(["fastening-power-tools", "drilling-impact-power-tools"]) },
        { id: "nav-mixing", name: "Смешивание", categoryIds: [...fromGroups(["mixing-power-tools", "mixing-accessories"])] },
        {
          id: "nav-hard-materials", name: "Резка твердых материалов",
          categoryIds: uniqueIds([...hardMaterialSteelIds, ...hardMaterialConcreteIds, ...hardMaterialTileIds]),
          subgroups: [
            { id: "steel", name: "Сталь", categoryIds: hardMaterialSteelIds },
            { id: "concrete", name: "Бетон", categoryIds: hardMaterialConcreteIds },
            { id: "tile", name: "Плитка", categoryIds: hardMaterialTileIds },
          ],
        },
        { id: "nav-sawing-cutting", name: "Пиление, рез и обработка дерева", categoryIds: fromGroups(["cutting-power-tools", "woodworking-power-tools"]) },
        { id: "nav-grinding-surface", name: "Шлифование и обработка поверхностей", categoryIds: fromGroups(["grinding-power-tools"]) },
        { id: "nav-painting-mounting", name: "Покраска, нагрев и монтаж", categoryIds: fromGroups(["power-guns-batteries"]) },
      ],
    },
    {
      id: "nav-hand-tools", name: "Ручной инструмент", order: 20, image: "assets/type-02-hand-tools.webp",
      groups: [
        { id: "nav-screwdrivers-wrenches", name: "Отвертки и ключи", categoryIds: fromGroups(["screwdrivers", "wrenches"]) },
        { id: "nav-impact-demolition", name: "Ударный и демонтажный инструмент", categoryIds: fromGroups(["striking-prying-tools"]) },
        { id: "nav-cutting-hand", name: "Резка и обработка материалов", categoryIds: fromGroups(["cutting-hand-tools"]) },
        { id: "nav-pliers-clamping", name: "Шарнирно-губцевый и зажимной инструмент", categoryIds: fromGroups(["pliers-tools", "clamping-tools"]) },
        { id: "nav-finishing-tile", name: "Отделочный и плиточный инструмент", categoryIds: fromGroups(["painting-tools", "tile-tools"]) },
        { id: "nav-tool-sets", name: "Наборы инструментов", categoryIds: fromGroups(["tool-sets"]) },
        { id: "nav-electrical-installation", name: "Электромонтажный инструмент", categoryIds: fromGroups(["electrical-hand-tools"], ["Измерители параметров эл.сетей"]) },
      ],
    },
    {
      id: "nav-accessories", name: "Оснастка и расходные материалы", order: 30, image: "assets/type-03-accessories.webp",
      groups: [
        { id: "nav-drilling-demolition-accessories", name: "Для сверления, бурения и разрушения", categoryIds: [...fromGroups(["drilling-accessories", "demolition-accessories"]), ...pick(["Набор коронок", "Набор сверл", "Наборы буров и зубил", "Наборы сверл и оснастки", "Шаблоны для сверления и бурения"])] },
        { id: "nav-cutting-accessories", name: "Для пиления и реза", categoryIds: [...fromGroups(["cutting-accessories"]), ...pick(["Насадки для реноваторов", "Пылеулавливающий кожух"])] },
        { id: "nav-grinding-accessories", name: "Для шлифования и полирования", categoryIds: [...fromGroups(["grinding-accessories"]), ...pick(["Пылеулавливающий кожух"])] },
        { id: "nav-fastening-accessories", name: "Биты и оснастка для крепления", categoryIds: pick(["Наборы бит", "Магнитные держатели для бит", "Торцевые головки", "Клеевые стержни", "Оснастка для степлеров и нейлеров"]) },
        { id: "nav-routing-accessories", name: "Для фрезерования и точной обработки", categoryIds: fromGroups(["routing-precision-accessories"]) },
        { id: "nav-welding-consumables", name: "Сварочные расходные материалы", categoryIds: pick(["Электроды и сварочная проволока", "Насадки для аппарата сварки пластиковых труб"]) },
      ],
    },
    {
      id: "nav-power-equipment", name: "Силовая техника", order: 40, image: "assets/type-04-power-equipment.webp",
      groups: [
        { id: "nav-power-supply", name: "Автономное электроснабжение", categoryIds: fromGroups(["power-supply"]) },
        { id: "nav-pneumatics", name: "Компрессоры и пневмоинструмент", categoryIds: fromGroups(["compressors-pneumatics"]) },
        { id: "nav-cleaning", name: "Мойки и клининговое оборудование", categoryIds: fromGroups(["pressure-washers", "cleaning-equipment"]) },
      ],
    },
    {
      id: "nav-construction-equipment", name: "Строительное оборудование", order: 50, image: "assets/type-05-construction-equipment.webp",
      groups: [
        { id: "nav-concrete-equipment", name: "Приготовление и уплотнение бетона", categoryIds: fromGroups(["concrete-equipment"]) },
        { id: "nav-machine-tools", name: "Станки и обработка материалов", categoryIds: fromGroups(["machine-tools"]) },
      ],
    },
    {
      id: "nav-measuring", name: "Измерение и контроль", order: 60, image: "assets/type-06-measuring.webp",
      groups: [
        { id: "nav-linear-measuring", name: "Линейные и угловые измерения", categoryIds: pick(["Рулетки, линейки и ленты", "Угольник, транспортиры и малки", "Штангенциркули и микрометры", "Лазерный дальномер"]) },
        { id: "nav-levels-planes", name: "Уровни, плоскости и разметка", categoryIds: pick(["Лазерный нивелир", "Оптический нивелир", "Уровни и отвесы", "Установка, индикация, питание измерителей"]) },
        { id: "nav-technical-control", name: "Температура и электрические параметры", categoryIds: pick(["Температурные измерители", "Измерители параметров эл.сетей"]) },
      ],
    },
    {
      id: "nav-welding-soldering", name: "Сварка и пайка", order: 70, image: "assets/type-07-welding.webp",
      groups: [
        { id: "nav-welding", name: "Сварочное оборудование и расходники", categoryIds: fromGroups(["welding-equipment"]) },
        { id: "nav-soldering", name: "Паяльное оборудование", categoryIds: fromGroups(["soldering-equipment"]) },
      ],
    },
    {
      id: "nav-storage-safety", name: "Хранение, рабочее место и защита", order: 80, image: "assets/type-08-storage.webp",
      groups: [
        { id: "nav-storage", name: "Хранение и переноска", categoryIds: pick(["Сумки и рюкзаки для хранения", "Ящик для инструмента", "Короба и контейнеры для хранения"]) },
        { id: "nav-workplace", name: "Организация рабочего места", categoryIds: fromGroups(["workshop-organization"]) },
      ],
    },
  ];

  // Необязательный дополнительный уровень для крупных смешанных направлений.
  // Если подгрупп нет, пользователь сразу видит категории — пустые и одиночные
  // промежуточные экраны не создаются.
  const subgroupDefinitions = {
    "nav-drilling-fastening": [
      { id: "fastening", name: "Закручивание и крепёж", categoryIds: fromGroups(["fastening-power-tools"]) },
      { id: "drilling-impact", name: "Сверление и ударные работы", categoryIds: fromGroups(["drilling-impact-power-tools"]) },
    ],
    "nav-sawing-cutting": [
      { id: "cutting-universal", name: "Резка и универсальная обработка", categoryIds: fromGroups(["cutting-power-tools"]) },
      { id: "woodworking", name: "Пиление и обработка дерева", categoryIds: fromGroups(["woodworking-power-tools"]) },
    ],
    "nav-screwdrivers-wrenches": [
      { id: "screwdrivers", name: "Отвёртки", categoryIds: fromGroups(["screwdrivers"]) },
      { id: "wrenches", name: "Ключи", categoryIds: fromGroups(["wrenches"]) },
    ],
    "nav-pliers-clamping": [
      { id: "gripping", name: "Захват и удержание", categoryIds: pick(["Клещи и специализированный ручной инструмент", "Многофункциональные и стандартные пассатижи", "Плоскогубцы, тонкогубцы"]) },
      { id: "cutting", name: "Кусачки, ножницы и болторезы", categoryIds: pick(["Бокорезы и кусачки", "Ножницы и болторезы"]) },
      { id: "multi-sets", name: "Мультитулы и наборы", categoryIds: pick(["Мультитул", "Наборы шарнирно-губцевого инструмента"]) },
      { id: "clamping", name: "Зажим и фиксация", categoryIds: fromGroups(["clamping-tools"]) },
    ],
    "nav-drilling-demolition-accessories": [
      { id: "drilling", name: "Для сверления", categoryIds: pick(["Коронки (перфоратор, УШМ, дрель)", "Набор коронок", "Сверла по бетону и камню", "Сверла по дереву (спиральные, перьевые,Форстнера)", "Сверла по металлу", "Сверла по стеклу и плитке", "Ступенчатые сверла", "Набор сверл", "Наборы сверл и оснастки", "Шаблоны для сверления и бурения"]) },
      { id: "demolition", name: "Для бурения и разрушения", categoryIds: pick(["Буры SDS+/SDS Max", "Наборы буров и зубил", "Долото/зубло перфоратора и отбойного молотка"]) },
    ],
    "nav-cutting-accessories": [
      { id: "power-cutting", name: "Для электроинструмента", categoryIds: pick(["Алмазные диски", "Диск пильный", "Отрезные диски", "Пилки для электролобзика", "Полотно для сабельной пилы", "Насадки для реноваторов", "Пылеулавливающий кожух"]) },
      { id: "manual-cutting", name: "Для ручного инструмента", categoryIds: pick(["Лезвия для строительных ножей", "Полотна для ножовок"]) },
    ],
    "nav-grinding-accessories": [
      { id: "grinding", name: "Для шлифования", categoryIds: pick(["Алмазные чашки", "Диски для эксцентриковых шлифмашин", "Лепестковые диски", "Фибровые диски", "Шлифовальные ленты"]) },
      { id: "polishing-cleaning", name: "Для полирования, зачистки и пылеудаления", categoryIds: pick(["Полировальные диски", "Щетки для УШМ", "Пылеулавливающий кожух"]) },
    ],
    "nav-pneumatics": [
      { id: "air-source", name: "Компрессоры и подача воздуха", categoryIds: pick(["Компрессоры", "Шланг для пневматического оборудования"]) },
      { id: "pneumatic-tools", name: "Пневматический инструмент", categoryIds: pick(["Набор пневматического инструмента", "Пневматические шлифовальные машины", "Пневматический монтажный инструмент", "Пневматическое забивное оборудование", "Пневматическое ударное оборудование", "Пневмопистолет", "Распылительный пневмоинструмент"]) },
    ],
    "nav-cleaning": [
      { id: "pressure-washers", name: "Мойки высокого давления", categoryIds: fromGroups(["pressure-washers"]) },
      { id: "construction-vacuums", name: "Строительные пылесосы", categoryIds: fromGroups(["cleaning-equipment"]) },
    ],
    "nav-machine-tools": [
      { id: "sawing-drilling", name: "Распил и сверление", categoryIds: pick(["Пильные станки", "Сверлильный станок"]) },
      { id: "forming-finishing", name: "Формообразование и чистовая обработка", categoryIds: pick(["Строгальные станки", "Стружкоотсос", "Токарный станок", "Шлифовальные и точильные станки"]) },
    ],
    "nav-welding": [
      { id: "metal-welding", name: "Сварка металла", categoryIds: pick(["Маска сварочная", "Сварочный аппарат", "Электроды и сварочная проволока"]) },
      { id: "plastic-pipes", name: "Сварка пластиковых труб", categoryIds: pick(["Аппарат для сварки пластиковых труб", "Насадки для аппарата сварки пластиковых труб"]) },
    ],
  };

  navigationSections.forEach((section) => section.groups.forEach((group) => {
    const subgroups = subgroupDefinitions[group.id];
    if (subgroups?.length > 1) group.subgroups = subgroups;
  }));

  // Пользовательские развилки для составных управленческих категорий.
  // Исходный узел и его связи с DNS не дублируются: несколько понятных
  // пользовательских названий ведут к одной исходной категории.
  const virtualSplitDefinitions = {
    "АКБ и ЗУ для электроинструмента": ["Аккумуляторы для инструмента", "Зарядные устройства"],
    "Пистолеты клеевые, для герметика": ["Клеевые пистолеты", "Пистолеты для герметика"],
    "Разводные и трубные ключи": ["Разводные ключи", "Трубные ключи"],
    "Шпатели и кельмы": ["Шпатели", "Кельмы"],
    "Валики и кисти": ["Малярные валики", "Малярные кисти"],
    "Зубила и кернеры": ["Ручные зубила", "Кернеры"],
    "Кувалды и кирки": ["Кувалды", "Кирки"],
    "Ломы, монтировки и гвоздодеры": ["Ломы", "Монтировки", "Гвоздодёры"],
    "Молотки и киянки": ["Молотки", "Киянки"],
    "Пилы и ножовки": ["Ручные пилы", "Ножовки"],
    "Стамеска, долото и рубанок": ["Стамески", "Долота", "Ручные рубанки"],
    "Бокорезы и кусачки": ["Бокорезы", "Кусачки"],
    "Ножницы и болторезы": ["Ножницы по металлу", "Болторезы"],
    "Плоскогубцы, тонкогубцы": ["Плоскогубцы", "Тонкогубцы"],
    "Рулетки, линейки и ленты": ["Рулетки", "Линейки", "Измерительные ленты"],
    "Угольник, транспортиры и малки": ["Угольники", "Транспортиры", "Малки"],
    "Уровни и отвесы": ["Пузырьковые уровни", "Отвесы"],
    "Штангенциркули и микрометры": ["Штангенциркули", "Микрометры"],
    "Стремянки и лестницы": ["Стремянки", "Лестницы"],
    "Электроды и сварочная проволока": ["Сварочные электроды", "Сварочная проволока"],
  };

  const virtualCategories = Object.entries(virtualSplitDefinitions).flatMap(([sourceName, names]) => {
    const source = categoryMap.get(sourceName);
    if (!source) return [];
    return names.map((name, index) => ({
      id: `virtual--${source.id}--${String(index + 1).padStart(2, "0")}--${slug(name)}`,
      name,
      sourceCategoryId: source.id,
      sourceName,
      order: (index + 1) * 10,
    }));
  });

  window.MANAGEMENT_TAXONOMY_V6 = { version: 13, macroSections, groups, navigationSections, virtualCategories };
})();
