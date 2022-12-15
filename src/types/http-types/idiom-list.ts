import type { TypeIdiomItem } from './common';

export type IdiomListGetReq = {
  /**
   * 页码 默认1
   */
  page?: number;
  /**
   * 每页条数 默认10
   */
  pageSize?: number;
  /**
   * 是否首位
   */
  isFirst?: string;
  /**
   * 查询汉字
   */
  word?: string;
  /**
   * 查询拼音
   */
  pinyin?: string;
};

export interface IdiomListGetRes {
  code: number;
  data: {
    list: TypeIdiomItem[];
    total: number;
  };
  message: string;
}
