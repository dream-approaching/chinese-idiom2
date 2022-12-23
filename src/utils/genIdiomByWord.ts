import { pinyin } from 'pinyin-pro';
import type { TypeIdiomItem } from '@/types/http-types/common';

export const genIdiomByWord = (word: string, onlyPinyin?: boolean): TypeIdiomItem => {
  if (onlyPinyin) {
    return {
      word: '',
      pinyin: pinyin(word.slice(-1)),
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    };
  }
  return {
    word: word,
    pinyin: pinyin(word),
    derivation: '',
    example: '',
    explanation: '',
    abbreviation: '',
  };
};
