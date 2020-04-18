console.log('MapContainer...');
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import MapScreen from './MapScreen';
import LoadingScreen from '../commons/LoadingScreen';
import { LOCATION_API } from '../api/LocationApi';
import { NOTIFICATIONS_API } from '../api/NotificationsApi';
import { getImage } from '../../helpers/getImage';
import {
  updateLocation as _updateLocation,
  updateLocationOfUserWithSharedLocation as _updateLocationOfUserWithSharedLocation,
  registerForNotifications as _registerForNotifications,
  signInFirebase as _signInFirebase,
  getExpoPushToken as _getExpoPushToken,
  addOrUpdateMarker as _addOrUpdateMarker,
  deleteMarker as _deleteMarker,
} from '../user/UserActions';
import {
  addContact as _addContact,
  addUserIdToContact as _addUserIdToContact,
  addExpoTokenToContact as _addExpoTokenToContact
} from '../contacts/ContactsActions';
import {
  findOrCreateSendingRelation as _findOrCreateSendingRelation,
  deleteSendingRelation as _deleteSendingRelation,
  deleteSendingRelationsById as _deleteSendingRelationsById,
  fetchSendingRelationsById as _fetchSendingRelationsById,
} from '../sendingRelation/SendingRelationActions';
import {
  addPendingNotification as _addPendingNotification,
  removePendingNotificationById as _removePendingNotificationById
} from '../notification/notificationActions';
import { ErrorBoundary } from '../commons/ErrorBoundary';
import {
  isEmptyObject,
  currentDate
} from '../commons/Utils'
import { userToContact } from "../commons/UserToContact";

class MapContainer extends Component {
  constructor(props) {
    super(props);
    // console.log('MapContainer/constructor: getLocationPermissions');
    this.state = {
      watchId: -1,
      notification: {},
      isListeningForNotifications: false,
    };
  }

  subscribeAndPostLocationUpdates = async () => {
    console.log('MapContainer/subscribeAndPostLocationUpdates: ', currentDate());
    const {
      user,
      updateLocation,
    } = this.props;

    if (this.state.watchId === -1) {
      try {
        let _watchId = await LOCATION_API.watchPositionAsync(async (location) => {
            console.log('MapContainer/subscribeAndPostLocationUpdates: ', currentDate(), ' location=', location);
            var locationAddress = await LOCATION_API.reverseGeocodeAsync(location);
            console.log('MapContainer/subscribeAndPostLocationUpdates: ', currentDate(), ' locationAddress=', locationAddress);
            location.locationAddress = locationAddress;
            await updateLocation(user, location);
            this.notifyLocationToUsersWithSendingRelation(location);
        });
        this.setState({ watchId: _watchId });
      } catch (error) {
        console.log('MapContainer/subscribeAndPostLocationUpdates: error=', error);
      }
    }
  }

  isSendingRelation = (senderId, receiverId) => {
    const {
      sendingRelations
    } = this.props;
    var isSendingRelation = false;
    sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
      if (sendingRelation.senderId === senderId && sendingRelation.receiverId === receiverId) {
        // console.log('MapContainer/isSendingRelation: il existe une sendingRelation ! ', sendingRelation);
        isSendingRelation = true;
      }
    })
    return isSendingRelation;
  }

  isReceivingRelation = (senderId, receiverId) => {
    const {
      sendingRelations
    } = this.props;
    var isReceivingRelation = false;
    sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
      if (sendingRelation.senderId === receiverId && sendingRelation.receiverId === senderId) {
        // console.log('MapContainer/isReceivingRelation: il existe une receivingRelation ! ', sendingRelation);
        isReceivingRelation = true;
      }
    })
    return isReceivingRelation;
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
    console.log('MapContainer/getContactByUserId: contact=', contact);
    return contact;
  }

  notifyLocationToUsersWithSendingRelation = async (location) => {
    const {
      user,
      sendingRelations,
      fetchSendingRelationsById
    } = this.props;
    // console.log('MapContainer/notifyLocationToUsersWithSendingRelation: user.userInfos.fullName=', user.userInfos.fullName);
    // console.log('MapContainer/notifyLocationToUsersWithSendingRelation: user.userInfos._id=', user.userInfos._id);
    // console.log('MapContainer/notifyLocationToUsersWithSendingRelation: sendingRelations=', sendingRelations);

    await fetchSendingRelationsById(user.userInfos._id);

    sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
      if (sendingRelation.senderId === user.userInfos._id) {
        console.log('MapContainer/notifyLocationToUsersWithSendingRelation: il existe une sendingRelation ! ', sendingRelation);
        var contact = this.getContactByUserId(sendingRelation.receiverId);
        if (contact) {
          this.notifyLocation(contact, location)
        }
      }
    });
  }

  notifyLocation = (contact, location) => {
    const {
      user,
      deleteSendingRelationsById,
      notifications,
      addPendingNotification,
      removePendingNotificationById
    } = this.props;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NOTIFY LOCATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log('MapContainer/notifyLocation: user.userInfos.fullName=', user.userInfos.fullName, ' notifications=', notifications);
    console.log('MapContainer/notifyLocation: location=', location);
    let expoToken = contact.expoToken;
    if (expoToken) {
      let title = 'Location !!!';
      let body = 'SEND by ' + user.userInfos.fullName
      let data = {
        action: 'SENDING_LOCATION',
        contact: userToContact(user),
        timestamp: Math.round(+new Date() / 1000),
        appNotifId: Math.floor(Math.random() * 100000),
        payload: location
      };
      addPendingNotification({
        appNotifId: data.appNotifId,
        expoToken: expoToken,
        name: contact.name,
        timestamp: data.timestamp
      });
      var count = 0;
      notifications.notificationsPendingArray.forEach((notificationPending) => {
        if (notificationPending.expoToken === expoToken) {
          count++;
        }
      });
      if (count > 5) {
        console.log('MapContainer/notifyLocation : plus de 5 notifications pending !!!!!! notifications.notificationsPendingArray=', notifications.notificationsPendingArray);
        let msg = 'L\'utilisateur ' + contact.name + ' est déconnecté';
        Alert.alert(
          'UTILISATEUR DECONNECTE !!',
          msg
        );
        notifications.notificationsPendingArray.forEach((notificationPending) => {
          if (notificationPending.expoToken === expoToken) {
            removePendingNotificationById(notificationPending.appNotifId);
          }
        });
        deleteSendingRelationsById(contact.userId);
        this.props.deleteMarker(contact.userId);
      } else {
        NOTIFICATIONS_API.sendNotification(expoToken, title, body, data);
      }
    }
  }

  sendLocationAck = (expoToken, appNotifId) => {
    const {
      user,
    } = this.props;
    console.log('MapContainer/sendLocationAck: expoToken=', expoToken, ' appNotifId=', appNotifId);
    if (expoToken) {
      let title = 'Location Acknowledgement!!!';
      let body = 'SEND by ' + user.userInfos.fullName
      let data = {
        action: 'SENDING_LOCATION_ACK',
        contact: userToContact(user),
        timestamp: Math.round(+new Date() / 1000),
        appNotifId: appNotifId,
        payload: null
      };
      NOTIFICATIONS_API.sendNotification(expoToken, title, body, data);
    }
  }

  onLocationAckReceived = async (notification) => {
    console.log('MapContainer/onLocationAckReceived : notification=', notification);
    const {
      notifications,
      removePendingNotificationById
    } = this.props;
    notifications.notificationsPendingArray.forEach((notificationPending) => {
      if (notificationPending.expoToken === notification.data.contact.expoToken) {
        removePendingNotificationById(notificationPending.appNotifId);
      }
    });
  }

  unwatchPositionAsync = () => {
    if (this.state.watchId !== -1) {
      this.state.watchId.remove();
      this.setState({ watchId: -1 });
    }
  }

  getContactByEmail = (email) => {
    const {
      contacts,
    } = this.props;
    contacts.allContactsArray.forEach((_contact) => {
      if (_contact.emails) {
        _contact.emails.forEach((_email) => {
          if (_email.email === email) {
            contact = _contact;
          }
        })
      }
    })
    console.log('MapContainer/getContactByEmail: return contact=', contact);
    return contact;
  }

  updateContactsOnNotificationReceived = (notification) => {
    const {
      addContact,
      addExpoTokenToContact,
      addUserIdToContact
    } = this.props;
    var senderContact = notification.data.contact;
    var senderId = senderContact.userId;
    var senderExpoToken = senderContact.expoToken;
    var senderFullName = senderContact.name;
    var senderEmail = senderContact.emails[0].email; // le contact (user) n'a qu'un seul email

    // on cherche si la notification provient d'un user qui est un contact du user courant
    var contact = this.getContactByEmail(senderEmail);
    if (contact !== null) {
      console.log('MapContainer/updateContactsOnNotificationReceived: le contact ', senderFullName, ' appartient aux contacts du user courant !');
      if (!contact.expoToken) {
        addExpoTokenToContact(senderExpoToken, contact);
      }
      if (!contact.userId) {
        addUserIdToContact(senderId, contact);
      }
    } else {
      addContact(senderContact);
      addExpoTokenToContact(senderExpoToken, contact);
      addUserIdToContact(senderId, contact);
    }
  }

  onLocationReceived = async (notification) => {
    console.log('MapContainer/onLocationReceived : notification=', notification);
    const {
      user,
      findOrCreateSendingRelation,
      addOrUpdateMarker
    } = this.props;
    var senderContact = notification.data.contact;
    var senderId = senderContact.userId;
    var senderEmail = senderContact.emails[0].email;
    var senderFirstName = senderContact.firstName || '';
    var senderLastName = senderContact.lastName || '';
    var senderFullName = senderContact.name || '';
    var senderExpoToken = senderContact.expoToken;
    var senderIsLogged = senderContact.isLogged;
    var senderLocation = notification.data.payload;
    var senderLocationAddress = senderLocation.locationAddress;
    var name = senderLocationAddress[0].name || '';
    var street = senderLocationAddress[0].street || '';
    var postalCode = senderLocationAddress[0].postalCode || '';
    var city = senderLocationAddress[0].city || '';
    if(name === ''){
      var senderLocationAddressStr = street + ' ' + postalCode + ' ' + city;
    } else {
      var senderLocationAddressStr = name + ' ' +street + ' ' + postalCode + ' ' + city;
    }
    var senderColor;
    console.log('MapContainer/onLocationReceived: senderLocationAddressStr=', senderLocationAddressStr);
    console.log('MapContainer/onLocationReceived : senderContact.expoToken=', senderContact.expoToken, ' notification.appNotifId=', notification.data.appNotifId);

    this.sendLocationAck(senderContact.expoToken, notification.data.appNotifId);
    this.updateContactsOnNotificationReceived(notification);
    // console.log('MapContainer/onLocationReceived: on créé la relation entre ', senderId, ' et ', user.userInfos._id);
    try {
      await findOrCreateSendingRelation({
        senderId: senderId,
        senderEmail: senderEmail,
        senderFirstName: senderFirstName,
        senderLastName: senderLastName,
        senderFullName: senderFullName,
        senderExpoToken: senderExpoToken,
        senderIsLogged: senderIsLogged,
        receiverId: user.userInfos._id,
        receiverEmail: user.userInfos.email,
        receiverFirstName: user.userInfos.firstName || '',
        receiverLastName: user.userInfos.lastName || '',
        receiverFullName: user.userInfos.fullName || '',
        receiverExpoToken: user.userInfos.expoToken,
        receiverIsLogged: user.userInfos.isLogged,
      });
    } catch (error) {
      console.log('MapContainer/onLocationReceived: ERROR findOrCreateSendingRelation ! error=', error);
    }
    if (this.isReceivingRelation(senderId, user.userInfos._id)) {
      senderColor = 'blue';
    } else {
      senderColor = 'orange'
    };
    let markerOfSender = {
      _id: senderId,
      title: senderFullName,
      coordinates: {
        latitude: senderLocation.coords.latitude,
        longitude: senderLocation.coords.longitude
      },
      description: senderLocationAddressStr,
      email: senderEmail,
      color: senderColor,
      image: getImage(senderFullName.substring(0, 1), senderColor)
    };
    addOrUpdateMarker(markerOfSender);
  }

  onLocationRequestReceived = async (notification) => {
    console.log('MapContainer/onLocationRequestReceived : notification=', notification);
    const { navigate } = this.props.navigation;
    const {
      user,
      findOrCreateSendingRelation,
      addOrUpdateMarker
    } = this.props;
    var senderContact = notification.data.contact;
    var senderId = senderContact.userId;
    var senderEmail = senderContact.emails[0].email;
    var senderFirstName = senderContact.firstName || '';
    var senderLastName = senderContact.lastName || '';
    var senderFullName = senderContact.name || '';
    var senderExpoToken = senderContact.expoToken;
    var senderIsLogged = senderContact.isLogged;
    var senderLocation = notification.data.payload;
    var senderLocationAddress = notification.data.payload.locationAddress;
    console.log('MapContainer/onLocationRequestReceived: senderLocationAddress=', senderLocationAddress);

    var name = senderLocationAddress[0].name || '';
    var street = senderLocationAddress[0].street || '';
    var postalCode = senderLocationAddress[0].postalCode || '';
    var city = senderLocationAddress[0].city || '';
    if(name === ''){
      var senderLocationAddressStr = street + ' ' + postalCode + ' ' + city;
    } else {
      var senderLocationAddressStr = name + ' ' + postalCode + ' ' + city;
    }
    var senderColor;
    console.log('MapContainer/onLocationRequestReceived: senderLocationAddressStr=', senderLocationAddressStr);
    console.log('MapContainer/onLocationRequestReceived : senderContact.expoToken=', senderContact.expoToken, ' notification.appNotifId=', notification.appNotifId);

    this.sendLocationAck(senderContact.expoToken, notification.data.appNotifId);
    this.updateContactsOnNotificationReceived(notification);

    try {
      // console.log('MapContainer/onLocationReceived: on créé la relation entre ', senderId, ' et ', user.userInfos._id);
      await findOrCreateSendingRelation({
        senderId: senderId,
        senderEmail: senderEmail,
        senderFirstName: senderFirstName || '',
        senderLastName: senderLastName || '',
        senderFullName: senderFullName || '',
        senderExpoToken: senderExpoToken,
        senderIsLogged: senderIsLogged,
        receiverId: user.userInfos._id,
        receiverEmail: user.userInfos.email,
        receiverFirstName: user.userInfos.firstName || '',
        receiverLastName: user.userInfos.lastName || '',
        receiverFullName: user.userInfos.fullName || '',
        receiverExpoToken: user.userInfos.expoToken,
        receiverIsLogged: user.userInfos.isLogged,
      });
    } catch (error) {
      console.log('MapContainer/onLocationReceived: ERROR findOrCreateSendingRelation ! error=', error);
    }
    if (this.isReceivingRelation(senderId, user.userInfos._id)) {
      senderColor = 'blue';
    } else {
      senderColor = 'orange'
    };
    let markerOfSender = {
      _id: senderId,
      title: senderFullName,
      coordinates: {
        latitude: senderLocation.coords.latitude,
        longitude: senderLocation.coords.longitude
      },
      description: senderLocationAddressStr,
      email: senderEmail,
      color: senderColor,
      image: getImage(senderFullName.substring(0, 1), senderColor)
    };
    addOrUpdateMarker(markerOfSender);
    var contact = this.getContactByEmail(senderEmail);
    if (notification.origin === 'selected') {
      Alert.alert(
        'Partage de localisation',
        `Pour continuer, partagez votre localisation avec ${contact.name}`,
        [
          { text: 'ANNULER', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          {
            text: 'OK', onPress: () => {
              console.log('MapContainer/onLocationRequestReceived: notification sélectionnée par l\'utilisateur et confirmée OK !!');
              navigate('ContactsDetailsScreen', { contact: contact });
            }
          },
        ],
        { cancelable: false }
      );
    }
  }

  onNoLocationRequestReceived = async (notification) => {
    console.log('MapContainer/onNoLocationRequestReceived : notification=', notification);
    const {
      user,
      deleteSendingRelation,
      deleteMarker
    } = this.props;
    let senderId = notification.data.contact.userId;
    // console.log('MapContainer/onNoLocationRequestReceived: on supprime le marker de ', senderFullName);
    deleteMarker(senderId);
    try {
      await deleteSendingRelation({ senderId: senderId, receiverId: user.userInfos._id })
    } catch (error) {
      console.log('MapContainer/onNoLocationRequestReceived: ERROR deleteSendingRelation ! error=', error);
    }
  }

  onAppStateReceived = (notification) => {
    let appState = notification.data.payload;
    let _id = notification.data._id;

    if (appState === 'APP_INACTIVE') {
      console.log('MapContainer/onAppStateReceived: appState=', appState);
      this.props.deleteMarker(_id);
    } else {
      console.log('MapContainer/onAppStateReceived: appState=', appState);
    }
  }

  onLoginFulfilledReceived = async (notification) => {
    console.log('MapContainer/onLoginFulfilledReceived : notification=', notification);
    const {
      user,
      addExpoTokenToContact,
      addUserIdToContact,
      findOrCreateSendingRelation
    } = this.props;
    let contact = notification.data.contact;
    console.log('MapContainer/onLoginFulfilledReceived: contact=', contact);
    addExpoTokenToContact(contact.expoToken, contact);
    addUserIdToContact(contact.userId, contact);
    console.log('MapContainer/onLoginFulfilledReceived: on créé la relation entre ', user.userInfos._id, ' et ', contact.userId);
    try {
      await findOrCreateSendingRelation({ senderId: user.userInfos._id, receiverId: contact.userId })
    } catch (error) {
      console.log('MapContainer/onLoginFulfilledReceived: ERROR findOrCreateSendingRelation ! error=', error);
    }
  }

  handleNotification = (notification) => {
    // console.log('MapContainer/handleNotification: notification RECEIVED =', notification);
    if (!isEmptyObject(notification.data)) {
      console.log('MapContainer/handleNotification: notification.data.action=', notification.data.action);

      switch (notification.data.action) {
        case 'SENDING_LOCATION':
          this.onLocationReceived(notification);
          return;
        case 'SENDING_LOCATION_ACK':
          this.onLocationAckReceived(notification);
          return;
        case 'SENDING_LOCATION_REQUEST':
          this.onLocationRequestReceived(notification);
          return;
        case 'SENDING_LOCATION_REQUEST_ACK':
          this.onLocationRequestAckReceived(notification);
          return;
        case 'SENDING_NO_LOCATION_REQUEST':
          this.onNoLocationRequestReceived(notification);
          return;
        case 'SENDING_APP_STATE':
          this.onAppStateReceived(notification);
          return;
        case 'LOGIN_FULFILLED':
          this.onLoginFulfilledReceived(notification);
          return;
        default:
          console.log('MapContainer/handleNotification: unknown action !!! notification.data.action=',
            notification.data.action);
          return;
      }
    };
  };

  componentDidMount = () => {
    const {
      user
    } = this.props;
    if (user.userInfos.isLogged
      && !user.isSignInFirebasePending
      && !user.isSignInFirebaseFulfilled) {
      console.log('MapContainer/componentDidMount: user.userInfos.providerData.provider=',
        ' user.userInfos.providerToken=', user.userInfos.providerToken, ' user.userInfos.idToken=', user.userInfos.idToken);
      this.props.signInFirebase(user.userInfos.providerData.provider, user.userInfos.providerToken, user.userInfos.idToken);
    }
  }

  componentDidUpdate = () => {
    const {
      appState,
      user
    } = this.props;

    if (!user.isGetExpoTokenPending
      && !user.isGetExpoTokenFulfilled) {
      this.props.getExpoPushToken();
      return;
    }
    if (user.userInfos.isLogged
      && user.isSignInFirebaseFulfilled
      && user.isGetExpoTokenFulfilled
      && !user.isRegisterForNotificationsPending
      && !user.isRegisterForNotificationsFulfilled) {
      this.props.registerForNotifications(user, user.expoPushToken);
      return;
    }
    if (user.isRegisterForNotificationsFulfilled
      && !this.state.isListeningForNotifications) {
      NOTIFICATIONS_API.addNotificationsListener(this.handleNotification);
      this.setState({ isListeningForNotifications: true })
    }
    if (appState.isLocationPermissionsFulfilled) {
      // console.log('MapContainer/componentDidUpdate: appState=', appState);
      let locationPermissionsStatus = appState.locationPermissions.status;
      // console.log('MapContainer/componentDidUpdate: locationPermissionsStatus=', locationPermissionsStatus);
      switch (locationPermissionsStatus) {
        case 'granted':
          if (this.state.watchId === -1) {
            this.subscribeAndPostLocationUpdates();
          }
          return null;
        case 'denied':
          this.unwatchPositionAsync();
          return null;
        default:
          return null;
      }
    }
  }

  // r e n d e r
  //
  render = () => {
    const {
      appState,
      user
    } = this.props;

    // console.log('MapContainer/render: appState=', appState);
    if (!appState.isLocationPermissionsFulfilled) {
      return <LoadingScreen
        color="#0000FF"
        size="large"
        message="chargement des permissions de localisation" />;
    }
    let locationPermissionsStatus = appState.locationPermissions.status;
    // console.log('MapContainer/render: locationPermissionsStatus=', locationPermissionsStatus);
    switch (locationPermissionsStatus) {
      case 'granted':
        if (!user.isLocationFulfilled) {
          return <LoadingScreen
            color="#0000FF"
            size="large"
            message="chargement de votre localisation" />;
        }
        return (<ErrorBoundary>
          <MapScreen navigation={this.props.navigation} />
        </ErrorBoundary>);
      case 'denied':
        console.log('MapContainer/render: PERMISSION DE LOCALISATION REFUSEE !!  locationPermissionsStatus=', locationPermissionsStatus);
        Alert.alert(
          'PERMISSION D\'ACCES DE LOCALISATION REFUSEE !!',
          'Application inutilisable'
        );
        return null;
      default:
        console.log('MapContainer/render: STATUS de PERMISSION DE LOCALISATION INCONNU !!  locationPermissionsStatus=', locationPermissionsStatus);
        Alert.alert(
          'STATUS de PERMISSION DE LOCALISATION INCONNU !!',
          'Application inutilisable'
        );
        return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    contacts: state.contacts,
    sendingRelations: state.sendingRelations,
    map: state.map,
    appState: state.appState,
    notifications: state.notifications,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addUserIdToContact: (userId, contact) => dispatch(_addUserIdToContact(userId, contact)),
  addExpoTokenToContact: (expoToken, contact) => dispatch(_addExpoTokenToContact(expoToken, contact)),
  addContact: (contact) => dispatch(_addContact(contact)),
  updateLocation: (user, location) => dispatch(_updateLocation(user, location)),
  updateLocationOfUserWithSharedLocation: (user) => dispatch(_updateLocationOfUserWithSharedLocation(user)),
  signInFirebase: (provider, providerToken, idToken) => dispatch(_signInFirebase(provider, providerToken, idToken)),
  getExpoPushToken: () => dispatch(_getExpoPushToken()),
  registerForNotifications: (user, expoPushToken) => dispatch(_registerForNotifications(user, expoPushToken)),
  addOrUpdateMarker: (marker) => dispatch(_addOrUpdateMarker(marker)),
  deleteMarker: (_id) => dispatch(_deleteMarker(_id)),
  addUserContact: (user, userToConnect) => dispatch(_addUserContact(user, userToConnect)),
  findOrCreateSendingRelation: (args) => dispatch(_findOrCreateSendingRelation(args)),
  deleteSendingRelation: (args) => dispatch(_deleteSendingRelation(args)),
  deleteSendingRelationsById: (_id) => dispatch(_deleteSendingRelationsById(_id)),
  addPendingNotification: (args) => dispatch(_addPendingNotification(args)),
  removePendingNotificationById: (appNotifId) => dispatch(_removePendingNotificationById(appNotifId)),
  fetchSendingRelationsById: (_id) => dispatch(_fetchSendingRelationsById(_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);

