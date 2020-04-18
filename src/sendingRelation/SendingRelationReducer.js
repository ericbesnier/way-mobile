console.log('sendingRelationReducer...');

import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';import {
  FIND_OR_CREATE_SENDING_RELATION,
  DELETE_SENDING_RELATION,
  DELETE_SENDING_RELATIONS,
  FETCH_SENDING_RELATIONS_BY_USER_ID,
} from './SendingRelationActions';

const INITIAL_STATE = {
  sendingRelationsArray: [],
  isFindOrCreateSendingRelationPending: false,
  isFindOrCreateSendingRelationFulfilled: false,
  isDeleteSendingRelationPending: false,
  isDeleteSendingRelationFulfilled: false,
  isDeleteSendingRelationsPending: false,
  isDeleteSendingRelationsFulfilled: false,
  isFetchSendingRelationByUserIdPending: false,
  isFetchSendingRelationByUserIdFulfilled: false,
  error: {
    on: false,
    message: null,
  },
};

export const sendingRelationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `${FIND_OR_CREATE_SENDING_RELATION}_PENDING`:
      console.log('sendingRelationReducer: action.type=', action.type);
      return {
        ...state,
        isFindOrCreateSendingRelationPending: true,
      };
    case `${FIND_OR_CREATE_SENDING_RELATION}_FULFILLED`:
      console.log('sendingRelationReducer: action.type=', action.type);
      // console.log('sendingRelationReducer: action.payload=', action.payload);

      return {
        ...state,
        sendingRelationsArray: action.payload.sendingRelations,
        isFindOrCreateSendingRelationPending: false,
        isFindOrCreateSendingRelationFulfilled: true,
      };
    case `${FIND_OR_CREATE_SENDING_RELATION}_REJECTED`:
      console.log('sendingRelationReducer: action.type=', action.type);
      return {
        ...state,
        isFindOrCreateSendingRelationPending: false,
        error: {
          on: true,
          message: 'Error when findOrCreateSendingRelation !',
        },
      };
    case `${DELETE_SENDING_RELATION}_PENDING`:
      console.log('sendingRelationReducer: action.type=', action.type);
      return {
        ...state,
        isDeleteSendingRelationPending: true,
      };
    case `${DELETE_SENDING_RELATION}_FULFILLED`:
      console.log('sendingRelationReducer: action.type=', action.type);
      console.log('sendingRelationReducer: action.payload=', action.payload);
      return {
        ...state,
        sendingRelationsArray: action.payload.sendingRelations,
        isDeleteSendingRelationPending: false,
        isDeleteSendingRelationFulfilled: true,
      };
    case `${DELETE_SENDING_RELATION}_REJECTED`:
      console.log('sendingRelationReducer: action.type=', action.type);
      return {
        ...state,
        isDeleteSendingRelationPending: false,
        error: {
          on: true,
          message: 'Error when deleteSendingRelation !',
        },
      };
      case `${DELETE_SENDING_RELATIONS}_PENDING`:
        console.log('sendingRelationReducer: action.type=', action.type);
        return {
          ...state,
          isDeleteSendingRelationsPending: true,
        };
      case `${DELETE_SENDING_RELATIONS}_FULFILLED`:
        console.log('sendingRelationReducer: action.type=', action.type);
        // console.log('sendingRelationReducer: action.payload=', action.payload);
        return {
          ...state,
          sendingRelationsArray: action.payload.sendingRelations,
          isDeleteSendingRelationsPending: false,
          isDeleteSendingRelationsFulfilled: true,
        };
      case `${DELETE_SENDING_RELATIONS}_REJECTED`:
        console.log('sendingRelationReducer: action.type=', action.type);
        return {
          ...state,
          isDeleteSendingRelationsPending: false,
          error: {
            on: true,
            message: 'Error when deleteSendingRelationsById !',
          },
        };
    case `${FETCH_SENDING_RELATIONS_BY_USER_ID}_PENDING`:
      console.log('sendingRelationReducer: action.type=', action.type);
      return {
        ...state,
        isFetchSendingRelationByUserIdPending: true,
      };
    case `${FETCH_SENDING_RELATIONS_BY_USER_ID}_FULFILLED`:
      console.log('sendingRelationReducer: action.type=', action.type);
      // console.log('sendingRelationReducer: action.payload=', action.payload);
      return {
        ...state,
        sendingRelationsArray: action.payload.sendingRelations,
        isFetchSendingRelationByUserIdPending: false,
        isFetchSendingRelationByUserIdFulfilled: true,
      };
    case `${FETCH_SENDING_RELATIONS_BY_USER_ID}_REJECTED`:
      console.log('sendingRelationReducer: action.type=', action.type);
      return {
        ...state,
        isFetchSendingRelationByUserIdPending: false,
        error: {
          on: true,
          message: 'Error when deleteSendingRelation !',
        },
      };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'sendingRelations',
  storage: AsyncStorage,
  blacklist: [
    // 'sendingRelations',
  ]
};


export default persistReducer(persistConfig, sendingRelationReducer);
