import { useState, useEffect, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import HttpRequest from '@/config/request';
import pinyin from 'pinyin';
import dayjs from 'dayjs';
import { AtSearchBar, AtToast } from 'taro-ui';
import Taro from '@tarojs/taro';
import { IdiomApi } from '@/api/index';
import { getPinYinByWord, genIdiomByWord } from '@/utils/index';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';
import type { TypeIdiomItem } from '@/types/http-types/common';
import { IdiomBelong } from '@/config/constants';
import styles from './index.module.less';
import { SolitaireHeader, GameStart } from './components';

const Solitaire = () => {
  const [submitValue, setSubmitValue] = useState('抱头鼠窜');
  const [startTime, setStartTime] = useState(dayjs().valueOf());
  const [lastTime, setLastTime] = useState(dayjs().valueOf());

  const handleChangeValue = (value: string) => {
    setSubmitValue(value.trim().slice(0, 20));
  };

  const handleClearValue = () => {
    setSubmitValue('');
  };

  const [currentSolitaireList, setCurrentSolitaireList] = useState<{ belong: string; effect: boolean; idiom: TypeIdiomItem; spend: number }[]>([]);

  const submitSolitaireAction = useCallback(
    async (params: IdiomSolitaireRobotReq, owner: keyof typeof IdiomBelong) => {
      try {
        const isByUser = owner === IdiomBelong.user;
        if (isByUser) {
          setCurrentSolitaireList((prev) => [
            ...prev,
            { belong: IdiomBelong.user, effect: true, idiom: genIdiomByWord(submitValue), spend: lastTime - dayjs().valueOf() },
          ]);
          setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
          const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
            url: IdiomApi.solitaireWithRobot,
            data: { ...params },
          });
          setSubmitValue('');
          setTimeout(() => {
            setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.robot, effect: true, idiom: res.list[0], spend: lastTime - dayjs().valueOf() }]);
            setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
          }, 200);
        } else {
          const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
            url: IdiomApi.solitaireWithRobot,
            data: { ...params },
          });
          setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.robot, effect: true, idiom: res.list[0], spend: dayjs().valueOf() - startTime }]);
          console.log('%c zjs startTime:', 'color: #fff;background: #b457ff;', startTime);
          console.log('%c zjs dayjs().valueOf() :', 'color: #fff;background: #b457ff;', dayjs().valueOf());
          setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
        }
      } catch (error) {
        const newList = currentSolitaireList.slice(0, -1);
        setCurrentSolitaireList([...newList, { belong: IdiomBelong.user, effect: false, idiom: genIdiomByWord(submitValue), spend: lastTime - startTime }]);
        setLastTime(dayjs().valueOf());
        console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      }
    },
    [submitValue, currentSolitaireList, lastTime, startTime]
  );

  const handleSubmitSolitaire = () => {
    if (submitValue.length < 4) {
      return Taro.showToast({ title: '成语长度不够哦', icon: 'none' });
    }

    const currentPinyin = getPinYinByWord(submitValue, { isFirst: true }); // 提交的成语的拼音

    if (currentSolitaireList.length) {
      const effectList = currentSolitaireList.filter((item) => item.effect); // 有效成语列表
      const lastIdiom = effectList[effectList.length - 1];
      const lastPinyin = getPinYinByWord(lastIdiom.idiom.word, { isLast: true }); // 最后一个有效成语的拼音

      if (currentPinyin !== lastPinyin) {
        Taro.showToast({ title: '成语不符合规则哦', icon: 'none' });
        return;
      }

      submitSolitaireAction({ word: submitValue, pinyin: getPinYinByWord(submitValue, { isLast: true }) }, IdiomBelong.user);
    } else {
      submitSolitaireAction({ word: submitValue, pinyin: getPinYinByWord(submitValue, { isLast: true }) }, IdiomBelong.user);
    }
  };

  const [isGameStart, setIsGameStart] = useState(false);
  const handleStartGame = (belong: string) => {
    setIsGameStart(true);
    if (belong === IdiomBelong.robot) {
      setStartTime(dayjs().valueOf());
      submitSolitaireAction({ currentListLength: 0 }, IdiomBelong.robot);
    }
  };

  return (
    <View className={styles.solitaireCon}>
      <SolitaireHeader currentSolitaireList={currentSolitaireList} />

      <View className={styles.gameContent}>
        {!isGameStart ? (
          <GameStart onGameStart={handleStartGame} />
        ) : (
          <View>
            {currentSolitaireList.slice(-2).map((item) => (
              <View key={item.idiom.word}>
                <View className={styles.pinyinAvatar}>{item.idiom.pinyin.split(' ')[0]}</View>
                <View className={styles.idiomContent}>
                  <Text className={styles.idiomText}>{item.idiom.word}</Text>
                  <Text className={styles.idiomPinyin}>{item.idiom.pinyin}</Text>
                </View>
                <View>
                  <Text className={styles.spentTime}>{`${(item.spend / 1000 / 100).toFixed(2)}s`}</Text>
                  <Text className={styles.spentTimeTip}>耗时</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
