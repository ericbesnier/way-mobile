console.log('notificationReducer...');

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  ADD_PENDING_NOTIFICATION,
  REMOVE_PENDING_NOTIFICATION_BY_ID,
} from './notificationActions';

const INITIAL_STATE = {
  notificationsPendingArray: [],
};

export const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_PENDING_NOTIFICATION:
      console.log('notificationReducer: action.type=', action.type);
      console.log('notificationReducer: action.payload=', action.payload);
      console.log('notificationReducer: state=', state);
      const item = action.payload;
      return {
        ...state,
        notificationsPendingArray: [...state.notificationsPendingArray, action.payload ]
      };
    case REMOVE_PENDING_NOTIFICATION_BY_ID:
      console.log('notificationReducer: action.type=', action.type);
      console.log('notificationReducer: action.payload=', action.payload);
      console.log('notificationReducer: state=', state);
      return {
        ...state,
        notificationsPendingArray: state.notificationsPendingArray.filter((item) => {
          console.log('notificationReducer: item=', item);
          if (item.appNotifId === action.payload) {
            console.log('notificationReducer: item.appNotifId === action.payload.appNotifId !!!!');
            return false;
          }
          return true;
        })
      };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'notificationRelation',
  storage: storage,
  blacklist: [
    // 'sendingRelation',
  ]
};


export default persistReducer(persistConfig, notificationReducer);
