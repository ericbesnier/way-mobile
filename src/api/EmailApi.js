console.log('EmailApi...');
import axios from 'axios';
// import { urlApi } from '../commons/UrlApi';
import getEnvVars from '../../environment';

axios.defaults.baseURL = urlApi;

const { urlApi } = getEnvVars();

// E m a i l A p i
// ---------------------
class EmailApi {
  constructor() {
    this.pathUser = '/user';
  }

  async sendInstallationMail(_id, args) {
    console.log('EmailApi/sendInstallationMail: _id=', _id, 'args=', args);
    console.log('EmailApi/sendInstallationMail: args=', args);
  
    try {
      const { data } = await axios.post(`${this.pathUser}/${_id}/sendInstallationMail`, args);
      console.log('EmailApi/sendInstallationMail: data=', data);
      return data;
    } catch (error) {
      if (error.response) {
        console.log('EmailApi/sendInstallationMail: The request was made and the server responded with a status code that falls out of the range of 2xx');
      } else if (error.request) {
        console.log('EmailApi/sendInstallationMail: The request was made but no response was received');
      } else {
        console.log('EmailApi/sendInstallationMail: Something happened in setting up the request that triggered an Error > error.message=', error.message);
      }
      console.log('EmailApi/sendInstallationMail: error.config=', error.config);
      throw error;
    }
  }
}

export const EMAIL_API = new EmailApi();
