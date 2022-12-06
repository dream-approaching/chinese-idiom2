interface IdiomListGetReqCommon {
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
}

export interface IdiomListGetReq1 extends IdiomListGetReqCommon {
  /**
   * 查询汉字
   */
  word?: string;
}

export interface IdiomListGetReq2 extends IdiomListGetReqCommon {
  /**
   * 查询拼音
   */
  pinyin?: string;
}

export type IdiomListGetReq = IdiomListGetReq1 | IdiomListGetReq2;

export interface IdiomListGetRes {
  code: number;
  data: null | {
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
