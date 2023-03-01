import {
  KeyboardAwareScrollView as RNKeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';

const KeyboardAwareScrollView = ({ children, ...props }) => (
  <RNKeyboardAwareScrollView
    automaticallyAdjustContentInsets={false}
    automaticallyAdjustsScrollIndicatorInsets={false}
    // extraScrollHeight={PADDING_VERTICAL_INPUT}
    keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
    {...props}
  >
    {children}
  </RNKeyboardAwareScrollView>
);

export default KeyboardAwareScrollView;
