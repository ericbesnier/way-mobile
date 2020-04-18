console.log('PermissionsApi...');
import * as Permissions from 'expo-permissions';

// P e r m i s s i o n s A p i
// ---------------------------
class PermissionsApi {
  async getLocationPermissions() {
    try {
      var locationPermissions = await Permissions.getAsync(Permissions.LOCATION);
      console.log('PermissionsApi/getLocationPermissions : getAsync locationPermissions=', locationPermissions);
      if (locationPermissions.status !== 'granted') {
        locationPermissions = await Permissions.askAsync(Permissions.LOCATION);
        console.log('PermissionsApi/getLocationPermissions : askAsync locationPermissions=', locationPermissions);
      }
      return locationPermissions;
    } catch (e) { 
      console.log('PermissionsApi/getLocationPermissions : CATCH ERREUR ! locationPermissions=', locationPermissions);
      throw e; 
    }
  }

  async getContactsPermissions() {
    try {
      var contactsPermissions = await Permissions.getAsync(Permissions.CONTACTS);
      console.log('PermissionsApi/getContactsPermissions : contactsPermissions=', contactsPermissions);
      if (contactsPermissions.status !== 'granted') {
        contactsPermissions = await Permissions.askAsync(Permissions.CONTACTS);
        console.log('PermissionsApi/getContactsPermissions : contactsPermissions=', contactsPermissions);
      }
      return contactsPermissions;
    } catch (e) { throw e; }
  }

  async getNotificationsPermissions() {
    try {
      var notificationsPermissions = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      console.log('PermissionsApi/getNotificationsPermissions : notificationsPermissions=', notificationsPermissions);
      if (notificationsPermissions.status !== 'granted') {
        notificationsPermissions = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        console.log('PermissionsApi/getNotificationsPermissions : notificationsPermissions=', notificationsPermissions);
      }
      return notificationsPermissions;
    } catch (e) { throw e; }
  }

  async getMultiPermissions() {
    try {
      var multiPermissions = await Permissions.getAsync(
        Permissions.LOCATION,
        Permissions.CONTACTS,
        Permissions.NOTIFICATIONS,
        );
      console.log('PermissionsApi/getMultiPermissions : multiPermissions=', multiPermissions);
      if (multiPermissions.status !== 'granted') {
        if(multiPermissions.permissions.contacts.status !== 'granted'){
          multiPermissions = await Permissions.askAsync(Permissions.CONTACTS);
        } else if (multiPermissions.permissions.location.status !== 'granted') {
          multiPermissions = await Permissions.askAsync(Permissions.LOCATION);
        } else if (multiPermissions.permissions.notifications.status !== 'granted') {
          multiPermissions = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
      }
      return multiPermissions;
    } catch (e) { throw e; }
  }
}

export const PERMISSIONS_API = new PermissionsApi();
