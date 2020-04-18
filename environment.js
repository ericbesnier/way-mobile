console.log('environment...');
import Constants from 'expo-constants';
console.log('environment/getEnvVars: Constants.manifest.releaseChannel=', Constants.manifest.releaseChannel);

const ENV = {
    dev: {
        urlApi: 'http://176.149.36.213:3000/api',
        APP_ID: '170454296968913', // login facebook
        CLIENT_ID_ANDROID: '648797721385-7798mlinhpa1fp6c0e5p6ec7cdsebtdh.apps.googleusercontent.com',
        CLIENT_ID_IOS: '648797721385-6826runjm4lrcfhovb875sm95sgbef1v.apps.googleusercontent.com',
        FireBaseConfig: {
            apiKey: 'AIzaSyBuuVdML812yXZu6oW5r5ubtlPqTZGf2pg',
            authDomain: 'way-205813.firebaseapp.com',
            databaseURL: 'https://way-205813.firebaseio.com',
            storageBucket: 'gs://way-205813.appspot.com'
          }
    },
    staging: {
        urlApi: 'http://176.149.36.213:3000/api',
        APP_ID: '170454296968913', // login facebook
        CLIENT_ID_ANDROID: '648797721385-7798mlinhpa1fp6c0e5p6ec7cdsebtdh.apps.googleusercontent.com',
        CLIENT_ID_IOS: '648797721385-6826runjm4lrcfhovb875sm95sgbef1v.apps.googleusercontent.com',
        FireBaseConfig: {
            apiKey: 'AIzaSyBuuVdML812yXZu6oW5r5ubtlPqTZGf2pg',
            authDomain: 'way-205813.firebaseapp.com',
            databaseURL: 'https://way-205813.firebaseio.com',
            storageBucket: 'gs://way-205813.appspot.com'
          }
    },
    prod: {
        urlApi: 'http://176.149.36.213:3000/api',
        APP_ID: '170454296968913', // login facebook
        CLIENT_ID_ANDROID: '648797721385-7798mlinhpa1fp6c0e5p6ec7cdsebtdh.apps.googleusercontent.com',
        CLIENT_ID_IOS: '648797721385-6826runjm4lrcfhovb875sm95sgbef1v.apps.googleusercontent.com',
        FireBaseConfig: {
            apiKey: 'AIzaSyBuuVdML812yXZu6oW5r5ubtlPqTZGf2pg',
            authDomain: 'way-205813.firebaseapp.com',
            databaseURL: 'https://way-205813.firebaseio.com',
            storageBucket: 'gs://way-205813.appspot.com'
          }
    }
};

console.log('environment: Constants.manifest.releaseChannel=', Constants.manifest.releaseChannel);

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    console.log('environment/getEnvVars: env=', env);
    console.log('environment/getEnvVars: __DEV__=', __DEV__);
    // __DEV__ is true when run locally, but false when published (react-native is running in Dev mode)
    if (__DEV__) {
        return ENV.dev;
    } else if (env === 'staging') {
        return ENV.staging;
    } else if (env === 'prod') {
        return ENV.prod;
    }
};

export default getEnvVars;