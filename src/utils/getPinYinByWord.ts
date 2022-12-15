import pinyin from 'pinyin';

export const getPinYinByWord = (word: string, { isFirst = false, isLast = false } = {}) => {
  if (!word) return '';
  if (isFirst) {
    return pinyin(word[0], {
      style: pinyin.STYLE_NORMAL,
    })[0][0];
  }
  if (isLast) {
    return pinyin(word[word.length - 1], {
      style: pinyin.STYLE_NORMAL,
    })[0][0];
  }

  return '';
};
