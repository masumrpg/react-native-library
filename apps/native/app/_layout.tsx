import React from 'react';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';

const AppLayout = () => {
  const [loaded, error] = useFonts({
    'Amiri-Regular': require('../assets/fonts/Amiri-Regular.ttf'),
    'Amiri-Bold': require('../assets/fonts/Amiri-Bold.ttf'),
    'NotoNaskhArabic-Regular': require('../assets/fonts/NotoNaskhArabic-Regular.ttf'),
    'NotoNaskhArabic-Bold': require('../assets/fonts/NotoNaskhArabic-Bold.ttf'),
    'ScheherazadeNew-Regular': require('../assets/fonts/ScheherazadeNew-Regular.ttf'),
    'ScheherazadeNew-Bold': require('../assets/fonts/ScheherazadeNew-Bold.ttf'),
    'Mirza-Regular': require('../assets/fonts/Mirza-Regular.ttf'),
    'Harmattan-Regular': require('../assets/fonts/Harmattan-Regular.ttf'),
    'Katibeh-Regular': require('../assets/fonts/Katibeh-Regular.ttf'),
    'AmiriQuran-Regular': require('../assets/fonts/AmiriQuran-Regular.ttf'),
    'Handjet-Regular': require('../assets/fonts/Handjet-Regular.ttf'),
    'ReemKufiFun-Regular': require('../assets/fonts/ReemKufiFun-Regular.ttf'),
    'ReemKufiInk-Regular': require('../assets/fonts/ReemKufiInk-Regular.ttf'),
  });

  if (!loaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
