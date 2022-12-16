import type { TypeIdiomItem } from './common';

export type IdiomSolitaireRobotReq = {
  /**
   * 当前接龙的长度
   */
  currentListLength?: number;
  /**
   * 当前提交的成语
   */
  word?: string;
  /**
   * 提交成语的第一个字的拼音
   */
  pinyin?: string;
};

export interface IdiomSolitaireRobotRes {
  code: number;
  data: {
    list: TypeIdiomItem[];
    total: number;
  };
  message: string;
}
