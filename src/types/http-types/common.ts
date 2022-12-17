export type TypeIdiomItem = {
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
};

export type TypeSolitaireItem = { belong: string; effect: boolean; idiom: TypeIdiomItem; spend?: number };
