import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import colors from '../assets/theme/colors';
import { alphaHexColor } from '../utils';

const OutlinedTextInput = forwardRef(
  ({ errorMessage = '', CustomView, ...props }, ref) => {
    return (
      <>
        <View style={{ justifyContent: 'center' }}>
          <TextInput
            ref={ref}
            mode="outlined"
            outlineStyle={[
              styles.inputOutline,
              !!errorMessage.length && { borderColor: colors.red },
            ]}
            activeOutlineColor={colors.primary}
            contentStyle={[
              styles.contentInput,
              !!props.multiline && { height: 100 },
            ]}
            style={styles.input}
            maxLength={255}
            {...props}
          />
          {CustomView}
        </View>

        {!!errorMessage.length && (
          <Text style={styles.passwordIncorrect}>{errorMessage}</Text>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  inputOutline: {
    borderWidth: 0.5,
    borderColor: alphaHexColor(colors.black, 0.3),
    backgroundColor: colors.white,
  },
  input: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: 4,
  },
  contentInput: {},
  passwordIncorrect: {
    fontSize: 10,
    color: colors.red,
    zIndex: 10,
  },
});

export default OutlinedTextInput;
