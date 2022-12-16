import { useState, useEffect, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import HttpRequest from '@/config/request';
import pinyin from 'pinyin';
import { AtSearchBar, AtToast } from 'taro-ui';
import Taro from '@tarojs/taro';
import { IdiomApi } from '@/api/index';
import { getPinYinByWord } from '@/utils/index';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';
import { useGetTodayImage } from '@/hooks/index';
import styles from './index.module.less';

const IdiomBelong = { user: '用户', robot: '机器人' };

const Solitaire = () => {
  const [submitValue, setSubmitValue] = useState('抱头鼠窜');

  const handleChangeValue = (value: string) => {
    setSubmitValue(value.trim().slice(0, 20));
  };

  const todayImage = useGetTodayImage();

  const handleClearValue = () => {
    setSubmitValue('');
  };

  const [currentSolitaireList, setCurrentSolitaireList] = useState<{ belong: string; effect: boolean; word: string }[]>([]);

  const submitSolitaireAction = useCallback(
    async (params: IdiomSolitaireRobotReq) => {
      try {
        setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.user, effect: true, word: submitValue }]);
        const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
          url: IdiomApi.solitaireWithRobot,
          data: { ...params },
        });
        setSubmitValue('');
        setTimeout(() => {
          setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.robot, effect: true, word: res.list[0].word }]);
        }, 200);
      } catch (error) {
        const newList = currentSolitaireList.slice(0, -1);
        setCurrentSolitaireList([...newList, { belong: IdiomBelong.user, effect: false, word: submitValue }]);
        console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      }
    },
    [submitValue, currentSolitaireList]
  );

  const handleSubmitSolitaire = () => {
    if (submitValue.length < 4) {
      return Taro.showToast({ title: '成语长度不够哦', icon: 'none' });
    }

    const currentPinyin = getPinYinByWord(submitValue, { isFirst: true }); // 提交的成语的拼音

    if (currentSolitaireList.length) {
      const effectList = currentSolitaireList.filter((item) => item.effect); // 有效成语列表
      const lastIdiom = effectList[effectList.length - 1];
      const lastPinyin = getPinYinByWord(lastIdiom.word, { isLast: true }); // 最后一个有效成语的拼音

      if (currentPinyin !== lastPinyin) {
        Taro.showToast({ title: '成语不符合规则哦', icon: 'none' });
        return;
      }

      submitSolitaireAction({ word: submitValue, pinyin: getPinYinByWord(submitValue, { isLast: true }) });
    } else {
      submitSolitaireAction({ word: submitValue, pinyin: getPinYinByWord(submitValue, { isLast: true }) });
    }
  };

  return (
    <View className={styles.solitaireCon}>
      <View className={styles.headerCardCon} style={{ backgroundImage: `url(${todayImage})` }}>
        <View className={styles.leftPart}>
          <Text className={styles.title}>成语接龙</Text>
          <Text className={styles.rule}>游戏规则: 成语的最后一个字和下一个成语的第一个字必须相同，且成语长度必须大于等于4个字</Text>
        </View>
        <View className={styles.rightPart}>222</View>
      </View>
      {/* <AtSearchBar value={submitValue} maxLength={20} onClear={handleClearValue} onChange={handleChangeValue} onActionClick={handleSubmitSolitaire} />
      <Text>游戏规则：成语的最后一个字和下一个成语的第一个字必须相同，且成语长度必须大于等于4个字</Text>
      <View>
        {currentSolitaireList.map((item, index) => (
          <Text key={index}>{item.word}--</Text>
        ))}
      </View> */}
    </View>
  );
};

export default Solitaire;
