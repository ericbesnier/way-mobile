// expo
import { MaterialIcons } from '@expo/vector-icons';
// react
import React from 'react';
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator
} from 'react-navigation';
// components
import MapScreen from '../map/MapScreen';
import MapContainer from '../map/MapContainer';
import ContactsContainer from '../contacts/contactsContainer/ContactsContainer';
import ContactsListScreen from '../contacts/contactsListScreen/ContactsListScreen';
import ContactsDetailsScreen from '../contacts/contactsDetailsScreen/ContactsDetailsScreen';
import AppMenuLeft from '../menubar/AppMenuLeft';
// others
import Colors from '../../constants/colors';
import { DRAWER_WIDTH } from '../../constants/values';
import NominalHeader from '../menubar/NominalHeader';
import AppHeaderLeft from '../menubar/AppHeaderLeft';
import AppHeaderRight from '../menubar/AppHeaderRight';
import SearchHeader from '../menubar/SearchHeader';

const MapStackNavigator = createStackNavigator({
  MapContainer: { screen: MapContainer },
  MapScreen: { screen: MapScreen }
},
{ headerMode: 'none' });

const ContactsStackNavigator = createStackNavigator({
  ContactsContainer: { screen: ContactsContainer },
  ContactsListScreen: { screen: ContactsListScreen },
  ContactsDetailsScreen: { screen: ContactsDetailsScreen },
},
{ headerMode: 'none' });

export const AppTabNavigator = createMaterialTopTabNavigator({
  Map: { screen: MapStackNavigator },
  Contacts: { screen: ContactsStackNavigator }
},
{
  initialRouteName: 'Map',
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: () => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Map') {
        iconName = 'map';
      } else if (routeName === 'Contacts') {
        iconName = 'contacts';
      }
      return <MaterialIcons name={iconName} size={25} color={'#e69500'} />;
    },
  }),
  tabBarOptions: {
    style: {
      backgroundColor: Colors.$whiteBackground,
    },
    showIcon: true,
    showLabel: false,
    indicatorStyle: { backgroundColor: '#9a6300' },
    pressColor: '$blueColor'
  },
});

const AppHeaderStackNavigator = createStackNavigator({
  HeaderStackNavigator: { screen: AppTabNavigator },
},
{
  navigationOptions: ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let headerTitle = routeName;
    const { params } = navigation.state;
    if (routeName === 'Contacts') {
      // console.log('AppTabNavigator/AppHeaderStackNavigator: params=', params);
      return (
        {
          header: params ? props => <SearchHeader {...props} />
            : props => <NominalHeader {...props} />,
          headerRight: <AppHeaderRight iconName='search' navigation={navigation} />,
          headerLeft: <AppHeaderLeft navigation={navigation} />,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: '#ffff', // $whiteColor
          headerMode: 'screen',
          headerTitle
        });
    }
    return (
      {
        header: props => <NominalHeader {...props} />,
        headerLeft: <AppHeaderLeft navigation={navigation} />,
        headerStyle: { backgroundColor: 'transparent', },
        headerTintColor: '#ffff', // $whiteColor
        headerMode: 'screen',
        headerTitle
      });
  }
},
);

export const AppRootNavigator = createDrawerNavigator({
  Home: { screen: AppHeaderStackNavigator, },
},
{
  drawerWidth: DRAWER_WIDTH,
  drawerPosition: 'left',
  contentComponent: ({ navigation }) => {
    return <AppMenuLeft
      navigation={navigation}
      label="First Item" />;
  },
}
);

