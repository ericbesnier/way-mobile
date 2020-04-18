import { PERMISSIONS_API } from '../api/PermissionsApi';
export const GET_LOCATION_PERMISSIONS = 'GET_LOCATION_PERMISSIONS';
export const GET_CONTACTS_PERMISSIONS = 'GET_CONTACTS_PERMISSIONS';
export const GET_NOTIFICATIONS_PERMISSIONS = 'GET_NOTIFICATIONS_PERMISSIONS';
export const GET_MULTI_PERMISSIONS = 'GET_MULTI_PERMISSIONS';
export const UPDATE_APP_STATE = 'UPDATE_APP_STATE';

export function getLocationPermissions() {
  return {
    type: GET_LOCATION_PERMISSIONS,
    payload: PERMISSIONS_API.getLocationPermissions(),
  };
}

export function getContactsPermissions() {
  return {
    type: GET_CONTACTS_PERMISSIONS,
    payload: PERMISSIONS_API.getContactsPermissions(),
  };
}

export function getNotificationsPermissions() {
  return {
    type: GET_NOTIFICATIONS_PERMISSIONS,
    payload: PERMISSIONS_API.getNotificationsPermissions(),
  };
}

export function getMultiPermissions() {
  return {
    type: GET_MULTI_PERMISSIONS,
    payload: PERMISSIONS_API.getMultiPermissions(),
  };
}

export function updateAppState(nextAppState) {
  console.log('AppStateActions/updateAppState: nextAppState=', nextAppState);

  return {
    type: UPDATE_APP_STATE,
    payload: nextAppState,
  };
}
