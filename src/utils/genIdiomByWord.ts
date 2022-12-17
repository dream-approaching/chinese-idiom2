import pinyin from 'pinyin';
import type { TypeIdiomItem } from '@/types/http-types/common';

export const genIdiomByWord = (word: string, onlyPinyin?: boolean): TypeIdiomItem => {
  if (onlyPinyin) {
    return {
      word: '',
      pinyin: pinyin(word.slice(-1)).flat().join(' '),
      derivation: '',
      example: '',
      explanation: '',
      abbreviation: '',
    };
  }
  return {
    word: word,
    pinyin: pinyin(word).flat().join(' '),
    derivation: '',
    example: '',
    explanation: '',
    abbreviation: '',
  };
};
