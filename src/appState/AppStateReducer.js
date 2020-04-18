console.log('AppStateReducer...');
import { AppState } from 'react-native'
import {
  GET_LOCATION_PERMISSIONS,
  GET_CONTACTS_PERMISSIONS,
  GET_NOTIFICATIONS_PERMISSIONS,
  GET_MULTI_PERMISSIONS,
  UPDATE_APP_STATE,
} from './AppStateActions';

const INITIAL_STATE = {
  currentAppState: AppState.currentState,
  locationProvider: null,

  locationPermissions: null,
  isLocationPermissionsPending: false,
  isLocationPermissionsFulfilled: false,

  contactsPermissions: null,
  isContactsPermissionsPending: false,
  isContactsPermissionsFulfilled: false,

  notificationsPermissions: null,
  isNotificationsPermissionsPending: false,
  isNotificationsPermissionsFulfilled: false,

  multiPermissions: null,
  isMultiPermissionsPending: false,
  isMultiPermissionsFulfilled: false,
  error: {
    on: false,
    message: null,
  },
};

export const AppStateReducer = (state = INITIAL_STATE, action) => {
  // console.log('AppStateReducer: state.currentAppState=', state.currentAppState);

  switch (action.type) {
    case `${GET_LOCATION_PERMISSIONS}_PENDING`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isLocationPermissionsPending: true,
      };
    case `${GET_LOCATION_PERMISSIONS}_FULFILLED`:
      console.log('AppStateReducer: action.type=', action.type);
      // console.log('AppStateReducer: action.payload=', action.payload);
      return {
        ...state,
        locationPermissions: action.payload,
        isLocationPermissionsPending: false,
        isLocationPermissionsFulfilled: true,
      };
    case `${GET_LOCATION_PERMISSIONS}_REJECTED`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isLocationPermissionsPending: false,
        error: {
          on: true,
          message: 'Error when getting my location permissions !',
        },
      };
    case `${GET_CONTACTS_PERMISSIONS}_PENDING`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isContactsPermissionsPending: true,
      };
    case `${GET_CONTACTS_PERMISSIONS}_FULFILLED`:
      console.log('AppStateReducer: action.type=', action.type);
      // console.log('AppStateReducer: action.payload=', action.payload);
      return {
        ...state,
        contactsPermissions: action.payload,
        isContactsPermissionsPending: false,
        isContactsPermissionsFulfilled: true,
      };
    case `${GET_CONTACTS_PERMISSIONS}_REJECTED`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isContactsPermissionsPending: false,
        error: {
          on: true,
          message: 'Error when getting my contacts permissions !',
        },
      };
    case `${GET_NOTIFICATIONS_PERMISSIONS}_PENDING`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isNotificationsPermissionsPending: true,
      };
    case `${GET_NOTIFICATIONS_PERMISSIONS}_FULFILLED`:
      console.log('AppStateReducer: action.type=', action.type);
      // console.log('AppStateReducer: action.payload=', action.payload);
      return {
        ...state,
        notificationsPermissions: action.payload,
        isNotificationsPermissionsPending: false,
        isNotificationsPermissionsFulfilled: true,
      };
    case `${GET_NOTIFICATIONS_PERMISSIONS}_REJECTED`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isNotificationsPermissionsPending: false,
        error: {
          on: true,
          message: 'Error when getting my notifications permissions !',
        },
      };
      case `${GET_MULTI_PERMISSIONS}_PENDING`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isMultiPermissionsPending: true,
      };
    case `${GET_MULTI_PERMISSIONS}_FULFILLED`:
      console.log('AppStateReducer: action.type=', action.type);
      // console.log('AppStateReducer: action.payload=', action.payload);
      return {
        ...state,
        multiPermissions: action.payload,
        isMultiPermissionsPending: false,
        isMultiPermissionsFulfilled: true,
      };
    case `${GET_MULTI_PERMISSIONS}_REJECTED`:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        isMultiPermissionsPending: false,
        error: {
          on: true,
          message: 'Error when getting my multi permissions !',
        },
      };
    case UPDATE_APP_STATE:
      console.log('AppStateReducer: action.type=', action.type);
      return {
        ...state,
        currentAppState: action.payload
      };
    default:
      return state;
  }
};