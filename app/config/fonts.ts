import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'Oktyabrina-script': require('../assets/fonts/Oktyabrina-script.ttf'),
    'Arkhip-Regular': require('../assets/fonts/Arkhip-Regular.ttf'), 
  });

  return [fontsLoaded];
};