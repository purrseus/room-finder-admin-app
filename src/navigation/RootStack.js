import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import colors from '../assets/theme/colors';
import globalStyles from '../assets/theme/globalStyles';
import DetailPostScreen from '../screens/app/DetailPostScreen';
import BottomTab from './BottomTab';

const Stack = createNativeStackNavigator();

const ProtectedScreens = (
  <Stack.Group>
    <Stack.Screen name="BottomTab" component={BottomTab} />

    <Stack.Screen name="DetailPost" component={DetailPostScreen} />
  </Stack.Group>
);

const RootStack = () => {
  const [fontsLoaded] = useFonts({
    'BalooBhaina-Regular': require('../../assets/fonts/BalooBhaina2-Regular.ttf'),
    'BalooBhaina-Medium': require('../../assets/fonts/BalooBhaina2-Medium.ttf'),
    'BalooBhaina-SemiBold': require('../../assets/fonts/BalooBhaina2-SemiBold.ttf'),
    'BalooBhaina-Bold': require('../../assets/fonts/BalooBhaina2-Bold.ttf'),
    'BalooBhaina-ExtraBold': require('../../assets/fonts/BalooBhaina2-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={globalStyles.flexFillCenter}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      {ProtectedScreens}
    </Stack.Navigator>
  );
};

export default RootStack;
