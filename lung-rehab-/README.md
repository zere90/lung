# 🫁 Программа реабилитации лёгких — Expo React Native App

## Структура проекта

```
LungRehab/
├── App.js                          # Точка входа, навигация
├── app.json                        # Конфигурация Expo
├── package.json                    # Зависимости
├── babel.config.js
└── src/
    ├── i18n/
    │   └── translations.js         # ✏️ МЕНЯЙТЕ ПЕРЕВОДЫ RU/KZ ЗДЕСЬ
    ├── data/
    │   ├── lessonsData.js          # ✏️ МЕНЯЙТЕ КОНТЕНТ УРОКОВ ЗДЕСЬ
    │   ├── exercisesData.js        # ✏️ МЕНЯЙТЕ УПРАЖНЕНИЯ ЗДЕСЬ
    │   └── planData.js             # ✏️ МЕНЯЙТЕ ПЛАН РЕАБИЛИТАЦИИ ЗДЕСЬ
    ├── context/
    │   └── AppContext.js           # Глобальный стейт, AsyncStorage
    ├── components/
    │   └── SharedComponents.js     # Общие компоненты (Card, ProgressBar...)
    └── screens/
        ├── HomeScreen.js           # Главная страница
        ├── BreathingScreen.js      # Список упражнений дыхания
        ├── BreathingSessionScreen.js # Сессия с таймером
        ├── DiaryScreen.js          # Дневник симптомов
        ├── PlanScreen.js           # План реабилитации
        ├── EducationScreen.js      # Список уроков
        └── LessonScreen.js         # Просмотр урока
```

## Быстрый старт

```bash
# 1. Установите зависимости
npm install

# 2. Запустите приложение
npx expo start

# Затем выберите:
# [a] Android  [i] iOS  [w] Web
```

## Что меняется и где

### 📝 Переводы (RU/KZ)
Файл: `src/i18n/translations.js`
- Добавьте KZ-тексты для всех ключей

### 📚 Уроки
Файл: `src/data/lessonsData.js`
- Заполните поля `titleKz`, `shortKz`, `goalKz`, `contentKz`, `keyPointsKz`
- Контент урока поддерживает простой markdown: `**Заголовок**`, `• Пункт`, `❗ Важно`

### 🫁 Упражнения дыхания
Файл: `src/data/exercisesData.js`
- Добавьте/измените упражнения
- Настройте фазы: `inhale` (вдох), `hold` (задержка), `exhale` (выдох), `pause` (пауза)

### 📅 План реабилитации
Файл: `src/data/planData.js`
- Настройте задания по дням недели (dayOfWeek: 0=Пн...6=Вс)
- Типы задач: `breathing`, `walk`, `exercise`, `diary`

## Цветовая схема
```
primary:    #2E7D6B (основной зелёный)
accent:     #81C784 (светло-зелёный)
background: #F4F7F6 (фон)
```

## Технологии
- Expo SDK 51
- React Navigation (Bottom Tabs + Stack)
- AsyncStorage (локальное хранение)
- Animated API (анимации)
- @expo/vector-icons (иконки Ionicons)
