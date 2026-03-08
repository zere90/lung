// ============================================================
// ДАННЫЕ ПЛАНА: Меняйте задания по дням недели
// ============================================================

// dayOfWeek: 0=Пн, 1=Вт, 2=Ср, 3=Чт, 4=Пт, 5=Сб, 6=Вс
export const weeklyPlanData = [
  {
    dayOfWeek: 0, // Понедельник
    tasks: [
      { id: 'mon_1', timeRu: '09:00', timeKz: '09:00', durationMin: 8, nameRu: 'Диафрагмальное дыхание', nameKz: 'Диафрагмалық тыныс алу', type: 'breathing' },
      { id: 'mon_2', timeRu: '11:00', timeKz: '11:00', durationMin: 20, nameRu: 'Утренняя прогулка', nameKz: 'Таңертеңгі серуен', type: 'walk' },
      { id: 'mon_3', timeRu: '20:00', timeKz: '20:00', durationMin: 5, nameRu: 'Дневник симптомов', nameKz: 'Симптомдар күнделігі', type: 'diary' },
    ],
  },
  {
    dayOfWeek: 1, // Вторник
    tasks: [
      { id: 'tue_1', timeRu: '09:00', timeKz: '09:00', durationMin: 6, nameRu: 'Дыхание квадратом', nameKz: 'Шаршы тыныс алу', type: 'breathing' },
      { id: 'tue_2', timeRu: '14:00', timeKz: '14:00', durationMin: 15, nameRu: 'Упражнения сидя', nameKz: 'Отырып жаттығулар', type: 'exercise' },
      { id: 'tue_3', timeRu: '20:00', timeKz: '20:00', durationMin: 5, nameRu: 'Дневник симптомов', nameKz: 'Симптомдар күнделігі', type: 'diary' },
    ],
  },
  {
    dayOfWeek: 2, // Среда
    tasks: [
      { id: 'wed_1', timeRu: '09:00', timeKz: '09:00', durationMin: 6, nameRu: 'Дыхание по квадрату', nameKz: 'Шаршы тыныс алу', type: 'breathing' },
      { id: 'wed_2', timeRu: '14:00', timeKz: '14:00', durationMin: 20, nameRu: 'Небольшая прогулка', nameKz: 'Шағын серуен', type: 'walk' },
      { id: 'wed_3', timeRu: '20:00', timeKz: '20:00', durationMin: 5, nameRu: 'Симптомы', nameKz: 'Симптомдар', type: 'diary' },
    ],
  },
  {
    dayOfWeek: 3, // Четверг
    tasks: [
      { id: 'thu_1', timeRu: '09:00', timeKz: '09:00', durationMin: 8, nameRu: 'Диафрагмальное дыхание', nameKz: 'Диафрагмалық тыныс алу', type: 'breathing' },
      { id: 'thu_2', timeRu: '11:00', timeKz: '11:00', durationMin: 10, nameRu: 'Спокойное дыхание', nameKz: 'Тыныш тыныс алу', type: 'breathing' },
      { id: 'thu_3', timeRu: '16:00', timeKz: '16:00', durationMin: 15, nameRu: 'Растяжка', nameKz: 'Созылу', type: 'exercise' },
    ],
  },
  {
    dayOfWeek: 4, // Пятница
    tasks: [
      { id: 'fri_1', timeRu: '09:00', timeKz: '09:00', durationMin: 10, nameRu: 'Глубокое дыхание', nameKz: 'Терең тыныс алу', type: 'breathing' },
      { id: 'fri_2', timeRu: '14:00', timeKz: '14:00', durationMin: 25, nameRu: 'Прогулка', nameKz: 'Серуен', type: 'walk' },
      { id: 'fri_3', timeRu: '20:00', timeKz: '20:00', durationMin: 5, nameRu: 'Дневник симптомов', nameKz: 'Симптомдар күнделігі', type: 'diary' },
    ],
  },
  {
    dayOfWeek: 5, // Суббота
    tasks: [
      { id: 'sat_1', timeRu: '10:00', timeKz: '10:00', durationMin: 8, nameRu: 'Дыхательная гимнастика', nameKz: 'Тыныс гимнастикасы', type: 'breathing' },
      { id: 'sat_2', timeRu: '15:00', timeKz: '15:00', durationMin: 20, nameRu: 'Лёгкие упражнения', nameKz: 'Жеңіл жаттығулар', type: 'exercise' },
    ],
  },
  {
    dayOfWeek: 6, // Воскресенье
    tasks: [
      { id: 'sun_1', timeRu: '10:00', timeKz: '10:00', durationMin: 30, nameRu: 'Прогулка в парке', nameKz: 'Саябақта серуен', type: 'walk' },
      { id: 'sun_2', timeRu: '20:00', timeKz: '20:00', durationMin: 5, nameRu: 'Итоги недели', nameKz: 'Апта қорытындысы', type: 'diary' },
    ],
  },
];
