import Taro from '@tarojs/taro';

export const getSolitaireHeight = () => {
  let itemHeight: number;
  let unit: string;
  switch (Taro.getEnv()) {
    case Taro.ENV_TYPE.WEAPP:
      itemHeight = 120;
      unit = 'rpx';
      break;
    case Taro.ENV_TYPE.WEB:
      itemHeight = 3;
      unit = 'rem';
      break;
    default:
      itemHeight = 120;
      unit = 'rpx';
  }
  return { itemHeight, unit };
};
