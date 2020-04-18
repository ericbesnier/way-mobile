import { USER_API } from '../api/UserApi';
import { NOTIFICATIONS_API } from '../api/NotificationsApi';
// import { cpus } from 'os';

export const CLEAN_STATE = 'CLEAN_STATE';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SIGN_IN_FIREBASE = 'SIGN_IN_FIREBASE';
export const GET_EXPO_TOKEN = 'GET_EXPO_TOKEN';
export const REGISTER_FOR_NOTIFICATIONS = 'REGISTER_FOR_NOTIFICATIONS';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const ADD_USER_CONTACT = 'ADD_USER_CONTACT';
export const SET_IS_LOCATION_SENT_USER_CONTACT = 'SET_IS_LOCATION_SENT_USER_CONTACT';
export const SET_IS_LOCATION_RECEIVED_USER_CONTACT = 'SET_IS_LOCATION_RECEIVED_USER_CONTACT';
export const UPDATE_LOCATION_OF_USER_WITH_SHARED_LOCATION = 'UPDATE_LOCATION_OF_USER_WITH_SHARED_LOCATION';
export const ADD_OR_UPDATE_MARKER = 'ADD_OR_UPDATE_MARKER';
export const DELETE_MARKER = 'DELETE_MARKER';
export const SET_TRACKING = 'SET_TRACKING';
export const ERROR = 'ERROR';


export const login = (provider, providerToken, idToken, providerInfos) => {
  console.log('UserActions/login: provider=', provider, 'providerToken=', providerToken, ' idToken=', idToken, ' providerInfos=', providerInfos);
  return {
    type: LOGIN,
    payload: USER_API.login({ provider, providerToken, idToken })
  };
};

export const logout = (_id) => {
  console.log('UserActions/logout: _id=', _id);
  return {
    type: LOGOUT,
    payload: USER_API.logout(_id)
  };
};

export const signInFirebase = (provider, providerToken, idToken) => {
  console.log('UserActions/signInFirebase: provider=', provider, ' providerToken=', providerToken, ' idToken=', idToken);
  return {
    type: SIGN_IN_FIREBASE,
    payload: NOTIFICATIONS_API.signInFirebase(provider, providerToken, idToken)
  };
};

export const getExpoPushToken = () => {
  // console.log('UserActions/getExpoPushToken');
  return {
    type: GET_EXPO_TOKEN,
    payload: NOTIFICATIONS_API.getNotificationsExpoPushToken()
  };
};

export const registerForNotifications = (user, expoPushToken) => {
  // console.log('UserActions/registerForNotifications');
  return {
    type: REGISTER_FOR_NOTIFICATIONS,
    payload: USER_API.registerForNotifications(user, expoPushToken),
  };
};

export const updateLocation = (user, location) => {
  // console.log('UserActions/updateLocation: user=', user, ' location=', location);
  // let promise;
  // try {
  //   promise = USER_API.updateLocation(user, location);
  // } catch (error) {
  //   console.log('UserActions/updateLocation: error=', error);
  //   return;
  // }
  // promise.then(
  //   (value) => {
  //     // console.log('UserActions/updateLocation: value=', value);
  //     return {
  //       type: UPDATE_LOCATION,
  //       payload: promise,
  //     };
  //   },
  //   (error) => {
  //     console.log('UserActions/updateLocation: error=', error);
  //     return {
  //       type: ERROR,
  //       payload: null,
  //     };
  //   }
  // );

  return {
    type: UPDATE_LOCATION,
    payload: USER_API.updateLocation(user, location),
  };
};

export const addUserContact = (user, userContact) => {
  // console.log('UserActions/addUserContact: newUserWithSharedLocation');
  return {
    type: ADD_USER_CONTACT,
    payload: USER_API.addUserContact(user, userContact),
  };
};

export const addOrUpdateMarker = (marker) => {
  return {
    type: ADD_OR_UPDATE_MARKER,
    marker,
  };
};

export const deleteMarker = (_id) => {
  return {
    type: DELETE_MARKER,
    _id,
  };
};

export const setTracking = (isTracking) => {
  return {
    type: SET_TRACKING,
    isTracking,
  };
};