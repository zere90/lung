import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, COLORS, Disclaimer } from '../components/SharedComponents';
import { lessonsData } from '../data/lessonsData';

export default function EducationScreen({ navigation }) {
  const { t, language, lessonProgress } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const completedCount = Object.values(lessonProgress).filter(Boolean).length;
  const totalLessons = lessonsData.length;
  const allDone = completedCount === totalLessons;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Ionicons name="school" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.heroTitle}>{t('educationTitle')}</Text>
            <Text style={styles.heroSubtitle}>{t('educationSubtitle')}</Text>
            <View style={styles.heroProgress}>
              <View style={styles.heroProgressBar}>
                <View style={[styles.heroProgressFill, { width: `${(completedCount / totalLessons) * 100}%` }]} />
              </View>
              <Text style={styles.heroProgressText}>{completedCount}/{totalLessons}</Text>
            </View>
          </View>

          {/* Lessons grid */}
          {lessonsData.map((lesson, index) => {
            const done = lessonProgress[lesson.id];
            const isNext = !done && (index === 0 || lessonProgress[index]);
            return (
              <Animated.View
                key={lesson.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20 + index * 5, 0] }) }]
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('Lesson', { lesson, lessonIndex: index, totalLessons })}
                >
                  <Card style={[styles.lessonCard, done && styles.lessonCardDone]}>
                    <View style={[styles.lessonNum, { backgroundColor: done ? COLORS.primary : (isNext ? COLORS.primary + '20' : COLORS.border) }]}>
                      {done ? (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      ) : (
                        <Text style={[styles.lessonNumText, { color: isNext ? COLORS.primary : COLORS.subtext }]}>{lesson.id}</Text>
                      )}
                    </View>
                    <View style={styles.lessonContent}>
                      <Text style={styles.lessonTitle}>
                        {t('lessonPrefix')} {lesson.id}
                      </Text>
                      <Text style={styles.lessonName}>
                        {language === 'ru' ? lesson.titleRu : lesson.titleKz}
                      </Text>
                      <Text style={styles.lessonDesc} numberOfLines={2}>
                        {language === 'ru' ? lesson.shortRu : lesson.shortKz}
                      </Text>
                    </View>
                    <View>
                      {done ? (
                        <Text style={styles.completedBadge}>{t('completedLesson')}</Text>
                      ) : (
                        <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* All complete */}
          {allDone && (
            <Card style={styles.completeCard}>
              <Ionicons name="trophy" size={40} color="#F6AD55" />
              <Text style={styles.completeTitle}>{t('courseComplete')}</Text>
            </Card>
          )}

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
  heroSection: { alignItems: 'center', paddingVertical: 24 },
  heroIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  heroSubtitle: { fontSize: 13, color: COLORS.subtext, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  heroProgress: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, width: '100%' },
  heroProgressBar: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  heroProgressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  heroProgressText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  lessonCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  lessonCardDone: { backgroundColor: '#F0F9F6' },
  lessonNum: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  lessonNumText: { fontSize: 16, fontWeight: '800' },
  lessonContent: { flex: 1 },
  lessonTitle: { fontSize: 11, color: COLORS.subtext, fontWeight: '500', textTransform: 'uppercase' },
  lessonName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  lessonDesc: { fontSize: 12, color: COLORS.subtext, marginTop: 2, lineHeight: 16 },
  completedBadge: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  completeCard: { alignItems: 'center', gap: 12, backgroundColor: '#FFF9E6' },
  completeTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
});
