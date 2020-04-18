export const ADD_PENDING_NOTIFICATION = 'ADD_PENDING_NOTIFICATION';
export const REMOVE_PENDING_NOTIFICATION_BY_ID = 'REMOVE_PENDING_NOTIFICATION_BY_ID';

export const addPendingNotification = (args) => {
  // args = { 
  //     appNotifId: data.appNotifId,
  //     expoToken: contact.expoToken, 
  //     name: contact.name,
  //     timestamp: data.timestamp 
  //   }
  console.log('notificationActions/addPendingNotification: args=', args);
  return {
    type: ADD_PENDING_NOTIFICATION,
    payload: args
  };
};

export const removePendingNotificationById = (appNotifId) => {
  console.log('notificationActions/removePendingNotificationById: appNotifId=', appNotifId);
  return {
    type: REMOVE_PENDING_NOTIFICATION_BY_ID,
    payload: appNotifId
  };
};