import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const styles = {
  dark: {
    ...MD3DarkTheme,
    roundness: 2,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#B84297',
      primaryContainer: '#22252A',
      text: '#e1e1e1bf',
      buttonText: '#ffffff',
      background: '#292D33',
    },
  },
  light: {
    ...MD3LightTheme,
    roundness: 2,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#B84297',
      primaryContainer: '#fff',
      text: '#333333bf',
      buttonText: '#ffffff',
      background: '#f6f6f6',
    },
  },
};

export default styles;
