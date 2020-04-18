console.log('ContactsListScreen...');
import { connect } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import _ from 'lodash';
import styles from './styles/ContactsListScreen';
import {
  fetchAllContacts as _fetchAllContacts,
  fetchFilteredContacts as _fetchFilteredContacts
} from '../ContactsActions';
import { fetchSendingRelationsById as _fetchSendingRelationsById } from '../../sendingRelation/SendingRelationActions';
import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const isUserSendingLocationToContact = (props) => {
  const {
    user,
    contact,
    sendingRelations
  } = props;
  // console.log('ContactsListScreen/isUserSendingLocationToContact sendingRelations=', sendingRelations);
  var userId = user.userInfos._id;
  // console.log('ContactsListScreen/isUserSendingLocationToContact userId=', userId);
  var isUserSendingLocationToContact = false;
  sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
    contact.emails.forEach((email) => {
      // console.log('ContactsListScreen/isUserSendingLocationToContact sendingRelation.receiverEmail=', sendingRelation.receiverEmail);
      // console.log('ContactsListScreen/isUserSendingLocationToContact email=', email);
      // console.log('ContactsListScreen/isUserSendingLocationToContact sendingRelation.senderId=', sendingRelation.senderId);
      if (sendingRelation.senderId === userId && sendingRelation.receiverEmail === email.email) {
        console.log('ContactsListScreen/isUserSendingLocationToContact: le user ', user.userInfos.fullName, ' envoie sa localisation au contact ', contact.name);
        isUserSendingLocationToContact = true;
      }
    })
  })
  return isUserSendingLocationToContact;
}

const isUserReceivingLocationFromContact = (props) => {
  const {
    user,
    contact,
    sendingRelations
  } = props;
  // console.log('ContactsListScreen/isUserReceivingLocationFromContact sendingRelations=', sendingRelations);
  var userId = user.userInfos._id;
  // console.log('ContactsListScreen/isUserReceivingLocationFromContact userId=', userId);
  var isUserReceivingLocationFromContact = false;
  sendingRelations.sendingRelationsArray.forEach((sendingRelation) => {
    contact.emails.forEach((email) => {
      // console.log('ContactsListScreen/isUserReceivingLocationFromContact sendingRelation.senderEmail=', sendingRelation.senderEmail);
      // console.log('ContactsListScreen/isUserReceivingLocationFromContact email=', email);
      // console.log('ContactsListScreen/isUserReceivingLocationFromContact sendingRelation.receiverId=', sendingRelation.receiverId);
      if (sendingRelation.senderEmail === email.email && sendingRelation.receiverId === userId) {
        console.log('ContactsListScreen/isUserReceivingLocationFromContact: le user ', user.userInfos.fullName, ' reçoit sa localisation du contact ', contact.name);
        isUserReceivingLocationFromContact = true;
      }
    })
  })
  return isUserReceivingLocationFromContact;
}

LocationIcon = (props) => {
  const {
    contact,
  } = props;
  const contactEmails = contact.emails || '';
  // console.log('ContactsListScreen/LocationIcon contact=', contact);
  if (contactEmails === '') {
    // console.log('ContactsListScreen/LocationIcon le userContact n\'a pas de mail > impossible de partager la localisation > pas d\'icone');
    return (null);
  }
  // le User émet et reçoit la localisation du userContact > icone bleue
  if (isUserSendingLocationToContact(props) === true && isUserReceivingLocationFromContact(props) === true) {
    return (
      <Icon
        name="location-on"
        size={24}
        color={EStyleSheet.value('$blueLocation')} />
    );
    // le User n'émet pas sa localisation au userContact, mais la reçoit > icone orange
  } else if (isUserSendingLocationToContact(props) === false && isUserReceivingLocationFromContact(props) === true) {
    return (
      <Icon
        name="location-on"
        size={24}
        color={EStyleSheet.value('$orangeLocation')} />
    );
    // le User émet sa localisation du userContact, mais ne la reçoit pas > icone rouge
  } else if (isUserSendingLocationToContact(props) === true && isUserReceivingLocationFromContact(props) === false) {
    return (
      <Icon
        name="location-on"
        size={24}
        color={EStyleSheet.value('$redLocation')} />
    );
  }
  return (null); // pas de userContact pour le user courant > pas d'icone
}

ContactItem = ({ contact, user, sendingRelations, navigate }) => {
  // console.log('ContactsListScreen/ContactItem user.userInfos.usersContacts=', user.userInfos.usersContacts);
  // console.log('ContactsListScreen/ContactItem contact=', contact);
  // console.log('ContactsListScreen/ContactItem sendingRelations=', sendingRelations);
  if (!contact) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View
      style={styles.viewContainerContactItem}>
      <View style={styles.iconWrapper}>
        <LocationIcon
          contact={contact}
          user={user}
          sendingRelations={sendingRelations}
        />
      </View>
      <TouchableHighlight
        value={contact}
        onPress={() => navigate('ContactsDetailsScreen', { contact, user })}
        underlayColor={EStyleSheet.value('$lightGrayColor')}
        style={styles.touchableHighlight}>
        <View style={styles.viewContactItem}>
          {contact.image ? (
            <TouchableOpacity style={styles.touchableOpacity}>
              <Image
                style={styles.image}
                source={{ uri: contact.image.uri }}
              />
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                style={[styles.touchableOpacityCircleIcon,
                { backgroundColor: contact.thumbnailColor }]}>
                {
                  contact.lastName ? (
                    <Text>{contact.lastName.substring(0, 1)}</Text>
                  ) : (
                      <Text>?</Text>
                    )
                }
              </TouchableOpacity>
            )
          }
          <Text style={styles.text}>
            {contact.lastName + ' ' + contact.firstName}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

// C o n t a c t s L i s t S c r e e n
// -----------------------------------
class ContactsListScreen extends Component {
  constructor(props) {
    super(props);
  }

  searchContacts = _.debounce((search) => {
    const { contacts } = this.props;
    console.log('ContactsListScreen/searchContacts: search=', search);
    const newData = contacts.allContactsArray.filter(contact => {
      const contactLastName = contact.lastName.toUpperCase();
      const textData = search.toUpperCase();
      var exp = '^' + textData;
      let regex = new RegExp(exp);
      let test = regex.test(contactLastName);
      if (test === true) {
        // console.log('ContactsListScreen/searchContacts: textData=',
        //   textData, ' contactLastName=', contactLastName, ' test=', test);
        return test;
      }
    });
    this.props.fetchFilteredContacts(newData);
  }, 300);

  handleRefresh = () => {
    console.log('ContactsListScreen/handleRefresh');
    this.props.fetchAllContacts();
  };

  componentDidUpdate = (prevProps) => {
    // console.log('ContactsListScreen/componentDidUpdate');
    if (this.props.contacts.search !== prevProps.contacts.search) {
      this.searchContacts(this.props.contacts.search);
    }
  }

  componentDidMount = () => {
    const {
      user,
      contacts,
    } = this.props;
    // console.log('ContactsListScreen/componentDidMount: user.userInfos._id', user.userInfos._id);
    this.props.fetchSendingRelationsById(user.userInfos._id);
    if (!contacts.areFiltered) {
      this.props.fetchAllContacts();
    } else {
      this.props.fetchFilteredContacts();
    }
  }

  // r e n d e r
  // -----------
  render = () => {
    const { navigate } = this.props.navigation;
    const {
      user,
      contacts,
      sendingRelations
    } = this.props;
    // console.log('ContactsListScreen/render: sendingRelations=', sendingRelations);
    if (contacts.areFiltered) {
      return (
        <FlatList
          data={contacts.filteredContactsArray}
          extraData={this.props}
          renderItem={(contact) => (<ContactItem
            key={contact.id}
            contact={contact.item}
            user={user}
            sendingRelations={sendingRelations}
            navigate={navigate} />)
          }
          keyExtractor={item => item.id}
        />
      );
    }
    return (
      <FlatList
        data={contacts.allContactsArray}
        extraData={this.props}
        renderItem={(contact) => (<ContactItem
          key={contact.id}
          contact={contact.item}
          user={user}
          sendingRelations={sendingRelations}
          navigate={navigate} />)
        }
        keyExtractor={item => item.id}
        onRefresh={this.handleRefresh}
        refreshing={contacts.isFetchAllContactsPending}
      />
    );
  }
}

mapStateToProps = (state) => {
  return {
    contacts: state.contacts,
    user: state.user,
    sendingRelations: state.sendingRelations
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchAllContacts: () => dispatch(_fetchAllContacts()),
  fetchFilteredContacts: (filteredContacts) => dispatch(_fetchFilteredContacts(filteredContacts)),
  fetchSendingRelationsById: (_id) => dispatch(_fetchSendingRelationsById(_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsListScreen);
