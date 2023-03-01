import { Text } from 'react-native';
import colors from '../assets/theme/colors';
import fonts from '../assets/theme/fonts';

const LargeTitle = ({ style, ...props }) => {
  return (
    <Text
    {...props}
    style={[{ fontSize: 24, fontFamily: fonts.balloBhainaExtraBold, color: colors.white, textAlign: 'center' }, style]}
    />
  );
};

export default LargeTitle;
