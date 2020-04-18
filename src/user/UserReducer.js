console.log('UserReducer...');
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import {
  LOGIN,
  LOGOUT,
  SIGN_IN_FIREBASE,
  GET_EXPO_TOKEN,
  REGISTER_FOR_NOTIFICATIONS,
  ADD_USER_CONTACT,
  UPDATE_LOCATION,
  ADD_OR_UPDATE_MARKER,
  DELETE_MARKER,
  SET_TRACKING,
} from './UserActions';


const INITIAL_STATE = {
  userInfos: {
    _id: null,
    firstName: null,
    lastName: null,
    fullName: null,
    phoneNumber: null,
    email: null,
    address: null,
    avatar: null,
    expoToken: null,
    JWTtoken: null,
    providerData: {
      uid: null,
      provider: null,
    },
    providerToken: null,
    idToken: null,
    usersContacts: [],
    usersWithBidirectionalSharedLocation: [],
    contactsWithPendingConnection: [],
    usersWithConnection: [],
    locations: [],
    locationError: {
      on: false,
      message: null,
    },
    marker: {
      _id: null,
      title: null,
      coordinates: {
        latitude: null,
        longitude: null
      },
      description: null
    },
    isLogged: false,
  },
  expoPushToken: null,
  firebaseCredentials: null,
  error: {
    on: false,
    message: null,
  },
  markers: [],

  isLoginPending: false,
  isLoginFulfilled: false,

  isLogoutPending: false,
  isLogoutFulfilled: false,

  isSignInFirebasePending: false,
  isSignInFirebaseFulfilled: false,

  isGetExpoTokenPending: false,
  isGetExpoTokenFulfilled: false,

  isRegisterForNotificationsPending: false,
  isRegisterForNotificationsFulfilled: false,

  isAddUserContactPending: false,
  isAddUserContactFulfilled: false,

  isSetIsLocationSentUserContactPending: false,
  isSetIsLocationSentUserContactFulfilled: false,

  isSetIsLocationReceivedUserContactPending: false,
  isSetIsLocationReceivedUserContactFulfilled: false,

  isSetIsLocationSentUserContactPending: false,
  isupdateLocationsSentStatusUserContactFulfilled: false,

  isAddContactWithPendingConnectionPending: false,
  isAddContactWithPendingConnectionFullfilled: false,

  isLocationPending: false,
  isLocationFulfilled: false,

  isTracking: false,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `${LOGIN}_PENDING`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isLoginPending: true,
      };
    case `${LOGIN}_FULFILLED`:
      console.log('UserReducer: action.type=', action.type);
      // console.log('UserReducer: action.payload.userInfos=', action.payload.userInfos);
      return {
        ...state,
        userInfos: action.payload.userInfos,
        isLoginPending: false,
      };
    case `${LOGIN}_REJECTED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isLoginPending: false,
        error: {
          on: true,
          message: 'Error when login !',
        },
      };
    case `${LOGOUT}_PENDING`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isLogoutPending: true,
      };
    case `${LOGOUT}_FULFILLED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        userInfos: action.payload.userInfos,
        isLogoutPending: false,
      };
    case `${LOGOUT}_REJECTED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isLogoutPending: false,
        error: {
          on: true,
          message: 'Error when logout !',
        },
      };
    case `${SIGN_IN_FIREBASE}_PENDING`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isSignInFirebasePending: true,
      };
    case `${SIGN_IN_FIREBASE}_FULFILLED`:
      console.log('UserReducer: action.type=', action.type);
      // console.log('UserReducer: action.payload=', action.payload);
      return {
        ...state,
        firebaseCredentials: action.payload,
        isSignInFirebasePending: false,
        isSignInFirebaseFulfilled: true,
      };
    case `${SIGN_IN_FIREBASE}_REJECTED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isSignInFirebasePending: false,
        error: {
          on: true,
          message: 'Error when sign in Firebase !',
        },
      };
    case `${GET_EXPO_TOKEN}_PENDING`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isGetExpoTokenPending: true,
      };
    case `${GET_EXPO_TOKEN}_FULFILLED`:
      console.log('UserReducer: action.type=', action.type);
      // console.log('UserReducer: action.payload=', action.payload);
      return {
        ...state,
        isGetExpoTokenPending: false,
        isGetExpoTokenFulfilled: true,
        expoPushToken: action.payload,
      };
    case `${GET_EXPO_TOKEN}_REJECTED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isGetExpoTokenPending: false,
        error: {
          on: true,
          message: 'Error when loading Expo push Token !',
        },
      };
    case `${REGISTER_FOR_NOTIFICATIONS}_PENDING`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isRegisterForNotificationsPending: true,
      };
    case `${REGISTER_FOR_NOTIFICATIONS}_FULFILLED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isRegisterForNotificationsPending: false,
        isRegisterForNotificationsFulfilled: true,
        userInfos: action.payload.userInfos,
      };
    case `${REGISTER_FOR_NOTIFICATIONS}_REJECTED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isRegisterForNotificationsPending: false,
        error: {
          on: true,
          message: 'Error when registering for push notifications !',
        },
      };
    case `${UPDATE_LOCATION}_PENDING`:
        // console.log('UserReducer: action.type=', action.type);
        // console.log('UserReducer: action.payload', action.payload);      
        return {
        ...state,
        isLocationPending: true,
      };
    case `${UPDATE_LOCATION}_FULFILLED`:
      // console.log('UserReducer: action.type=', action.type);
      // console.log('UserReducer: action.payload', action.payload);
      return {
        ...state,
        userInfos: action.payload.userInfos,
        isLocationPending: false,
        isLocationFulfilled: true,
      };
    case `${UPDATE_LOCATION}_REJECTED`:
        console.log('UserReducer: action.type=', action.type);
        console.log('UserReducer: action.payload', action.payload);
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isLocationPending: false,
        error: {
          on: true,
          message: 'Error when update location !',
        },
      };
    case `${ADD_USER_CONTACT}_PENDING`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isAddUserContactPending: true,
      };
    case `${ADD_USER_CONTACT}_FULFILLED`:
      console.log('UserReducer: action.type=', action.type);
      // console.log('UserReducer: action.payload', action.payload);
      return {
        ...state,
        userInfos: action.payload.userInfos,
        isAddUserContactPending: false,
        isAddUserContactFulfilled: true,
      };
    case `${ADD_USER_CONTACT}_REJECTED`:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        isAddUserContactPending: false,
        error: {
          on: true,
          message: 'Error when add user with shared location !',
        },
      };
    case ADD_OR_UPDATE_MARKER:
      console.log('UserReducer: action.type=', action.type);
      console.log('UserReducer: action.marker=', action.marker);
      var index = getIndex(state.markers, action.marker._id);
      if (index > -1) {
        console.log('UserReducer: UPDATE markers: index=', index);
        let markersTmp1 = state.markers;
        let markersTmp2 = markersTmp1.filter(marker => marker._id !== action.marker._id);
        console.log('UserReducer: [...markersTmp2, action.marker]=', [...markersTmp2, action.marker]);
        return {
          ...state,
          markers: [...markersTmp2, action.marker]
        };
      } else {
        console.log('UserReducer: ADD to markers: index=', index);
        return {
          ...state,
          markers: [...state.markers, action.marker]
        };
      }
    case DELETE_MARKER:
      console.log('UserReducer: action.type=', action.type);
      return {
        ...state,
        markers: deleteItemById(state.markers, action._id)
      };
      case SET_TRACKING:
        console.log('UserReducer: action.type=', action.type);
        return {
          ...state,
          isTracking: action.isTracking
        };
    default:
      return state;
  }
};

getIndex = (markers, _id) => {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]._id === _id) {
      return i;
    }
  }
  return -1;
}

deleteItemById = (array, _id) => {
  // console.log('====================================');
  // console.log('userReducer/deleteItemById array=', array);
  // console.log('====================================');
  // console.log('userReducer/deleteItemById _id=', _id);
  return array.filter(item => item._id !== _id);
}

const persistConfig = {
  key: 'user',
  storage: AsyncStorage,
  blacklist: [
    'locations',
    'isLocationFulfilled',
    'isLocationPending',
    'locationError',
    'markers',
  ]
};

export default persistReducer(persistConfig, UserReducer);