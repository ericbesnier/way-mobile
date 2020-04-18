console.log('SendinRelationApi...');
import axios from 'axios';
import { logErrorResponseServer } from '../commons/LogError';

// S e n d i n R e l a t i o n A p i
// ---------------------------------
class SendinRelationApi {
  constructor() {
    this.pathSendingRelation = '/sendingRelation';
  }

  findOrCreateSendingRelation = async (args) => {
    // console.log('SendinRelationApi/findOrCreateSendingRelation: args=', args);
    try {
      const { data } = await axios.post(`${this.pathSendingRelation}/findOrCreateSendingRelation`, args);
      return data;
    } catch (error) {
      logErrorResponseServer('SendinRelationApi/findOrCreateSendingRelation', error);
    }
  }

  deleteSendingRelation = async (args) => {
    console.log('SendinRelationApi/deleteSendingRelation: args=', args);
    try {
      const { data } = await axios.post(`${this.pathSendingRelation}/deleteSendingRelation`, args);
      return data;
    } catch (error) {
      logErrorResponseServer('SendinRelationApi/deleteSendingRelation', error);
    }
  }

  deleteSendingRelationsById = async (args) => {
    console.log('SendinRelationApi/deleteSendingRelationsById: args=', args);
    try {
      const { data } = await axios.post(`${this.pathSendingRelation}/deleteSendingRelationsById`, {_id: args });
      return data;
    } catch (error) {
      logErrorResponseServer('SendinRelationApi/deleteSendingRelationsById', error);
    }
  }

  getSendingRelation = async (args) => {
    console.log('SendinRelationApi/getSendingRelation: args=', args);
    try {
      const { data } = await axios.get(`${this.pathSendingRelation}/getSendingRelation`, args);
      return data;
    } catch (error) {
      logErrorResponseServer('SendinRelationApi/getSendingRelation', error);
    }
  }

  fetchSendingRelationsById = async (_id) => {
    // console.log('SendinRelationApi/fetchSendingRelationsById: _id=', _id);
    try {
      const { data } = await axios.get(`${this.pathSendingRelation}/fetchSendingRelationsById`, { params: { _id: _id } });
      return data;
    } catch (error) {
      logErrorResponseServer('SendinRelationApi/fetchSendingRelationsById', error);
    }
  }
}

export const SENDING_RELATION_API = new SendinRelationApi();