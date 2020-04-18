console.log('LocationApi...');
import * as Location from 'expo-location'
import { Platform } from 'react-native';
import { TIME_BETWEEN_LOCATION_UPDATE } from '../../constants/values'
import { NOTIFICATIONS_API } from '../api/NotificationsApi';

// L o c a t i o n A p i
// ---------------------
class LocationApi {

  constructor() {
    this.lastWatchPositionTimestamp = 0;
  }

  getProviderStatusAsync = async () => {
    try {
      const providerStatus = await Location.getProviderStatusAsync();
      console.log('LocationApi/getProviderStatusAsync : providerStatus=', providerStatus);
      return providerStatus;
    } catch (error) {
      console.log('LocationApi/getProviderStatusAsync: error=', error);
    }
  }

  stopLocationUpdatesAsync = async (locationUpdateTask) => {
    console.log('LocationApi/stopLocationUpdatesAsync: Stop !!!!! stopLocationUpdatesAsync........................... locationUpdateTask=', locationUpdateTask);
    try {
      await Location.stopLocationUpdatesAsync(locationUpdateTask);
    }
    catch (error) {
      console.log('LocationApi/stopLocationUpdatesAsync: error=', error);
    }
  }

  startLocationUpdatesAsync = async (locationUpdateTask) => {
    console.log('LocationApi/startLocationUpdatesAsync: Starting startLocationUpdatesAsync........................... locationUpdateTask=', locationUpdateTask);
    // if (Platform.OS === 'android') {
    //   foregroundService = {
    //     notificationTitle: 'Way Channel',
    //     notificationBody: 'New location !!!!',
    //     // android: {
    //     //   channelId: 'Way',
    //     // },
    //     notificationColor: 'RRGGBB '
    //   };
    // }
    try {
      await Location.startLocationUpdatesAsync(
        locationUpdateTask, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: TIME_BETWEEN_LOCATION_UPDATE,
        distanceInterval: 0,
        deferredUpdatesInterval: 0,
        deferredUpdatesDistance: 0,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Way',
          notificationBody: 'New location !!!!',
          // android: {
          //   channelId: 'Way',
          // },
          notificationColor: 'RRGGBB '
        },
      });
    }
    catch (error) {
      console.log('LocationApi/startLocationUpdatesAsync: error=', error);
    }
  }

  watchPositionAsync = async (callBack) => {
    console.log('LocationApi/watchPositionAsync: Starting watchPositionAsync...');

    try {
      this.watchId = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 0, // 2000
        timeInterval: TIME_BETWEEN_LOCATION_UPDATE * 1000, // 200000
        mayShowUserSettingsDialog: false
      }, location => {
        var currentWatchPositionTimestamp = Math.round(+new Date() / 1000);
        // console.log('LocationApi/watchPositionAsync: currentWatchPositionTimestamp=', currentWatchPositionTimestamp);
        // console.log('LocationApi/watchPositionAsync: this.lastWatchPositionTimestamp=', this.lastWatchPositionTimestamp);
        // console.log('LocationApi/watchPositionAsync: currentWatchPositionTimestamp - this.lastWatchPositionTimestamp=', currentWatchPositionTimestamp - this.lastWatchPositionTimestamp);
        if (this.lastWatchPositionTimestamp == 0 || currentWatchPositionTimestamp - this.lastWatchPositionTimestamp > TIME_BETWEEN_LOCATION_UPDATE) {
          callBack(location)
          this.lastWatchPositionTimestamp = currentWatchPositionTimestamp;
        }
      }
      );
      return this.watchId;
    }
    catch (error) {
      console.log('LocationApi/watchPositionAsync: error=', error);
    }
  }

  getCurrentPositionAsync = async () => {
    try {
      return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    } catch (error) {
      console.log('LocationApi/getCurrentPositionAsync: error=', error);
    }
  }

  reverseGeocodeAsync = async (location) => {
    // console.log('LocationApi/reverseGeocodeAsync: location=', location);
    try {
      return await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch (error) {
      console.log('LocationApi/reverseGeocodeAsync: error=', error);
    }
  }
}

export const LOCATION_API = new LocationApi();
