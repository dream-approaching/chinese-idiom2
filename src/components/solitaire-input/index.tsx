import { View, Text } from '@tarojs/components';
import { generalColorByStr } from '@/utils/index';
import { AtInput } from 'taro-ui';
import { useState, useEffect } from 'react';
import { Max_Idiom_Time, Show_Skip_Time } from '@/config/constants';
import { useInterval } from '@/hooks/index';
import styles from './index.module.less';

export default function SolitaireInput({
  pinyin,
  submitValue,
  onChange,
  onSubmit,
  handleRestart,
  onSkip,
  allowSkipTimes,
}: {
  pinyin: string;
  submitValue: string;
  allowSkipTimes: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
  handleRestart: () => void;
  onSkip: () => void;
}) {
  const [disabled, setDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (submitValue.length === 0 || waitTime > Max_Idiom_Time) {
      setDisabled(true);
      if (waitTime > Max_Idiom_Time) {
        setInputDisabled(true);
      }
    } else {
      setDisabled(false);
    }
  }, [submitValue, waitTime]);

  useInterval(() => setWaitTime(waitTime + 1), waitTime >= Max_Idiom_Time ? null : 1000);

  const handleSubmit = () => {
    if (disabled) {
      return;
    }
    onSubmit();
  };

  const handleSkip = () => {
    if (!allowSkipTimes) return;
    setWaitTime(0); // 重置等待时间
    onSkip();
  };
  return (
    <View className={styles.inputContainer}>
      <View className={styles.itemCon}>
        <View className={styles.pinyinAvatar}>
          <View className={styles.avatar} style={{ backgroundColor: generalColorByStr(pinyin) }}>
            {pinyin}
          </View>
        </View>
        <View className={styles.idiomContent}>
          <AtInput
            disabled={inputDisabled}
            border={false}
            name="submitValue"
            maxlength={10}
            title=""
            type="text"
            placeholder="请在此处接龙"
            value={submitValue}
            onChange={onChange}
          />
        </View>
        <View className={styles.rightContent} onClick={handleSubmit}>
          <Text className={`${styles.submitBtn} ${disabled ? styles.disabled : ''}`}>提交</Text>
          <Text className={`${styles.submitTime} ${disabled ? styles.disabled : ''}`}>{waitTime} s</Text>
        </View>
      </View>
      <View className={styles.inputFooter}>
        {waitTime > Show_Skip_Time && waitTime < Max_Idiom_Time && (
          <Text className={`${styles.jumpBtn} ${!allowSkipTimes ? styles.jumpDisabled : ''}`} onClick={handleSkip}>
            答不上来 点击跳过 (剩余 {allowSkipTimes} 次)
          </Text>
        )}
        {waitTime >= Max_Idiom_Time && (
          <>
            <Text className={styles.gameOverTip}>超出等待时间，此局已结束</Text>
            <Text className={styles.gameOverBtn} onClick={handleRestart}>
              点击重新开始
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
