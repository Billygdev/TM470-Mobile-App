import { useThemeMode } from '@/contexts/ThemeContext';
import React from 'react';
import { Button } from 'react-native-paper';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <Button mode="outlined" onPress={toggleTheme} style={{ margin: 16 }}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
}
