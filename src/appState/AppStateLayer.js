import React from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import 'redux';

import { NOTIFICATIONS_API } from '../api/NotificationsApi';
import {
  getLocationPermissions,
  getContactsPermissions,
  getNotificationsPermissions,
  updateAppState
} from './AppStateActions';
import { LOCATION_API } from '../api/LocationApi';
import {
  BACKGROUND_LOCATION_UPDATES_TASK,
} from '../../constants/values'

class AppStateLayer extends React.Component {

  /*
    The only way a user can change the permissions is to leave the app and go to settings.
    So we don't need to subscribe to permission changes if we just check the AppState!

    When this component mounts we want to subscribe to AppState events:
    - When the user leaves the experience
    - Opens the App switcher
    - Opens a notification
    - Turns the phone off
    - Other events that make you leave the app :-}
  */
  getPermissions = async () => {
    try {
      await this.props.getLocationPermissions();
      await this.props.getContactsPermissions();
      await this.props.getNotificationsPermissions();
    } catch (error) {
      console.log('AppStateLayer/getPermissions: error=', error);
    }
  }

  componentDidMount() {
    // console.log('AppStateLayer/componentDidMount');
    this.getPermissions();
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  /*
    Do some clean up!
  */
  componentWillUnmount() {
    // console.log('AppStateLayer/componentWillUnmount');
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

  getContactByUserId = (userId) => {
    const {
      contacts,
    } = this.props;
    var contact = null;
    contacts.allContactsArray.forEach((_contact) => {
      if (_contact.userId === userId) {
        contact = _contact;
      }
    });
    console.log('AppStateLayer/getContactByUserId: contact=', contact);
    return contact;
  }

  notifyAppInactiveToUsersWithSharedLocation = () => {
    const {
      user,
      sendingRelations
    } = this.props;
    console.log('AppStateLayer/notifyAppInactiveToUsersWithSharedLocation: user.userInfos.fullName=', user.userInfos.fullName);
    // on cherche les contacts vers lesquels le user courant émet sa localisation
    sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
      if (sendingRelation.senderId === user.userInfos._id) {
        console.log('AppStateLayer/notifyLocationToUsersWithSendingRelation: il existe une sendingRelation ! ', sendingRelation);
        let contact = this.getContactByUserId(sendingRelation.receiverId);
        if (contact) {
          this.notifyAppInactive(contact.expoToken)
        }
      }
    });
    // on cherche les contacts qui émettent leur localisation vers le user courant
    sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
      if (sendingRelation.receiverId === user.userInfos._id) {
        console.log('AppStateLayer/notifyLocationToUsersWithSendingRelation: il existe une sendingRelation ! ', sendingRelation);
        let contact = this.getContactByUserId(sendingRelation.senderId);
        if (contact) {
          this.notifyAppInactive(contact.expoToken)
        }
      }
    });
  }

  notifyAppInactive = (expoToken) => {
    const {
      user
    } = this.props;
    console.log('AppStateLayer/notifyAppInactive: user.userInfos.fullName=', user.userInfos.fullName);

    if (expoToken) {
      let token = expoToken;
      let title = 'WAY Inactive !!!';
      let body = 'SEND by ' + user.userInfos.fullName
      let data = {
        _id: user.userInfos._id,
        fullName: user.userInfos.fullName,
        action: 'SENDING_APP_STATE',
        payload: 'APP_INACTIVE'
      };
      console.log('AppStateLayer/notifyAppInactive: token= ', token, ' title=', title, ' body=', body, ' data=', data);
      NOTIFICATIONS_API.sendNotification(expoToken, title, body, data);
    }
  }

  /*
    - This calls our nifty redux method which will check the permission for us
    - Set appSate value of redux state
  */
  handleAppStateChangeAsync = async (nextAppState) => {
    console.log('AppStateLayer/handleAppStateChangeAsync : this.props.appState.currentAppState=',
      this.props.appState.currentAppState, ' nextAppState=', nextAppState);
    if (this.props.appState.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('AppStateLayer/handleAppStateChangeAsync: App has come to the foreground!');
    }
    else {
      console.log('AppStateLayer/handleAppStateChangeAsync: App has come to the inactive|background!');
      await LOCATION_API.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);
      await LOCATION_API.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);
      this.notifyAppInactiveToUsersWithSharedLocation();
    }
    this.props.updateAppState(nextAppState);
  }

  /*
    So we really just want the `componentDidMount` & `componentWillUnmount` so lets just pass all the props back to the child...
  */
  render() {
    return this.props.children;
  }
}


const mapStateToProps = (state) => {
  return {
    appState: state.appState,
    sendingRelations: state.sendingRelations,
    user: state.user,
    contacts: state.contacts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getLocationPermissions: () => dispatch(getLocationPermissions()),
  getContactsPermissions: () => dispatch(getContactsPermissions()),
  getNotificationsPermissions: () => dispatch(getNotificationsPermissions()),
  updateAppState: (nextAppState) => dispatch(updateAppState(nextAppState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStateLayer);
