
import { Alert } from 'react-native';

export const logErrorResponseServer = (functionName, error) => {
  if (error.response) {
    console.log(functionName, ': Error Response Server ! The request was made and the server responded with a status code that falls out of the range of 2xx');
    console.log(functionName, ': error.response.data=', error.response.data);
    console.log(functionName, ': error.response.status=', error.response.status);
    console.log(functionName, ': error.response.headers=', error.response.headers);
    Alert.alert(
      'Error Response Server !',
      JSON.stringify(error.response.data)
    );
  } else if (error.request) {
    console.log(functionName, ': Error Response Server ! The request was made but no response was received');
    console.log(functionName, ': error.request=', error.request);
    Alert.alert(
      'Error Response Server !',
      JSON.stringify(error.request)
    );
  } else {
    console.log(functionName, ': Error Response Server ! Something happened in setting up the request that triggered an Error > error.message=', error.message);
    Alert.alert(
      'Error Response Server !',
      JSON.stringify(error.message)
    );
  }
};

// export const logErrorResponseServer = (functionName, error) => {
//   if (error.response) {
//     console.log(functionName, ': Error Response Server ! The request was made and the server responded with a status code that falls out of the range of 2xx');
//     console.log(functionName, ': error.response.data=', error.response.data);
//     console.log(functionName, ': error.response.status=', error.response.status);
//     console.log(functionName, ': error.response.headers=', error.response.headers);
//     Alert.alert(
//       'Error Response Server !',
//       error.response.data
//     );
//   } else if (error.request) {
//     console.log(functionName, ': Error Response Server ! The request was made but no response was received');
//     console.log(functionName, ': error.request=', error.request);
//     Alert.alert(
//       'Error Response Server !',
//       error.request
//     );
//   } else {
//     console.log(functionName, ': Error Response Server ! Something happened in setting up the request that triggered an Error > error.message=', error.message);
//     Alert.alert(
//       'Error Response Server !',
//       error.message
//     );
//   }
// };