import { useState, useEffect, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import HttpRequest from '@/config/request';
import pinyin from 'pinyin';
import dayjs from 'dayjs';
import Taro from '@tarojs/taro';
import { IdiomApi } from '@/api/index';
import { getPinYinByWord, genIdiomByWord, generalColorByStr } from '@/utils/index';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';
import type { TypeSolitaireItem } from '@/types/http-types/common';
import { SolitaireItem, SolitaireInput } from '@/components';
import { IdiomBelong } from '@/config/constants';
import styles from './index.module.less';
import { SolitaireHeader, GameStart } from './components';

const fake = [
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '《周易·系辞下》服牛乘马，引重致远。”',
      example: '大王要～，就得虚心自慝，多隐藏一些才是。★曹禺《胆剑篇》第二幕',
      explanation: '指负载沉重而能到达远方◇比喻抱负远大，能闯出新的前景，做出宏伟的业绩。',
      pinyin: 'rèn zhòng zhì yuǎn',
      word: '任重致远',
      abbreviation: 'rzzy',
    },
    spend: 248,
  },
  {
    belong: 'user',
    effect: true,
    idiom: {
      word: '鸢飞鱼跃',
      pinyin: 'yuān fēi yú yuè',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: -99955,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '叶圣陶《倪焕之》十七农场里的木芙蓉开了，共引为悦目赏心的乐事。”',
      example: '鲜花的多种多样的姿态，纷繁的颜色，除了让我们～外，我想还可以对我们的艺术思想有所启发。★秦牧《艺海拾贝·鲜花百态和艺术风格》',
      explanation: '看了美好景物而心情舒畅。',
      pinyin: 'yuè mù shǎng xīn',
      word: '悦目赏心',
      abbreviation: 'ymsx',
    },
    spend: -100390,
  },
  {
    belong: 'user',
    effect: false,
    idiom: {
      word: '心有所属',
      pinyin: 'xīn yǒu suǒ shǔ',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: 100614,
  },
  {
    belong: 'user',
    effect: false,
    idiom: {
      word: '心心相惜',
      pinyin: 'xīn xīn xiāng xī',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: 109641,
  },
  {
    belong: 'user',
    effect: true,
    idiom: {
      word: '心安理得',
      pinyin: 'xīn ān lǐ dé',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: -12401,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '无',
      example: '梅兰芳先生不愧是一个德艺双馨的艺术家。',
      explanation: '形容一个人的德行和艺术（技艺）都具有良好的声誉。一般指从事艺术的人。',
      pinyin: 'dé yì shuāng xīn',
      word: '德艺双馨',
      abbreviation: 'dysx',
    },
    spend: -12805,
  },
  {
    belong: 'user',
    effect: true,
    idiom: {
      word: '心比天高',
      pinyin: 'xīn bǐ tiān gāo',
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    },
    spend: -49977,
  },
  {
    belong: 'robot',
    effect: true,
    idiom: {
      derivation: '清·钱谦益《复李叔则书》生平迂愚，耻以文字媚人，况敢膏唇岐舌，以诳知己。”',
      example: '无',
      explanation: '犹言膏唇拭舌。岐舌，指舌头上耍花招，说话反复无常。',
      pinyin: 'gào chún qí shé',
      word: '膏唇岐舌',
      abbreviation: 'gcqs',
    },
    spend: -50414,
  },
];
const remainNum = 4;
const itemHeight = 3; // 3rem
const Solitaire = () => {
  const [submitValue, setSubmitValue] = useState('');
  const [startTime, setStartTime] = useState(dayjs().valueOf());
  const [lastTime, setLastTime] = useState(dayjs().valueOf());

  const handleChangeValue = (value: string) => {
    setSubmitValue(value.trim().slice(0, 20));
  };

  const handleClearValue = () => {
    setSubmitValue('');
  };

  const [currentSolitaireList, setCurrentSolitaireList] = useState<TypeSolitaireItem[]>(fake);

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
          // 随机0-3s 之间 机器人回复
          setTimeout(() => {
            setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.robot, effect: true, idiom: res.list[0], spend: lastTime - dayjs().valueOf() }]);
            setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
          }, Math.random() * 1000 * 3);
        } else {
          const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
            url: IdiomApi.solitaireWithRobot,
            data: { ...params },
          });
          setCurrentSolitaireList((prev) => [...prev, { belong: IdiomBelong.robot, effect: true, idiom: res.list[0], spend: dayjs().valueOf() - startTime }]);
          setLastTime(dayjs().valueOf()); // 记录上一次的结束时间
        }
      } catch (error) {
        setCurrentSolitaireList([
          ...currentSolitaireList,
          { belong: IdiomBelong.user, effect: false, idiom: genIdiomByWord(submitValue), spend: lastTime - startTime },
        ]);
        setLastTime(dayjs().valueOf());
        setSubmitValue('');
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

  // 有效的列表
  const [effectSolitaireList, setEffectSolitaireList] = useState<TypeSolitaireItem[]>([]);
  useEffect(() => {
    setEffectSolitaireList(currentSolitaireList.filter((item) => item.effect).map((item) => item));
  }, [currentSolitaireList]);
  console.log('%c zjs effectSolitaireList:', 'color: #fff;background: #b457ff;', effectSolitaireList);

  const [nextSolitaire, setNextSolitaire] = useState<TypeSolitaireItem>();
  console.log('%c zjs nextSolitaire:', 'color: #fff;background: #b457ff;', nextSolitaire);
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
    handleStartGame(IdiomBelong.robot);
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
              // 最后一个是机器人回复的，说明下个是用户回复的
              (effectSolitaireList[effectSolitaireList.length - 1]?.belong === IdiomBelong.robot && (
                <SolitaireInput
                  submitValue={submitValue}
                  pinyin={nextSolitaire?.idiom.pinyin || ''}
                  onChange={handleChangeValue}
                  onSubmit={handleSubmitSolitaire}
                />
              )) || <SolitaireItem item={nextSolitaire} />
            }
          </View>
        )}
      </View>
    </View>
  );
};

export default Solitaire;
