import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { useGetTodayImage } from '@/hooks/index';
import { IdiomBelong } from '@/config/constants';
import styles from './index.module.less';

const SolitaireHeader = ({ currentSolitaireList }) => {
  console.log('%c zjs currentSolitaireList:', 'color: #fff;background: #b457ff;', currentSolitaireList);
  const todayImage = useGetTodayImage();

  return (
    <View className={styles.headerCardCon} style={{ backgroundImage: `url(${todayImage})` }}>
      <View className={styles.leftPart}>
        <View className={styles.titleCon}>
          <Text className={styles.title}>成语接龙</Text>
          <Text className={styles.rule}>游戏规则: 成语的最后一个字和下一个成语的第一个字必须相同，且成语长度必须大于等于4个字</Text>
        </View>
        <Text className={styles.footer}>{dayjs().format('MMMM D, YYYY')}</Text>
      </View>
      <View className={styles.rightPart}>
        <View className={styles.lenCon}>
          <Text className={styles.length}>{currentSolitaireList.length}</Text>
          <Text className={styles.lengthTip}>本局</Text>
        </View>
        <View className={styles.lenCon}>
          <Text className={styles.length}>{currentSolitaireList.filter((item) => item.belong === IdiomBelong.user && item.effect).length}</Text>
          <Text className={styles.lengthTip}>我的</Text>
        </View>
      </View>
    </View>
  );
};

export default SolitaireHeader;
