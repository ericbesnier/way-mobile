console.log('AppHeaderRight...');
import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { MaterialHeaderButtons, Item } from './AppHeaderButtons';
import SearchHeader from '../menubar/SearchHeader';

export default class AppHeaderRight extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  render() {
    if (this.props.iconName === 'search') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <MaterialHeaderButtons IconComponent={MaterialIcons}>
            <Item
              title="Search"
              iconName={'search'}
              onPress={() => {
                this.props.navigation.setParams({ SearchHeader: () => SearchHeader() });
              }}
            />
          </MaterialHeaderButtons>
        </View >
      );
    }
  }
}