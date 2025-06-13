import { MD3DarkTheme as DarkTheme, MD3LightTheme as LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: '#0066cc',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00aced',
  },
};
