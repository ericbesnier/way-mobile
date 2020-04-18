console.log('ContactsActions');
import { CONTACTS_API } from '../api/ContactsApi';

export const FETCH_ALL_CONTACTS = 'FETCH_ALL_CONTACTS';
export const FETCH_FILTERED_CONTACTS = 'FETCH_FILTERED_CONTACTS';
export const SET_SEARCH = 'SET_SEARCH';
export const CANCEL_SEARCH = 'CANCEL_SEARCH';
export const ADD_CONTACT = 'ADD_CONTACT';
export const ADD_EXPO_TOKEN_TO_CONTACT = 'ADD_EXPO_TOKEN_TO_CONTACT';
export const ADD_USER_ID_TO_CONTACT = 'ADD_USER_ID_TO_CONTACT';

export const fetchAllContacts = () => {
  console.log('ContactsActions/fetchAllContacts');
  return {
    type: FETCH_ALL_CONTACTS,
    payload: CONTACTS_API.fetchAllContacts(),
  };
};

export const fetchFilteredContacts = (filteredContacts) => {
  console.log('ContactsActions/fetchFilteredContacts');
  return {
    type: FETCH_FILTERED_CONTACTS,
    data: filteredContacts
  };
};

export const setSearch = (search) => {
  console.log('ContactsActions/setSearch: search=', search);
  return {
    type: SET_SEARCH,
    search: search
  };
};

export const cancelSearch = () => {
  return {
    type: CANCEL_SEARCH,
    data: []
  };
};

export const addContact = (contact) => {
  return {
    type: ADD_CONTACT,
    contact: contact
  };
};

export const addExpoTokenToContact = (expoToken, contact) => {
  return {
    type: ADD_EXPO_TOKEN_TO_CONTACT,
    data: { expoToken: expoToken, contact: contact }
  };
};

export const addUserIdToContact = (userId, contact) => {
  return {
    type: ADD_USER_ID_TO_CONTACT,
    data: { userId: userId, contact: contact }
  };
};