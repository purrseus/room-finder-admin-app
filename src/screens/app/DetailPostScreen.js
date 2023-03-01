import { useEffect, useMemo, useState } from 'react';
import {
  Image as RNImage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import open from 'react-native-open-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../assets/theme/colors';
import fonts from '../../assets/theme/fonts';
import globalStyles from '../../assets/theme/globalStyles';
import Button from '../../components/Button';
import Image from '../../components/Image';
import Spacer from '../../components/Spacer';
import { showTopToast } from '../../components/ToastNotification';
import { approvePost, deletePost, postSnapshot, userSnapshot } from '../../firebase/cloudFirestore';
import {
  alphaHexColor,
  formatCurrency,
  formatDate,
  utilityTitle,
} from '../../utils';

const CheckItem = ({ title }) => {
  return (
    <View style={[styles.row, { width: '50%' }]}>
      <RNImage
        source={require('../../assets/icons/check/check.png')}
        style={styles.checkIcon}
      />
      <Text style={styles.statusText}>{title}</Text>
    </View>
  );
};

const DetailPostScreen = ({ navigation, route: { params } }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [post, setPost] = useState();

  useEffect(() => {
    let unsubscribe;
    if (params?.id) {
      unsubscribe = postSnapshot(params?.id, (documentSnapshot) => {
        setPost({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      });
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (post?.userId) {
      unsubscribe = userSnapshot(post?.userId, (documentSnapshot) => {
        setPost((prevState) => ({
          ...prevState,
          user: documentSnapshot.data(),
        }));
      });
    }

    return unsubscribe;
  }, [post?.userId]);

  const availableUtilities = useMemo(() => {
    if (!post) return [];
    return Object.entries(post).filter(
      ([key, value]) => !!key.startsWith('has') && !!value,
    );
  }, [post]);

  const goToMaps = async () => {
    if (!post?.address) return;

    try {
      open({
        provider: Platform.OS === 'ios' ? 'apple' : 'google',
        query: post?.address,
      });
    } catch (error) {
      showTopToast(error);
    }
  };

  const handleApprovePost = async () => {
    if (!params?.id) return;
    try {
      await approvePost(params?.id);
      navigation.goBack();
      showTopToast('Duyệt bài đăng thành công!', true);
    } catch (error) {
      showTopToast(error);
    }
  }

  const handleDeletePost = async () => {
    if (!params?.id) return;
    try {
      await deletePost(params?.id);
      navigation.goBack();
      showTopToast('Xóa bài đăng thành công!', true);
    } catch (error) {
      showTopToast(error);
    }
  }

  return (
    <View style={globalStyles.flexFill}>
      <TouchableOpacity
        activeOpacity={1}
        hitSlop={12}
        onPress={navigation.goBack}
        style={[styles.back, { top: top + 12 }]}
      >
        <RNImage
          source={require('../../assets/icons/arrow-left/arrow-left.png')}
        />
      </TouchableOpacity>
      <Image
        source={{ imageStorage: post?.photo }}
        style={{ width, height: height * 0.48 }}
      />
      <View style={[styles.sheet, { height: height * 0.52 + 30 }]}>
        <ScrollView
          contentContainerStyle={[
            { paddingTop: 30, paddingHorizontal: 30 },
            !post && { display: 'none' },
          ]}
        >
          <Text numberOfLines={2} style={styles.title}>
            {post?.title}
          </Text>
          <View style={styles.rowBetween}>
            <View style={styles.roomRateWrapper}>
              <Text style={styles.roomRate}>
                {formatCurrency(post?.roomRate)}
              </Text>
              <Text style={styles.perMonth}> / tháng</Text>
            </View>
            <Text style={styles.createdAt}>
              Ngày đăng: {formatDate(post?.createdAt)}
            </Text>
          </View>

          <View style={styles.twoSideContainer}>
            <View style={styles.leftContentContainer}>
              {!!post?.area && (
                <View style={styles.row}>
                  <View style={styles.iconWrapper}>
                    <RNImage
                      source={require('../../assets/icons/size/size.png')}
                      style={styles.sizeIcon}
                    />
                  </View>
                  <Text style={styles.info} numberOfLines={1}>
                    Diện tích: {post?.area}m2
                  </Text>
                </View>
              )}
              <Spacer h={8} />
              {!!post?.address && (
                <View style={styles.row}>
                  <View style={styles.iconWrapper}>
                    <RNImage
                      source={require('../../assets/icons/map-marker/map-marker.png')}
                      style={styles.locationIcon}
                    />
                  </View>
                  <Text style={styles.info} numberOfLines={4}>
                    {post?.address}
                  </Text>
                </View>
              )}
              <Spacer h={8} />
              {!!post?.user?.phoneNumber && (
                <View style={styles.row}>
                  <View style={styles.iconWrapper}>
                    <RNImage
                      source={require('../../assets/icons/call/call.png')}
                      style={styles.callIcon}
                    />
                  </View>
                  <Text style={styles.info} numberOfLines={2}>
                    {post?.user?.phoneNumber}
                  </Text>
                </View>
              )}
            </View>
            <Spacer w={16} />
            <View style={styles.rightContentContainer}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: post?.isOutOfRoom
                        ? colors.orange
                        : colors.primary,
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {post?.isOutOfRoom ? 'Hết phòng' : 'Còn phòng'}
                </Text>
              </View>
              <Spacer h={8} />
              <Text style={styles.owner}>Chủ trọ: {post?.user?.name}</Text>
              <Spacer h={8} />
              <Text onPress={goToMaps} style={styles.hyperLink}>
                Xem trên Google Map
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subTitle}>Miêu tả</Text>
          <Text style={styles.description}>{post?.description}</Text>

          <Text style={styles.subTitle}>Tiện ích</Text>

          <View style={styles.checkContainer}>
            {availableUtilities.map(([text]) => (
              <CheckItem key={text} title={utilityTitle(text)} />
            ))}
          </View>
        </ScrollView>
        {!post?.approved && <Button
          title="Duyệt bài"
          onPress={handleApprovePost}
          style={[styles.button, { marginBottom: 4 }]}
        />}
        <Button
          title="Xóa bài"
          onPress={handleDeletePost}
          style={[styles.button, { marginBottom: bottom || 16, backgroundColor: colors.red }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.white,
    ...StyleSheet.absoluteFillObject,
    top: undefined,
  },
  back: {
    position: 'absolute',
    zIndex: 10,
    left: 30,
  },
  title: {
    fontSize: 20,
    color: alphaHexColor(colors.black, 0.6),
    fontFamily: fonts.balloBhainaExtraBold,
    flexShrink: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createdAt: {
    fontSize: 10,
    color: alphaHexColor(colors.black, 0.6),
  },
  leftContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  twoSideContainer: {
    flexDirection: 'row',
    marginTop: 26,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeIcon: {
    width: 14,
    height: 14,
  },
  locationIcon: {
    width: 10,
    height: 13,
  },
  info: {
    flexShrink: 1,
    fontSize: 12,
    marginLeft: 10,
    color: alphaHexColor(colors.black, 0.6),
  },
  callIcon: {
    width: 14,
    height: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 10,
    color: alphaHexColor(colors.black, 0.6),
  },
  owner: {
    fontSize: 10,
    color: alphaHexColor(colors.black, 0.6),
  },
  hyperLink: {
    fontSize: 10,
    color: alphaHexColor(colors.black, 0.8),
    textDecorationLine: 'underline',
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    marginVertical: 26,
  },
  subTitle: {
    fontSize: 12,
    color: alphaHexColor(colors.black, 0.8),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 10,
    color: alphaHexColor(colors.black, 0.6),
    marginBottom: 18,
  },
  checkIcon: {
    width: 12,
    height: 12,
  },
  checkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 6,
    marginTop: 8,
    marginHorizontal: 30,
  },
});

export default DetailPostScreen;
