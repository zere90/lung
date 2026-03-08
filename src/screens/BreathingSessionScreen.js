import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Animated, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../components/SharedComponents';

const CIRCLE_SIZE = 200;
const RADIUS = 85;

export default function BreathingSessionScreen({ route, navigation }) {
  const { exercise } = route.params;
  const { t, language, saveBreathingSession } = useApp();

  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(exercise.phases[0].seconds);
  const [totalTimeLeft, setTotalTimeLeft] = useState(exercise.duration * 60);
  const [cycleCount, setCycleCount] = useState(0);

  const circleAnim = useRef(new Animated.Value(0.7)).current;
  const phaseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);
  const phaseTimerRef = useRef(null);

  const phases = exercise.phases;
  const currentPhase = phases[phaseIndex];

  const phaseLabels = {
    inhale: { ru: t('inhale'), kz: t('inhale') },
    hold: { ru: t('hold'), kz: t('hold') },
    exhale: { ru: t('exhale'), kz: t('exhale') },
    pause: { ru: t('pause'), kz: t('pause') },
  };

  const circleTargets = { inhale: 1.0, hold: 1.0, exhale: 0.7, pause: 0.7 };

  const animateCircle = useCallback((phase, duration) => {
    Animated.timing(circleAnim, {
      toValue: circleTargets[phase] || 0.85,
      duration: duration * 900,
      useNativeDriver: true,
    }).start();
    Animated.sequence([
      Animated.timing(phaseAnim, { toValue: 0.7, duration: 150, useNativeDriver: true }),
      Animated.timing(phaseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      clearInterval(phaseTimerRef.current);
      return;
    }

    // Phase countdown
    phaseTimerRef.current = setInterval(() => {
      setPhaseTime(prev => {
        if (prev <= 1) {
          setPhaseIndex(pi => {
            const next = (pi + 1) % phases.length;
            if (next === 0) setCycleCount(c => c + 1);
            const nextPhase = phases[next];
            animateCircle(nextPhase.phaseKey, nextPhase.seconds);
            setTimeout(() => setPhaseTime(nextPhase.seconds), 0);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Total countdown
    intervalRef.current = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(phaseTimerRef.current);
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    animateCircle(currentPhase.phaseKey, currentPhase.seconds);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(phaseTimerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setPhaseIndex(0);
    setPhaseTime(phases[0].seconds);
    setTotalTimeLeft(exercise.duration * 60);
    setCycleCount(0);
    circleAnim.setValue(0.7);
  };

  const handleSave = async () => {
    const minutesCompleted = Math.round((exercise.duration * 60 - totalTimeLeft) / 60);
    await saveBreathingSession({
      exerciseId: exercise.id,
      minutes: minutesCompleted || exercise.duration,
      date: new Date().toISOString(),
      cycles: cycleCount,
    });
    navigation.goBack();
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const phaseLabel = phaseLabels[currentPhase.phaseKey]?.[language] || currentPhase.phaseKey;

  const circleScale = circleAnim;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{language === 'ru' ? exercise.nameRu : exercise.nameKz}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Animated circle */}
        <View style={styles.circleContainer}>
          {/* Outer ring */}
          <View style={styles.outerRing} />
          <Animated.View style={[styles.circle, { transform: [{ scale: circleScale }] }]}>
            <Animated.Text style={[styles.phaseText, { opacity: phaseAnim }]}>
              {isRunning ? phaseLabel.toUpperCase() : ''}
            </Animated.Text>
            <Animated.Text style={[styles.phaseSubText, { opacity: phaseAnim }]}>
              {isRunning ? t('followRhythm') : t('startSession')}
            </Animated.Text>
            {isRunning && (
              <Text style={styles.phaseCountdown}>{phaseTime}</Text>
            )}
          </Animated.View>
        </View>

        {/* Time left */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeDisplay}>{formatTime(totalTimeLeft)}</Text>
          <Text style={styles.timeLabel}>{t('timeLeft')}</Text>
        </View>

        {/* Cycle counter */}
        {cycleCount > 0 && (
          <Text style={styles.cycleText}>
            {t('cycle')} {cycleCount}
          </Text>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {!isRunning ? (
            <TouchableOpacity style={styles.mainBtn} onPress={handleStart}>
              <Ionicons name="play" size={32} color="#fff" />
              <Text style={styles.mainBtnText}>
                {totalTimeLeft < exercise.duration * 60 ? t('resumeSession') : t('startSession')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: '#F6AD55' }]} onPress={handlePause}>
              <Ionicons name="pause" size={32} color="#fff" />
              <Text style={styles.mainBtnText}>{t('pauseSession')}</Text>
            </TouchableOpacity>
          )}

          <View style={{ width: 56 }} />
        </View>
      </View>

      {/* Completion Modal */}
      <Modal visible={isComplete} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.modalTitle}>{t('sessionComplete')}</Text>
            <Text style={styles.modalDesc}>{t('sessionCompleteDesc')}</Text>
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatNum}>{exercise.duration}</Text>
                <Text style={styles.modalStatLabel}>{t('duration')}</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatNum}>{cycleCount}</Text>
                <Text style={styles.modalStatLabel}>{t('cycle')}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{t('saveAndClose')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 },
  circleContainer: { width: CIRCLE_SIZE + 60, height: CIRCLE_SIZE + 60, justifyContent: 'center', alignItems: 'center' },
  outerRing: {
    position: 'absolute', width: CIRCLE_SIZE + 40, height: CIRCLE_SIZE + 40,
    borderRadius: (CIRCLE_SIZE + 40) / 2,
    borderWidth: 2, borderColor: COLORS.primary + '20',
  },
  circle: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  phaseText: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center' },
  phaseSubText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 4 },
  phaseCountdown: { fontSize: 40, fontWeight: '900', color: '#fff', marginTop: 8 },
  timeContainer: { alignItems: 'center' },
  timeDisplay: { fontSize: 52, fontWeight: '900', color: COLORS.text },
  timeLabel: { fontSize: 14, color: COLORS.subtext, marginTop: 4 },
  cycleText: { fontSize: 14, color: COLORS.subtext, fontWeight: '500' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  resetBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  mainBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.primary, borderRadius: 30,
    paddingHorizontal: 28, paddingVertical: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  mainBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%' },
  modalIcon: { marginBottom: 16 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  modalDesc: { fontSize: 15, color: COLORS.subtext, textAlign: 'center', marginTop: 8 },
  modalStats: { flexDirection: 'row', gap: 40, marginVertical: 24 },
  modalStat: { alignItems: 'center' },
  modalStatNum: { fontSize: 32, fontWeight: '800', color: COLORS.primary },
  modalStatLabel: { fontSize: 13, color: COLORS.subtext },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 32, paddingVertical: 14, width: '100%', alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
