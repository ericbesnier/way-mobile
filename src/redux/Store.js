import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { reducer as form } from 'redux-form';
import reduxPromiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import storage from '@react-native-community/async-storage';


// reducers
import ContactsReducer from '../contacts/ContactsReducer';
import UserReducer from '../user/UserReducer';
import SendingRelationReducer from '../sendingRelation/SendingRelationReducer';
import NotificationReducer from '../notification/notificationReducer';
import { AppStateReducer } from '../appState/AppStateReducer';
let Persistor = null;

const middlewares = [
  reduxPromiseMiddleware,
  thunk,
];

// A c t i o n s
// -------------

export const SIGNOUT = 'SIGNOUT';

export function signout() {
  console.log('Store/signout');
  if (Persistor) {
    console.log('Store/signout: Persistor.purge()');
    Persistor.purge();
  }
  return {
    type: SIGNOUT,
  };
}

// r e d u c e r s
// ---------------

const AppReducers = combineReducers({
  sendingRelations: SendingRelationReducer,
  notifications: NotificationReducer,
  user: UserReducer,
  contacts: ContactsReducer,
  appState: AppStateReducer,
  form,
});

const RootReducer = (state, action) => {
  switch (action.type) {
    case SIGNOUT:
      console.log('Store/RootReducer: action.type=', action.type);
      Object.keys(state).forEach(key => {
        storage.removeItem(`persist:${key}`);
      });
      storage.removeItem('persist:_persist');
      state = undefined;
      break;
    default:
  }
  return AppReducers(state, action);
};

export default () => {
  let Store = createStore(
    RootReducer,
    undefined,
    applyMiddleware(...middlewares),
  );
  Persistor = persistStore(Store);
  if (Persistor) {
    console.log('Store/RootReducer: persistStore !!!!!!!!!!!!! A SUPPRIMER !!!!!!!!!!!!!');
    Persistor.purge();
  }

  return { Store, Persistor };
};
