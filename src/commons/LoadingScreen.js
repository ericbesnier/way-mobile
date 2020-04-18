import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import styles from './styles/LoadingScreen';

const LoadingScreen = (props) => {
  const size = props.size || 'large';
  const color = props.color || 'gray';
  const message = props.message || '';
  return (
    < View style={styles.root} >
      <ActivityIndicator
        size={size}
        color={color}
      />
      <Text style={styles.title}>Veuillez attendre, svp...</Text>
      <Text style={styles.message}>{message}</Text>
    </View >
  );
};

export default LoadingScreen;
