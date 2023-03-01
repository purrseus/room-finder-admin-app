/* eslint-disable no-useless-escape */
import { FirebaseError } from 'firebase/app';
import {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../assets/theme/colors';
import { alphaHexColor, shadowGenerator } from '../utils';
import { showOverlayLoading } from './OverlayLoading';
import Spacer from './Spacer';

const EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use';
const USER_NOT_FOUND = 'auth/user-not-found';
const WRONG_PASSWORD = 'auth/wrong-password';

const getMessage = (message) => {
  switch (true) {
    case message.includes(EMAIL_ALREADY_IN_USE):
      return 'Email này đã được sử dụng!';
    case message.includes(USER_NOT_FOUND):
    case message.includes(WRONG_PASSWORD):
      return 'Email hoặc Mật khẩu không đúng!';
    default:
      return message;
  }
};

export const toastNotificationRef = createRef(null);
export const showTopToast = (message, isSucceeded = false) => {
  if (__DEV__) console.log(message);
  showOverlayLoading(false);
  toastNotificationRef.current?.show(
    message instanceof FirebaseError
      ? getMessage(message.message)
      : message?.toString() || '',
    isSucceeded,
  );
};

const SuccessIcon = () => (
  <View style={styles.successIconWrapper}>
    <Image
      source={require('../assets/icons/check/check.png')}
      style={styles.successIcon}
    />
  </View>
);

const FailedIcon = () => {
  return (
    <View style={styles.failedIconWrapper}>
      <Image
        source={require('../assets/icons/plus/plus.png')}
        style={styles.failedIcon}
      />
    </View>
  );
};

const ToastNotification = forwardRef((_, ref) => {
  const { top } = useSafeAreaInsets();
  const isShowing = useRef(false);
  const [content, setContent] = useState({ message: '', isSucceeded: false });
  const transitionAnimation = useRef(new Animated.Value(-120)).current;

  const reset = useCallback(() => {
    isShowing.current = false;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (message, isSucceeded = false) => {
        if (isShowing.current) return;
        setContent({ message, isSucceeded });
        isShowing.current = true;

        const timeout = setTimeout(() => {
          isShowing.current = false;
        }, 4000);

        const animationScript = Animated.sequence([
          Animated.spring(transitionAnimation, {
            duration: 250,
            friction: 6,
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
          Animated.spring(transitionAnimation, {
            duration: 250,
            toValue: -120,
            useNativeDriver: true,
          }),
        ]);

        animationScript.start(() => {
          isShowing.current = false;
          clearTimeout(timeout);
        });
      },
    }),
    [reset],
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { marginTop: top + 16 },
        { transform: [{ translateY: transitionAnimation }] },
      ]}
    >
      {content.isSucceeded ? <SuccessIcon /> : <FailedIcon />}
      <Spacer w={6} />
      <Text style={styles.message} numberOfLines={2}>
        {content.message}
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1000,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    ...shadowGenerator(8),
  },
  successIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    tintColor: colors.white,
    width: 10,
    height: 10,
  },
  failedIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedIcon: {
    tintColor: colors.white,
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
  },
  message: {
    flexShrink: 1,
    fontSize: 12,
    marginLeft: 6,
    color: alphaHexColor(colors.black, 0.6),
  },
});

export default ToastNotification;
