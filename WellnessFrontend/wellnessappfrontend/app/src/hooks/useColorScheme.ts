import { useColorScheme as useNativeColorScheme } from 'react-native';

const useColorScheme = () => {
  const colorScheme = useNativeColorScheme();
  return colorScheme ?? 'light';
}

export default useColorScheme;