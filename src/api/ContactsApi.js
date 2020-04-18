console.log('ContactsApi...');
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

import randomColor from 'randomcolor';

const Paris = {
  latitude: 48.866667,
  longitude: 2.333333,
  title: 'Paris',
  description: 'Fluctuat Nec Mergitur',
};

// C o n t a c t s A p i
// ---------------------
class ContactsApi {

  cleanContacts = (contacts) => {
    const INITIAL_LOCATION = {
      coords: {
        latitude: Paris.latitude,
        longitude: Paris.longitude,
      },
    };

    const INITIAL_MARKER = {
      title: 'localisation partagée',
      coordinates: {
        latitude: Paris.latitude,
        longitude: Paris.longitude
      },
      description: 'lat ' + Paris.latitude
        + ' long ' + Paris.longitude,
    };

    let i;
    for (i = 0; i < contacts.length; i++) {
      // for (var i in contacts) {
      contacts[i].thumbnailColor = randomColor();
      contacts[i].isFavorite = false;
      contacts[i].location = INITIAL_LOCATION;
      contacts[i].marker = INITIAL_MARKER;

      if (contacts[i].lastName) {
        contacts[i].lastName = contacts[i].lastName.toUpperCase();
      } else {
        contacts[i].lastName = '';
      }
      if (contacts[i].firstName) {
        contacts[i].firstName = contacts[i].firstName.toLowerCase();
      } else {
        contacts[i].firstName = '';
      }
      contacts[i].marker.title = contacts[i].firstName
        + ' ' + contacts[i].lastName;
    }
    return contacts;
  }

  fetchAllContacts = async () => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.CONTACTS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.CONTACTS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Application inutilisable sans accès aux contacts !');
      }
      let result = null;
      result = await Contacts.getContactsAsync({
        sort: Contacts.SortTypes.LastName
      });
      result.data = this.cleanContacts(result.data);
      // console.log('ContactsApi/fetchAllContacts: result.data.length=', result.data.length);
      // console.log('ContactsApi/fetchAllContacts: result.data=', result.data);
      return result.data;
    } catch (e) { throw e; }
  }

  contains = ({ name, email }, query) => {
    const { first, last } = name;
    if (first.includes(query) || last.includes(query) || email.includes(query)) {
      return true;
    }
    return false;
  };
}

export const CONTACTS_API = new ContactsApi();