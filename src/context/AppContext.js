import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const KEYS = {
  LANGUAGE: '@lang',
  SESSIONS: '@sessions',
  DIARY: '@diary',
  PLAN_PROGRESS: '@plan_progress',
  LESSON_PROGRESS: '@lesson_progress',
  STREAK: '@streak',
  LAST_SESSION_DATE: '@last_session_date',
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');
  const [sessions, setSessions] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [planProgress, setPlanProgress] = useState({});
  const [lessonProgress, setLessonProgress] = useState({});
  const [streakDays, setStreakDays] = useState(0);
  const [loading, setLoading] = useState(true);

  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lang, sess, diary, plan, lessons, streak] = await Promise.all([
        AsyncStorage.getItem(KEYS.LANGUAGE),
        AsyncStorage.getItem(KEYS.SESSIONS),
        AsyncStorage.getItem(KEYS.DIARY),
        AsyncStorage.getItem(KEYS.PLAN_PROGRESS),
        AsyncStorage.getItem(KEYS.LESSON_PROGRESS),
        AsyncStorage.getItem(KEYS.STREAK),
      ]);
      if (lang) setLanguage(lang);
      if (sess) setSessions(JSON.parse(sess));
      if (diary) setDiaryEntries(JSON.parse(diary));
      if (plan) setPlanProgress(JSON.parse(plan));
      if (lessons) setLessonProgress(JSON.parse(lessons));
      if (streak) setStreakDays(parseInt(streak));
    } catch (e) {
      console.log('Load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const switchLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
  };

  const saveDiaryEntry = async (entry) => {
    const newEntries = [entry, ...diaryEntries];
    setDiaryEntries(newEntries);
    await AsyncStorage.setItem(KEYS.DIARY, JSON.stringify(newEntries));
  };

  const saveBreathingSession = async (session) => {
    const newSessions = [session, ...sessions];
    setSessions(newSessions);
    await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(newSessions));
    // Update streak
    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem(KEYS.LAST_SESSION_DATE);
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = lastDate === yesterday.toDateString() ? streakDays + 1 : 1;
      setStreakDays(newStreak);
      await AsyncStorage.setItem(KEYS.STREAK, String(newStreak));
      await AsyncStorage.setItem(KEYS.LAST_SESSION_DATE, today);
    }
  };

  const togglePlanTask = async (taskId) => {
    const updated = { ...planProgress, [taskId]: !planProgress[taskId] };
    setPlanProgress(updated);
    await AsyncStorage.setItem(KEYS.PLAN_PROGRESS, JSON.stringify(updated));
  };

  const markLessonComplete = async (lessonId) => {
    const updated = { ...lessonProgress, [lessonId]: true };
    setLessonProgress(updated);
    await AsyncStorage.setItem(KEYS.LESSON_PROGRESS, JSON.stringify(updated));
  };

  // Computed values
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);

  const getWeeklyProgress = () => {
    const { weeklyPlanData } = require('../data/planData');
    const allTasks = weeklyPlanData.flatMap(d => d.tasks);
    if (allTasks.length === 0) return 0;
    const done = allTasks.filter(t => planProgress[t.id]).length;
    return Math.round((done / allTasks.length) * 100);
  };

  return (
    <AppContext.Provider value={{
      language,
      switchLanguage,
      t,
      loading,
      sessions,
      totalSessions,
      totalMinutes,
      streakDays,
      saveBreathingSession,
      diaryEntries,
      saveDiaryEntry,
      planProgress,
      togglePlanTask,
      lessonProgress,
      markLessonComplete,
      getWeeklyProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
};
