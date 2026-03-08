import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, COLORS, Disclaimer, ProgressBar } from '../components/SharedComponents';
import { weeklyPlanData } from '../data/planData';

const TASK_ICONS = {
  breathing: { icon: 'leaf-outline', color: COLORS.primary },
  walk: { icon: 'walk-outline', color: '#26A69A' },
  exercise: { icon: 'barbell-outline', color: '#5C6BC0' },
  diary: { icon: 'document-text-outline', color: '#8D6E63' },
};

export default function PlanScreen({ navigation }) {
  const { t, language, planProgress, togglePlanTask } = useApp();
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7; // Convert Sun=0 to Mon=0

  const [selectedDay, setSelectedDay] = useState(todayDow);

  const dayLabels = t('days');

  // Get week dates (Monday = start)
  const getWeekDates = () => {
    const dates = [];
    const mon = new Date(today);
    mon.setDate(today.getDate() - todayDow);
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const weekDates = getWeekDates();

  const selectedDayData = weeklyPlanData.find(d => d.dayOfWeek === selectedDay);
  const tasks = selectedDayData?.tasks || [];

  // Compute selected day progress
  const completedToday = tasks.filter(t2 => planProgress[t2.id]).length;
  const progressPercent = tasks.length ? Math.round((completedToday / tasks.length) * 100) : 0;

  // Weekly stats
  const allTasks = weeklyPlanData.flatMap(d => d.tasks);
  const allDone = allTasks.filter(t2 => planProgress[t2.id]).length;
  const weeklyPercent = allTasks.length ? Math.round((allDone / allTasks.length) * 100) : 0;

  const isDayComplete = (dow) => {
    const dayData = weeklyPlanData.find(d => d.dayOfWeek === dow);
    if (!dayData || !dayData.tasks.length) return false;
    return dayData.tasks.every(t2 => planProgress[t2.id]);
  };

  const hasDayTask = (dow) => {
    const dayData = weeklyPlanData.find(d => d.dayOfWeek === dow);
    return dayData && dayData.tasks.length > 0;
  };

  const selectedDate = weekDates[selectedDay];
  const dateLabel = selectedDate.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('planTitle')}</Text>
        </View>

        {/* Week selector */}
        <Card style={styles.weekCard}>
          <Text style={styles.weekLabel}>
            {t('weekLabel')}{' '}
            {weekDates[0].getDate()}{' '}— {weekDates[6].getDate()}{' '}
            {weekDates[6].toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ', { month: 'long' })}
          </Text>
          <View style={styles.daysRow}>
            {(Array.isArray(dayLabels) ? dayLabels : ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']).map((label, i) => {
              const isSelected = selectedDay === i;
              const isToday = i === todayDow;
              const done = isDayComplete(i);
              const hasTask = hasDayTask(i);
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
                  onPress={() => setSelectedDay(i)}
                >
                  <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>{label}</Text>
                  <View style={[
                    styles.dayDot,
                    done && { backgroundColor: COLORS.primary },
                    !done && hasTask && isToday && { backgroundColor: COLORS.primary, opacity: 0.5 },
                    !done && !isToday && { backgroundColor: COLORS.border },
                  ]} />
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Selected day progress */}
        <Card style={[styles.progressCard, progressPercent === 100 && styles.progressCardDone]}>
          <View style={styles.progressRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressDayText}>{dateLabel}</Text>
              <Text style={styles.progressTaskText}>
                {completedToday} {language === 'ru' ? 'из' : '/'} {tasks.length} {language === 'ru' ? 'заданий' : 'тапсырма'}
              </Text>
              <ProgressBar value={progressPercent} color="#fff" style={styles.progressBar} />
            </View>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
        </Card>

        {/* Tasks */}
        <Text style={styles.sectionTitle}>{t('todayTasks')}</Text>

        {tasks.length === 0 ? (
          <Card>
            <Text style={{ color: COLORS.subtext, textAlign: 'center' }}>{t('noTasks')}</Text>
          </Card>
        ) : (
          tasks.map(task => {
            const done = planProgress[task.id];
            const icon = TASK_ICONS[task.type] || TASK_ICONS.diary;
            return (
              <TouchableOpacity key={task.id} onPress={() => togglePlanTask(task.id)} activeOpacity={0.8}>
                <Card style={[styles.taskCard, done && styles.taskCardDone]}>
                  <View style={[styles.taskDot, { backgroundColor: done ? COLORS.primary : COLORS.border }]}>
                    {done && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskName, done && styles.taskNameDone]}>
                      {language === 'ru' ? task.nameRu : task.nameKz}
                    </Text>
                    <View style={styles.taskMeta}>
                      <Ionicons name="time-outline" size={12} color={COLORS.subtext} />
                      <Text style={styles.taskMetaText}>
                        {language === 'ru' ? task.timeRu : task.timeKz} • {task.durationMin} {t('duration')}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.taskIcon, { backgroundColor: icon.color + '15' }]}>
                    <Ionicons name={icon.icon} size={18} color={icon.color} />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}

        {/* Weekly summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{allDone}</Text>
              <Text style={styles.summaryLabel}>{t('completedTasks')}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: COLORS.primary }]}>{weeklyPercent}%</Text>
              <Text style={styles.summaryLabel}>{t('weeklyProgressLabel')}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{allTasks.length - allDone}</Text>
              <Text style={styles.summaryLabel}>{t('remaining')}</Text>
            </View>
          </View>
        </Card>

        <Disclaimer />
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  weekCard: { marginBottom: 12 },
  weekLabel: { fontSize: 13, color: COLORS.subtext, marginBottom: 12 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayBtn: { alignItems: 'center', gap: 6, padding: 8, borderRadius: 12, flex: 1 },
  dayBtnSelected: { backgroundColor: COLORS.primary + '15' },
  dayLabel: { fontSize: 12, fontWeight: '600', color: COLORS.subtext },
  dayLabelSelected: { color: COLORS.primary },
  dayDot: { width: 10, height: 10, borderRadius: 5 },
  progressCard: { backgroundColor: COLORS.primary, marginBottom: 16 },
  progressCardDone: { backgroundColor: '#26A69A' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  progressDayText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  progressTaskText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  progressBar: { backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 10 },
  progressPercent: { fontSize: 32, fontWeight: '900', color: '#fff' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  taskCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  taskCardDone: { backgroundColor: '#F0F9F6' },
  taskDot: {
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  taskName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  taskNameDone: { textDecorationLine: 'line-through', color: COLORS.subtext },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  taskMetaText: { fontSize: 12, color: COLORS.subtext },
  taskIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  summaryCard: { marginTop: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryNum: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  summaryLabel: { fontSize: 11, color: COLORS.subtext, marginTop: 2 },
});
