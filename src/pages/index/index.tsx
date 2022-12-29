import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { VERSION } from '@/config/constants';
import { HomeHeader } from './components';
import styles from './index.module.less';

const Home = () => {
  const handleToDictionary = () => {
    Taro.navigateTo({
      url: '/pages/dictionary/index',
    });
  };

  const handleToSolitaire = () => {
    Taro.navigateTo({
      url: '/pages/solitaire/index',
    });
  };

  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '成语接龙，试试你可以接几个',
      path: '/pages/index/index',
    };
  });

  useShareTimeline(() => {
    return {
      title: '成语接龙，随便接一个',
      path: '/pages/index/index',
    };
  });

  const handleAppreciate = () => {
    Taro.previewImage({
      urls: ['https://zhengjinshou.cn/other/like.jpg'],
    });
  };
  return (
    <View className={styles.homeCon}>
      <HomeHeader />
      <View>
        <View onClick={handleToDictionary} className={styles.cardItem}>
          <Text>成语查找</Text>
        </View>
        <View onClick={handleToSolitaire} className={styles.cardItem}>
          <Text>成语接龙</Text>
        </View>
      </View>
      <View className={styles.footer}>
        <Button className={styles.footerBtn}>{VERSION}</Button>
        <Button className={styles.footerBtn} data-name="shareBtn" open-type="share">
          分享
        </Button>
        <Button className={styles.footerBtn} onClick={handleAppreciate}>
          赞赏
        </Button>
      </View>
    </View>
  );
};

export default Home;
