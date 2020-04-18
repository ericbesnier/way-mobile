import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  scrollView: {
    backgroundColor: '$whiteBackground',
  },
  viewContainerContactItem: {
    flexDirection: 'row',
    backgroundColor: '$whiteSurface',
    height: 56,
  },
  touchableHighlight: {
    // flex: 1,
    justifyContent: 'center',
    // marginLeft: 5,
    width: '90%',
  },
  viewContactItem: {
    flexDirection: 'row',
  },
  touchableOpacityCircleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 100,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 100,
  },
  text: {
    textAlignVertical: 'center',
    fontFamily: 'RobotoRegular',
    color: 'black',
    marginLeft: 12,
    fontSize: 16,
  },
  iconWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '10%',
  },
});

export default styles;