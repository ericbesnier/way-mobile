console.log('NotificationsApi...');
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import { logErrorResponseServer } from '../commons/LogError';
import getEnvVars from '../../environment';
const { FireBaseConfig } = getEnvVars();

firebase.initializeApp(FireBaseConfig);

// Listen for authentication state to change.
firebase.auth().onAuthStateChanged((user) => {
  if (user != null) {
    console.log('NotificationsApi : Firebase : We are authenticated as user.email=', user.email);
  } else {
    console.log('NotificationsApi : Firebase :  No user is signed in !!');
  }
});

// N o t i f i c a t i o n s A p i
// -------------------------------
class NotificationsApi {

  signInFirebase = async (provider, providerToken, idToken) => {
    // console.log('NotificationsApi/signInFirebase: provider=', provider, ' providerToken=', providerToken, ' idToken=', idToken);
    let OAuthCredential = null;
    if (provider === 'google') {
      try {
        // Build Firebase credential with the Google access token.
        OAuthCredential = await firebase.auth.GoogleAuthProvider.credential(idToken, providerToken);
        // console.log('NotificationsApi/signInFirebase: OAuthCredential=', OAuthCredential);
      } catch (error) {
        logErrorResponseServer('NotificationsApi/signInFirebase: firebase.auth.GoogleAuthProvider.credential', error);
      }
    } else {
      try {
        // Build Firebase credential with the Facebook access token.
        OAuthCredential = await firebase.auth.FacebookAuthProvider.credential(idToken, providerToken);
      } catch (error) {
        logErrorResponseServer('NotificationsApi/signInFirebase: firebase.auth.FacebookAuthProvider.credential', error);
      }
    }
    try {
      // Sign in with Firebase credential from the user.
      // const userCredential = await firebase.auth().signInAndRetrieveDataWithCredential(OAuthCredential)
      const userCredential = await firebase.auth().signInWithCredential(OAuthCredential)
      // console.log('NotificationsApi/signInFirebase: userCredential=', userCredential);
      return userCredential;
    } catch (error) {
      logErrorResponseServer('NotificationsApi/signInFirebase: firebase.auth().signInAndRetrieveDataWithCredential', error);
    }
  }

  getNotificationsExpoPushToken = async () => {
    // console.log('NotificationsApi/getNotificationsExpoPushToken');
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    try {
      // Get the token that uniquely identifies this device
      let expoPushToken = await Notifications.getExpoPushTokenAsync();
      console.log('NotificationsApi/getNotificationsExpoPushToken: expoPushToken=', expoPushToken);
      return expoPushToken;
    } catch (error) {
      logErrorResponseServer('NotificationsApi/getNotificationsExpoPushToken: error=', error);
    }
  }

  sendNotification = async (token, title, body, data) => {
    // console.log('NotificationsApi/sendNotification: token=', token, ' title=', title, 'body=', body, ' data=', data);
    const message = {
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data,
    };
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      // console.log('NotificationsApi/sendNotification: response=', response);

      // var _bodyInit = JSON.parse(response._bodyInit);
      // console.log('NotificationsApi/sendNotification: _bodyInit=', _bodyInit);
      // var id = { ids: [_bodyInit.data.id] }
      // console.log('NotificationsApi/sendNotification: id=', id);
      // // NotificationsApi/sendNotification: response data= {"data":{"id":"b9d427d1-9ae0-4127-a326-5aa35994ab57","status":"ok"}}
      // const responseReceipt = await fetch('https://exp.host/--/api/v2/push/getReceipts',
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(id),
      //   });
      // console.log('NotificationsApi/sendNotification: responseReceipt=', responseReceipt);
    } catch (e) { throw e; }
  }

  addNotificationsListener = (handleNotification) => {
    // console.log('NotificationsApi/addNotificationsListener');
    let notificationSubscription = Notifications.addListener(handleNotification);
    // console.log('NotificationsApi/addNotificationsListener: notificationSubscription=', notificationSubscription);
    return notificationSubscription;
  }
}

export const NOTIFICATIONS_API = new NotificationsApi();
