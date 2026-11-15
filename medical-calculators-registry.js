// The unique legacy inventory. Existing improved tools retain their current routes.
window.MEDICAL_CALCULATORS = [
  {
    id: 'score2', title: 'SCORE2', category: 'Сердечно-сосудистые риски',
    description: '10-летний риск фатальных и нефатальных сердечно-сосудистых событий.',
    search: 'score2 сердечно сосудистый риск профилактика лпнп apob',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=s2', migrated: false
  },
  {
    id: 'score2op', title: 'SCORE2-OP', category: 'Сердечно-сосудистые риски',
    description: 'Оценка сердечно-сосудистого риска у пациентов пожилого возраста.',
    search: 'score2op score2-op score2 op пожилые старше 70 сердечно сосудистый риск',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=op', migrated: false
  },
  {
    id: 'score2diabetes', title: 'SCORE2-Diabetes', category: 'Сердечно-сосудистые риски',
    description: 'Оценка сердечно-сосудистого риска при сахарном диабете 2 типа.',
    search: 'score2diabetes score2-diabetes score2 diabetes сахарный диабет сд2 сердечно сосудистый риск',
    route: 'Медицинские_калькуляторы.html?tool=score2diabetes', migrated: true
  },
  {
    id: 'prevent', title: 'PREVENT / PCE', category: 'Сердечно-сосудистые риски',
    description: '10-летний риск атеросклеротических сердечно-сосудистых заболеваний.',
    search: 'prevent pce pooled cohort equations acc aha риск атеросклероз ссз',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=pr', migrated: false
  },
  {
    id: 'cadptp', title: 'Вероятность ИБС — ESC', category: 'Сердечно-сосудистые риски',
    description: 'Оценка претестовой вероятности обструктивной ишемической болезни сердца.',
    search: 'cadptp cad ptp pre-test probability esc ибс ишемическая болезнь сердца боль грудь',
    route: 'Медицинские_калькуляторы.html?tool=cadptp', migrated: true
  },
  {
    id: 'dlcn', title: 'DLCN — семейная гиперхолестеринемия', category: 'Сердечно-сосудистые риски',
    description: 'Критерии Голландской липидной клиники для диагностики СГХС.',
    search: 'dlcn голландские критерии семейная гиперхолестеринемия сгхс генетика лпнп',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=dl', migrated: false
  },
  {
    id: 'afstroke', title: 'CHA₂DS₂-VA / CHA₂DS₂-VASc', category: 'Сердечно-сосудистые риски',
    description: 'Оценка риска инсульта и тромбоэмболий при фибрилляции предсердий.',
    search: 'afstroke cha2ds2-va cha2ds2-vasc cha2ds2 vasc фп фибрилляция предсердий инсульт антикоагуляция',
    route: 'Медицинские_калькуляторы.html?tool=afstroke', migrated: true
  },
  {
    id: 'hasbled', title: 'HAS-BLED', category: 'Сердечно-сосудистые риски',
    description: 'Оценка риска кровотечений у пациентов с фибрилляцией предсердий.',
    search: 'hasbled has-bled has bled риск кровотечений фибрилляция предсердий антикоагуляция ноак',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=hbled', migrated: false
  },
  {
    id: 'grace', title: 'GRACE ACS', category: 'Острые состояния',
    description: 'Оценка риска при остром коронарном синдроме по шкале GRACE.',
    search: 'grace acs окс острый коронарный синдром инфаркт риск',
    route: 'Медицинские_калькуляторы.html?tool=grace', migrated: true
  },
  {
    id: 'precisedapt', title: 'PRECISE-DAPT', category: 'Сердечно-сосудистые риски',
    description: 'Оценка риска кровотечений при двойной антиагрегантной терапии.',
    search: 'precisedapt precise-dapt precise dapt кровотечения двойная антиагрегантная терапия',
    route: 'Медицинские_калькуляторы.html?tool=precisedapt', migrated: true
  },
  {
    id: 'qtc', title: 'QTc', category: 'Сердечно-сосудистые риски',
    description: 'Коррекция интервала QT с учётом частоты сердечных сокращений.',
    search: 'qtc qt экг интервал коррекция чсс аритмия базетт фридеричиа',
    route: 'Медицинские_калькуляторы.html?tool=qtc', migrated: true
  },
  {
    id: 'vte', title: 'Подозрение на ВТЭО', category: 'Острые состояния',
    description: 'Оценка клинической вероятности венозных тромбоэмболических осложнений.',
    search: 'vte втэо тромбоз тромбоэмболия тэла wells женева geneva d-димер',
    route: 'Медицинские_калькуляторы.html?tool=vte', migrated: true
  },
  {
    id: 'pneumonia', title: 'CRB-65 / CURB-65', category: 'Острые состояния',
    description: 'Оценка тяжести внебольничной пневмонии.',
    search: 'pneumonia crb-65 curb-65 crb65 curb65 пневмония тяжесть госпитализация',
    route: 'Медицинские_калькуляторы.html?tool=pneumonia', migrated: true
  },
  {
    id: 'sorethroat', title: 'FeverPAIN / Centor / McIsaac', category: 'Острые состояния',
    description: 'Оценка вероятности стрептококковой инфекции при боли в горле.',
    search: 'sorethroat feverpain centor mcisaac центор макайзек боль горло фарингит тонзиллит стрептококк',
    route: 'Медицинские_калькуляторы.html?tool=sorethroat', migrated: true
  },
  {
    id: 'bmi', title: 'ИМТ и антропометрия', category: 'Антропометрия',
    description: 'Индекс массы тела, окружность талии и оценка весовых рисков.',
    search: 'bmi имт антропометрия масса тела ожирение талия рост вес',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=bmi', migrated: false
  },
  {
    id: 'egfr', title: 'Функция почек — CKD-EPI', category: 'Лабораторные расчёты',
    description: 'Расчёт СКФ, стадия ХБП, альбуминурия и коррекция доз препаратов.',
    search: 'egfr скф почки хбп ckd ckd-epi ckdepi креатинин альбуминурия kdigo',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=ckd', migrated: false
  },
  {
    id: 'egfrcys', title: 'СКФ с цистатином C', category: 'Лабораторные расчёты',
    description: 'Оценка скорости клубочковой фильтрации с использованием цистатина C.',
    search: 'egfrcys egfr скф почки цистатин c cystatin ckd-epi креатинин',
    route: 'Медицинские_калькуляторы.html?tool=egfrcys', migrated: true
  },
  {
    id: 'electrolytes', title: 'Электролиты, осмолярность и КЩС', category: 'Лабораторные расчёты',
    description: 'Расчёты электролитного и кислотно-щелочного состояния.',
    search: 'electrolytes электролиты осмолярность осмоляльность кщс натрий кальций анионная разница',
    route: 'Медицинские_калькуляторы.html?tool=electrolytes', migrated: true
  },
  {
    id: 'mentzer', title: 'Индекс Ментцера', category: 'Лабораторные расчёты',
    description: 'Индекс Ментцера для дифференциальной оценки микроцитарной анемии.',
    search: 'mentzer ментцер индекс анемия микроцитоз талассемия железодефицит mcv эритроциты',
    route: 'Медицинские_калькуляторы.html?tool=mentzer', migrated: true
  },
  {
    id: 'tsat', title: 'TSAT — насыщение трансферрина', category: 'Лабораторные расчёты',
    description: 'Расчёт процента насыщения трансферрина железом.',
    search: 'tsat насыщение трансферрина железо ожсс трансферрин железодефицит анемия',
    route: 'Медицинские_калькуляторы.html?tool=tsat', migrated: true
  },
  {
    id: 'fib4', title: 'FIB-4 — стеатоз и фиброз печени', category: 'Печень',
    description: 'Комплексная оценка стеатоза и риска фиброза печени.',
    search: 'fib4 fib-4 печень фиброз стеатоз жировой гепатоз масжп нажбп hsi fli nfs',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=liver', migrated: false
  },
  {
    id: 'maf5', title: 'MAF-5', category: 'Печень',
    description: 'Оценка риска фиброза печени по модели MAF-5.',
    search: 'maf5 maf-5 печень фиброз масжп нажбп метаболическая болезнь печени',
    route: 'Медицинские_калькуляторы.html?tool=maf5', migrated: true
  },
  {
    id: 'liverpro', title: 'LiverPRO', category: 'Печень',
    description: 'Оценка риска фиброза печени по модели LiverPRO.',
    search: 'liverpro liver pro печень фиброз масжп нажбп',
    route: 'Медицинские_калькуляторы.html?tool=liverpro', migrated: true
  },
  {
    id: 'adapt', title: 'PRO-C3 / ADAPT', category: 'Печень',
    description: 'Оценка риска фиброза печени с использованием PRO-C3 и ADAPT.',
    search: 'adapt pro-c3 proc3 pro c3 печень фиброз коллаген',
    route: 'Медицинские_калькуляторы.html?tool=adapt', migrated: true
  },
  {
    id: 'stopbang', title: 'STOP-Bang', category: 'Сон',
    description: 'Скрининговая оценка риска обструктивного апноэ сна.',
    search: 'stopbang stop-bang stop bang апноэ сон храп остановки дыхания',
    route: 'Медицинские_калькуляторы.html?tool=stopbang', migrated: true
  },
  {
    id: 'epworth', title: 'Шкала сонливости Эпворт', category: 'Сон',
    description: 'Оценка выраженности дневной сонливости по шкале Эпворт.',
    search: 'epworth ess эпворт эпуорт сонливость дневная сон',
    route: 'Медицинские_калькуляторы.html?tool=epworth', migrated: true
  },
  {
    id: 'frax', title: 'FRAX', category: 'Кости',
    description: 'Оценка 10-летнего риска остеопоротических переломов.',
    search: 'frax фракс перелом остеопороз кости минеральная плотность бедро',
    route: 'Медицинские_калькуляторы.html?tool=frax', migrated: true
  },
  {
    id: 'phq9', title: 'PHQ-9', category: 'Психическое здоровье',
    description: 'Оценка выраженности депрессивных симптомов за последние две недели.',
    search: 'phq9 phq-9 депрессия настроение скрининг опросник',
    route: 'Клинические_шкалы.html?tool=phq9', migrated: false
  },
  {
    id: 'gad7', title: 'GAD-7', category: 'Психическое здоровье',
    description: 'Скрининговая оценка выраженности симптомов тревоги за последние две недели.',
    search: 'gad7 gad-7 тревога тревожность генерализованное тревожное расстройство опросник',
    route: 'Клинические_шкалы.html?tool=gad7', migrated: false
  },
  {
    id: 'mmse', title: 'MMSE', category: 'Когнитивные функции',
    description: 'Краткая шкала оценки психического статуса и когнитивных функций.',
    search: 'mmse mini mental state examination когнитивные функции память деменция психический статус',
    route: 'Медицинские_калькуляторы.html?tool=mmse', migrated: true
  },
  {
    id: 'cl', title: 'Клинический профиль', category: 'Клинические калькуляторы',
    description: 'Коморбидности, категория риска, цели и комплексный план терапии.',
    search: 'клинический профиль клиника ибс хсн аг диабет фп cha2ds2 vasc терапия',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=cl', migrated: false, catalogOnly: true
  },
  {
    id: 'dm2', title: 'Сахарный диабет 2 типа', category: 'Клинические калькуляторы',
    description: 'Индивидуальная цель HbA1c и алгоритм выбора сахароснижающей терапии.',
    search: 'сахарный диабет сд2 dm2 hba1c гликированный гемоглобин терапия инглт гпп',
    route: 'Калькулятор_Медицинской_суперсилы.html?tool=dm2', migrated: false, catalogOnly: true
  },
  {
    id: 'pain', title: 'Шкала интенсивности боли', category: 'Опросники и шкалы',
    description: 'Оценка боли с мужской или женской визуальной шкалой и автоматической интерпретацией.',
    search: 'шкала интенсивности боли боль болевой синдром вас визуальная аналоговая шкала nrs pain мужчина женщина',
    route: 'Клинические_шкалы.html?tool=pain', migrated: false, catalogOnly: true
  },
  {
    id: 'pss10', title: 'PSS-10', category: 'Опросники и шкалы',
    description: 'Оценка уровня воспринимаемого стресса в течение последнего месяца.',
    search: 'pss-10 pss10 стресс воспринимаемый напряжение опросник',
    route: 'Клинические_шкалы.html?tool=pss10', migrated: false, catalogOnly: true
  },
  {
    id: 'sss8', title: 'SSS-8', category: 'Опросники и шкалы',
    description: 'Русскоязычная шкала выраженности восьми групп соматических симптомов.',
    search: 'sss-8 sss8 соматические симптомы соматизация телесные жалобы опросник',
    route: 'Клинические_шкалы.html?tool=sss8', migrated: false, catalogOnly: true
  },
  {
    id: 'bfi', title: 'Краткий опросник усталости BFI', category: 'Опросники и шкалы',
    description: 'Выраженность усталости и её влияние на повседневную активность за последние 24 часа.',
    search: 'bfi усталость слабость утомление истощение краткий опросник',
    route: 'Клинические_шкалы.html?tool=bfi', migrated: false, catalogOnly: true
  },
  {
    id: 'health-wheel', title: 'Колесо здоровья', category: 'Опросники и шкалы',
    description: 'Наглядная самооценка двенадцати областей здоровья и качества жизни.',
    search: 'колесо здоровья качество жизни энергия сон питание самочувствие стресс отношения',
    route: 'Клинические_шкалы.html?tool=health-wheel', migrated: false, catalogOnly: true
  },
  {
    id: 'bp-monitors', title: 'Валидированные тонометры', category: 'Справочные инструменты',
    description: 'Пятистраничный список проверенных домашних приборов для измерения давления.',
    search: 'тонометры артериальное давление stride bp валидированные проверенные устройства манжета',
    route: 'Клинические_шкалы.html?tool=bp-monitors', migrated: false, catalogOnly: true
  }
];
