import { useEffect, useState } from 'react';
import HttpRequest from '@/config/request';
import { IdiomApi } from '@/api/index';
import defaultTopImage from '@/assets/images/defaultTop.jpg';
import type { TypeIdiomItem } from '@/types/http-types/common';
import type { IdiomSolitaireRobotReq, IdiomSolitaireRobotRes } from '@/types/http-types/idiom-solitaire-robot';

let todayIdiom = {
  derivation: '',
  example: '',
  explanation: '',
  pinyin: '',
  word: '',
  abbreviation: '',
};

const useGetTodayIdiom = () => {
  const [idiom, setIdiom] = useState<TypeIdiomItem>(todayIdiom);

  useEffect(() => {
    if (idiom.word) return;

    getIdiomAction();
  }, []);

  const refreshIdiom = () => {
    getIdiomAction();
  };

  const getIdiomAction = () => {
    HttpRequest<IdiomSolitaireRobotReq, IdiomSolitaireRobotRes['data']>({
      url: IdiomApi.solitaireWithRobot,
      data: { currentListLength: 0 },
    })
      .then((res) => {
        todayIdiom = res.list[0];
        setIdiom(res.list[0]);
      })
      .catch((err) => {
        setIdiom(defaultTopImage);
        console.log(err);
      });
  };

  return { idiom, refreshIdiom };
};

export default useGetTodayIdiom;
