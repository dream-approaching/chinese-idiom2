import { useState, useEffect, useCallback } from 'react';
import { View } from '@tarojs/components';
import HttpRequest from '@/config/request';
import pinyin from 'pinyin';
import { AtSearchBar, AtToast } from 'taro-ui';
import Taro from '@tarojs/taro';
import { IdiomApi } from '@/api/index';
import { getPinYinByWord } from '@/utils/index';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';
import styles from './index.module.less';

const Solitaire = () => {
  const [submitValue, setSubmitValue] = useState('抱头鼠窜');

  const handleChangeValue = (value: string) => {
    setSubmitValue(value.trim().slice(0, 20));
  };

  const handleClearValue = () => {
    setSubmitValue('');
  };

  const [currentSolitaireList, setCurrentSolitaireList] = useState<string[]>([]);

  const submitSolitaireAction = useCallback(async (params: IdiomSolitaireRobotReq) => {
    try {
      const res = await HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
        url: IdiomApi.solitaireWithRobot,
        data: { ...params },
      });
      return res;
    } catch (error) {
      console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      return [];
    }
  }, []);

  const handleSubmitSolitaire = () => {
    if (submitValue.length < 4) {
      Taro.showToast({ title: '成语长度不够哦' });
    }
    console.log('%c zjs setSearchValue:', 'color: #fff;background: #b457ff;', submitValue);

    const currentPinyin = getPinYinByWord(submitValue, { isFirst: true }); // 提交的成语的拼音
    console.log('%c zjs currentPinyin:', 'color: #fff;background: #b457ff;', currentPinyin);

    if (currentSolitaireList.length) {
      const lastIdiom = currentSolitaireList[currentSolitaireList.length - 1];
      const lastPinyin = getPinYinByWord(lastIdiom, { isLast: true }); // 最后一个成语的拼音
      console.log('%c zjs lastPinyin:', 'color: #fff;background: #b457ff;', lastPinyin);
      if (currentPinyin !== lastPinyin) {
        Taro.showToast({ title: '成语不符合规则哦' });
        return;
      }
    } else {
      // 随机返回一个成语给客户端
      submitSolitaireAction({ word: submitValue, pinyin: getPinYinByWord(submitValue, { isLast: true }) }).then((res) => {
        console.log('%c zjs res:', 'color: #fff;background: #b457ff;', res);
      });
    }
  };

  console.log(getPinYinByWord('成语'));
  console.log(getPinYinByWord('成语', { isFirst: true }));
  console.log(getPinYinByWord('成语', { isLast: true }));
  return (
    <View className={styles.solitaireCon}>
      <AtSearchBar value={submitValue} fixed maxLength={20} onClear={handleClearValue} onChange={handleChangeValue} onActionClick={handleSubmitSolitaire} />
      {currentSolitaireList.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </View>
  );
};

export default Solitaire;
