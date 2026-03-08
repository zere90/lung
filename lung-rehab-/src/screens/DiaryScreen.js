import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, COLORS, Disclaimer } from '../components/SharedComponents';

const SYMPTOM_KEYS = ['shortness', 'cough', 'chestPain', 'fatigue', 'wheezing', 'headache', 'nausea', 'appetite'];

const DISCOMFORT_COLORS = {
  1: '#48BB78', 2: '#68D391', 3: '#F6AD55', 4: '#FC8181', 5: '#E53E3E',
};

export default function DiaryScreen() {
  const { t, language, saveDiaryEntry, diaryEntries } = useApp();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [discomfort, setDiscomfort] = useState(null);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (key) => {
    setSelectedSymptoms(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (discomfort === null) {
      Alert.alert('', t('discomfortLevel') + '?');
      return;
    }
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      discomfort,
      notes,
    };
    await saveDiaryEntry(entry);
    setSelectedSymptoms([]);
    setDiscomfort(null);
    setNotes('');
    Alert.alert('✓', t('entrySaved'));
  };

  const getWeeklyAvg = () => {
    const week = diaryEntries.slice(0, 7);
    if (!week.length) return null;
    return (week.reduce((a, e) => a + e.discomfort, 0) / week.length).toFixed(1);
  };

  const avg = getWeeklyAvg();

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      day: 'numeric', month: 'short',
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('diaryTitle')}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </Text>
        </View>

        {/* Weekly stats */}
        {avg && (
          <Card style={styles.statsCard}>
            <Text style={styles.sectionLabel}>{t('weeklyStats')}</Text>
            <View style={styles.statsRow}>
              <View style={styles.avgBadge}>
                <Text style={styles.avgNum}>{avg}</Text>
                <Text style={styles.avgLabel}>{t('avgScore')}</Text>
              </View>
              <View style={styles.miniChartRow}>
                {diaryEntries.slice(0, 7).reverse().map((e, i) => (
                  <View key={i} style={styles.miniBar}>
                    <View style={[
                      styles.miniBarFill,
                      { height: (e.discomfort / 5) * 40, backgroundColor: DISCOMFORT_COLORS[e.discomfort] }
                    ]} />
                  </View>
                ))}
              </View>
            </View>
          </Card>
        )}

        {/* Symptoms */}
        <Card>
          <Text style={styles.sectionLabel}>{t('chooseSymptoms')}</Text>
          <View style={styles.chipsContainer}>
            {SYMPTOM_KEYS.map(key => {
              const selected = selectedSymptoms.includes(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleSymptom(key)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {t(`symptoms.${key}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Discomfort level */}
        <Card>
          <Text style={styles.sectionLabel}>{t('discomfortLevel')}</Text>
          {[1, 2, 3, 4, 5].map(level => (
            <TouchableOpacity
              key={level}
              style={[styles.levelRow, discomfort === level && { borderColor: DISCOMFORT_COLORS[level], borderWidth: 2 }]}
              onPress={() => setDiscomfort(level)}
            >
              <View style={[styles.levelDot, { backgroundColor: DISCOMFORT_COLORS[level] }]} />
              <Text style={styles.levelText}>{t(`discomfortLevels.${level}`)}</Text>
              <Text style={styles.levelNum}>{level}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Notes */}
        <Card>
          <Text style={styles.sectionLabel}>{t('additionalNotes')}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={t('notesPlaceholder')}
            placeholderTextColor={COLORS.subtext}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </Card>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{t('saveEntry')}</Text>
        </TouchableOpacity>

        {/* History */}
        {diaryEntries.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>{t('history')}</Text>
            {diaryEntries.slice(0, 10).map(entry => (
              <Card key={entry.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                  <View style={[styles.levelDot, { backgroundColor: DISCOMFORT_COLORS[entry.discomfort] }]} />
                  <Text style={styles.historyLevel}>{entry.discomfort}/5</Text>
                </View>
                {entry.symptoms.length > 0 && (
                  <Text style={styles.historySymptoms}>
                    {entry.symptoms.map(s => t(`symptoms.${s}`)).join(', ')}
                  </Text>
                )}
                {entry.notes ? <Text style={styles.historyNotes}>{entry.notes}</Text> : null}
              </Card>
            ))}
          </View>
        )}

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
  dateText: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  statsCard: { marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  avgBadge: { alignItems: 'center', backgroundColor: COLORS.primary + '15', padding: 12, borderRadius: 12 },
  avgNum: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  avgLabel: { fontSize: 10, color: COLORS.subtext, textAlign: 'center' },
  miniChartRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', height: 50, gap: 4 },
  miniBar: { flex: 1, height: 50, justifyContent: 'flex-end', backgroundColor: COLORS.border, borderRadius: 4 },
  miniBarFill: { borderRadius: 4, width: '100%' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#f9f9f9',
  },
  chipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '12' },
  chipText: { fontSize: 13, color: COLORS.subtext, fontWeight: '500' },
  chipTextSelected: { color: COLORS.primary, fontWeight: '600' },
  levelRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12,
    backgroundColor: '#f9f9f9', marginBottom: 8, borderWidth: 1.5, borderColor: 'transparent',
  },
  levelDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  levelText: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  levelNum: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  textInput: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    padding: 14, minHeight: 100, fontSize: 14, color: COLORS.text, backgroundColor: '#fafafa',
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 16,
    alignItems: 'center', marginVertical: 16,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  historySection: { marginBottom: 8 },
  historyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  historyCard: { gap: 6 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyDate: { fontSize: 14, fontWeight: '600', color: COLORS.text, flex: 1 },
  historyLevel: { fontSize: 14, fontWeight: '600', color: COLORS.subtext },
  historySymptoms: { fontSize: 12, color: COLORS.subtext },
  historyNotes: { fontSize: 13, color: COLORS.text, fontStyle: 'italic' },
});
