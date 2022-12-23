import { pinyin } from 'pinyin-pro';

export const getPinYinByWord = (word: string, { isFirst = false, isLast = false } = {}) => {
  if (!word) return '';
  if (isFirst) {
    return pinyin(word[0], { toneType: 'none' });
  }
  if (isLast) {
    return pinyin(word[word.length - 1], { toneType: 'none' });
  }

  return '';
};
