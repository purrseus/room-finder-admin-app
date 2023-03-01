import { useActionSheet } from '@expo/react-native-action-sheet';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../../assets/theme/colors';
import Image from '../../../components/Image';
import Spacer from '../../../components/Spacer';
import { showTopToast } from '../../../components/ToastNotification';
import { deleteUser } from '../../../firebase/cloudFirestore';
import { alphaHexColor, shadowGenerator } from '../../../utils';

const actionSheetOptions = ['Xóa người dùng', 'Hủy'];
const destructiveButtonIndex = 0;
const cancelButtonIndex = 1;

const UserItem = ({ item }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const onShowActionSheet = () => {
    if (!item?.id) return;

    showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      async (selectedIndex) => {
        try {
          switch (selectedIndex) {
            case destructiveButtonIndex:
              await deleteUser(item.id);
              showTopToast('Đã xóa người dùng!', true);
              break;
  
            case cancelButtonIndex:
              // Canceled
              break;
          }
        } catch (error) {
          showTopToast(error);
        }
      },
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={onShowActionSheet}
      style={styles.container}
    >
      <Image style={styles.image} source={{ imageStorage: item?.avatar }} />
      <Spacer w={14} />
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={styles.email}>{item?.email}</Text>
          <Text style={styles.address}>{item?.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginHorizontal: 30,
    borderRadius: 8,
    ...shadowGenerator(8, alphaHexColor(colors.black, 0.4)),
    backgroundColor: colors.white,
    padding: 12,
    flexDirection: 'row',
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    color: alphaHexColor(colors.black, 0.6),
    fontWeight: 'bold',
    flexShrink: 1,
  },
  email: {
    marginVertical: 8,
    fontWeight: 'bold',
    fontSize: 11,
    color: alphaHexColor(colors.black, 0.6),
    flexShrink: 1,
  },
  address: {
    marginBottom: 8,
    fontSize: 10,
    color: alphaHexColor(colors.black, 0.6),
    flexShrink: 1,
  },
  roomRateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomRate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  perMonth: {
    fontSize: 11,
    color: alphaHexColor(colors.black, 0.6),
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 18,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    color: alphaHexColor(colors.black, 0.6),
  },
});

export default UserItem;
