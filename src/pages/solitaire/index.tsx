import { useState, useEffect, useCallback } from 'react';
import { View } from '@tarojs/components';
import HttpRequest from '@/config/request';
import dayjs from 'dayjs';
import Taro from '@tarojs/taro';
import { IdiomApi } from '@/api/index';
import { getPinYinByWord, genIdiomByWord } from '@/utils/index';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';
import type { TypeSolitaireItem, TypeIdiomItem } from '@/types/http-types/common';
import { SolitaireItem, SolitaireInput } from '@/components';
import { IdiomBelong } from '@/config/constants';
import styles from './index.module.less';
import { SolitaireHeader, GameStart } from './components';

const remainNum = 4;
const itemHeight = 3; // 3rem
const Solitaire = () => {
  const [submitValue, setSubmitValue] = useState('');
  const [startTime, setStartTime] = useState(dayjs().valueOf());
  const [lastTime, setLastTime] = useState(dayjs().valueOf());

  const handleChangeValue = (value: string) => {
    setSubmitValue(value.trim().slice(0, 20));
  };

  const [currentSolitaireList, setCurrentSolitaireList] = useState<TypeSolitaireItem[]>([]);
  const [robotIdiom, setRobotIdiom] = useState<TypeIdiomItem>();

  const submitSolitaireAction = useCallback(
    async (params: IdiomSolitaireRobotReq, owner: keyof typeof IdiomBelong) => {
      try {
        const isByUser = owner === IdiomBelong.user;
        if (isByUser) {
          setCurrentSolitaireList((prev) => [
            ...prev,
            { belong: IdiomBelong.user, effect: true, idiom: genIdiomByWord(submitValue), spend: dayjs().valueOf() - lastTime },
          ]);
          const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
            url: IdiomApi.solitaireWithRobot,
            data: { ...params },
          });
          setRobotIdiom(res.list[0]);
        } else {
          const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
            url: IdiomApi.solitaireWithRobot,
            data: { ...params },
          });
          setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.robot, effect: true, idiom: res.list[0], spend: dayjs().valueOf() - startTime }]);
        }
      } catch (error) {
        setCurrentSolitaireList([
          ...currentSolitaireList,
          { belong: IdiomBelong.user, effect: false, idiom: genIdiomByWord(submitValue), spend: dayjs().valueOf() - lastTime },
        ]);
        setSubmitValue('');
        setNextSolitaire(undefined);
        console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      }
    },
    [submitValue, currentSolitaireList, lastTime, startTime]
  );

  // 模拟机器人 0-3s 之间随机回复
  useEffect(() => {
    if (robotIdiom) {
      setSubmitValue('');
      setTimeout(() => {
        setCurrentSolitaireList((prev) => [
          ...prev,
          { belong: IdiomBelong.robot, effect: true, idiom: robotIdiom as TypeIdiomItem, spend: dayjs().valueOf() - lastTime },
        ]);
        setRobotIdiom(undefined);
      }, Math.random() * 1000 * 3);
    }
  }, [robotIdiom, setCurrentSolitaireList, lastTime]);

  // 点击提交
  const handleSubmitSolitaire = () => {
    if (submitValue.length < 4) {
      return Taro.showToast({ title: '成语长度不够哦', icon: 'none' });
    }
    const currentPinyin = getPinYinByWord(submitValue, { isFirst: true }); // 提交的成语的拼音
    if (effectSolitaireList.length) {
      const lastIdiom = effectSolitaireList[effectSolitaireList.length - 1];
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

  // 点击开始游戏
  const [isGameStart, setIsGameStart] = useState(false);
  const handleStartGame = (belong: string) => {
    setIsGameStart(true);
    if (belong === IdiomBelong.robot) {
      setStartTime(dayjs().valueOf());
      submitSolitaireAction({ currentListLength: 0 }, IdiomBelong.robot);
    } else {
      setStartTime(dayjs().valueOf());
    }
  };

  // 有效的列表
  const [effectSolitaireList, setEffectSolitaireList] = useState<TypeSolitaireItem[]>([]);
  useEffect(() => {
    setEffectSolitaireList(currentSolitaireList.filter((item) => item.effect).map((item) => item));
    setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
  }, [currentSolitaireList]);

  const [nextSolitaire, setNextSolitaire] = useState<TypeSolitaireItem>();
  useEffect(() => {
    if (effectSolitaireList.length === 0) return;
    const lastSolitaire = effectSolitaireList[effectSolitaireList.length - 1];
    setNextSolitaire({
      belong: IdiomBelong.user,
      idiom: genIdiomByWord(lastSolitaire.idiom.word, true),
      effect: true,
      spend: undefined,
    });
  }, [effectSolitaireList]);

  // todo mock
  useEffect(() => {
    // handleStartGame(IdiomBelong.robot);
  }, []);

  return (
    <View className={styles.solitaireCon}>
      <SolitaireHeader currentSolitaireList={currentSolitaireList} />

      <View className={styles.gameContent}>
        {!isGameStart ? (
          <GameStart onGameStart={handleStartGame} />
        ) : (
          <View
            className={styles.contentCon}
            style={{ top: `${effectSolitaireList.length > remainNum ? -(effectSolitaireList.length - remainNum) * itemHeight : 0}rem` }}
          >
            {effectSolitaireList.map((item) => (
              <SolitaireItem key={item.idiom.word} item={item} />
            ))}
            {
              // 最后一个是机器人回复的，说明下个是用户回复的 或者 不存在有效的成语列表，即是玩家先开始游戏的
              effectSolitaireList[effectSolitaireList.length - 1]?.belong === IdiomBelong.robot || !effectSolitaireList.length ? (
                <SolitaireInput
                  submitValue={submitValue}
                  pinyin={nextSolitaire?.idiom.pinyin || ''}
                  onChange={handleChangeValue}
                  onSubmit={handleSubmitSolitaire}
                />
              ) : (
                <SolitaireItem item={nextSolitaire} />
              )
            }
          </View>
        )}
      </View>
    </View>
  );
};

export default Solitaire;
