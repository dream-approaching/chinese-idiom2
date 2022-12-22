import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { HomeHeader } from './components';
import styles from './index.module.less';

const Home = () => {
  const handleToDictionary = () => {
    Taro.navigateTo({
      url: 'pages/dictionary/index',
    });
  };

  const handleToSolitaire = () => {
    Taro.navigateTo({
      url: 'pages/solitaire/index',
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
    </View>
  );
};

export default Home;
