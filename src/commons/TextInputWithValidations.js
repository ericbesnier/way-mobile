import React from 'react';
import { View } from 'react-native';
import { FormInput, FormLabel, FormValidationMessage } from 'react-native-elements';

import Colors from '../../constants/colors';

const TextInputWithValidations = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <View>
    <FormLabel fontFamily="montserrat" labelStyle={{ color: Colors.$blackBlueColor }}>
      {label}
    </FormLabel>
    <FormInput
      {...input}
      {...custom}
    />
    {error && touched &&
        <FormValidationMessage fontFamily="montserrat" labelStyle={{ color: Colors.$redColor }}>
          {error}
        </FormValidationMessage>}
  </View>
);

export default TextInputWithValidations;