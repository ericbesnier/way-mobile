console.log('AppHeaderLeft...');
import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialHeaderButtons, Item } from './AppHeaderButtons';

export default class AppHeaderLeft extends Component {

  render() {
    return (
      <MaterialHeaderButtons IconComponent={MaterialIcons}>
        <Item title="Drawer" iconName="menu" onPress={
          () => { this.props.navigation.openDrawer(); }
        } />
      </MaterialHeaderButtons>
    );
  }
}

