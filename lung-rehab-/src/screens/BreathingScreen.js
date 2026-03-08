import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, COLORS, DifficultyBadge, Disclaimer, ProgressBar } from '../components/SharedComponents';
import { exercisesData } from '../data/exercisesData';

export default function BreathingScreen({ navigation }) {
  const { t, language, totalSessions, totalMinutes, streakDays, sessions } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

// СТАЛО:
const today = new Date().toDateString();
const completedToday = sessions.filter(
  s => new Date(s.date).toDateString() === today
).length;
const totalToday = exercisesData.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('breathingTitle')}</Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Today's goal */}
          <Card style={styles.goalCard}>
            <View style={styles.goalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalTitle}>{t('todayGoal')}</Text>
                <Text style={styles.goalSub}>
                  {t('completedOf').replace('%s', completedToday).replace('%s', totalToday)}
                </Text>
                <ProgressBar value={(completedToday / totalToday) * 100} color={COLORS.primary} style={{ marginTop: 10 }} />
              </View>
              <Text style={styles.goalPercent}>
                {Math.round((completedToday / totalToday) * 100)}%
              </Text>
            </View>
          </Card>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{totalSessions}</Text>
              <Text style={styles.statLabel}>{t('totalSessions')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{totalMinutes}</Text>
              <Text style={styles.statLabel}>{t('minutes')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{streakDays}</Text>
              <Text style={styles.statLabel}>{t('streakDays')}</Text>
            </View>
          </View>

          {/* Exercises list */}
          {exercisesData.map((ex, i) => (
            <Animated.View
              key={ex.id}
              style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20 + i * 10, 0] }) }] }}
            >
              <Card style={styles.exCard}>
                <View style={styles.exHeader}>
                  <View style={styles.exIconBg}>
                    <Ionicons name="leaf-outline" size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exName}>{language === 'ru' ? ex.nameRu : ex.nameKz}</Text>
                    <Text style={styles.exDesc}>{language === 'ru' ? ex.descRu : ex.descKz}</Text>
                  </View>
                </View>
                <View style={styles.exFooter}>
                  <View style={styles.exMeta}>
                    <Ionicons name="time-outline" size={14} color={COLORS.subtext} />
                    <Text style={styles.exMetaText}>{ex.duration} {t('duration')}</Text>
                  </View>
                  <DifficultyBadge difficulty={ex.difficulty} lang={language} />
                  <TouchableOpacity
                    style={styles.startBtn}
                    onPress={() => navigation.navigate('BreathingSession', { exercise: ex })}
                  >
                    <Text style={styles.startBtnText}>{t('start')}</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </Animated.View>
          ))}

          <Disclaimer />
          <View style={{ height: 20 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  goalCard: { marginBottom: 12 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  goalTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  goalSub: { fontSize: 13, color: COLORS.subtext, marginTop: 2 },
  goalPercent: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.subtext, marginTop: 2, textAlign: 'center' },
  divider: { width: 1, backgroundColor: COLORS.border },
  exCard: { gap: 12 },
  exHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  exIconBg: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  exName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  exDesc: { fontSize: 12, color: COLORS.subtext, marginTop: 2, lineHeight: 16 },
  exFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  exMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  exMetaText: { fontSize: 13, color: COLORS.subtext },
  startBtn: {
    marginLeft: 'auto', backgroundColor: COLORS.primary,
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
