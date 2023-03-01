import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../assets/theme/colors';
import { alphaHexColor } from '../utils';
import Spacer from './Spacer';

const IconTextInput = ({
  iconLeft,
  iconLeftStyle,
  iconRightStyle,
  textInputStyle,
  iconRight,
  style,
  editable,
  ...props
}) => {
  const [isFocusing, setIsFocusing] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocusing && { borderColor: colors.primary },
        style,
      ]}
    >
      {!!iconLeft && (
        <View style={styles.iconWrapper}>
          <Image source={iconLeft} style={[styles.icon, iconLeftStyle]} />
        </View>
      )}
      <Spacer w={8} />
      {editable === false ? (
        <Text
          style={[
            styles.input,
            { height: undefined, color: alphaHexColor(colors.black, 0.3) },
            textInputStyle,
          ]}
        >
          {props.placeholder}
        </Text>
      ) : (
        <TextInput
          {...props}
          selectionColor={colors.primary}
          onFocus={() => setIsFocusing(true)}
          onBlur={() => setIsFocusing(false)}
          style={[styles.input, textInputStyle]}
        />
      )}
      {!!iconRight && (
        <View style={styles.iconWrapper}>
          <Image source={iconRight} style={[styles.icon, iconRightStyle]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.input,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  iconWrapper: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
  input: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    fontSize: 12,
    height: 18,
    flex: 1,
  },
});

export default IconTextInput;
