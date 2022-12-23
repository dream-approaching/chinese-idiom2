import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import ArrowIcon from '@/assets/images/arrow.png';
import { generalColorByStr } from '@/utils/index';
import type { IdiomListGetRes } from '@/types/http-types/idiom-list';
import styles from './index.module.less';

export default function IdiomItem({ item, allowToggle = true }: { item: IdiomListGetRes['data']['list'][0]; allowToggle?: boolean }) {
  const [open, setOpen] = useState(true);

  const contentArr = [
    { key: '拼音', value: item.pinyin },
    { key: '释义', value: item.explanation },
    { key: '出处', value: item.derivation },
    { key: '例子', value: item.example },
  ];

  const handleToggleStatus = () => {
    if (!allowToggle) return;
    setOpen(!open);
  };

  return (
    <View className={styles.collapseCon} onClick={handleToggleStatus}>
      <View className={styles.leftCon} style={{ backgroundColor: generalColorByStr(item.pinyin.split(' ')[0]) }}>
        <View className={styles.avatarText}>{item.pinyin.split(' ')[0]}</View>
      </View>
      <View className={styles.rightCon}>
        <View className={styles.titleCon}>
          <Text className={styles.titleText}>{item.word}</Text>
          {allowToggle && <Image className={`${styles.icon} ${open ? styles.openIcon : ''}`} src={ArrowIcon} />}
        </View>
        <View className={`${styles.contentCon} ${open ? styles.showAll : ''}`}>
          {contentArr.map((contentItem, index) => {
            return (
              <View key={index} className={styles.content}>
                <Text className={styles.contextKey}>{contentItem.key}: </Text>
                <Text className={styles.contextValue}>{contentItem.value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
