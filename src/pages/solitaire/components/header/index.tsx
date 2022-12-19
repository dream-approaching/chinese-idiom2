import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import { AtActivityIndicator } from 'taro-ui';
import { useGetTodayImage } from '@/hooks/index';
import { IdiomBelong, Max_Idiom_Time } from '@/config/constants';
import styles from './index.module.less';

const SolitaireHeader = ({ currentSolitaireList, showRight, onRestart }) => {
  const { image, refreshImage, imgLoading } = useGetTodayImage();

  return (
    <View className={styles.headerCardCon} style={{ backgroundImage: `url(${image})` }}>
      <AtActivityIndicator isOpened={imgLoading} mode="center"></AtActivityIndicator>
      <View className={styles.leftPart}>
        <View className={styles.titleCon}>
          <Text className={styles.title}>成语接龙</Text>
          <Text className={styles.rule}>
            游戏规则: 成语的最后一个字和下一个成语的第一个字必须相同，且成语长度必须大于等于4个字。最长等待时间{Max_Idiom_Time}秒
          </Text>
        </View>
        <View className={styles.footer}>
          <Text className={styles.time}>{dayjs().format('MMMM D, YYYY')}</Text>
          <Text className={styles.toggleBtn} onClick={refreshImage}>
            换背景图
          </Text>
        </View>
      </View>
      {showRight && (
        <View className={styles.rightPart}>
          <View className={styles.rightTop}>
            <View className={styles.lenCon}>
              <Text className={styles.length}>{currentSolitaireList.length}</Text>
              <Text className={styles.lengthTip}>本局</Text>
            </View>
            <View className={styles.lenCon}>
              <Text className={styles.length}>{currentSolitaireList.filter((item) => item.belong === IdiomBelong.user && item.effect).length}</Text>
              <Text className={styles.lengthTip}>我的</Text>
            </View>
          </View>
          <View className={styles.rightBottom}>
            <Text className={styles.restartText} onClick={onRestart}>
              重新开始
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SolitaireHeader;
