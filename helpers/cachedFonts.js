import * as Font from 'expo-font';

const cachedFonts = fonts => fonts.map(font => Font.loadAsync(font));

export const fontAssets = cachedFonts([
  { montserrat: require('../assets/fonts/Montserrat-Regular.ttf') },
  { montserratBold: require('../assets/fonts/Montserrat-Bold.ttf') },
  { montserratLight: require('../assets/fonts/Montserrat-Light.ttf') },
  { montserratMed: require('../assets/fonts/Montserrat-Medium.ttf') },
  { RobotoBlack: require('../assets/fonts/Roboto-Black.ttf') },
  { RobotoBlackItalic: require('../assets/fonts/Roboto-BlackItalic.ttf') },
  { RobotoBold: require('../assets/fonts/Roboto-Bold.ttf') },
  { RobotoBoldItalic: require('../assets/fonts/Roboto-BoldItalic.ttf') },
  { RobotoItalic: require('../assets/fonts/Roboto-Italic.ttf') },
  { RobotoLight: require('../assets/fonts/Roboto-Light.ttf') },
  { RobotoLightItalic: require('../assets/fonts/Roboto-LightItalic.ttf') },
  { RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf') },
  { RobotoMediumItalic: require('../assets/fonts/Roboto-MediumItalic.ttf') },
  { RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf') },
  { RobotoThin: require('../assets/fonts/Roboto-Thin.ttf') },
  { RobotoThinItalic: require('../assets/fonts/Roboto-ThinItalic.ttf') }
]);