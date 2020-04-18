import React, { Component } from 'react';
import {
  ScrollView,
  SafeAreaView,
  Image,
  Text,
  TouchableHighlight,
  View,
  Alert,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import styles from './styles/AppMenuLeft';
import { signout as _signout } from '../redux/Store';
import { logout as _logout} from '../user/UserActions';

let appConfig = require('../../app.json');

// A p p M e n u L e f t
//
class AppMenuLeft extends Component {
  constructor(props) {
    super(props);
  }

  async logout() {
    const {
      user,
      signout
    } = this.props;
    signout();
    console.log('AppMenuLeft/logout: user.userInfos._id=', user.userInfos._id);
    this.props.logout(user.userInfos._id);
  }

  render() {
    const {
      user,
    } = this.props;
    // console.log('AppMenuLeft: user=', user);
    return (
      <View style={styles.container}>
        <ScrollView>
          <SafeAreaView
            forceInset={{ top: 'always', horizontal: 'never' }}>
            <Image
              style={styles.image}
              source={user.userInfos.avatar.data
                ? { uri: user.userInfos.avatar.data.url }
                : { uri: user.userInfos.avatar }}
            />
            <Text style={styles.name}>
              {user.name}
            </Text>
            <Text style={styles.email}>
              {user.email}
            </Text>

            <View style={styles.viewContainerItem}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={EStyleSheet.value('$grayFontColor')} />
              </View>
              <TouchableHighlight
                underlayColor={EStyleSheet.value('$lightGrayColor')}
                style={styles.touchableHighlight}>
                <TouchableOpacity onPress={() => this.logout()}>
                  <Text style={styles.itemText}>Déconnexion</Text>
                </TouchableOpacity>
              </TouchableHighlight>
            </View>

            <View style={styles.viewContainerItem}>
              <View style={styles.iconWrapper}>
                <Entypo
                  name="info-with-circle"
                  size={24}
                  color={EStyleSheet.value('$grayFontColor')} />
              </View>
              <TouchableHighlight
                underlayColor={EStyleSheet.value('$lightGrayColor')}
                style={styles.touchableHighlight}>
                <TouchableOpacity onPress={() => Alert.alert(
                  appConfig.expo.name,
                  appConfig.expo.description
                ) }>
                  <Text style={styles.itemText}>Information sur la version</Text>
                </TouchableOpacity>
              </TouchableHighlight>
            </View>

          </SafeAreaView>
        </ScrollView >
      </View >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  signout: () => dispatch(_signout()),
  logout: (id) => dispatch(_logout(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppMenuLeft);