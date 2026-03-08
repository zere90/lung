import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppProvider, useApp } from './src/context/AppContext';
import { COLORS } from './src/components/SharedComponents';

import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import BreathingScreen from './src/screens/BreathingScreen';
import BreathingSessionScreen from './src/screens/BreathingSessionScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import PlanScreen from './src/screens/PlanScreen';
import EducationScreen from './src/screens/EducationScreen';
import LessonScreen from './src/screens/LessonScreen';
import TestsScreen from './src/screens/TestsScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Tab = createBottomTabNavigator();
const BreathingStack = createStackNavigator();
const EducationStack = createStackNavigator();

function BreathingNavigator() {
  return (
    <BreathingStack.Navigator screenOptions={{ headerShown: false }}>
      <BreathingStack.Screen name="BreathingList" component={BreathingScreen} />
      <BreathingStack.Screen name="BreathingSession" component={BreathingSessionScreen} />
    </BreathingStack.Navigator>
  );
}

function EducationNavigator() {
  return (
    <EducationStack.Navigator screenOptions={{ headerShown: false }}>
      <EducationStack.Screen name="EducationList" component={EducationScreen} />
      <EducationStack.Screen name="Lesson" component={LessonScreen} />
    </EducationStack.Navigator>
  );
}

function AppTabs() {
  const { t, loading } = useApp();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9EA8B3',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E8EEF0',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Breathing: focused ? 'leaf' : 'leaf-outline',
            Diary: focused ? 'document-text' : 'document-text-outline',
            Plan: focused ? 'calendar' : 'calendar-outline',
            Education: focused ? 'school' : 'school-outline',
            Tests: focused ? 'clipboard' : 'clipboard-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('home') }} listeners={({ navigation }) => ({ tabPress: () => navigation.navigate('Home') })} />
      <Tab.Screen name="Breathing" component={BreathingNavigator} options={{ tabBarLabel: t('breathing') }} />
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ tabBarLabel: t('diary') }} />
      <Tab.Screen name="Plan" component={PlanScreen} options={{ tabBarLabel: t('plan') }} />
      <Tab.Screen name="Education" component={EducationNavigator} options={{ tabBarLabel: t('education') }} />
      <Tab.Screen name="Tests" component={TestsScreen} options={{ tabBarLabel: t('tests') }} />
    </Tab.Navigator>
  );
}

function Root() {
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userProfile')
      .then(raw => { if (raw) setProfile(JSON.parse(raw)); })
      .catch(() => {})
      .finally(() => setCheckingProfile(false));
  }, []);

  if (checkingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!profile) {
    return <ProfileScreen onComplete={(p) => setProfile(p)} />;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppTabs />
      </NavigationContainer>
    </AppProvider>
  );
}

export default function App() {
  return <Root />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
