import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  cardView: {
    backgroundColor: '$whiteSurface',
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: 250,
  },
  titleName: {
    fontFamily: 'RobotoRegular',
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 15,
    fontSize: 24,
  },
  text: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    // marginLeft: 70,
  },
  label: {
    fontFamily: 'RobotoRegular',
    fontSize: 14,
    color: '$grayFontColor',
    // marginLeft: 70,
    marginBottom: 10,
  },
  line: {
    borderWidth: 0.5,
    borderColor: '$lightGrayColor',
    margin: 10,
  },
  emailScrollView: {
    // width: '80%',
  },
  wrapperIconText: {
    flexDirection: 'row',
  },
  wrapperIcon: {
    width: '20%',
    alignItems: 'center',
  },
  wrapperText: {
    width: '80%',
  },
  wrapperImageIcon: {
    width: '100%',
    height: 250,
    // backgroundColor: '$lightGrayColor',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$blueSecondaryVariant',
  },
  borderImageIcon: {
    width: 105,
    height: 105,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$whiteBackground',
  },
  linearGradient: {
    width: '100%',
    height: 250,
  },
});

export default styles;