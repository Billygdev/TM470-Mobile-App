import { darkTheme, lightTheme } from '@/constants/Themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider, useThemeMode } from '@/contexts/ThemeContext';
import { DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <InnerLayout />
    </CustomThemeProvider>
  );
}

function InnerLayout() {
  const { theme } = useThemeMode();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const navTheme = theme === 'dark' ? NavDarkTheme : NavLightTheme;
  const paperTheme = theme === 'dark' ? darkTheme : lightTheme;
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={navTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={statusBarStyle} />
        </ThemeProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
