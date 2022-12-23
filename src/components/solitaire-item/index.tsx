import { View, Text } from '@tarojs/components';
import { useState, useEffect, memo } from 'react';
import type { TypeSolitaireItem, TypeIdiomItem } from '@/types/http-types/common';
import { IdiomBelong, ColorTheme } from '@/config/constants';
import { IdiomItem } from '@/components/index';
import { AtActivityIndicator, AtModal, AtModalContent } from 'taro-ui';
import styles from './index.module.less';

function SolitaireItem({ item, size }: { item?: TypeSolitaireItem; size?: string }) {
  const avatarBg = item?.effect ? (item?.belong === IdiomBelong.robot ? ColorTheme.robot : ColorTheme.user) : 'transparent';

  const [modalShow, setModalShow] = useState(false);

  const handleShowModal = () => {
    if (!item?.idiom.word || !item?.effect) return;
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  useEffect(() => {
    return () => {
      setModalShow(false);
    };
  }, []);

  return (
    <View className={styles.itemContainer}>
      <View className={`${styles.itemCon} ${size ? styles[size] : ''}`} key={item?.idiom.word}>
        <View className={styles.pinyinAvatar}>
          <View className={styles.avatar} style={{ backgroundColor: avatarBg }}>
            {item?.idiom.pinyin.split(' ')[0]}
          </View>
        </View>
        <View className={styles.idiomContent} onClick={handleShowModal}>
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
      {item?.idiom && (
        <AtModal isOpened={modalShow} className={styles.modalContain} onClose={handleCloseModal}>
          <AtModalContent>
            <IdiomItem item={item?.idiom as TypeIdiomItem} allowToggle={false} />
          </AtModalContent>
        </AtModal>
      )}
    </View>
  );
}
export default memo(SolitaireItem);
