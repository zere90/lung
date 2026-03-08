import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { Card, COLORS, Disclaimer } from '../components/SharedComponents';
import { qlqC30, qlqLC13 } from '../data/testsData';

const SCALE_4 = [1, 2, 3, 4];
const SCALE_7 = [1, 2, 3, 4, 5, 6, 7];

const LABELS_4 = {
  ru: { 1: 'Совсем нет', 2: 'Немного', 3: 'Довольно сильно', 4: 'Очень сильно' },
  kz: { 1: 'Мүлдем жоқ', 2: 'Аздап', 3: 'Айтарлықтай', 4: 'Өте күшті' },
};

export default function TestsScreen() {
  const { t, language } = useApp();
  const lang = language;

  const [activeTest, setActiveTest] = useState(null); // 'c30' | 'lc13'
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [savedResults, setSavedResults] = useState([]);

  React.useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const raw = await AsyncStorage.getItem('testResults');
      if (raw) setSavedResults(JSON.parse(raw));
    } catch {}
  };

  const startTest = (testId) => {
    setActiveTest(testId);
    setAnswers({});
    setCurrentQ(0);
    setShowResult(false);
  };

  const closeTest = () => {
    setActiveTest(null);
    setShowResult(false);
  };

  const testData = activeTest === 'c30' ? qlqC30 : qlqLC13;
  const questions = testData?.questions || [];
  const question = questions[currentQ];

  const handleAnswer = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = async (finalAnswers) => {
    const result = {
      testId: testData.id,
      date: new Date().toISOString(),
      answers: finalAnswers,
      score: computeScore(finalAnswers),
    };
    const updated = [result, ...savedResults].slice(0, 20);
    setSavedResults(updated);
    await AsyncStorage.setItem('testResults', JSON.stringify(updated));
    setShowResult(true);
  };

  const computeScore = (ans) => {
    const vals = Object.values(ans);
    if (!vals.length) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    // Normalize to 0-100
    const maxVal = testData.id === 'qlq_c30'
      ? (questions.filter(q => q.type === '1-7').length > 0 ? 5.5 : 4)
      : 4;
    return Math.round(((avg - 1) / (maxVal - 1)) * 100);
  };

  const getScoreColor = (score) => {
    if (score <= 30) return '#48BB78';
    if (score <= 60) return '#F6AD55';
    return '#FC8181';
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'kk-KZ', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const getTestName = (testId) => {
    if (testId === 'qlq_c30') return lang === 'ru' ? qlqC30.nameRu : qlqC30.nameKz;
    return lang === 'ru' ? qlqLC13.nameRu : qlqLC13.nameKz;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{lang === 'ru' ? 'Тестирование' : 'Тестілеу'}</Text>
          <Text style={styles.subtitle}>
            {lang === 'ru' ? 'Стандартизированные опросники EORTC' : 'EORTC стандартты сауалнамалары'}
          </Text>
        </View>

        {/* Test cards */}
        <TouchableOpacity onPress={() => startTest('c30')} activeOpacity={0.85}>
          <Card style={styles.testCard}>
            <View style={[styles.testIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="clipboard-outline" size={28} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.testName}>{lang === 'ru' ? qlqC30.nameRu : qlqC30.nameKz}</Text>
              <Text style={styles.testDesc}>{lang === 'ru' ? qlqC30.descRu : qlqC30.descKz}</Text>
              <View style={styles.testMeta}>
                <Ionicons name="help-circle-outline" size={14} color={COLORS.subtext} />
                <Text style={styles.testMetaText}>30 {lang === 'ru' ? 'вопросов' : 'сұрақ'}</Text>
                <Ionicons name="time-outline" size={14} color={COLORS.subtext} style={{ marginLeft: 8 }} />
                <Text style={styles.testMetaText}>~10 {lang === 'ru' ? 'мин' : 'мин'}</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color={COLORS.primary} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => startTest('lc13')} activeOpacity={0.85}>
          <Card style={styles.testCard}>
            <View style={[styles.testIcon, { backgroundColor: '#5C6BC0' + '15' }]}>
              <Ionicons name="medkit-outline" size={28} color="#5C6BC0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.testName}>{lang === 'ru' ? qlqLC13.nameRu : qlqLC13.nameKz}</Text>
              <Text style={styles.testDesc}>{lang === 'ru' ? qlqLC13.descRu : qlqLC13.descKz}</Text>
              <View style={styles.testMeta}>
                <Ionicons name="help-circle-outline" size={14} color={COLORS.subtext} />
                <Text style={styles.testMetaText}>13 {lang === 'ru' ? 'вопросов' : 'сұрақ'}</Text>
                <Ionicons name="time-outline" size={14} color={COLORS.subtext} style={{ marginLeft: 8 }} />
                <Text style={styles.testMetaText}>~5 {lang === 'ru' ? 'мин' : 'мин'}</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color="#5C6BC0" />
          </Card>
        </TouchableOpacity>

        {/* History */}
        {savedResults.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>{lang === 'ru' ? 'История тестов' : 'Тест тарихы'}</Text>
            {savedResults.slice(0, 5).map((r, i) => (
              <Card key={i} style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyName}>{getTestName(r.testId)}</Text>
                    <Text style={styles.historyDate}>{formatDate(r.date)}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(r.score) + '20' }]}>
                    <Text style={[styles.scoreNum, { color: getScoreColor(r.score) }]}>{r.score}</Text>
                    <Text style={[styles.scoreLabel, { color: getScoreColor(r.score) }]}>/100</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        <Disclaimer />
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Test Modal */}
      <Modal visible={!!activeTest && !showResult} animationType="slide">
        <SafeAreaView style={styles.modalSafe}>
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeTest} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {activeTest && (lang === 'ru' ? testData?.nameRu : testData?.nameKz)}
            </Text>
            <Text style={styles.modalProgress}>
              {currentQ + 1}/{questions.length}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
          </View>

          {question && (
            <ScrollView contentContainerStyle={styles.questionContainer} showsVerticalScrollIndicator={false}>
              {/* Question number */}
              <View style={styles.qNumBadge}>
                <Text style={styles.qNumText}>
                  {lang === 'ru' ? `Вопрос ${currentQ + 1}` : `Сұрақ ${currentQ + 1}`}
                </Text>
              </View>

              <Text style={styles.questionText}>
                {lang === 'ru' ? question.ru : question.kz}
              </Text>

              {/* 1-4 scale */}
              {question.type === '1-4' && (
                <View style={styles.optionsWrap}>
                  {SCALE_4.map(val => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.option,
                        answers[question.id] === val && styles.optionSelected,
                      ]}
                      onPress={() => handleAnswer(question.id, val)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.optionDot, answers[question.id] === val && styles.optionDotSelected]}>
                        <Text style={[styles.optionDotNum, answers[question.id] === val && { color: '#fff' }]}>{val}</Text>
                      </View>
                      <Text style={[styles.optionText, answers[question.id] === val && styles.optionTextSelected]}>
                        {LABELS_4[lang][val]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 1-7 scale */}
              {question.type === '1-7' && (
                <View style={styles.scale7Wrap}>
                  <View style={styles.scale7Labels}>
                    <Text style={styles.scale7LabelMin}>
                      {lang === 'ru' ? question.labelMinRu : question.labelMinKz}
                    </Text>
                    <Text style={styles.scale7LabelMax}>
                      {lang === 'ru' ? question.labelMaxRu : question.labelMaxKz}
                    </Text>
                  </View>
                  <View style={styles.scale7Row}>
                    {SCALE_7.map(val => (
                      <TouchableOpacity
                        key={val}
                        style={[
                          styles.scale7Btn,
                          answers[question.id] === val && styles.scale7BtnSelected,
                        ]}
                        onPress={() => handleAnswer(question.id, val)}
                      >
                        <Text style={[
                          styles.scale7Num,
                          answers[question.id] === val && styles.scale7NumSelected,
                        ]}>{val}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          {/* Prev/Next nav */}
          <View style={styles.modalNav}>
            {currentQ > 0 && (
              <TouchableOpacity style={styles.navPrevBtn} onPress={() => setCurrentQ(q => q - 1)}>
                <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
                <Text style={styles.navPrevText}>{lang === 'ru' ? 'Назад' : 'Артқа'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <Ionicons name="checkmark-circle" size={60} color={COLORS.primary} />
            <Text style={styles.resultTitle}>
              {lang === 'ru' ? 'Тест завершён!' : 'Тест аяқталды!'}
            </Text>
            <Text style={styles.resultDesc}>
              {lang === 'ru'
                ? 'Ваши ответы записаны. Результаты можно обсудить с лечащим врачом.'
                : 'Жауаптарыңыз тіркелді. Нәтижелерді дәрігермен талқылауға болады.'}
            </Text>
            {savedResults[0] && (
              <View style={[styles.resultScore, { backgroundColor: getScoreColor(savedResults[0].score) + '15' }]}>
                <Text style={[styles.resultScoreNum, { color: getScoreColor(savedResults[0].score) }]}>
                  {savedResults[0].score}/100
                </Text>
                <Text style={styles.resultScoreLabel}>
                  {lang === 'ru' ? 'Индекс симптомов' : 'Симптом индексі'}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.resultBtn} onPress={closeTest}>
              <Text style={styles.resultBtnText}>{lang === 'ru' ? 'Закрыть' : 'Жабу'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
  testCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  testIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  testName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  testDesc: { fontSize: 12, color: COLORS.subtext, marginTop: 2, lineHeight: 16 },
  testMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  testMetaText: { fontSize: 12, color: COLORS.subtext, marginLeft: 3 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  historySection: { marginTop: 8 },
  historyCard: {},
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  historyDate: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  scoreBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  scoreNum: { fontSize: 22, fontWeight: '800' },
  scoreLabel: { fontSize: 11, fontWeight: '600' },

  // Modal
  modalSafe: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', elevation: 2,
  },
  modalTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center', marginHorizontal: 8 },
  modalProgress: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  progressTrack: { height: 4, backgroundColor: COLORS.border, marginHorizontal: 16, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  questionContainer: { padding: 20, paddingTop: 24 },
  qNumBadge: {
    backgroundColor: COLORS.primary + '15', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 12,
  },
  qNumText: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 0.5 },
  questionText: { fontSize: 18, fontWeight: '600', color: COLORS.text, lineHeight: 26, marginBottom: 28 },
  optionsWrap: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  optionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  optionDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  optionDotSelected: { backgroundColor: COLORS.primary },
  optionDotNum: { fontSize: 16, fontWeight: '800', color: COLORS.subtext },
  optionText: { fontSize: 15, fontWeight: '500', color: COLORS.text, flex: 1 },
  optionTextSelected: { fontWeight: '700', color: COLORS.primary },

  // Scale 7
  scale7Wrap: { gap: 12 },
  scale7Labels: { flexDirection: 'row', justifyContent: 'space-between' },
  scale7LabelMin: { fontSize: 12, color: '#48BB78', fontWeight: '600' },
  scale7LabelMax: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  scale7Row: { flexDirection: 'row', gap: 8 },
  scale7Btn: {
    flex: 1, aspectRatio: 1, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  scale7BtnSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  scale7Num: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  scale7NumSelected: { color: '#fff' },

  // Nav
  modalNav: {
    paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8,
    flexDirection: 'row', justifyContent: 'flex-start',
  },
  navPrevBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  navPrevText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },

  // Result
  resultOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  resultCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', gap: 12 },
  resultTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  resultDesc: { fontSize: 14, color: COLORS.subtext, textAlign: 'center', lineHeight: 20 },
  resultScore: { borderRadius: 16, padding: 20, alignItems: 'center', width: '100%' },
  resultScoreNum: { fontSize: 40, fontWeight: '900' },
  resultScoreLabel: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
  resultBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingHorizontal: 40, paddingVertical: 14, width: '100%', alignItems: 'center',
  },
  resultBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});