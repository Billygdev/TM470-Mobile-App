import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'react-native-paper';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon source="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="travel-events"
        options={{
          title: 'Travel Events',
          tabBarIcon: ({ color }) => (
            <Icon source="calendar" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}