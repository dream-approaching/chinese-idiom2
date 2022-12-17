import { View, Text } from '@tarojs/components';
import { generalColorByStr } from '@/utils/index';
import { AtInput } from 'taro-ui';
import { useState, useEffect } from 'react';
import styles from './index.module.less';

export default function SolitaireInput({
  pinyin,
  submitValue,
  onChange,
  onSubmit,
}: {
  pinyin: string;
  submitValue: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (submitValue.length === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [submitValue]);

  const handleSubmit = () => {
    if (disabled) {
      return;
    }
    onSubmit();
  };
  return (
    <View className={styles.itemCon}>
      <View className={styles.pinyinAvatar}>
        <View className={styles.avatar} style={{ backgroundColor: generalColorByStr(pinyin) }}>
          {pinyin}
        </View>
      </View>
      <View className={styles.idiomContent}>
        <AtInput border={false} name="submitValue" maxlength={10} title="" type="text" placeholder="请在此处接龙" value={submitValue} onChange={onChange} />
      </View>
      <View className={styles.rightContent}>
        <Text className={`${styles.submitBtn} ${disabled ? styles.disabled : ''}`} onClick={handleSubmit}>
          提交
        </Text>
      </View>
    </View>
  );
}
