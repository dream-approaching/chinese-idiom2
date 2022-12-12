export const generalColorByStr = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = hash * 34 + str.charCodeAt(i);
    hash = intValue(hash);
  }
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + '0.3)';
};

function intValue(num: number) {
  const MAX_VALUE = 0x7fffffff;
  const MIN_VALUE = -0x80000000;
  if (num > MAX_VALUE || num < MIN_VALUE) {
    return (num &= 0xffffffff);
  }
  return num;
}
