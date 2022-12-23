import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';

import { AtActivityIndicator } from 'taro-ui';
import { useGetTodayImage, useGetTodayIdiom } from '@/hooks/index';
import styles from './index.module.less';

const HomeHeader = () => {
  const { image, refreshImage, imgLoading } = useGetTodayImage();
  const { idiom, refreshIdiom } = useGetTodayIdiom();

  return (
    <View className={styles.headContainer}>
      <View className={styles.headerCardCon} style={{ backgroundImage: `url(${image})` }}>
        <AtActivityIndicator isOpened={imgLoading} mode="center"></AtActivityIndicator>
        <View className={styles.leftPart}>
          <View className={styles.titleCon}>
            <View className={styles.titleLine}>
              <Text className={styles.title}>{idiom.word}</Text>
              <Text className={styles.refreshText} onClick={refreshIdiom}>
                换词
              </Text>
            </View>
            <Text className={styles.rule}>{idiom.derivation.length > 1 && idiom.derivation}</Text>
            <Text className={styles.rule}>{idiom.explanation.length > 1 && idiom.explanation}</Text>
          </View>
          <View className={styles.footer}>
            <Text className={styles.time}>{dayjs().format('MMMM D, YYYY')}</Text>
            <Text className={styles.toggleBtn} onClick={refreshImage}>
              换背景图
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
