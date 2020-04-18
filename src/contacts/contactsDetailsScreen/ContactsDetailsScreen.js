console.log('ContactsDetailsScreen...');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { LinearGradient } from 'expo-linear-gradient' ;
import ActionButton from 'react-native-action-button';
import { Text, View, Image, TouchableHighlight, ScrollView } from 'react-native';
import { USER_API } from '../../api/UserApi';
import { NOTIFICATIONS_API } from '../../api/NotificationsApi';
import styles from './styles/ContactsDetailsScreen';
import { EMAIL_API } from '../../api/EmailApi';
import {
  findOrCreateSendingRelation as _findOrCreateSendingRelation,
  deleteSendingRelation as _deleteSendingRelation,
} from '../../sendingRelation/SendingRelationActions';
import { 
  addPendingNotification as _addPendingNotification, 
} from '../../notification/notificationActions';
import {
  addExpoTokenToContact as _addExpoTokenToContact,
  addUserIdToContact as _addUserIdToContact
} from '../../contacts/ContactsActions';
import { userToContact } from "../../commons/UserToContact";

const ContactsPhoneNumbersScreen = (props) => {
  if (props.number) {
    return (
      <ScrollView>
        <View>
          <TouchableHighlight>
            <View>
              <Text style={styles.text}>
                {props.number}
              </Text>
              <Text style={styles.label}>
                {props.label}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  } else {
    return null;
  }
}

const ContactsEmailsScreen = (props) => {
  if (props.email) {
    return (
      <ScrollView style={styles.emailScrollView}>
        <View>
          <TouchableHighlight>
            <View>
              <Text style={styles.text}>
                {props.email}
              </Text>
              <Text style={styles.label}>
                {props.label}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  } else {
    return null;
  }
}

const IconEmails = (props) => {
  return (
    <View>
      <View style={styles.line} />
      <View style={styles.wrapperIconText}>
        <View style={styles.wrapperIcon}>
          <MaterialIcons
            name='email'
            size={25}
            color={EStyleSheet.value('$orangePrimaryVariant')} />
        </View>
        <View style={styles.wrapperText}>
          {props.emails.map((email, index) => (
            <ContactsEmailsScreen
              key={index}
              email={email.email}
              label={email.label}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const IconPhoneNumbers = (props) => {
  return (
    <View>
      <View style={styles.line} />
      <View style={styles.wrapperIconText}>
        <View style={styles.wrapperIcon}>
          <MaterialIcons
            name='phone'
            size={25}
            color={EStyleSheet.value('$orangePrimaryVariant')} />
        </View>
        <View style={styles.wrapperText}>
          {props.phoneNumbers.map((phoneNumber, index) => (
            <ContactsPhoneNumbersScreen
              key={index}
              number={phoneNumber.number}
              label={phoneNumber.label}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const ImagePersonIcon = () => {
  return (
    <LinearGradient
      colors={[
        EStyleSheet.value('$grayContactCard1'),
        EStyleSheet.value('$grayContactCard2'),
        EStyleSheet.value('$grayContactCard3')]}
      style={styles.linearGradient}>
      <View style={styles.wrapperImageIcon}>

        <View style={styles.borderImageIcon}>
          <View style={styles.imageIcon}>
            <MaterialIcons
              name="person"
              color={EStyleSheet.value('$blueSecondary')}
              size={75} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const sendInstallationMail = (user, contact) => {
  console.log('ContactsDetailsScreen/sendInstallationMail: user.userInfos.fullName=', user.userInfos.fullName);
  console.log('ContactsDetailsScreen/sendInstallationMail: contact=', contact);
  EMAIL_API.sendInstallationMail(user.userInfos._id, contact);
}

const sendNotificationLocationRequest = (props) => {
  const {
    user,
    contact,
    addPendingNotification
  } = props;
  console.log('ContactsDetailsScreen/sendNotificationLocationRequest: ------------------------------------------------  contact.expoToken=', contact.expoToken, ' user=', user);
  if (contact.expoToken) {
    let title = 'Partager localisation ?';
    let body = user.userInfos.fullName;
    var lastLocation = user.userInfos.locations.length - 1;
    let data = {
      action: 'SENDING_LOCATION_REQUEST',
      contact: userToContact(user),
      timestamp: Math.round(+new Date() / 1000),
      appNotifId: Math.floor(Math.random() * 100000),
      payload: user.userInfos.locations[lastLocation]
    };
    addPendingNotification({ 
      appNotifId: data.appNotifId,
      expoToken: contact.expoToken, 
      timestamp: data.timestamp 
    });
    NOTIFICATIONS_API.sendNotification(contact.expoToken, title, body, data);
  }
}

const sendNotificationNoLocationRequest = (user, contact) => {
  console.log('ContactsDetailsScreen/sendNotificationNoLocationRequest: contact.expoToken=', contact.expoToken);
  let expoToken = contact.expoToken;
  if (expoToken) {
    let title = 'Fin du partage de localisation !';
    let body = user.userInfos.fullName;
    let data = {
      action: 'SENDING_NO_LOCATION_REQUEST',
      contact: userToContact(user),
      timestamp: Math.round(+new Date() / 1000),
      appNotifId: Math.floor(Math.random() * 100000),
      payload: null
    };
    NOTIFICATIONS_API.sendNotification(expoToken, title, body, data);
  }
}

const updateContactAndNotify = async (props) => {
  const {
    user,
    contact,
    findOrCreateSendingRelation,
    addExpoTokenToContact,
    addUserIdToContact
  } = props;
  try {
    for (var i = 0; i < contact.emails.length; i++) {
      var userToConnect = await USER_API.getUserByEmail(contact.emails[i].email);
      if (userToConnect.userInfos != null) {
        break;
      }
    }
  } catch (error) {
    console.log('ContactsDetailsScreen/updateContactAndNotify: ERROR getUserByEmail ! error=', error);
  }
  if (userToConnect.userInfos != null) { 
    console.log('ContactsDetailsScreen/updateContactAndNotify: le contact à notifier existe sur le serveur, c\'est le user ', userToConnect.userInfos.fullName);
    addExpoTokenToContact(userToConnect.userInfos.expoToken, contact);
    addUserIdToContact(userToConnect.userInfos._id, contact);
    // console.log('ContactsDetailsScreen/updateContactAndNotify: on créé la relation entre ', user.userInfos._id, ' et ', userToConnect.userInfos._id);
    // console.log('ContactsDetailsScreen/updateContactAndNotify: userToConnect.userInfos.email', userToConnect.userInfos.email);
    try {
      await findOrCreateSendingRelation({ 
        senderId: user.userInfos._id, 
        senderEmail: user.userInfos.email, 
        senderFirstName: user.userInfos.firstName || '', 
        senderLastName: user.userInfos.lastName || '', 
        senderFullName: user.userInfos.fullName || '', 
        senderExpoToken: user.userInfos.expoToken, 
        senderIsLogged: user.userInfos.isLogged, 
        receiverId: userToConnect.userInfos._id,
        receiverEmail: userToConnect.userInfos.email,
        receiverFirstName: userToConnect.userInfos.firstName || '',
        receiverLastName: userToConnect.userInfos.lastName || '',
        receiverFullName: userToConnect.userInfos.fullName || '',
        receiverExpoToken: userToConnect.userInfos.expoToken,
        receiverIsLogged: userToConnect.userInfos.isLogged,
      });
    } catch (error) {
      console.log('ContactsDetailsScreen/updateContactAndNotify: ERROR findOrCreateSendingRelation ! error=', error);
    }
    // console.log('ContactsDetailsScreen/updateContactAndNotify: on fait la demande de partage de localisation via une notification expo !');
    sendNotificationLocationRequest(props);
  } else { // le user à qui on veut faire une demande de partage n'existe pas sur le server  >> on envoie un mail d'installation de l'appli
    sendInstallationMail(user, contact);
  }
}

const askForLocationSharing = async (props) => {
  const {
    user,
    contact,
    findOrCreateSendingRelation,
  } = props;
  // console.log('ContactsDetailsScreen/askForLocationSharing: contact=', contact);

  if (contact.expoToken && contact.userId) {
    try {
      // await findOrCreateSendingRelation({ senderId: user.userInfos._id, receiverId: contact.userId });
      await findOrCreateSendingRelation({ 
        senderId: user.userInfos._id, 
        senderEmail: user.userInfos.email, 
        senderFirstName: user.userInfos.firstName || '', 
        senderLastName: user.userInfos.lastName || '', 
        senderFullName: user.userInfos.fullName || '', 
        senderExpoToken: user.userInfos.expoToken, 
        senderIsLogged: user.userInfos.isLogged, 
        receiverId: contact.userId,
        receiverEmail: contact.emails[0].email,
        receiverFirstName: contact.firstName || '',
        receiverLastName: contact.lastName || '',
        receiverFullName: contact.name || '',
        receiverExpoToken: contact.expoToken,
        receiverIsLogged: contact.isLogged || '',
      });
    } catch (error) {
      console.log('ContactsDetailsScreen/askForLocationSharing: ERROR findOrCreateSendingRelation ! error=', error);
    }
    // console.log('ContactsDetailsScreen/askForLocationSharing: on fait la demande de partage de localisation via une notification expo !');
    sendNotificationLocationRequest(props);
  } else {
    updateContactAndNotify(props);
  }
}

const askForLocationNotSharing = async (props) => {
  const {
    user,
    contact,
    deleteSendingRelation
  } = props;
  // console.log('ContactsDetailsScreen/askForLocationNotSharing: user.userInfos.fullName=', user.userInfos.fullName, 'contact=', contact);
  // on supprime la sending relation entre user et contact
  console.log('ContactsDetailsScreen/askForLocationNotSharing: on supprime la relation entre ', user.userInfos._id, ' et ', contact.userId);
  try {
    await deleteSendingRelation({ senderId: user.userInfos._id, receiverId: contact.userId });
  } catch (error) {
    console.log('ContactsDetailsScreen/askForLocationNotSharing: ERROR deleteSendingRelation ! error=', error);
  }
  // on fait la demande de fin de partage de localisation via une notification expo
  sendNotificationNoLocationRequest(user, contact);
}

const isUserSendingLocationToContact = (props) => {
  // console.log('ContactsDetailsScreen/isUserSendingLocationToContact props=', props);
  const {
    user,
    contact,
    sendingRelations
  } = props;
  if (contact.expoToken && contact.userId) { // le contact est un user
    var userId = user.userInfos._id;
    var contactId = contact.userId;
    var isUserSendingLocationToContact = false;
    sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
      if (sendingRelation.senderId === userId && sendingRelation.receiverId === contactId) {
        console.log('ContactsDetailsScreen/isUserSendingLocationToContact: le user ', user.userInfos.fullName, ' envoie sa localisation au contact ', contact.name);
        isUserSendingLocationToContact = true;
      }
    })
  }
  return isUserSendingLocationToContact;
}

const LocationActionButton = (props) => {
  // console.log('ContactsDetailsScreen/LocationActionButton props=', props);
  const {
    contact,
  } = props;
  // console.log('ContactsDetailsScreen/LocationActionButton contact=', contact);
  if (contact.emails === "") { // le contact n'a pas de mail > impossible de partager la localisation
    return (null);
  }
  if (contact.expoToken && contact.userId) { // le contact est un user
    if (isUserSendingLocationToContact(props)) {
      return (
        <ActionButton
          buttonColor={EStyleSheet.value('$stopSignRed')}
          renderIcon={() => (<MaterialIcons name="location-off" size={25} />)}
          onPress={() => askForLocationNotSharing(props)}
        />
      );
    }
  }
  return (
    <ActionButton
      buttonColor={EStyleSheet.value('$startSignGreen')}
      renderIcon={() => (<MaterialIcons name="add-location" size={25} />)}
      onPress={() => askForLocationSharing(props)}
    />
  );
}


// c l a s s   C o n t a c t s D e t a i l s S c r e e n
// -----------------------------------------------------
class ContactsDetailsScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const contact = navigation.getParam('contact', 'NO-CONTACT');
    // console.log('ContactsDetailsScreen/constructor: contact=', contact);

    this.state = {
      contact: {
        id: contact.id,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        name: contact.name || '',
        phoneNumbers: contact.phoneNumbers || '',
        emails: contact.emails || '',
        imageAvailable: contact.imageAvailable || '',
        image: contact.image || '',
      },
    };
  }

  static navigationOptions =
    {
      title: 'ContactsDetailsScreen',
    };

  getContactById = (id) => {
    const {
      contacts,
    } = this.props;
    // console.log('ContactsDetailsScreen/getContactById: contacts=', contacts);
    var contact = null;
    contacts.allContactsArray.forEach((_contact) => {
      if (_contact.id === id) {
        contact = _contact;
      }
    });
    return contact;
  }

  render() {
    const {
      user,
      sendingRelations,
      findOrCreateSendingRelation,
      deleteSendingRelation,
      addExpoTokenToContact,
      addUserIdToContact,
      addPendingNotification
    } = this.props;
    // console.log('ContactsDetailsScreen/render: user.userInfos.fullName=', user.userInfos.fullName);

    const contact = this.getContactById(this.state.contact.id);
    const emails = contact.emails;
    const name = contact.name;
    const phoneNumbers = contact.phoneNumbers;
    const image = contact.image;

    return (
      <View style={styles.cardView}>
        {image ? <Image style={styles.image} source={{ uri: image.uri }} /> : <ImagePersonIcon />}
        <Text style={styles.titleName}>{name}</Text>
        {emails ? <IconEmails emails={emails} /> : null}
        {phoneNumbers ? <IconPhoneNumbers phoneNumbers={phoneNumbers} /> : null}
        <LocationActionButton
          contact={contact}
          user={user}
          sendingRelations={sendingRelations}
          findOrCreateSendingRelation={findOrCreateSendingRelation}
          deleteSendingRelation={deleteSendingRelation}
          addExpoTokenToContact={addExpoTokenToContact}
          addUserIdToContact={addUserIdToContact}
          addPendingNotification={addPendingNotification}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    contacts: state.contacts,
    sendingRelations: state.sendingRelations,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addExpoTokenToContact: (expoToken, contact) => dispatch(_addExpoTokenToContact(expoToken, contact)),
  addUserIdToContact: (userId, contact) => dispatch(_addUserIdToContact(userId, contact)),
  findOrCreateSendingRelation: (args) => dispatch(_findOrCreateSendingRelation(args)),
  deleteSendingRelation: (args) => dispatch(_deleteSendingRelation(args)),
  addPendingNotification: (args) => dispatch(_addPendingNotification(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsDetailsScreen);