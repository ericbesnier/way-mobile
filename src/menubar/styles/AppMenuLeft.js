import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '$whiteSurface',
  },
  image: {
    flexGrow: 1,
    height: 240,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    position: 'absolute',
    bottom: 0,
    top: 170,
    left: 0,
    right: 0,
    margin: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: '$whiteBackground',
    backgroundColor: 'transparent',
    fontFamily: 'RobotoRegular',
  },
  email: {
    position: 'absolute',
    bottom: 0,
    top: 190,
    left: 0,
    right: 0,
    margin: 24,
    fontSize: 14,
    color: '$lightGrayColor',
    backgroundColor: 'transparent',
    fontFamily: 'RobotoRegular',
  },
  touchableHighlight: {
    justifyContent: 'center',
    height: 56,
    width: '80%',
  },
  itemText: {
    fontSize: 14,
    color: '$blackColor',
    fontWeight: 'bold',
    fontFamily: 'RobotoRegular',
  },
  iconWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  viewContainerItem: {
    flexDirection: 'row',
    backgroundColor: '$whiteSurface',
    height: 56,
  },
});

export default styles;

