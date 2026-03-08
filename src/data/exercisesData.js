// ============================================================
// ДАННЫЕ УПРАЖНЕНИЙ: Меняйте названия, описания, этапы
// ============================================================

export const exercisesData = [
  {
    id: 'box',
    nameRu: 'Дыхание квадратом (4-4-4-4)',
    nameKz: 'Шаршы тыныс алу (4-4-4-4)',
    descRu: '4-4-4-4 схема дыхания для расслабления и концентрации',
    descKz: 'Демалу және шоғырлану үшін 4-4-4-4 тыныс алу схемасы',
    duration: 6,
    difficulty: 'medium',
    phases: [
      { phaseKey: 'inhale', seconds: 4 },
      { phaseKey: 'hold', seconds: 4 },
      { phaseKey: 'exhale', seconds: 4 },
      { phaseKey: 'pause', seconds: 4 },
    ],
  },
  {
    id: 'deep',
    nameRu: 'Глубокое дыхание',
    nameKz: 'Терең тыныс алу',
    descRu: 'Дышите медленно и глубоко, чтобы увеличить объём лёгких',
    descKz: 'Өкпе көлемін арттыру үшін баяу және терең тыныс алыңыз',
    duration: 5,
    difficulty: 'easy',
    phases: [
      { phaseKey: 'inhale', seconds: 4 },
      { phaseKey: 'hold', seconds: 2 },
      { phaseKey: 'exhale', seconds: 6 },
      { phaseKey: 'pause', seconds: 2 },
    ],
  },
  {
    id: 'pursed',
    nameRu: 'Дыхание с поджатыми губами',
    nameKz: 'Жабылған ерін арқылы тыныс алу',
    descRu: 'Помогает дольше держать дыхательные пути открытыми',
    descKz: 'Тыныс алу жолдарын ұзақ ашық ұстауға көмектеседі',
    duration: 10,
    difficulty: 'easy',
    phases: [
      { phaseKey: 'inhale', seconds: 2 },
      { phaseKey: 'exhale', seconds: 5 },
      { phaseKey: 'pause', seconds: 1 },
    ],
  },
  {
    id: 'diaphragm',
    nameRu: 'Диафрагмальное дыхание',
    nameKz: 'Диафрагмалық тыныс алу',
    descRu: 'Укрепляет диафрагму и улучшает газообмен в лёгких',
    descKz: 'Диафрагманы нығайтады және өкпедегі газ алмасуды жақсартады',
    duration: 8,
    difficulty: 'easy',
    phases: [
      { phaseKey: 'inhale', seconds: 4 },
      { phaseKey: 'hold', seconds: 1 },
      { phaseKey: 'exhale', seconds: 6 },
      { phaseKey: 'pause', seconds: 2 },
    ],
  },
  {
    id: 'resistance',
    nameRu: 'Дыхание с сопротивлением',
    nameKz: 'Кедергімен тыныс алу',
    descRu: 'Улучшенная техника для тренировки дыхательных мышц',
    descKz: 'Тыныс бұлшықеттерін жаттықтыруға арналған жетілдірілген техника',
    duration: 12,
    difficulty: 'hard',
    phases: [
      { phaseKey: 'inhale', seconds: 3 },
      { phaseKey: 'hold', seconds: 2 },
      { phaseKey: 'exhale', seconds: 8 },
      { phaseKey: 'pause', seconds: 2 },
    ],
  },
];
