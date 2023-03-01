import { StyleSheet, View } from 'react-native';
import colors from '../assets/theme/colors';
import { alphaHexColor, shadowGenerator } from '../utils';

const LargeCard = ({ children, style, ...props }) => {
  return (
    <View {...props} style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 30,
    paddingVertical: 26,
    marginHorizontal: 30,
    ...shadowGenerator(16, alphaHexColor(colors.black, 0.3)),
  },
});

export default LargeCard;
