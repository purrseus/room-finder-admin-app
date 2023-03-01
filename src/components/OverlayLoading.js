import { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '../assets/theme/colors';
import { alphaHexColor } from '../utils';

export const overlayLoadingRef = createRef(null);
export const showOverlayLoading = (isShow) => overlayLoadingRef.current?.[isShow ? 'show' : 'hide']?.();

const OverlayLoading = forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
      },
    }),
    [],
  );

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.white} size="large" />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: alphaHexColor(colors.black, 0.4),
  },
});

export default OverlayLoading;
