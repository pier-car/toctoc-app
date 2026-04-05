/**
 * App.js
 *
 * Root entry point for the TocToc React Native application.
 * Wraps the app in the NavigationContainer required by React Navigation
 * and renders the main AppNavigator which contains all tab and stack routes.
 * Signs in anonymously with Firebase on startup and shows a loading spinner
 * while the auth session initialises.
 */
import "./global.css";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { signInAnonymouslyAndGetUser } from './src/services/firebase';

export default function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    signInAnonymouslyAndGetUser()
      .catch((err) => {
        console.error('[App] Firebase anonymous sign-in failed:', err);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);

  if (!authReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
});
