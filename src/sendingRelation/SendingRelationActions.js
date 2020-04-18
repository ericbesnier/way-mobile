import { SENDING_RELATION_API } from '../api/SendingRelationApi';

export const FIND_OR_CREATE_SENDING_RELATION = 'FIND_OR_CREATE_SENDING_RELATION';
export const DELETE_SENDING_RELATION = 'DELETE_SENDING_RELATION';
export const DELETE_SENDING_RELATIONS = 'DELETE_SENDING_RELATIONS';
export const FETCH_SENDING_RELATIONS_BY_USER_ID = 'FETCH_SENDING_RELATIONS_BY_USER_ID';


export const findOrCreateSendingRelation = (args) => {
  console.log('SendingRelationActions/findOrCreateSendingRelation: args=', args);
  return {
    type: FIND_OR_CREATE_SENDING_RELATION,
    payload: SENDING_RELATION_API.findOrCreateSendingRelation(args)
  };
};

// args = { senderId: senderId, receiverId: receiverId }
export const deleteSendingRelation = (args) => {
  // console.log('SendingRelationActions/deleteSendingRelation: args=', args);
  return {
    type: DELETE_SENDING_RELATION,
    payload: SENDING_RELATION_API.deleteSendingRelation(args)
  };
};

export const deleteSendingRelationsById = (_id) => {
  console.log('SendingRelationActions/deleteSendingRelationsById: _id=', _id);
  return {
    type: DELETE_SENDING_RELATIONS,
    payload: SENDING_RELATION_API.deleteSendingRelationsById(_id)
  };
};

export const fetchSendingRelationsById = (args) => {
  // console.log('SendingRelationActions/fetchSendingRelationsById: args=', args);
  return {
    type: FETCH_SENDING_RELATIONS_BY_USER_ID,
    payload: SENDING_RELATION_API.fetchSendingRelationsById(args)
  };
};
