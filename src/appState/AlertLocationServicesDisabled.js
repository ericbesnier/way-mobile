import { Platform, Alert, Linking } from 'react-native';
import { IntentLauncherAndroid } from 'expo';

export const AlertLocationServicesDisabled = () => {
  Alert.alert(
    'Service de localisation désativé',
    'Pour continuer, activez la localisation de l\'appareil, qui utilise le service de localisation de Google',
    [
      { text: 'ANNULER', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'OK', onPress: () => {
          if (Platform.OS === 'android') {
            IntentLauncherAndroid.startActivityAsync(
              IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
            );
          } else {
            Linking.openURL('app-settings:');
          }
        }
      },
    ],
    { cancelable: false }
  );
};
