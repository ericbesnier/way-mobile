import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchableHighlight: {
    // flex: 1,
    // justifyContent: 'center',
    // marginLeft: 5,
    // width: '90%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  paragraph: {
    fontSize: 14,
    textAlign: 'center',
  },
  containerActivityIndicator: {
    flex: 1,
  },
  touchableOpacitySquareIcon: {
    borderWidth: 0.3,
    borderBottomWidth: 1,
    borderRadius: 2,
    borderColor: '#c3c3c3',
    shadowOffset: { //ios
      height: 0,
      width: 0
    },
    marginLeft: 12,
    marginRight: 12,
    marginTop: 10,  // position: 'absolute',
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  switch: {
    marginLeft: 12,
    marginRight: 12,
    position: 'absolute',
    marginBottom: 20,
    bottom: 0,
    left: 0,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 100,
  },
  touchableOpacityCircleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 100,
  },
  initiale: {
    // textAlign: 'center',
    fontFamily: 'RobotoRegular',
    color: 'black',
    fontSize: 8,
    fontWeight: 'bold',
  },
  image: {
    // backgroundColor: 'green',
    width: 40,
    height: 40,
  },
  calloutView: {
    backgroundColor: 'white',
    width: 250,
    height: 100,
  },
  calloutText: {
    textAlign: 'center',
    fontFamily: 'RobotoRegular',
    color: 'black',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
  },
  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight,
  },
});

export default styles;