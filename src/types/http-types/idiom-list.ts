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
    list: {
      /**
       * 出处
       */
      derivation: string;
      /**
       * 例子
       */
      example: string;
      /**
       * 释义
       */
      explanation: string;
      /**
       * 拼音
       */
      pinyin: string;
      /**
       * 汉字
       */
      word: string;
      /**
       * 首字母
       */
      abbreviation: string;
    }[];
    total: number;
  };
  message: string;
}
