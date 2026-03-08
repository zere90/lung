import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../components/SharedComponents';

export default function ProfileScreen({ onComplete }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [lang, setLang] = useState('ru');

  const labels = {
    ru: {
      title: 'Добро пожаловать',
      subtitle: 'Введите ваши данные для начала работы',
      name: 'Имя',
      surname: 'Фамилия',
      age: 'Возраст',
      namePh: 'Введите имя',
      surnamePh: 'Введите фамилию',
      agePh: 'Введите возраст',
      btn: 'Начать',
      err: 'Пожалуйста, заполните все поля',
      errAge: 'Введите корректный возраст (1–120)',
    },
    kz: {
      title: 'Қош келдіңіз',
      subtitle: 'Жұмысты бастау үшін деректеріңізді енгізіңіз',
      name: 'Аты',
      surname: 'Тегі',
      age: 'Жасы',
      namePh: 'Атыңызды енгізіңіз',
      surnamePh: 'Тегіңізді енгізіңіз',
      agePh: 'Жасыңызды енгізіңіз',
      btn: 'Бастау',
      err: 'Барлық өрістерді толтырыңыз',
      errAge: 'Дұрыс жасты енгізіңіз (1–120)',
    },
  };

  const L = labels[lang];

  const handleSubmit = async () => {
    if (!name.trim() || !surname.trim() || !age.trim()) {
      Alert.alert('', L.err);
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('', L.errAge);
      return;
    }
    const profile = { name: name.trim(), surname: surname.trim(), age: ageNum, language: lang };
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Lang toggle */}
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'ru' && styles.langBtnActive]}
              onPress={() => setLang('ru')}
            >
              <Text style={[styles.langText, lang === 'ru' && styles.langTextActive]}>RU</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'kz' && styles.langBtnActive]}
              onPress={() => setLang('kz')}
            >
              <Text style={[styles.langText, lang === 'kz' && styles.langTextActive]}>KZ</Text>
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <View style={styles.iconWrap}>
            <Text style={{ fontSize: 52 }}>🏥</Text>
          </View>

          <Text style={styles.title}>{L.title}</Text>
          <Text style={styles.subtitle}>{L.subtitle}</Text>

          {/* Fields */}
          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>{L.name}</Text>
              <TextInput
                style={styles.input}
                placeholder={L.namePh}
                placeholderTextColor={COLORS.subtext}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>{L.surname}</Text>
              <TextInput
                style={styles.input}
                placeholder={L.surnamePh}
                placeholderTextColor={COLORS.subtext}
                value={surname}
                onChangeText={setSurname}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>{L.age}</Text>
              <TextInput
                style={styles.input}
                placeholder={L.agePh}
                placeholderTextColor={COLORS.subtext}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>{L.btn}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  langRow: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginBottom: 16 },
  langBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  langBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  langText: { fontWeight: '700', fontSize: 13, color: COLORS.subtext },
  langTextActive: { color: '#fff' },
  iconWrap: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.subtext, textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 20 },
  form: { gap: 16, marginBottom: 32 },
  inputWrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: COLORS.text, backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 16, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});