import React, { Component } from 'react';
import { View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';

export default function (ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false
    }

    componentDidMount() {
      this.handleConnectionChange();
    }

    handleConnectionChange = () => {
      const webPing = setInterval(
        async () => {
          fetch('https://google.com', { mode: 'no-cors' })
            .then(
              () => {
                this.setState({ isDisconnected: false });
                return clearInterval(webPing);
              }
            )
            .catch(
              (error) => {
                this.setState({ isDisconnected: true });
                this.dropdown.alertWithType('error', 'Error', error.message);
                return;
              }
            )
        }, 2000);
    }

    render() {
      console.log('NetworkDetector/render: this.state.isDisconnected=', this.state.isDisconnected);

      return (
        <View>
          <ComposedComponent {...this.props} />
          {this.state.isDisconnected ? <DropdownAlert ref={ref => this.dropdown = ref} /> : null}
        </View>
      );
    }
  }

  return NetworkDetector;
}

// { isDisconnected && (<DropdownAlert ref={ref => this.dropdown = ref} />) }
