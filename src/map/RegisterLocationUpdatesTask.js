import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import {
    currentDate
} from '../commons/Utils'
// import { Store } from '../../Root';
import { LOCATION_API } from '../api/LocationApi';
import {
    updateLocation as _updateLocation,
} from '../user/UserActions';
import {
    MIN_INTERVAL_BETWEEN_BACKGROUND_FETCH,
} from '../../constants/values'

import axios from 'axios';


export async function handleRetrieveLocation({ data, error }) {
    // console.log('RegisterLocationUpdatesTask/handleRetrieveLocation : ', currentDate());
    // console.log('RegisterLocationUpdatesTask/handleRetrieveLocation : store=', this.store, ' ', currentDate());
    if (error) {
        console.log('RegisterLocationUpdatesTask/handleRetrieveLocation : error=', error);
        return;
    }
    if (data) {
        const { locations } = data;
        // console.log('RegisterLocationUpdatesTask/handleRetrieveLocation: ', currentDate(), ' locations=', locations);
        var location = locations[locations.length - 1];
        console.log('RegisterLocationUpdatesTask/handleRetrieveLocation: ', currentDate(), ' location=', location);

        // var locationAddress = await LOCATION_API.reverseGeocodeAsync(location);
        // console.log('RegisterLocationUpdatesTask/handleRetrieveLocation: ', currentDate(), ' locationAddress=', locationAddress);
        // console.log('RegisterLocationUpdatesTask/handleRetrieveLocation: this.store=', this.store);
        var state = this.store.getState();
        var user = state.user;
        // console.log('RegisterLocationUpdatesTask/handleRetrieveLocation: user=', user);
        // location.locationAddress = locationAddress;
        await this.store.dispatch(_updateLocation(user, location));
        // this.notifyLocationToUsersWithSendingRelation(location);
    }
};

export const registerLocationUpdatesTask = async (locationUpdatesTaskName, _handleRetrieveLocation) => {
    console.log('RegisterLocationUpdatesTask/handleRetrieveLocation');

    TaskManager.defineTask(locationUpdatesTaskName, _handleRetrieveLocation);

    const status = await BackgroundFetch.getStatusAsync();
    console.log('RegisterLocationUpdatesTask/registerLocationUpdatesTask: status=', status);

    switch (status) {
        case BackgroundFetch.Status.Restricted:
            console.log("RegisterLocationUpdatesTask/registerLocationUpdatesTask: BackgroundFetch.Status.Restricted");
            return;
        case BackgroundFetch.Status.Denied:
            console.log("RegisterLocationUpdatesTask/registerLocationUpdatesTask: BackgroundFetch.Status.Denied");
            return;
        default: {
            console.log("RegisterLocationUpdatesTask/registerLocationUpdatesTask: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Background execution allowed");
            let tasks = await TaskManager.getRegisteredTasksAsync();
            if (tasks.find(f => f.taskName === locationUpdatesTaskName) == null) {
                console.log("RegisterLocationUpdatesTask/registerLocationUpdatesTask: Registering task ", locationUpdatesTaskName);
                BackgroundFetch.registerTaskAsync(
                    locationUpdatesTaskName,
                    {
                        minimumInterval: MIN_INTERVAL_BETWEEN_BACKGROUND_FETCH,
                        stopOnTerminate: true,
                        startOnBoot: false,
                    },
                ).then(() => BackgroundFetch.setMinimumIntervalAsync(MIN_INTERVAL_BETWEEN_BACKGROUND_FETCH));
                tasks = await TaskManager.getRegisteredTasksAsync();
                console.log("RegisterLocationUpdatesTask/registerLocationUpdatesTask: Registered tasks", tasks);
            } else {
                console.log('RegisterLocationUpdatesTask/registerLocationUpdatesTask: ', `Task ${locationUpdatesTaskName} already registered, skipping`);
            }
        }
    }
}