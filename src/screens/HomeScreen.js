import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Animated, StatusBar, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, COLORS, Disclaimer, ProgressBar } from '../components/SharedComponents';

export default function HomeScreen({ navigation }) {
  const { t, language, switchLanguage, totalSessions, totalMinutes, streakDays, getWeeklyProgress } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const weeklyProgress = getWeeklyProgress();
  const today = new Date();
  const dateStr = today.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const quickActions = [
    {
      icon: 'fitness-outline',
      titleKey: 'breathingExercises',
      descKey: 'breathingExercisesDesc',
      color: '#2E7D6B',
      tab: 'Breathing',
    },
    {
      icon: 'document-text-outline',
      titleKey: 'symptomsTracker',
      descKey: 'symptomsTrackerDesc',
      color: '#5C6BC0',
      tab: 'Diary',
    },
    {
      icon: 'calendar-outline',
      titleKey: 'rehabPlan',
      descKey: 'rehabPlanDesc',
      color: '#26A69A',
      tab: 'Plan',
    },
    {
      icon: 'school-outline',
      titleKey: 'educationSection',
      descKey: 'educationSectionDesc',
      color: '#8D6E63',
      tab: 'Education',
    },
    {
      icon: 'clipboard-outline',
      titleKey: 'testsSection',
      descKey: 'testsSectionDesc',
      color: '#E53E3E',
      tab: 'Tests',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>{t('welcome')}</Text>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => switchLanguage(language === 'ru' ? 'kz' : 'ru')}
          >
            <Text style={styles.langText}>{language === 'ru' ? 'KZ' : 'RU'}</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Weekly Progress Card */}
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{t('weeklyProgress')}</Text>
              <View style={styles.progressIconBg}>
                <Ionicons name="trending-up" size={18} color="#fff" />
              </View>
            </View>
            <Text style={styles.progressPercent}>{weeklyProgress}%</Text>
            <ProgressBar value={weeklyProgress} color="#fff" style={styles.progressBar} />
            <Text style={styles.progressSubtext}>
              {t('exercisesCompleted').replace('%s', weeklyProgress)}
            </Text>
          </Card>

          {/* Stats */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Ionicons name="pulse-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>{totalSessions}</Text>
              <Text style={styles.statLabel}>{t('sessions')}</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="ribbon-outline" size={24} color="#8D6E63" />
              <Text style={styles.statNumber}>{streakDays}</Text>
              <Text style={styles.statLabel}>{t('streakDays')}</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="time-outline" size={24} color="#5C6BC0" />
              <Text style={styles.statNumber}>{totalMinutes}</Text>
              <Text style={styles.statLabel}>{t('minutes')}</Text>
            </Card>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          {quickActions.map((action) => (
            <Card
              key={action.tab}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.tab)}
            >
              <View style={[styles.actionIconBg, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.icon} size={26} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{t(action.titleKey)}</Text>
                <Text style={styles.actionDesc}>{t(action.descKey)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
            </Card>
          ))}

          <Disclaimer />
          <View style={{ height: 20 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingTop: 20, marginBottom: 20,
  },
  welcomeText: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  dateText: { fontSize: 13, color: COLORS.subtext, marginTop: 2 },
  langBtn: {
    backgroundColor: COLORS.primary, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  langText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  progressCard: { backgroundColor: COLORS.primary, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressTitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  progressIconBg: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  progressPercent: { fontSize: 42, fontWeight: '800', color: '#fff', marginBottom: 10 },
  progressBar: { backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 8 },
  progressSubtext: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statNumber: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: 11, color: COLORS.subtext, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginTop: 12, marginBottom: 12 },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionIconBg: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  actionDesc: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
});