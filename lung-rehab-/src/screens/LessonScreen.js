import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, COLORS, Disclaimer } from '../components/SharedComponents';
import { lessonsData } from '../data/lessonsData';

export default function LessonScreen({ route, navigation }) {
  const { lesson, lessonIndex, totalLessons } = route.params;
  const { t, language, markLessonComplete, lessonProgress } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [lesson.id]);

  const isDone = lessonProgress[lesson.id];
  const hasPrev = lessonIndex > 0;
  const hasNext = lessonIndex < totalLessons - 1;

  const handleNext = async () => {
    if (!isDone) await markLessonComplete(lesson.id);
    if (hasNext) {
      const nextLesson = lessonsData[lessonIndex + 1];
      navigation.replace('Lesson', { lesson: nextLesson, lessonIndex: lessonIndex + 1, totalLessons });
    } else {
      markLessonComplete(lesson.id);
      navigation.goBack();
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevLesson = lessonsData[lessonIndex - 1];
      navigation.replace('Lesson', { lesson: prevLesson, lessonIndex: lessonIndex - 1, totalLessons });
    }
  };

  const title = language === 'ru' ? lesson.titleRu : lesson.titleKz;
  const goal = language === 'ru' ? lesson.goalRu : lesson.goalKz;
  const content = language === 'ru' ? lesson.contentRu : lesson.contentKz;
  const keyPoints = language === 'ru' ? lesson.keyPointsRu : lesson.keyPointsKz;

  // Simple markdown-like rendering
  const renderContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={i} style={styles.boldHeading}>
            {line.replace(/\*\*/g, '')}
          </Text>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('❗')) {
        return (
          <Text key={i} style={styles.bulletItem}>{line}</Text>
        );
      }
      if (line.startsWith('✅')) {
        return <Text key={i} style={styles.checkItem}>{line}</Text>;
      }
      if (line === '') return <View key={i} style={{ height: 8 }} />;
      return (
        <Text key={i} style={styles.paragraph}>{line}</Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          <Text style={styles.backText}>{t('backToCourse')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Lesson number + title */}
          <View style={styles.lessonHeader}>
            <View style={styles.lessonNumBadge}>
              <Text style={styles.lessonNumText}>
                {t('lessonPrefix').toUpperCase()} {lesson.id}
              </Text>
            </View>
            <Text style={styles.lessonTitle}>{title}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            {lessonsData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === lessonIndex && styles.progressDotActive,
                  lessonProgress[lessonsData[i].id] && styles.progressDotDone,
                ]}
              />
            ))}
          </View>

          {/* Goal */}
          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIconBg}>
                <Ionicons name="flag" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.goalTitle}>{t('lessonGoal')}</Text>
            </View>
            <Text style={styles.goalText}>{goal}</Text>
          </Card>

          {/* Content */}
          <Card style={styles.contentCard}>
            {renderContent(content)}
          </Card>

          {/* Key Points */}
          <Card style={styles.keyPointsCard}>
            <View style={styles.keyPointsHeader}>
              <View style={styles.goalIconBg}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.goalTitle}>{t('keyPoints')}</Text>
            </View>
            {keyPoints.map((point, i) => (
              <View key={i} style={styles.keyPoint}>
                <View style={styles.keyPointDot} />
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </Card>

          <Disclaimer />

          {/* Navigation */}
          <View style={styles.navRow}>
            {hasPrev ? (
              <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
                <Text style={styles.prevBtnText}>{t('prevLesson')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {hasNext ? t('nextLesson') : t('completedLesson')}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
  container: { flex: 1, paddingHorizontal: 16 },
  lessonHeader: { marginBottom: 16, marginTop: 8 },
  lessonNumBadge: {
    backgroundColor: COLORS.primary + '15', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8,
  },
  lessonNumText: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 1 },
  lessonTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, lineHeight: 32 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressDot: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
  },
  progressDotActive: { backgroundColor: COLORS.primary, opacity: 0.5 },
  progressDotDone: { backgroundColor: COLORS.primary },
  goalCard: { backgroundColor: COLORS.primary + '08', borderWidth: 1, borderColor: COLORS.primary + '20' },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  goalIconBg: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  goalTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  goalText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  contentCard: { gap: 4 },
  boldHeading: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 },
  paragraph: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  bulletItem: { fontSize: 14, color: COLORS.text, lineHeight: 22, paddingLeft: 4 },
  checkItem: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  keyPointsCard: { backgroundColor: '#F0F9F6', borderWidth: 1, borderColor: COLORS.primary + '20' },
  keyPointsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  keyPoint: { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  keyPointDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.primary, marginTop: 6,
  },
  keyPointText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 20 },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  prevBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  nextBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14,
  },
  nextBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
