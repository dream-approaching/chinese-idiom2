import pinyin from 'pinyin';
import type { TypeIdiomItem } from '@/types/http-types/common';

export const genIdiomByWord = (word: string): TypeIdiomItem => {
  return {
    word: word,
    pinyin: pinyin(word).flat().join(' '),
    derivation: '',
    example: '',
    explanation: '',
    abbreviation: '',
  };
};
