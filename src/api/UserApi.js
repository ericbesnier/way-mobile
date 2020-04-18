console.log('*******************************************************************');
console.log('................... Lancement de l\'application ...................');
console.log('*******************************************************************');
console.log('UserApi...');
import axios from 'axios';
import { logErrorResponseServer } from '../commons/LogError';

// U s e r A p i
// -------------
class UserApi {
  constructor() {
    this.pathUser = '/user';
  }

  login = async (args) => {
    console.log('UserApi/login: args=', args);
    try {
      const { data } = await axios.post(`${this.pathUser}/login`, args);
      // const { data } = await axios.post('http://176.149.36.213:3000/api/user/login', args);
      console.log('UserApi/login: data.userInfos.fullName=', data.userInfos.fullName);
      // console.log('UserApi/login: data=', data);
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/login', error);
    }
  }

  logout = async (_id) => {
    console.log('UserApi/logout: _id=', _id);
    try {
      const { data } = await axios.post(`${this.pathUser}/${_id}/logout`);
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/logout', error);
    }
  }

  getUserByEmail = async (email) => {
    // console.log('UserApi/getUserByEmail email=', email);
    try {
      const { data } = await axios.get(`${this.pathUser}/getUserByEmail`,
        { params: { email: email } });
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/getUserByEmail', error);
    }
  }

  getUserById = async (_id) => {
    console.log('UserApi/getUserById _id=', _id);
    try {
      const { data } = await axios.get(`${this.pathUser}/getUserById`, { params: { _id: _id } });
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/getUserById', error);
    }
  }

  registerForNotifications = async (user, expoToken) => {
    console.log('UserApi/registerForNotifications; user.userInfos._id=', user.userInfos._id, ' expoToken=', expoToken);
    try {
      const { data } = await axios.post(`${this.pathUser}/${user.userInfos._id}/registerForNotifications`,
        { expoToken: expoToken });
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/registerForNotifications', error);
    }
  }

  updateLocation = async (user, location) => {
    // console.log('UserApi/updateLocation user.userInfos._id=', user.userInfos._id, ' location=', location);
    try {
      const { data } = await axios.post(`${this.pathUser}/${user.userInfos._id}/updateLocation`,
        location);
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/updateLocation', error);
    }
  }

  addUserContact = async (user, userToConnect) => {
    console.log('UserApi/addUserContact: user.userInfos.fullName=', user.userInfos.fullName,
      'userToConnect.userInfos.fullName=', userToConnect.userInfos.fullName);
    var _userContact = {
      _id: userToConnect.userInfos._id,
      firstName: userToConnect.userInfos.firstName,
      lastName: userToConnect.userInfos.lastName,
      fullName: userToConnect.userInfos.fullName,
      email: userToConnect.userInfos.email,
      avatar: userToConnect.userInfos.avatar,
      expoToken: userToConnect.userInfos.expoToken,
      isLogged: userToConnect.userInfos.isLogged,
    }
    try {
      const { data } = await axios.post(`${this.pathUser}/${user.userInfos._id}/addUserContact`,
        { userContact: _userContact });
      return data;
    } catch (error) {
      logErrorResponseServer('UserApi/addUserContact', error);
    }
  }
}

export const USER_API = new UserApi();