console.log('ContactsContainer...');
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import ContactsListScreen from '../contactsListScreen/ContactsListScreen';
import LoadingScreen from '../../commons/LoadingScreen';

class ContactsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('ContactsContainer/render: this.props=', this.props);
    const {
      navigation,
      appState,
    } = this.props;
    // console.log('ContactsContainer/render');
    if (!appState.isContactsPermissionsFulfilled) {
      return <LoadingScreen
        color="#0000FF"
        size="large"
        message="chargement des permissions de contacts" />;
    }
    let contactsPermissionsStatus = appState.contactsPermissions.status;
    // console.log('ContactsContainer/render: contactsPermissionsStatus=', contactsPermissionsStatus);
    switch (contactsPermissionsStatus) {
      case 'granted':
        return (
            <ContactsListScreen
              navigation={navigation}
            />
        );
      case 'denied':
        console.log('ContactsContainer/render: PERMISSION D\'ACCES AUX CONTACTS REFUSEE !!  contactsPermissionsStatus=', contactsPermissionsStatus);
        Alert.alert(
          'PERMISSION D\'ACCES AUX CONTACTS REFUSEE !!',
          'Application inutilisable'
        );
        return null;
      default:
        console.log('ContactsContainer/render: STATUS de PERMISSION D\'ACCES AUX CONTACTS INCONNU !!  contactsPermissionsStatus=', contactsPermissionsStatus);
        Alert.alert(
          'STATUS de PERMISSION D\'ACCES AUX CONTACTS INCONNU !!',
          'Application inutilisable'
        );
        return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    contacts: state.contacts,
    appState: state.appState,
  };
}

export default connect(
  mapStateToProps,
  null
)(ContactsContainer);
