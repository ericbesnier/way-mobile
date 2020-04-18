console.log('Root...');
// import { SQLite } from 'expo-sqlite';
import React, { Component } from 'react';
import { UIManager, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppLogin from './src/user/AppLogin';
import Colors from './constants/colors';
import { fontAssets, imageAssets } from './helpers';
import createStore from './src/redux/Store';
import LoadingScreen from './src/commons/LoadingScreen';
import { YellowBox } from 'react-native';
import { Notifications } from 'expo';
import { handleRetrieveLocation, registerLocationUpdatesTask } from './src/map/RegisterLocationUpdatesTask';
import { BACKGROUND_LOCATION_UPDATES_TASK } from './constants/values'
import axios from 'axios';
import getEnvVars from './environment';

const { urlApi } = getEnvVars();
axios.defaults.baseURL = urlApi;
export const { Store, Persistor } = createStore();
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
EStyleSheet.build(Colors);
console.log('Root: Store=', Store);
registerLocationUpdatesTask(BACKGROUND_LOCATION_UPDATES_TASK, handleRetrieveLocation.bind({ "store": Store }));

// c l a s s  R o o t
//
export class Root extends Component {
  constructor() {
    super();
    console.disableYellowBox = true;
    console.ignoredYellowBox = ['Setting a timer'];
    YellowBox.ignoreWarnings([
      'Setting a timer',
      'Warning:'
    ]);
  }

  state = {
    fontLoaded: false,
    imageLoaded: false,
    isDisconnected: false
  }

  handleConnectionChange = () => {
    const webPing = setInterval(
      async () => {
        fetch('https://google.com', { mode: 'no-cors' })
          .then(
            () => {
              this.setState({ isDisconnected: false });
              return clearInterval(webPing);
            }
          )
          .catch(
            (error) => {
              this.setState({ isDisconnected: true });
              this.dropdown.alertWithType('error', 'Error', error.message);
              return;
            }
          )
      }, 2000);
  }

  async loadFontAssetsAsync() {
    await Promise.all(fontAssets);
    this.setState({ fontLoaded: true });
  }

  loadImageAssetsAsync = async () => {
    await Promise.all(imageAssets);
    // console.log('Root: loadImageAssetsAsync');
    this.setState({ imageLoaded: true });
  }

  componentDidMount() {
    // Create a channel for sending push notifications
    if (Platform.OS == 'android') {
      Notifications.createChannelAndroidAsync(
        'Way',
        {
          name: 'Way',
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
    }

    this.loadFontAssetsAsync();
    this.loadImageAssetsAsync();
    this.handleConnectionChange();

    Notifications.presentLocalNotificationAsync({
      title: 'Way Channel',
      body: 'Created !!!!',
      android: {
        channelId: 'Way',
      },
    });
  }

  // r e n d e r
  //
  render() {
    if (!this.state.fontLoaded || !this.state.imageLoaded) {
      return (<LoadingScreen
        color="#FF0000"
        size="large"
        message="chargement des fonts et des images..." />);
    }
    return (
      <Provider store={Store}>
        <PersistGate
          loading={<LoadingScreen
            color="#00FF00"
            size="large"
            message="chargement du PersistGate" />}
          persistor={Persistor} >
          <AppLogin />
          {this.state.isDisconnected ? <DropdownAlert ref={ref => this.dropdown = ref} /> : null}
        </PersistGate>
      </Provider >
    );
  }
}
