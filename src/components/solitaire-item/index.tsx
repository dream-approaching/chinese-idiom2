import { View, Text } from '@tarojs/components';
import type { TypeSolitaireItem } from '@/types/http-types/common';
import { IdiomBelong, ColorTheme } from '@/config/constants';
import { AtActivityIndicator } from 'taro-ui';
import styles from './index.module.less';

export default function SolitaireItem({ item, size }: { item?: TypeSolitaireItem; size: string }) {
  const avatarBg = item?.effect ? (item?.belong === IdiomBelong.robot ? ColorTheme.robot : ColorTheme.user) : 'transparent';
  return (
    <View className={`${styles.itemCon} ${styles[size]}`} key={item?.idiom.word}>
      <View className={styles.pinyinAvatar}>
        <View className={styles.avatar} style={{ backgroundColor: avatarBg }}>
          {item?.idiom.pinyin.split(' ')[0]}
        </View>
      </View>
      <View className={styles.idiomContent}>
        {(item?.idiom.word && (
          <Text className={`${styles.idiomText} ${item.effect ? '' : styles.unEffect}`}>
            {item.idiom.word}
            {!item.effect && '(无效)'}
          </Text>
        )) || <Text className={styles.idiomTextWaiting}>小灵思考中。。。</Text>}
        <Text className={styles.idiomPinyin}>{item?.idiom.pinyin}</Text>
      </View>
      <View className={styles.rightContent}>
        {(item?.spend && (
          <>
            <Text className={styles.spentTime}>{`${(item?.spend / 1000).toFixed(2)} s`}</Text>
            <Text style={{ color: item.belong === IdiomBelong.robot ? ColorTheme.robot : ColorTheme.user }} className={styles.spentTimeTip}>
              {item.belong === IdiomBelong.robot ? '小灵' : '我'}
            </Text>
          </>
        )) || <AtActivityIndicator className={styles.spinIcon} color="#999"></AtActivityIndicator>}
      </View>
    </View>
  );
}
