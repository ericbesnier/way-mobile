
console.log('App...');
import React from 'react';
import { Root } from './Root';
// import NetworkDetector from './src/networkDetector/NetworkDetector';

// c l a s s   A p p
//
export default class App extends React.Component {
  render = () => {
    return (
      <Root />
    );
  }
}

// export default NetworkDetector(App);