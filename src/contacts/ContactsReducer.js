console.log('ContactsReducer...');
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {
  FETCH_ALL_CONTACTS,
  FETCH_FILTERED_CONTACTS,
  SET_SEARCH,
  CANCEL_SEARCH,
  ADD_CONTACT,
  ADD_EXPO_TOKEN_TO_CONTACT,
  ADD_USER_ID_TO_CONTACT
} from './ContactsActions';

const INITIAL_STATE = {
  allContactsArray: [],
  filteredContactsArray: [],
  isFetchAllContactsPending: false,
  isFetchAllContactsFulfilled: false,
  showLoading: false,
  areFiltered: false,
  search: '',
  error: {
    on: false,
    message: null,
  },
};

const ContactsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `${FETCH_ALL_CONTACTS}_PENDING`:
      console.log('ContactsReducer: action.type=', action.type);
      return {
        ...state,
        isFetchAllContactsPending: true,
      };
    case `${FETCH_ALL_CONTACTS}_FULFILLED`:
      console.log('ContactsReducer: action.type=', action.type);
      // console.log('ContactsReducer: action.payload=', action.payload);
      return {
        ...state,
        allContactsArray: action.payload,
        isFetchAllContactsPending: false,
        isFetchAllContactsFulfilled: true,
        error: {
          on: false,
          message: null,
        },
      };
    case `${FETCH_ALL_CONTACTS}_REJECTED`:
      console.log('ContactsReducer: action.type=', action.type);
      return {
        ...state,
        isFetchAllContactsPending: false,
        error: {
          on: true,
          message: 'Error when fetching All contacts',
        },
      };
    case FETCH_FILTERED_CONTACTS:
      console.log('ContactsReducer: action.type=', action.type);
      // console.log('ContactsReducer: action.data=', action.data);
      return {
        ...state,
        filteredContactsArray: action.data,
        areFiltered: true,
        showLoading: false,
      };
    case SET_SEARCH:
      console.log('ContactsReducer: action.type=', action.type);
      return {
        ...state,
        search: action.search,
        showLoading: true,
      };
    case CANCEL_SEARCH:
      console.log('ContactsReducer: action.type=', action.type);
      return {
        ...state,
        filteredContactsArray: action.data,
        areFiltered: false,
      };
    case ADD_CONTACT:
      console.log('ContactsReducer: action.type=', action.type);
      return {
        ...state,
        allContactsArray: [...state.allContactsArray, action.contact],
      };
    case ADD_EXPO_TOKEN_TO_CONTACT:
      console.log('ContactsReducer: action.type=', action.type);
      // console.log('ContactsReducer: action.data=', action.data);
      let newAllContactsArray1 = state.allContactsArray.slice();
      newAllContactsArray1.map((contactState) => {
        if(contactState.emails) {
          contactState.emails.forEach((emailState) => {
            action.data.contact.emails.forEach((emailAction) => {
              if(emailState.email === emailAction.email) {
                contactState.expoToken = action.data.expoToken;
                return contactState;
              }
              return contactState;
            });
          });
        }
      });
      return {
        ...state,
        allContactsArray: newAllContactsArray1
      };
    case ADD_USER_ID_TO_CONTACT:
      console.log('ContactsReducer: action.type=', action.type);
      // console.log('ContactsReducer: action.data=', action.data);
      let newAllContactsArray2 = state.allContactsArray.slice();
      newAllContactsArray2.map((contactState) => {
        if(contactState.emails) {
          contactState.emails.forEach((emailState) => {
            action.data.contact.emails.forEach((emailAction) => {
              if(emailState.email === emailAction.email) {
                contactState.userId = action.data.userId;
                return contactState;
              }
              return contactState;
            });
          });
        }
      });
      return {
        ...state,
        allContactsArray: newAllContactsArray2
      };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'contact',
  storage: AsyncStorage,
  blacklist: [
  ]
};

export default persistReducer(persistConfig, ContactsReducer);