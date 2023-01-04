import { View, Text, Input } from '@tarojs/components';
import { generalColorByStr } from '@/utils/index';
import { useState, useEffect, memo } from 'react';
import type { CommonEventFunction, InputProps } from '@tarojs/components/types';
import SolitaireTime from './time-con';
import styles from './index.module.less';

function SolitaireInput({
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
  onChange: CommonEventFunction<InputProps.inputEventDetail>;
  onSubmit: () => void;
  handleRestart: () => void;
  onSkip: () => void;
}) {
  const [disabled, setDisabled] = useState(false);
  const [timeout, setTimeout] = useState(false);

  const onTimeout = () => {
    setTimeout(true);
  };

  const handleSubmit = () => {
    if (disabled) {
      return;
    }
    onSubmit();
  };

  useEffect(() => {
    setDisabled(timeout || submitValue.length === 0);
  }, [timeout, submitValue]);

  const handleSkip = () => {
    if (!allowSkipTimes) return;
    // 重置状态
    setTimeout(false);
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
          <Input
            disabled={timeout}
            name="submitValue"
            maxlength={40}
            type="text"
            placeholder="请在此处接龙"
            value={submitValue}
            controlled
            onInput={onChange}
            onConfirm={handleSubmit}
            confirmType="done"
            placeholderClass={styles.placeholder}
          />
        </View>
        <View className={styles.rightContent} onClick={handleSubmit}>
          <Text className={`${styles.submitBtn} ${disabled ? styles.disabled : ''}`}>提交</Text>
          <SolitaireTime key={allowSkipTimes} onTimeout={onTimeout} className={`${styles.submitTime} ${disabled ? styles.disabled : ''}`} />
        </View>
      </View>
      <View className={styles.inputFooter}>
        {!timeout && allowSkipTimes > 0 && (
          <Text className={`${styles.jumpBtn} ${!allowSkipTimes ? styles.jumpDisabled : ''}`} onClick={handleSkip}>
            点击跳过 (剩余 {allowSkipTimes} 次)
          </Text>
        )}
        {timeout && (
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

export default memo(SolitaireInput);
