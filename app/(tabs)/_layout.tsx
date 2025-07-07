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
            height: 54,
          },
          default: {
            height: 54,
          },
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
        name="search-travel-events"
        options={{
          title: 'Search Travel Events',
          tabBarIcon: ({ color }) => (
            <Icon source="calendar" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-bookings"
        options={{
          title: 'My Bookings',
          tabBarIcon: ({ color }) => (
            <Icon source="calendar-account" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}