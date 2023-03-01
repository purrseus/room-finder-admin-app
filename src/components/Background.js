import {
  ScrollView,
  StyleSheet, useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../assets/theme/colors';
import KeyboardAwareScrollView from './KeyboardAwareScrollView';

const Background = ({
  children,
  topDecorHeight = 0.33,
  scrollView,
  keyboardScrollView,
  ...props
}) => {
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const Component = keyboardScrollView ? KeyboardAwareScrollView : scrollView ? ScrollView : View;

  return (
    <View style={styles.container}>
      <View style={[styles.topDecor, { height: height * topDecorHeight }]} />
      <View
        style={StyleSheet.absoluteFill}
      >
        <View style={{ height: top }} />
        <Component {...props}>{children}</Component>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topDecor: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default Background;
