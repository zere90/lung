import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

export const COLORS = {
  primary: '#1E88E5',
  accent: '#42A5F5',
  background: '#f6fbff',
  card: '#FFFFFF',
  text: '#1f2d3d',
  subtext: '#5a7184',
  border: '#D0E8FB',
  error: '#E53E3E',
  warning: '#F6AD55',
  success: '#48BB78',
  dark: '#0D47A1',
  light: '#E3F2FD',
};

export const Disclaimer = () => {
  const { t } = useApp();
  return (
    <View style={styles.disclaimer}>
      <Text style={styles.disclaimerText}>{t('disclaimer')}</Text>
    </View>
  );
};

export const Card = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
};

export const ProgressBar = ({ value, color, style }) => {
  const clamp = Math.min(Math.max(value || 0, 0), 100);
  return (
    <View style={[styles.progressTrack, style]}>
      <View style={[styles.progressFill, { width: `${clamp}%`, backgroundColor: color || COLORS.primary }]} />
    </View>
  );
};

export const DifficultyBadge = ({ difficulty, lang }) => {
  const labels = {
    easy: { ru: 'Easy', kz: 'Оңай' },
    medium: { ru: 'Medium', kz: 'Орта' },
    hard: { ru: 'Hard', kz: 'Қиын' },
  };
  const colors = { easy: '#48BB78', medium: '#F6AD55', hard: '#E53E3E' };
  return (
    <View style={[styles.badge, { backgroundColor: colors[difficulty] + '22', borderColor: colors[difficulty] + '44' }]}>
      <Text style={[styles.badgeText, { color: colors[difficulty] }]}>
        {labels[difficulty]?.[lang || 'ru'] || difficulty}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  disclaimer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F6AD55',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E8EEF0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
