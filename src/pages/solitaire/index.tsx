import { useState, useEffect, useCallback, useRef } from 'react';
import { View } from '@tarojs/components';
import HttpRequest from '@/config/request';
import dayjs from 'dayjs';
import Taro from '@tarojs/taro';
import { IdiomApi } from '@/api/index';
import { getPinYinByWord, genIdiomByWord } from '@/utils/index';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';
import type { TypeSolitaireItem, TypeIdiomItem } from '@/types/http-types/common';
import { SolitaireItem, SolitaireInput } from '@/components';
import { IdiomBelong, Allow_Skip_times } from '@/config/constants';
import styles from './index.module.less';
import { SolitaireHeader, GameStart } from './components';

const fake = [
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '明·徐霖《绣襦记·伪儒乐聘》空穷读数行书，蹈规循矩没是非。”',
      example: '无',
      explanation: '指遵守规矩。同蹈矩循规”。',
      pinyin: 'dǎo guī xún jǔ',
      word: '蹈规循矩',
      abbreviation: 'dgxj',
    },
    spend: 37,
  },
  {
    belong: 'user',
    effect: false,
    idiom: {
      word: '居安思危',
      pinyin: 'jū ān sī wēi',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: 17522,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '《尔雅·释训》式微式微者，微微微者也。”',
      example: '富庶的河套，是黄河所给的一点点它口里所吐出的，和被它所吞没的比较起来，真是～了。★臧克家《毛主席向着黄河笑》',
      explanation: '形容非常小或非常少。',
      pinyin: 'wēi hū qí wēi',
      word: '微乎其微',
      abbreviation: 'whqw',
    },
    spend: 1979,
  },
  {
    belong: 'user',
    effect: true,
    idiom: {
      word: '危言耸听',
      pinyin: 'wēi yán sǒng tīng',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: 13276,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '语出《左传·文公十七年》古人有言曰……‘鹿死不择音（荫）’小国之事大国也，德则其人也，不德则其鹿也，铤而走险，急何能择。”',
      example: '无',
      explanation: '挺而走险。指事急之时，被迫冒险行事。',
      pinyin: 'tǐng lù zǒu xiǎn',
      word: '挺鹿走险',
      abbreviation: 'tlzx',
    },
    spend: 142,
  },
  {
    belong: 'user',
    effect: true,
    idiom: {
      word: '先发制人',
      pinyin: 'xiān fā zhì rén',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: 7820,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '清·洪昻《长生殿·寄情》蓬莱院月悴花憔，昭阳殿人非物是。”',
      example: '无',
      explanation: '指人事变迁，景物依旧。',
      pinyin: 'rén fēi wù shì',
      word: '人非物是',
      abbreviation: 'rfws',
    },
    spend: 657,
  },
  {
    belong: 'user',
    effect: true,
    idiom: {
      word: '适可而止',
      pinyin: 'shì kě ér zhǐ',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: 12143,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '《左传·僖公九年》天威不违颜咫尺。”',
      example: '左右如今也不容相近，～一般，有甚舍不得处？★明·冯梦龙《古今小说》第二十二卷',
      explanation: '咫古代长度单位，周制八寸，合今市尺六寸二分二厘；咫尺比喻距离很近。比喻距离虽近，但很难相见，象是远在天边一样。',
      pinyin: 'zhǐ chǐ tiān yá',
      word: '咫尺天涯',
      abbreviation: 'zcty',
    },
    spend: 2337,
  },
];
const remainNum = 4;
const itemHeight = 3; // 3rem
const Solitaire = () => {
  const [submitValue, setSubmitValue] = useState('');
  const [lastTime, setLastTime] = useState(0);
  const lastTimeRef = useRef(lastTime);

  const handleChangeValue = (value: string) => {
    setSubmitValue(value.trim().slice(0, 20));
  };

  const [currentSolitaireList, setCurrentSolitaireList] = useState<TypeSolitaireItem[]>(fake);
  const [robotIdiom, setRobotIdiom] = useState<TypeIdiomItem>();

  const submitSolitaireAction = useCallback(
    async (params: IdiomSolitaireRobotReq, owner: keyof typeof IdiomBelong) => {
      try {
        const isByUser = owner === IdiomBelong.user;
        if (isByUser) {
          setCurrentSolitaireList((prev) => [
            ...prev,
            { belong: IdiomBelong.user, effect: true, idiom: genIdiomByWord(submitValue), spend: dayjs().valueOf() - lastTimeRef.current },
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
          setCurrentSolitaireList((prev) => [
            ...prev,
            { belong: IdiomBelong.robot, effect: true, idiom: res.list[0], spend: dayjs().valueOf() - lastTimeRef.current },
          ]);
        }
      } catch (error) {
        setCurrentSolitaireList([
          ...currentSolitaireList,
          { belong: IdiomBelong.user, effect: false, idiom: genIdiomByWord(submitValue), spend: dayjs().valueOf() - lastTimeRef.current },
        ]);
        setSubmitValue('');
        setNextSolitaire(undefined);
        console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      }
    },
    [submitValue, currentSolitaireList]
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
      setLastTime(dayjs().valueOf());
      submitSolitaireAction({ currentListLength: 0 }, IdiomBelong.robot);
    } else {
      setLastTime(dayjs().valueOf());
    }
  };

  useEffect(() => {
    lastTimeRef.current = lastTime;
  }, [lastTime]);

  // 有效的列表
  const [effectSolitaireList, setEffectSolitaireList] = useState<TypeSolitaireItem[]>([]);
  useEffect(() => {
    if (currentSolitaireList.length === 0) return;
    setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
    setEffectSolitaireList(currentSolitaireList.filter((item) => item.effect).map((item) => item));
    console.log('%c zjs currentSolitaireList:', 'color: #fff;background: #b457ff;', currentSolitaireList);
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

  // 用户跳过 机器人帮助答题
  const [allowSkipTimes, setAllowSkipTimes] = useState(Allow_Skip_times);
  const onSkip = () => {
    setAllowSkipTimes((prev) => prev - 1); // 跳过次数减一
    setSubmitValue('');
    if (effectSolitaireList.length === 0) {
      submitSolitaireAction({ currentListLength: 0 }, IdiomBelong.robot);
      return;
    }
    submitSolitaireAction({ pinyin: getPinYinByWord(effectSolitaireList[effectSolitaireList.length - 1].idiom.word, { isLast: true }) }, IdiomBelong.robot);
  };

  // 重新开始 重置
  const handleResetAll = () => {
    setIsGameStart(false);
    setCurrentSolitaireList([]);
    setEffectSolitaireList([]);
    setSubmitValue('');
    setNextSolitaire(undefined);
    setAllowSkipTimes(Allow_Skip_times);
  };

  return (
    <View className={styles.solitaireCon}>
      <SolitaireHeader currentSolitaireList={currentSolitaireList} showRight={isGameStart} onRestart={handleResetAll} />

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
                  handleRestart={handleResetAll}
                  onSkip={onSkip}
                  allowSkipTimes={allowSkipTimes}
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
