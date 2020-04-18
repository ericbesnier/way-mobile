import React, { Component } from 'react';
// import { Facebook, Google } from 'expo';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import { Text, Alert } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { login as _login } from './UserActions';
import { LoadingScreen } from '../commons';
import Fonts from '../../constants/fonts';
import Colors from '../../constants/colors';
// import fbConfig from '../../constants/fbConfig';
// import googleConfig from '../../constants/googleConfig';
// import { Notifications } from '../api/NotificationsApi';

import getEnvVars from '../../environment';
const { 
  CLIENT_ID_ANDROID,
  CLIENT_ID_IOS,
  APP_ID
 } = getEnvVars();

const FlexContainer = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
  alignSelf: stretch;
`;

const MediumText = styled.Text`
  color: ${Colors.$orangePrimaryVariant}
  fontSize: 20;
  fontFamily: montserratBold;
`;

const XLargeText = styled.Text`
  color: ${Colors.$orangePrimaryVariant}
  fontSize: 50;
  fontFamily: montserratBold;
`;

const BottomButtonWrapper = styled.TouchableOpacity`
  flex: 0.2;
  flexDirection: row;
`;

const Button = styled.TouchableOpacity`
  justifyContent: space-around;
  alignItems: center;
  flex: 1;
  backgroundColor: ${({ color }) => color};
  flexDirection: row;
  paddingHorizontal: 10;
`;

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    console.log('LoginScreen/constructor');
  }

  _onLoginPress = name => {
    if (name === 'facebook') {
      this.loginWithFacebook();
    } else {
      this.loginWithGoogle();
    }
  }

  async loginWithFacebook() {
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(APP_ID, {
      permissions: ['public_profile', 'email']
    });
    console.log('LoginScreen/loginWithFacebook: type=', type, ' token=', token, " APP_ID=", APP_ID);

    if (type === 'success') {
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.type(large)`
      );
      const providerInfos = await response.json();
      console.log('LoginScreen/loginWithFacebook: resp=', providerInfos);
      // Alert.alert(
      //   'Login provider Facebook ok !',
      //   `${providerInfos.name}\n\n${providerInfos.email}`,
      // );
      this.props.login('facebook', token, null, providerInfos);
    } else {
      throw new Error('Echec login Application (Facebook) !');
    }
  }

  async loginWithGoogle() {
    try {
      console.log('LoginScreen/loginWithGoogle: CLIENT_ID_IOS=', CLIENT_ID_IOS);
      console.log('LoginScreen/loginWithGoogle: CLIENT_ID_ANDROID=', CLIENT_ID_ANDROID);
      // try {
      //   var result = await Google.logInAsync({
      //     iosClientId: googleConfig.CLIENT_ID_IOS,
      //     androidClientId: googleConfig.CLIENT_ID_ANDROID,
      //     scopes: ['profile', 'email']
      //   });
      // } catch (error) {
      //   console.log('LoginScreen/loginWithGoogle: logInAsync error=', error);
      // }

      try {
        var result = await Google.logInAsync({
          iosClientId: CLIENT_ID_IOS,
          androidClientId: CLIENT_ID_ANDROID,
          scopes: ['profile', 'email']
        });
      } catch (error) {
        console.log('LoginScreen/loginWithGoogle: logInAsync error=', error);
      }

      // console.log('LoginScreen/loginWithGoogle: result.user.email=', result.user.email);
      console.log('LoginScreen/loginWithGoogle: result=', result);
      if (result.type === 'success') {
        // Alert.alert(
        //   'Login provider Google ok !',
        //   `${result.user.name}\n\n${result.user.email}`,
        // );
        console.log('LoginScreen/loginWithGoogle: result.idToken=', result.idToken);

        this.props.login('google', result.accessToken, result.idToken, result.user);
      } else {
        return { canceled: true };
      }
    } catch (e) {
      console.log('LoginScreen/loginWithGoogle: erreur=', e);
      Alert.alert('Echec login Application (Google) !');
      throw (e);
    }
  }

  render() {
    // console.log('LoginScreen/render this.props.user.userInfos.fullName=', this.props.user.userInfos.fullName);
    if (this.props.user.isLoginPending) {
      return (<LoadingScreen color="#FF0000" size="large" message="login à l'application WAY en cours..." />);
    }
    return (
      <FlexContainer>
        <FlexContainer>
          <Text style={Fonts.userTitle}>
            <MediumText>W</MediumText>here <MediumText>A</MediumText>re <MediumText>Y</MediumText>ou <MediumText>?!?</MediumText>
          </Text>
        </FlexContainer>
        <FlexContainer>
          <FlexContainer>
            <FlexContainer>
              <Text style={Fonts.userWelcomeText}>
                Find your friends with <XLargeText>WAY</XLargeText>
              </Text>
            </FlexContainer>
          </FlexContainer>
          <BottomButtonWrapper>
            <Button color="#db3236" onPress={() => this._onLoginPress('google')}>
              <Text style={Fonts.buttonAuth}>Connect with</Text>
              <MaterialCommunityIcons name="google" size={30} color="#fff" />
            </Button>
            <Button color="#3b5998" onPress={() => this._onLoginPress('facebook')}>
              <Text style={Fonts.buttonAuth}>Connect with</Text>
              <MaterialCommunityIcons name="facebook" size={30} color="#fff" />
            </Button>
          </BottomButtonWrapper>
        </FlexContainer>
      </FlexContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  login: (provider, providerToken, idToken, providerInfos) => dispatch(_login(provider, providerToken, idToken, providerInfos)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);