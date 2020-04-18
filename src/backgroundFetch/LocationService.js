import { AppState, Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {
    MIN_INTERVAL_BETWEEN_BACKGROUND_FETCH,
    BACKGROUND_FETCH_TASK,
    BACKGROUND_LOCATION_UPDATES_TASK
} from '../../constants/values'

class LocationService {

  defineTasks() {
    console.log('LocationService/defineTasks');

    // Define Retrieve Location task
    TaskManager.defineTask(
      BACKGROUND_LOCATION_UPDATES_TASK,
      this.handleRetrieveLocation
    );

    // Define Report Location task
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, this.handleReportLocation);
  }

  async registerTasks() {
    console.log('LocationService/registerTasks');
    await this.registerBackgroundFetchTask(true);
    await this.startLocationUpdates();
  }

  /**
   * Stop all background tasks that we might have previously started.
   */
  async unregisterTasks() {
    console.log('LocationService/unregisterTasks');
    await TaskManager.unregisterAllTasksAsync();
  }

  /**
   * Display current background tasks
   */
  async displayTasks(text) {
    let tasks = await TaskManager.getRegisteredTasksAsync();
    console.log(text + JSON.stringify(tasks));
  }

  handleRetrieveLocation = ({ data, error }) => {
    console.log('LocationService/handleRetrieveLocation');

    if (error) {
      console.log('LocationService/handleRetrieveLocation: error=', error);
      return;
    }
    if (data) {
      try {
        const locations = data.locations;
        console.log('LocationService/handleRetrieveLocation: locations=', locations);
      } catch (err) {
        console.log('LocationService/handleRetrieveLocation: err=', err);
      }
    }
  };

  async registerBackgroundFetchTask(firstTime) {
    switch (Platform.OS) {
      case `ios`:
        await this.registerBackgroundFetchTask_iOS(firstTime);
        break;
      case `android`:
        await this.registerBackgroundFetchTask_android(firstTime);
        break;
      default:
        console.log('LocationService/registerBackgroundFetchTask: No background fetch task set for OS ', Platform.OS);
    }
  }

  async registerBackgroundFetchTask_iOS(firstTime) {
    const registered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    if (registered && !firstTime) {
      return;
    }

    const status = await BackgroundFetch.getStatusAsync();
    switch (status) {
      case BackgroundFetch.Status.Restricted:
        console.log('LocationService/registerBackgroundFetchTask_iOS: Background fetch execution is restricted');
        return;
      case BackgroundFetch.Status.Denied:
        console.log('LocationService/registerBackgroundFetchTask_iOS: Background fetch execution is disabled');
        return;
      default: {
        console.log('LocationService/registerBackgroundFetchTask_iOS: Background fetch execution allowed');
        await this.displayTasks('Registered tasks before: ');
        let isRegistered = await TaskManager.isTaskRegisteredAsync(
          BACKGROUND_FETCH_TASK
        );
        if (isRegistered) {
          console.log('LocationService/registerBackgroundFetchTask_iOS: Task ', BACKGROUND_FETCH_TASK, ' already registered, skipping');
        } else {
          console.log('LocationService/registerBackgroundFetchTask_iOS: Background Fetch Task not found - Registering task');
          await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 20,
          });
          await this.displayTasks('Registered tasks after: ');
        }

        console.log('LocationService/registerBackgroundFetchTask_iOS: Before startLocationUpdatesAsync()');
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
          // For some obscure reason this following line is required to get background fetch working (https://github.com/expo/expo/issues/3582)
          await Location.startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
            timeInterval: 20000, // Android only property supposedly
            deferredUpdatesInterval: 20000,
            showsBackgroundLocationIndicator: false,
          });
        }
        console.log('LocationService/registerBackgroundFetchTask_iOS: After startLocationUpdatesAsync()');

        // The minimum interval we suggest to iOS (if we don't set this then iOS will use a very high number instead)
        // This must be called every time
        await BackgroundFetch.setMinimumIntervalAsync(20);
      }
    }
  }

  async registerBackgroundFetchTask_android(firstTime) {
    const registered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    if (registered && !firstTime) {
      return;
    }

    const status = await BackgroundFetch.getStatusAsync();
    switch (status) {
      case BackgroundFetch.Status.Restricted:
        console.log('LocationService/registerBackgroundFetchTask_android: Background fetch execution is restricted');
        return;
      case BackgroundFetch.Status.Denied:
        console.log('LocationService/registerBackgroundFetchTask_android: Background fetch execution is disabled');
        return;
      default: {
        console.log('LocationService/registerBackgroundFetchTask_android: Background fetch execution allowed');
        await this.displayTasks('Registered tasks before: ');
        let isRegistered = await TaskManager.isTaskRegisteredAsync(
          BACKGROUND_FETCH_TASK
        );
        if (isRegistered) {
          console.log('LocationService/registerBackgroundFetchTask_android: Task ', BACKGROUND_FETCH_TASK, ' already registered, skipping');
        } else {
          console.log('LocationService/registerBackgroundFetchTask_android: Background Fetch Task not found - Registering task');
          await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 20,
            // TODO We'll want to ensure that if we continue to run the task outside of the life of the application
            // that we do the same for the update location task too - otherwise no point
            // stopOnTerminate: false, //TODO We'll probably want to put conditions on this
            // startOnBoot: true, //TODO and this
          });
          await this.displayTasks('Registered tasks after: ');
        }
      }
    }
  }

  async unregisterBackgroundFetchTask() {
    // First check that it is registered
    let registered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    console.log('LocationService/unregisterBackgroundFetchTask: registered before ', registered);
    if (registered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
    registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    console.log('LocationService/unregisterBackgroundFetchTask: registered after ', registered);
  }

  /**
   * Report location when app is backgrounded
   */
  handleReportLocation = async () => {
    console.log(`LocationService/handleReportLocation`);
    try {
      // If app is active then websockets is responsible for uploading location packets
      if (AppState.currentState === 'active') {
        console.log(`LocationService/handleReportLocation: active`);
        // return BackgroundFetch.Result.NoData;
        return BackgroundFetch.Result.NewData;
      }

      // Fetch would happen here . . .

      console.log('LocationService/handleReportLocation: fetch complete');
      return BackgroundFetch.Result.NewData;
    } catch (error) {
      return BackgroundFetch.Result.Failed;
    }
  };

  /**
   * Start the location updates task which is responsible for getting the device's location.
   */
  startLocationUpdates = async () => {
    console.log('LocationService/startLocationUpdates');

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_UPDATES_TASK
    );
    if (hasStarted) {
      return;
    }

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    const accuracy = '5';
    const timeInterval = '10000';
    const distanceInterval = '1';
    const activityType = '4';
    let foregroundService;
    if (Platform.OS === 'android') {
      foregroundService = {
        notificationTitle: 'Background Fetch App',
        notificationBody: 'Location sharing active',
        notificationColor: '#3F51B5',
      };
    }
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
      accuracy: parseInt(accuracy, 10),
      timeInterval: parseInt(timeInterval, 10), // Android only property supposedly
      distanceInterval: parseInt(distanceInterval, 5),
      // deferredUpdatesInterval: 10000,
      // pausesUpdatesAutomatically: true, // iOS option for battery optimisation
      // activityType: Location.ActivityType.AutomotiveNavigation
      // activityType: Location.ActivityType.OtherNavigation, // "The location manager is being used to track movements for other types of vehicular navigation that are not automobile related."
      activityType: parseInt(activityType, 10),
      showsBackgroundLocationIndicator: false,
      // The following is necessary to be able to retrieve background locations frequently for Android
      foregroundService,
    });
  };

  /**
   * Stop getting background location updates (but don't unregister the task).
   */
  async stopLocationUpdates() {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);
    // TaskManager.unregisterTaskAsync(BACKGROUND_LOCATION_UPDATES_TASK);
  }
}

const locationService = new LocationService();
export default locationService;