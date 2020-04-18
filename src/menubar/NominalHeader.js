import React, { Component } from 'react';
import { Header } from 'react-navigation-stack';
import { View, Platform } from 'react-native';

class NominalHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          marginTop: Platform.OS == 'ios' ? 20 : 0,
          backgroundColor: '#ffA500',
        }}
      >
        <Header {...this.props} />
      </View>
    );
  }
}

export default NominalHeader;