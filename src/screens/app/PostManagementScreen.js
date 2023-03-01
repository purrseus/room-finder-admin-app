import { useScrollToTop } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../assets/theme/colors';
import globalStyles from '../../assets/theme/globalStyles';
import Background from '../../components/Background';
import LargeTitle from '../../components/LargeTitle';
import { postManagementSnapshot } from '../../firebase/cloudFirestore';
import { alphaHexColor } from '../../utils';
import PostManagementItem from './components/PostManagementItem';

const PostManagementScreen = () => {
  const [posts, setPosts] = useState([]);
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const scrollRef = useRef(null);

  useScrollToTop(scrollRef);

  useEffect(() => {
    let unsubscribe;
    unsubscribe = postManagementSnapshot((documentSnapshot) => {
      const tempPosts = [];
      documentSnapshot.forEach((doc) => {
        tempPosts.push({ ...doc.data(), id: doc.id });
      });
      setPosts(tempPosts);
    });

    return () => unsubscribe?.();
  }, []);

  const HeaderItems = useCallback(
    () => (
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>Danh sách bài đăng</Text>
        <Text style={styles.countItem}>{posts.length} kết quả</Text>
      </View>
    ),
    [posts],
  );

  const renderItem = useCallback(({ item }) => {
    return <PostManagementItem item={item} />;
  }, []);

  return (
    <Background topDecorHeight={0.2} style={globalStyles.flexFill}>
      <View style={[styles.headerWrapper, { height: height * 0.2 - top }]}>
        <LargeTitle>Quản lý bài đăng</LargeTitle>
      </View>

      <FlatList
        ref={scrollRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id || index}
        ListHeaderComponent={HeaderItems}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
    marginTop: 20,
    marginHorizontal: 30,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: alphaHexColor(colors.black, 0.6),
  },
  countItem: {
    fontSize: 8,
    color: alphaHexColor(colors.black, 0.6),
  },
});

export default PostManagementScreen;
