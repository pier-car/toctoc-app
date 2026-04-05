/**
 * src/navigation/AppNavigator.js
 *
 * Top-level navigation structure for TocToc:
 *
 *  - A Bottom Tab Navigator with four tabs:
 *      🏠  Feed     → HomeScreen
 *      ➕  Post     → NewPostScreen  (raised FAB-style centre tab)
 *      💬  Chats    → Placeholder chats screen
 *      👤  Profile  → ProfileScreen
 *
 *  - A Stack Navigator that wraps the tab navigator and adds:
 *      ChatScreen  (accessible from HomeScreen via a post card tap)
 *
 * Tab bar design: white background, subtle shadow, active tint #6C63FF.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, PlusCircle, MessageSquare, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import NewPostScreen from '../screens/NewPostScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FlyerScreen from '../screens/FlyerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ---------------------------------------------------------------------------
// Placeholder Chats list screen
// ---------------------------------------------------------------------------
function ChatsPlaceholderScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.icon}>💬</Text>
      <Text style={placeholderStyles.title}>Chats coming soon</Text>
      <Text style={placeholderStyles.subtitle}>
        Tap a post in the Feed to start an anonymous chat with your neighbor.
      </Text>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 21 },
});

// ---------------------------------------------------------------------------
// Custom raised centre tab button
// ---------------------------------------------------------------------------
function PostTabButton({ onPress, accessibilityState }) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="Create new post"
      accessibilityRole="button"
      style={styles.fabWrapper}
    >
      <View style={[styles.fab, focused && styles.fabFocused]}>
        <PlusCircle size={28} color="#FFFFFF" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Bottom Tab Navigator
// ---------------------------------------------------------------------------
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={NewPostScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <PostTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsPlaceholderScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={1.8} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ---------------------------------------------------------------------------
// Root Stack Navigator (adds ChatScreen on top of tabs)
// ---------------------------------------------------------------------------
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#111827',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        cardStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.post?.category
            ? `${getCategoryEmoji(route.params.post.category)}  ${truncate(
                route.params.post.message,
                32,
              )}`
            : 'Chat',
        })}
      />
      <Stack.Screen
        name="Flyer"
        component={FlyerScreen}
        options={{ title: 'Volantino Condominio' }}
      />
    </Stack.Navigator>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getCategoryEmoji(category) {
  const map = { package: '📦', borrow: '🛠️', groupbuy: '🍕', info: 'ℹ️' };
  return map[category] ?? '💬';
}

function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max) + '…';
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 60,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  fabWrapper: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabFocused: {
    backgroundColor: '#5A52E0',
  },
});
