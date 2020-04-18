import { Alert } from 'react-native';

export default (error, info) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log('Error reported :(');
  console.log('error=', error);
  console.log('info=', info);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  Alert.alert(
    'Error reported :(',
    `${error}\n\n${info}`,
  );
};