import { View, Text } from '@tarojs/components';
import { generalColorByStr } from '@/utils/index';
import type { TypeSolitaireItem } from '@/types/http-types/common';
import { IdiomBelong } from '@/config/constants';
import { AtActivityIndicator } from 'taro-ui';
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
        {(item?.idiom.word && <Text className={styles.idiomText}>{item.idiom.word}</Text>) || <Text className={styles.idiomTextWaiting}>小灵思考中。。。</Text>}
        <Text className={styles.idiomPinyin}>{item?.idiom.pinyin}</Text>
      </View>
      <View className={styles.rightContent}>
        {(item?.spend && (
          <>
            <Text className={styles.spentTime}>{`${(item?.spend / 1000).toFixed(2)} s`}</Text>
            <Text className={styles.spentTimeTip}>{item.belong === IdiomBelong.robot ? '小灵' : '我'}</Text>
          </>
        )) || <AtActivityIndicator className={styles.spinIcon} color="#999"></AtActivityIndicator>}
      </View>
    </View>
  );
}
