import { View, Text } from '@tarojs/components';
import { generalColorByStr } from '@/utils/index';
import type { TypeSolitaireItem } from '@/types/http-types/common';
import styles from './index.module.less';

export default function SolitaireItem({ item }: { item?: TypeSolitaireItem }) {
  return (
    <View className={styles.itemCon} key={item?.idiom.word}>
      <View className={styles.pinyinAvatar}>
        <View className={styles.avatar} style={{ backgroundColor: generalColorByStr(item?.idiom.pinyin.split(' ')[0] || '') }}>
          {item?.idiom.pinyin.split(' ')[0]}
        </View>
      </View>
      <View className={styles.idiomContent}>
        <Text className={styles.idiomText}>{item?.idiom.word}</Text>
        <Text className={styles.idiomPinyin}>{item?.idiom.pinyin}</Text>
      </View>
      <View className={styles.rightContent}>
        {item?.spend && (
          <>
            <Text className={styles.spentTime}>{`${(item?.spend / 1000 / 100).toFixed(2)} s`}</Text>
            <Text className={styles.spentTimeTip}>耗时</Text>
          </>
        )}
      </View>
    </View>
  );
}
